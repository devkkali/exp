'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatCurrency } from '@/lib/format';
import { CATEGORY_MAP } from '@/lib/constants';
import { Category } from '@/lib/types';

interface BudgetProgressCardProps {
  actualSpend: number;
  budgetTotal: number;
  topCategories: { category: Category; amount: number }[];
}

export function BudgetProgressCard({
  actualSpend,
  budgetTotal,
  topCategories,
}: BudgetProgressCardProps) {
  const over = actualSpend - budgetTotal;
  const hasBudget = budgetTotal > 0;

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Budget Progress</h2>
          <p className="text-sm text-white/45">Estimated vs actual this month</p>
        </div>
        {hasBudget && (
          <Badge variant={over > 0 ? 'danger' : 'success'}>
            {over > 0 ? `Over by ${formatCurrency(over)}` : `Under by ${formatCurrency(Math.abs(over))}`}
          </Badge>
        )}
      </div>

      <div className="mt-5 space-y-4">
        {hasBudget ? (
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-white/65">Monthly budget</span>
              <span className="font-medium">
                {formatCurrency(actualSpend)} / {formatCurrency(budgetTotal)}
              </span>
            </div>
            <ProgressBar value={actualSpend} max={budgetTotal} />
          </div>
        ) : (
          <p className="text-sm text-white/40">No budget set for this month. Set one in the Budget tab.</p>
        )}

        {topCategories.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {topCategories.slice(0, 3).map(({ category, amount }) => {
              const meta = CATEGORY_MAP[category];
              return (
                <div key={category} className="rounded-2xl bg-white/5 p-3">
                  <p className="text-xs text-white/45">
                    {meta.emoji} {meta.label}
                  </p>
                  <p className="mt-2 text-base font-semibold">{formatCurrency(amount)}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
