'use client';

import { formatCurrency, formatPercent } from '@/lib/format';
import { CATEGORY_MAP } from '@/lib/constants';
import { Category } from '@/lib/types';

interface CategoryRowProps {
  category: Category;
  amount: number;
  totalExpenses: number;
}

export function CategoryRow({ category, amount, totalExpenses }: CategoryRowProps) {
  const meta = CATEGORY_MAP[category];
  const percent = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;

  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className={`h-3 w-3 rounded-full ${meta.color}`} />
        <div>
          <p className="text-sm font-medium">
            {meta.emoji} {meta.label}
          </p>
          <p className="text-xs text-white/45">{formatPercent(percent)} of expenses</p>
        </div>
      </div>
      <p className="text-sm font-semibold">{formatCurrency(amount)}</p>
    </div>
  );
}
