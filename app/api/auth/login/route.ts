import { NextRequest, NextResponse } from 'next/server';
import {
  AUTH_COOKIE_NAME,
  createSessionToken,
  getSessionMaxAge,
  shouldUseSecureCookie,
} from '@/lib/auth-session';
import {
  ensureBootstrapAuthUser,
  findAuthUserByUsername,
  normalizeUsername,
  verifyPassword,
} from '@/lib/auth-user';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const username = normalizeUsername(body?.username?.toString?.() || '');
  const password = body?.password?.toString?.() || '';
  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
  }
  const bootstrap = await ensureBootstrapAuthUser();
  if (!bootstrap.ok) {
    return NextResponse.json({ error: bootstrap.error }, { status: 500 });
  }
  const user = await findAuthUserByUsername(username);
  const isValidPassword = user ? await verifyPassword(password, user.passwordHash) : false;
  if (!user || !isValidPassword) {
    return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
  }
  const token = await createSessionToken(user.username);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: shouldUseSecureCookie(request),
    sameSite: 'lax',
    path: '/',
    maxAge: getSessionMaxAge(),
  });
  return response;
}
