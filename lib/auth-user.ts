import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

const MIN_PASSWORD_LENGTH = 8;
const BCRYPT_ROUNDS = 12;
const DEV_DEFAULT_USERNAME = 'admin';
const DEV_DEFAULT_PASSWORD = 'admin123';

export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase();
}

function resolveBootstrapCredentials(): { username: string; password: string } | null {
  const rawUsername =
    process.env.AUTH_BOOTSTRAP_USERNAME ||
    process.env.AUTH_USERNAME ||
    (process.env.NODE_ENV !== 'production' ? DEV_DEFAULT_USERNAME : '');
  const rawPassword =
    process.env.AUTH_BOOTSTRAP_PASSWORD ||
    process.env.AUTH_PASSWORD ||
    (process.env.NODE_ENV !== 'production' ? DEV_DEFAULT_PASSWORD : '');

  const username = normalizeUsername(rawUsername || '');
  const password = rawPassword || '';

  if (!username || !password) return null;
  return { username, password };
}

export function getPasswordPolicyError(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export async function findAuthUserByUsername(username: string) {
  const normalized = normalizeUsername(username);
  if (!normalized) return null;
  return prisma.authUser.findUnique({ where: { username: normalized } });
}

export async function ensureBootstrapAuthUser(): Promise<{ ok: true } | { ok: false; error: string }> {
  const count = await prisma.authUser.count();
  if (count > 0) return { ok: true };

  const bootstrap = resolveBootstrapCredentials();
  if (!bootstrap) {
    return {
      ok: false,
      error:
        'No admin user exists yet. Set AUTH_BOOTSTRAP_USERNAME and AUTH_BOOTSTRAP_PASSWORD (or AUTH_USERNAME and AUTH_PASSWORD), then sign in again.',
    };
  }

  const passwordPolicyError = getPasswordPolicyError(bootstrap.password);
  if (passwordPolicyError) {
    return {
      ok: false,
      error: `Bootstrap password invalid: ${passwordPolicyError}`,
    };
  }

  const passwordHash = await hashPassword(bootstrap.password);
  try {
    await prisma.authUser.create({
      data: {
        username: bootstrap.username,
        passwordHash,
      },
    });
  } catch (error) {
    const countAfterCreate = await prisma.authUser.count();
    if (countAfterCreate === 0) throw error;
  }

  return { ok: true };
}
