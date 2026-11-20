import crypto from 'node:crypto';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { eq } from 'drizzle-orm';
import { adminAuth } from './firebase-admin.ts';
import { db, hasConfiguredDatabase, resolvePostgresUrl } from '../db/index.ts';
import { ensureSeeded } from '../db/queries.ts';
import { administratorAccounts } from '../db/schema.ts';

export const ADMIN_COOKIE_NAME = 'ufb_admin_session';

const getSessionSecret = (): string => {
  if (process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.length >= 16) {
    return process.env.ADMIN_SESSION_SECRET;
  }
  const seed =
    resolvePostgresUrl() ||
    process.env.SQL_PASSWORD ||
    process.env.APP_URL ||
    'urfoodbox-local-dev-signing-key';
  return crypto.createHash('sha256').update(`ufb-admin-secret:${seed}`).digest('hex');
};

export interface AdminSessionPayload {
  adminId: number;
  email: string;
  role: string;
  exp: number;
}

export interface AuthenticatedAdmin {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

export function createAdminSessionToken(payload: Omit<AdminSessionPayload, 'exp'>): string {
  const fullPayload: AdminSessionPayload = {
    ...payload,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };
  const data = Buffer.from(JSON.stringify(fullPayload), 'utf8').toString('base64url');
  const sig = crypto
    .createHmac('sha256', getSessionSecret())
    .update(data)
    .digest('base64url');
  return `${data}.${sig}`;
}

export function verifyAdminSessionToken(token: string): AdminSessionPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [data, sig] = parts;
    const expectedSig = crypto
      .createHmac('sha256', getSessionSecret())
      .update(data)
      .digest('base64url');

    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }

    const decoded = JSON.parse(Buffer.from(data, 'base64url').toString('utf8')) as AdminSessionPayload;
    if (!decoded || typeof decoded.adminId !== 'number' || typeof decoded.exp !== 'number') {
      return null;
    }
    if (decoded.exp < Date.now()) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export function parseCookies(cookieHeader: string | null): Record<string, string> {
  const result: Record<string, string> = {};
  if (!cookieHeader) return result;
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key) {
      try {
        result[key] = decodeURIComponent(value);
      } catch {
        result[key] = value;
      }
    }
  }
  return result;
}

export function isHttpsRequest(request: Request): boolean {
  const forwardedProto = request.headers.get('x-forwarded-proto');
  if (forwardedProto) return forwardedProto.split(',')[0].trim() === 'https';
  return request.url.startsWith('https://') || process.env.VERCEL === '1';
}

export function isCrossSiteRequest(request: Request): boolean {
  const fetchSite = request.headers.get('sec-fetch-site');
  const fetchDest = request.headers.get('sec-fetch-dest');
  if (fetchDest === 'iframe' || fetchSite === 'cross-site') {
    return true;
  }
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (origin && host) {
    try {
      return new URL(origin).host !== host;
    } catch {
      return false;
    }
  }
  return false;
}

export function buildAdminCookieConfig(request: Request, token: string) {
  const isSecure = isHttpsRequest(request);
  const useSameSiteNone = isSecure && isCrossSiteRequest(request);
  return {
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: (useSameSiteNone ? 'none' : 'lax') as 'none' | 'lax',
    secure: isSecure,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  };
}

export async function getAuthenticatedFirebaseUser(
  request: Request
): Promise<DecodedIdToken | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.slice('Bearer '.length).trim();
  try {
    return await adminAuth.verifyIdToken(token);
  } catch {
    return null;
  }
}

export async function getAuthenticatedAdmin(
  request: Request
): Promise<AuthenticatedAdmin | null> {
  if (!hasConfiguredDatabase()) {
    return null;
  }

  try {
    await ensureSeeded();
    const cookies = parseCookies(request.headers.get('cookie'));
    const headerToken = request.headers.get('x-admin-token')?.trim();
    const sessionToken = cookies[ADMIN_COOKIE_NAME] || headerToken;

    if (sessionToken) {
      const session = verifyAdminSessionToken(sessionToken);
      if (session) {
        const [admin] = await db
          .select({
            id: administratorAccounts.id,
            email: administratorAccounts.email,
            fullName: administratorAccounts.fullName,
            role: administratorAccounts.role,
            isActive: administratorAccounts.isActive,
          })
          .from(administratorAccounts)
          .where(eq(administratorAccounts.id, session.adminId))
          .limit(1);

        if (admin && admin.isActive) {
          return {
            id: admin.id,
            email: admin.email,
            fullName: admin.fullName,
            role: admin.role,
          };
        }
      }
    }

    // Also support Firebase Bearer token for verified owner Google Sign-In
    const decoded = await getAuthenticatedFirebaseUser(request);
    if (decoded?.email && decoded.email_verified) {
      const [admin] = await db
        .select({
          id: administratorAccounts.id,
          email: administratorAccounts.email,
          fullName: administratorAccounts.fullName,
          role: administratorAccounts.role,
          isActive: administratorAccounts.isActive,
        })
        .from(administratorAccounts)
        .where(eq(administratorAccounts.email, decoded.email.toLowerCase()))
        .limit(1);

      if (admin && admin.isActive) {
        return {
          id: admin.id,
          email: admin.email,
          fullName: admin.fullName,
          role: admin.role,
        };
      }
    }
  } catch (err) {
    console.error('Admin session verification error:', err);
  }

  return null;
}
