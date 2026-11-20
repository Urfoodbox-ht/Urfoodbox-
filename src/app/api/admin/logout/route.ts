import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, isHttpsRequest } from '../../../../lib/auth.ts';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const isSecure = isHttpsRequest(request);
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: isSecure ? 'none' : 'lax',
    secure: isSecure,
    path: '/',
    maxAge: 0,
  });
  return response;
}
