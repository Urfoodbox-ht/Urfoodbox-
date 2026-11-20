import { NextResponse } from 'next/server';
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
    const idToken = extractBearerToken(request);
    if (!idToken) {
      return NextResponse.json({ error: 'Missing Google ID token.' }, { status: 401 });
    }

    const admin = await authenticateAdminWithFirebaseToken(idToken);
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
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
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
