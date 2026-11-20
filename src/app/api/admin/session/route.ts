import { NextResponse } from 'next/server';
import { hasConfiguredDatabase } from '../../../../db/index.ts';
import { getAuthenticatedAdmin } from '../../../../lib/auth.ts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    if (!hasConfiguredDatabase()) {
      return NextResponse.json(
        { error: 'Database is not configured.' },
        { status: 500 }
      );
    }

    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'Administrator authentication required.' },
        { status: 401 }
      );
    }
    return NextResponse.json({ admin });
  } catch (error) {
    console.error('Admin session route error:', error);
    return NextResponse.json(
      { error: 'Failed to verify administrator session.' },
      { status: 500 }
    );
  }
}
