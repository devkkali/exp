'use client';

import { useRouter } from 'next/navigation';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function PageHeader({ title, subtitle, showBack = false, rightAction }: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-5 flex items-start justify-between">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white/60 hover:bg-white/10 hover:text-white transition"
          >
            ← Back
          </button>
        )}
        <div>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-white/50">{subtitle}</p>}
        </div>
      </div>
      {rightAction && <div>{rightAction}</div>}
    </div>
  );
}
