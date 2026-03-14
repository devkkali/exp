'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BottomNav } from './BottomNav';
import { DataProvider } from '@/providers/DataProvider';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/login';
  const isHomePage = pathname === '/';

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null);
    router.replace('/login');
  }

  if (isLoginPage) {
    return (
      <main className="min-h-screen px-4 pt-5 pb-10">
        <div className="mx-auto w-full max-w-md">
          {children}
        </div>
      </main>
    );
  }
  return (
    <DataProvider>
      <main className="min-h-screen px-4 pt-5 pb-28">
        <div className="mx-auto w-full max-w-md">
          {isHomePage && (
            <div className="mb-3 flex items-center justify-end gap-2">
              <Link
                href="/change-password"
                className="rounded-xl bg-white/5 px-3 py-2 text-xs font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                Change password
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-xl bg-white/5 px-3 py-2 text-xs font-medium text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                Log out
              </button>
            </div>
          )}
          {children}
        </div>
      </main>
      <BottomNav />
    </DataProvider>
  );
}
