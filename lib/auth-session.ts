import { SignJWT, jwtVerify } from 'jose';

export const AUTH_COOKIE_NAME = 'pb_auth_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getAuthSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET || 'change-this-auth-secret-in-production';
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(username: string): Promise<string> {
  return new SignJWT({ sub: username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getAuthSecret());
}
export async function getSessionUsername(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getAuthSecret());
    const subject = payload.sub;
    if (typeof subject !== 'string' || !subject) return null;
    return subject;
  } catch {
    return null;
  }
}

export async function verifySessionToken(token: string): Promise<boolean> {
  const username = await getSessionUsername(token);
  return Boolean(username);
}

export function getSessionMaxAge(): number {
  return SESSION_MAX_AGE_SECONDS;
}
