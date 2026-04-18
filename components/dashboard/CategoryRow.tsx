'use client';

import { formatCurrency } from '@/lib/format';
import { CATEGORY_MAP } from '@/lib/constants';
import { Category } from '@/lib/types';

interface CategoryRowProps {
  category: Category;
  amount: number;
  totalExpenses: number;
  delta?: { amount: number; percentChange: number | null; isNew: boolean } | null;
}

export function CategoryRow({ category, amount, totalExpenses, delta }: CategoryRowProps) {
  const meta = CATEGORY_MAP[category];
  const percent = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;

  return (
    <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
      <div className="flex min-w-0 items-center gap-2">
        <div className={`h-2 w-2 shrink-0 rounded-full ${meta.color}`} />
        <span className="truncate text-sm font-medium">
          {meta.emoji} {meta.label}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-2 text-sm">
        <span className="text-white/40">{percent}%</span>
        <span className="font-semibold">{formatCurrency(amount)}</span>
        {delta && delta.amount !== 0 && <DeltaBadge delta={delta} />}
      </div>
    </div>
  );
}

function DeltaBadge({
  delta,
}: {
  delta: { amount: number; percentChange: number | null; isNew: boolean };
}) {
  const isUp = delta.amount > 0;
  const colorClass = isUp ? 'text-red-400' : 'text-emerald-400';
  const sign = isUp ? '+' : '−';
  const label = delta.isNew
    ? 'new'
    : delta.percentChange !== null
      ? `${sign}${Math.round(Math.abs(delta.percentChange))}%`
      : `${sign}${formatCurrency(Math.abs(delta.amount))}`;
  return <span className={`min-w-11 text-right text-xs font-medium ${colorClass}`}>{label}</span>;
}
