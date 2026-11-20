import crypto from 'node:crypto';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { and, eq, isNotNull, isNull, sql } from 'drizzle-orm';
import { verifyFirebaseIdToken } from './firebase-admin.ts';
import { db, hasConfiguredDatabase, resolvePostgresUrl } from '../db/index.ts';
import { ensureSeeded, hasClaimedFirebaseOwner } from '../db/queries.ts';
import { administratorAccounts } from '../db/schema.ts';

export const ADMIN_COOKIE_NAME = 'ufb_admin_session';

export class AdminAuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'AdminAuthError';
    this.status = status;
  }
}

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

export function extractBearerToken(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.slice('Bearer '.length).trim();
  return token || null;
}

function assertValidAdminDecodedToken(decoded: DecodedIdToken): {
  uid: string;
  email: string;
} {
  const email = typeof decoded.email === 'string' ? decoded.email.trim().toLowerCase() : '';
  if (!decoded.uid || !email) {
    throw new AdminAuthError('Firebase account must have a valid email address.', 401);
  }

  // Google Sign-In always asserts verified email; manually added Firebase Email/Password users
  // default to email_verified=false until verified, so allow 'password' provider when authorized server-side.
  const provider = decoded.firebase?.sign_in_provider;
  if (provider !== 'password' && !decoded.email_verified) {
    throw new AdminAuthError('Verified email required for administrator sign-in.', 401);
  }

  return { uid: decoded.uid, email };
}

function timingSafeMatch(provided: string, expected: string): boolean {
  const a = crypto.createHash('sha256').update(provided, 'utf8').digest();
  const b = crypto.createHash('sha256').update(expected, 'utf8').digest();
  return crypto.timingSafeEqual(a, b);
}

export function getBootstrapConfigStatus(): {
  bootstrapConfigured: boolean;
  requiresBootstrapToken: boolean;
  hasAdminEmailAllowlist: boolean;
} {
  const bootstrapToken = process.env.ADMIN_BOOTSTRAP_TOKEN?.trim() || '';
  const adminEmail = process.env.ADMIN_EMAIL?.trim() || '';
  return {
    bootstrapConfigured: Boolean(bootstrapToken || adminEmail),
    requiresBootstrapToken: Boolean(bootstrapToken),
    hasAdminEmailAllowlist: Boolean(adminEmail),
  };
}

export async function isOwnerBootstrapOpen(): Promise<boolean> {
  if (!hasConfiguredDatabase()) {
    return false;
  }
  return !(await hasClaimedFirebaseOwner());
}

export async function getAuthenticatedFirebaseUser(
  request: Request
): Promise<DecodedIdToken | null> {
  const token = extractBearerToken(request);
  if (!token) {
    return null;
  }
  try {
    return await verifyFirebaseIdToken(token);
  } catch {
    return null;
  }
}

export async function bootstrapInitialOwnerWithFirebaseToken(
  idToken: string,
  providedBootstrapToken?: string
): Promise<AuthenticatedAdmin> {
  await ensureSeeded();

  let decoded: DecodedIdToken;
  try {
    decoded = await verifyFirebaseIdToken(idToken);
  } catch (err) {
    console.error('Firebase Admin ID token verification failed during bootstrap:', err);
    throw new AdminAuthError('Invalid or expired Firebase authentication token.', 401);
  }

  const { uid, email } = assertValidAdminDecodedToken(decoded);

  const expectedBootstrapToken = process.env.ADMIN_BOOTSTRAP_TOKEN?.trim() || '';
  const expectedAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() || '';

  if (!expectedBootstrapToken && !expectedAdminEmail) {
    throw new AdminAuthError(
      'Initial owner bootstrap is locked. Configure ADMIN_BOOTSTRAP_TOKEN or ADMIN_EMAIL in your server environment variables.',
      403
    );
  }

  if (expectedBootstrapToken) {
    const candidate = (providedBootstrapToken || '').trim();
    if (!candidate || !timingSafeMatch(candidate, expectedBootstrapToken)) {
      throw new AdminAuthError(
        'Invalid bootstrap authorization token. Verify ADMIN_BOOTSTRAP_TOKEN in your server environment.',
        403
      );
    }
  }

  if (expectedAdminEmail && email !== expectedAdminEmail) {
    throw new AdminAuthError(
      'This Firebase email does not match the authorized owner email (ADMIN_EMAIL).',
      403
    );
  }

  const owner = await db.transaction(async (tx) => {
    // Serialize bootstrap attempts across concurrent serverless invocations
    await tx.execute(sql`SELECT pg_advisory_xact_lock(71992026)`);

    const claimed = await tx
      .select({ id: administratorAccounts.id })
      .from(administratorAccounts)
      .where(
        and(
          isNotNull(administratorAccounts.firebaseUid),
          eq(administratorAccounts.isActive, true)
        )
      )
      .limit(1);

    if (claimed.length > 0) {
      throw new AdminAuthError(
        'Initial owner administrator is already configured. Public administrator registration is disabled.',
        403
      );
    }

    // Deactivate any legacy unlinked placeholder rows so only the verified Firebase owner has access
    await tx
      .update(administratorAccounts)
      .set({ isActive: false })
      .where(isNull(administratorAccounts.firebaseUid));

    const [existingForEmail] = await tx
      .select()
      .from(administratorAccounts)
      .where(eq(administratorAccounts.email, email))
      .limit(1);

    const displayName =
      typeof decoded.name === 'string' && decoded.name.trim()
        ? decoded.name.trim()
        : 'UrFoodBox Owner';

    if (existingForEmail) {
      const [updated] = await tx
        .update(administratorAccounts)
        .set({
          firebaseUid: uid,
          fullName: existingForEmail.fullName || displayName,
          passwordHash: 'firebase-auth-managed',
          role: 'owner',
          isActive: true,
          lastLoginAt: new Date(),
        })
        .where(eq(administratorAccounts.id, existingForEmail.id))
        .returning({
          id: administratorAccounts.id,
          email: administratorAccounts.email,
          fullName: administratorAccounts.fullName,
          role: administratorAccounts.role,
        });
      return updated;
    }

    const [inserted] = await tx
      .insert(administratorAccounts)
      .values({
        email,
        fullName: displayName,
        passwordHash: 'firebase-auth-managed',
        firebaseUid: uid,
        role: 'owner',
        isActive: true,
        lastLoginAt: new Date(),
      })
      .returning({
        id: administratorAccounts.id,
        email: administratorAccounts.email,
        fullName: administratorAccounts.fullName,
        role: administratorAccounts.role,
      });

    return inserted;
  });

  return owner;
}

