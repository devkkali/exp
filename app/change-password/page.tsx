'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { ChangePasswordForm } from './ChangePasswordForm';

export default function ChangePasswordPage() {
  return (
    <>
      <PageHeader title="Change Password" subtitle="Update your account password" />
      <ChangePasswordForm />
    </>
  );
}
