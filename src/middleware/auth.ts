import crypto from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { eq } from 'drizzle-orm';
import { adminAuth } from '../lib/firebase-admin.ts';
import { db } from '../db/index.ts';
import { administratorAccounts } from '../db/schema.ts';

export const ADMIN_COOKIE_NAME = 'ufb_admin_session';

const getSessionSecret = (): string => {
  if (process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.length >= 16) {
    return process.env.ADMIN_SESSION_SECRET;
  }
  const seed = process.env.SQL_PASSWORD || process.env.APP_URL || 'urfoodbox-local-dev-signing-key';
  return crypto.createHash('sha256').update(`ufb-admin-secret:${seed}`).digest('hex');
};

export interface AdminSessionPayload {
  adminId: number;
  email: string;
  role: string;
  exp: number;
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

export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
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

export interface AuthRequest extends Request {
  firebaseUser?: DecodedIdToken;
  adminUser?: {
    id: number;
    email: string;
    fullName: string;
    role: string;
  };
}

export async function requireFirebaseAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.slice('Bearer '.length).trim();
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.firebaseUser = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
}

export async function optionalFirebaseAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice('Bearer '.length).trim();
    try {
      req.firebaseUser = await adminAuth.verifyIdToken(token);
    } catch {
      // Ignore invalid optional token for guest checkout
    }
  }
  next();
}

export async function requireAdminAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const cookies = parseCookies(req.headers.cookie);
  const cookieToken = cookies[ADMIN_COOKIE_NAME];

  if (cookieToken) {
    const session = verifyAdminSessionToken(cookieToken);
    if (session) {
      try {
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
          req.adminUser = {
            id: admin.id,
            email: admin.email,
            fullName: admin.fullName,
            role: admin.role,
          };
          return next();
        }
      } catch (err) {
        console.error('Admin session lookup failed:', err);
        return res.status(500).json({ error: 'Authentication verification failed' });
      }
    }
  }

  // Also support Firebase Bearer token for verified owner Google Sign-In
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice('Bearer '.length).trim();
    try {
      const decoded = await adminAuth.verifyIdToken(token);
      if (decoded.email && decoded.email_verified) {
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
          req.adminUser = {
            id: admin.id,
            email: admin.email,
            fullName: admin.fullName,
            role: admin.role,
          };
          return next();
        }
      }
    } catch {
      // Fall through to 401
    }
  }

  return res.status(401).json({ error: 'Administrator authorization required' });
}
