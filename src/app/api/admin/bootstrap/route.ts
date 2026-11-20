import { NextResponse } from 'next/server';
import { hasConfiguredDatabase } from '../../../../db/index.ts';
import {
  AdminAuthError,
  bootstrapInitialOwnerWithFirebaseToken,
  buildAdminCookieConfig,
  createAdminSessionToken,
  extractBearerToken,
  getBootstrapConfigStatus,
  isOwnerBootstrapOpen,
} from '../../../../lib/auth.ts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!hasConfiguredDatabase()) {
      return NextResponse.json(
        { error: 'Database is not configured.' },
        { status: 500 }
      );
    }

    const bootstrapOpen = await isOwnerBootstrapOpen();
    const configStatus = getBootstrapConfigStatus();

    return NextResponse.json({
      bootstrapOpen,
      bootstrapConfigured: configStatus.bootstrapConfigured,
      requiresBootstrapToken: configStatus.requiresBootstrapToken,
    });
  } catch (error) {
    console.error('Admin bootstrap status error:', error);
    return NextResponse.json(
      { error: 'Failed to inspect administrator bootstrap status.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      idToken?: unknown;
      bootstrapToken?: unknown;
    };

    const bearerToken = extractBearerToken(request);
    const bodyIdToken = typeof body?.idToken === 'string' ? body.idToken.trim() : '';
    const firebaseIdToken = bearerToken || bodyIdToken;

    if (!firebaseIdToken) {
      return NextResponse.json(
        { error: 'Firebase ID token is required to authorize the initial owner.' },
        { status: 400 }
      );
    }

    const providedBootstrapToken =
      typeof body?.bootstrapToken === 'string'
        ? body.bootstrapToken
        : request.headers.get('x-admin-bootstrap-token') || undefined;

    const admin = await bootstrapInitialOwnerWithFirebaseToken(
      firebaseIdToken,
      providedBootstrapToken
    );

    const token = createAdminSessionToken({
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
    });

    const response = NextResponse.json({
      admin,
      sessionToken: token,
      authProvider: 'firebase',
      bootstrapped: true,
    });
    response.cookies.set(buildAdminCookieConfig(request, token));
    return response;
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Admin bootstrap error:', error);
    const message =
      error instanceof Error &&
      (error.message.includes('Database is not configured') ||
        error.message.includes('Database connection failed'))
        ? error.message
        : 'Failed to authorize initial owner administrator.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
