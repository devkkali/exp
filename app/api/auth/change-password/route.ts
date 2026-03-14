import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, getSessionUsername } from '@/lib/auth-session';
import { getPasswordPolicyError, hashPassword, verifyPassword } from '@/lib/auth-user';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const sessionUsername = token ? await getSessionUsername(token) : null;
  if (!sessionUsername) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const currentPassword = body?.currentPassword?.toString?.() || '';
  const newPassword = body?.newPassword?.toString?.() || '';

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: 'Current password and new password are required.' },
      { status: 400 }
    );
  }

  if (currentPassword === newPassword) {
    return NextResponse.json(
      { error: 'New password must be different from current password.' },
      { status: 400 }
    );
  }

  const passwordPolicyError = getPasswordPolicyError(newPassword);
  if (passwordPolicyError) {
    return NextResponse.json({ error: passwordPolicyError }, { status: 400 });
  }

  const user = await prisma.authUser.findUnique({
    where: { username: sessionUsername },
  });

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isCurrentPasswordValid = await verifyPassword(currentPassword, user.passwordHash);
  if (!isCurrentPasswordValid) {
    return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 });
  }

  const newPasswordHash = await hashPassword(newPassword);
  await prisma.authUser.update({
    where: { id: user.id },
    data: { passwordHash: newPasswordHash },
  });

  return NextResponse.json({ ok: true });
}
