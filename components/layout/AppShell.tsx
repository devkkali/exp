'use client';

import { type ReactNode } from 'react';
import { BottomNav } from './BottomNav';
import { DataProvider } from '@/providers/DataProvider';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <DataProvider>
      <main className="min-h-screen px-4 pt-5 pb-28">
        <div className="mx-auto w-full max-w-md">
          {children}
        </div>
      </main>
      <BottomNav />
    </DataProvider>
  );
}
