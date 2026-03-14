'use client';

import { GradientCard } from '@/components/ui/Card';
import { formatCurrency, formatMonthLabel } from '@/lib/format';

interface WelcomeCardProps {
  monthKey: string;
  netBalance: number;
}

export function WelcomeCard({ monthKey, netBalance }: WelcomeCardProps) {
  return (
    <GradientCard>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-white/60">Welcome back</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Pocket Budget</h1>
          <p className="mt-2 text-sm text-white/50">{formatMonthLabel(monthKey)} overview</p>
        </div>
        <div className="rounded-2xl bg-white/10 px-3 py-2 text-right">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">Balance</p>
          <p className={`mt-1 text-lg font-semibold ${netBalance >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
            {formatCurrency(netBalance)}
          </p>
        </div>
      </div>
    </GradientCard>
  );
}
