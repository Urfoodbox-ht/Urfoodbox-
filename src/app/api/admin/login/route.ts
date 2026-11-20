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
    const body = (await request.json().catch(() => ({}))) as {
      idToken?: unknown;
    };

    const bearerToken = extractBearerToken(request);
    const bodyIdToken = typeof body?.idToken === 'string' ? body.idToken.trim() : '';
    const firebaseIdToken = bearerToken || bodyIdToken;

    if (!firebaseIdToken) {
      return NextResponse.json(
        {
          error:
            'Firebase authentication token is required. Sign in through Firebase Authentication (Email/Password or Google).',
        },
        { status: 400 }
      );
    }

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
        : 'Failed to sign in with Firebase Authentication.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
