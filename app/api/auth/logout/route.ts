import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, shouldUseSecureCookie } from '@/lib/auth-session';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    secure: shouldUseSecureCookie(request),
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
