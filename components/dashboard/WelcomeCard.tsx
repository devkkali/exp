'use client';

import { GradientCard } from '@/components/ui/Card';
import { MonthPicker } from '@/components/ui/MonthPicker';
import { formatCurrency } from '@/lib/format';

interface WelcomeCardProps {
  monthKey: string;
  onMonthChange: (key: string) => void;
  netBalance: number;
  income: number;
  expenses: number;
}

export function WelcomeCard({
  monthKey,
  onMonthChange,
  netBalance,
  income,
  expenses,
}: WelcomeCardProps) {
  const balanceColor = netBalance >= 0 ? 'text-emerald-300' : 'text-red-300';
  return (
    <GradientCard>
      <MonthPicker value={monthKey} onChange={onMonthChange} />
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/45">Net</p>
          <p className={`text-2xl font-bold tracking-tight ${balanceColor}`}>
            {formatCurrency(netBalance)}
          </p>
        </div>
        <div className="flex items-center gap-4 text-right text-sm">
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-emerald-300/70">In</p>
            <p className="font-semibold text-emerald-300">{formatCurrency(income)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-red-300/70">Out</p>
            <p className="font-semibold text-red-300">{formatCurrency(expenses)}</p>
          </div>
        </div>
      </div>
    </GradientCard>
  );
}
