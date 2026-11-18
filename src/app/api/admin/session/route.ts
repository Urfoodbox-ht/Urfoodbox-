import { NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '../../../../lib/auth.ts';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const admin = await getAuthenticatedAdmin(request);
  if (!admin) {
    return NextResponse.json(
      { error: 'Administrator authentication required.' },
      { status: 401 }
    );
  }
  return NextResponse.json({ admin });
}