export async function authenticateAdminWithFirebaseToken(
  idToken: string
): Promise<AuthenticatedAdmin> {
  await ensureSeeded();

  let decoded: DecodedIdToken;
  try {
    decoded = await verifyFirebaseIdToken(idToken);
  } catch (err) {
    console.error('Firebase Admin ID token verification failed:', err);
    throw new AdminAuthError('Invalid or expired Firebase authentication token.', 401);
  }

  const { uid, email } = assertValidAdminDecodedToken(decoded);

  const [admin] = await db
    .select({
      id: administratorAccounts.id,
      email: administratorAccounts.email,
      fullName: administratorAccounts.fullName,
      role: administratorAccounts.role,
      firebaseUid: administratorAccounts.firebaseUid,
      isActive: administratorAccounts.isActive,
    })
    .from(administratorAccounts)
    .where(eq(administratorAccounts.firebaseUid, uid))
    .limit(1);

  if (!admin || !admin.isActive || admin.email.toLowerCase() !== email) {
    const bootstrapOpen = await isOwnerBootstrapOpen();
    if (bootstrapOpen) {
      throw new AdminAuthError(
        'No owner administrator has been authorized yet. Complete the Initial Owner Setup first.',
        403
      );
    }
    throw new AdminAuthError(
      'This Firebase account is not authorized as a store administrator.',
      403
    );
  }

  await db
    .update(administratorAccounts)
    .set({ lastLoginAt: new Date() })
    .where(eq(administratorAccounts.id, admin.id));

  return {
    id: admin.id,
    email: admin.email,
    fullName: admin.fullName,
    role: admin.role,
  };
}

export async function getAuthenticatedAdmin(
  request: Request
): Promise<AuthenticatedAdmin | null> {
  if (!hasConfiguredDatabase()) {
    return null;
  }

  try {
    await ensureSeeded();

    // 1. Verify Firebase Bearer ID token via Firebase Admin SDK when supplied
    const bearerToken = extractBearerToken(request);
    if (bearerToken) {
      const decoded = await getAuthenticatedFirebaseUser(request);
      if (!decoded) return null;

      try {
        const { uid, email } = assertValidAdminDecodedToken(decoded);
        const [admin] = await db
          .select({
            id: administratorAccounts.id,
            email: administratorAccounts.email,
            fullName: administratorAccounts.fullName,
            role: administratorAccounts.role,
            firebaseUid: administratorAccounts.firebaseUid,
            isActive: administratorAccounts.isActive,
          })
          .from(administratorAccounts)
          .where(eq(administratorAccounts.firebaseUid, uid))
          .limit(1);

        if (admin && admin.isActive && admin.email.toLowerCase() === email) {
          return {
            id: admin.id,
            email: admin.email,
            fullName: admin.fullName,
            role: admin.role,
          };
        }
      } catch {
        return null;
      }
      return null;
    }

    // 2. Fall back to HttpOnly session cookie / header issued after Firebase verification
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
            firebaseUid: administratorAccounts.firebaseUid,
            isActive: administratorAccounts.isActive,
          })
          .from(administratorAccounts)
          .where(eq(administratorAccounts.id, session.adminId))
          .limit(1);

        if (admin && admin.isActive && admin.firebaseUid) {
          return {
            id: admin.id,
            email: admin.email,
            fullName: admin.fullName,
            role: admin.role,
          };
        }
      }
    }
  } catch (err) {
    console.error('Admin session verification error:', err);
  }

  return null;
}
