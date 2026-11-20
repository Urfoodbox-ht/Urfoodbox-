import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '../../../../db/index.ts';
import { ensureSeeded } from '../../../../db/queries.ts';
import { administratorAccounts } from '../../../../db/schema.ts';
import {
  AdminAuthError,
  authenticateAdminWithFirebaseToken,
  buildAdminCookieConfig,
  createAdminSessionToken,
  extractBearerToken,
} from '../../../../lib/auth.ts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const body = (await request.json().catch(() => ({}))) as {
      email?: unknown;
      password?: unknown;
      idToken?: unknown;
    };

    const bearerToken = extractBearerToken(request);
    const bodyIdToken = typeof body?.idToken === 'string' ? body.idToken.trim() : '';
    const firebaseIdToken = bearerToken || bodyIdToken;

    if (firebaseIdToken) {
      const admin = await authenticateAdminWithFirebaseToken(firebaseIdToken);
      const token = createAdminSessionToken({
        adminId: admin.id,
        email: admin.email,
        role: admin.role,
      });

      const response = NextResponse.json({
        admin,
        sessionToken: token,
        authProvider: 'firebase',
      });
      response.cookies.set(buildAdminCookieConfig(request, token));
      return response;
    }

    const { email, password } = body || {};
    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Firebase ID token or email and password are required.' },
        { status: 400 }
      );
    }

    const [admin] = await db
      .select()
      .from(administratorAccounts)
      .where(eq(administratorAccounts.email, email.trim().toLowerCase()))
      .limit(1);

    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { error: 'Invalid administrator credentials.' },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid administrator credentials.' },
        { status: 401 }
      );
    }

    await db
      .update(administratorAccounts)
      .set({ lastLoginAt: new Date() })
      .where(eq(administratorAccounts.id, admin.id));

    const token = createAdminSessionToken({
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    const response = NextResponse.json({
      admin: {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
      },
      sessionToken: token,
      authProvider: 'credentials',
    });
    response.cookies.set(buildAdminCookieConfig(request, token));
    return response;
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Admin login error:', error);
    const message =
      error instanceof Error &&
      (error.message.includes('Database is not configured') ||
        error.message.includes('Database connection failed'))
        ? error.message
        : 'Failed to sign in.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
