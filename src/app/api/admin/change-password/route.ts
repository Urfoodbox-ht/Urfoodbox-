import { NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '../../../../lib/auth.ts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const adminUser = await getAuthenticatedAdmin(request);
  if (!adminUser) {
    return NextResponse.json(
      { error: 'Administrator authentication required.' },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      error:
        'Administrator passwords are managed in Firebase Authentication, not PostgreSQL. Use the Firebase password change flow in the Security tab or Firebase Console.',
    },
    { status: 410 }
  );
}
