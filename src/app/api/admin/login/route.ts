import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '../../../../db/index.ts';
import { ensureSeeded } from '../../../../db/queries.ts';
import { administratorAccounts } from '../../../../db/schema.ts';
import {
  buildAdminCookieConfig,
  createAdminSessionToken,
} from '../../../../lib/auth.ts';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const body = await request.json().catch(() => ({}));
    const { email, password } = body || {};

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Email and password are required.' },
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
    });
    response.cookies.set(buildAdminCookieConfig(request, token));
    return response;
  } catch (error) {
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
