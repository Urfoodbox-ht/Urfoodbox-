import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '../../../../db/index.ts';
import { ensureSeeded } from '../../../../db/queries.ts';
import { administratorAccounts } from '../../../../db/schema.ts';
import {
  buildAdminCookieConfig,
  createAdminSessionToken,
} from '../../../../lib/auth.ts';
import { adminAuth } from '../../../../lib/firebase-admin.ts';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing Google ID token.' }, { status: 401 });
    }

    const idToken = authHeader.slice('Bearer '.length).trim();
    const decoded = await adminAuth.verifyIdToken(idToken);
    if (!decoded.email || !decoded.email_verified) {
      return NextResponse.json({ error: 'Verified email required.' }, { status: 401 });
    }

    const [admin] = await db
      .select()
      .from(administratorAccounts)
      .where(eq(administratorAccounts.email, decoded.email.toLowerCase()))
      .limit(1);

    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { error: 'This Google account is not authorized as a store administrator.' },
        { status: 403 }
      );
    }

    await db
      .update(administratorAccounts)
      .set({ firebaseUid: decoded.uid, lastLoginAt: new Date() })
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
    });
    response.cookies.set(buildAdminCookieConfig(request, token));
    return response;
  } catch (error) {
    console.error('Admin Google login error:', error);
    if (
      error instanceof Error &&
      (error.message.includes('Database is not configured') ||
        error.message.includes('Database connection failed'))
    ) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: 'Google administrator sign-in failed.' },
      { status: 401 }
    );
  }
}
