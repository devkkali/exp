'use client';

import { CategoryDelta } from '@/lib/types';
import { CATEGORY_MAP } from '@/lib/constants';
import { formatCurrency, formatPercent } from '@/lib/format';

interface CategoryComparisonItemProps {
  data: CategoryDelta;
}

export function CategoryComparisonItem({ data }: CategoryComparisonItemProps) {
  const meta = CATEGORY_MAP[data.category];
  const increased = data.delta > 0;
  const decreased = data.delta < 0;

  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-base">{meta.emoji}</span>
        <div>
          <p className="text-sm font-medium">{meta.label}</p>
          <p className="text-xs text-white/40">
            {formatCurrency(data.amountA)} → {formatCurrency(data.amountB)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`text-sm font-semibold ${
            increased ? 'text-red-400' : decreased ? 'text-emerald-400' : 'text-white/40'
          }`}
        >
          {data.delta > 0 ? '+' : ''}{formatCurrency(data.delta)}
        </p>
        {data.percentChange !== null && (
          <p className="text-xs text-white/30">
            {data.percentChange > 0 ? '↑' : data.percentChange < 0 ? '↓' : ''}
            {formatPercent(Math.abs(data.percentChange))}
          </p>
        )}
      </div>
    </div>
  );
}
