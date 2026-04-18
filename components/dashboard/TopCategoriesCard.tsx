'use client';

import { Card } from '@/components/ui/Card';
import { CategoryRow } from './CategoryRow';
import { Category, CategoryDelta } from '@/lib/types';

interface TopCategoriesCardProps {
  categories: { category: Category; amount: number }[];
  totalExpenses: number;
  deltas?: CategoryDelta[];
}

export function TopCategoriesCard({ categories, totalExpenses, deltas }: TopCategoriesCardProps) {
  if (categories.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-semibold">Top Categories</h2>
        <p className="mt-2 text-sm text-white/40">No expenses this month yet.</p>
      </Card>
    );
  }

  const deltaMap = new Map((deltas ?? []).map((d) => [d.category, d]));

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Top Categories</h2>
          <p className="text-sm text-white/45">Biggest expenses · change vs last month</p>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {categories.filter(({ amount }) => amount > 0).map(({ category, amount }) => {
          const d = deltaMap.get(category);
          const delta = d
            ? { amount: d.delta, percentChange: d.percentChange, isNew: d.amountA === 0 }
            : null;
          return (
            <CategoryRow
              key={category}
              category={category}
              amount={amount}
              totalExpenses={totalExpenses}
              delta={delta}
            />
          );
        })}
      </div>
    </Card>
  );
}
