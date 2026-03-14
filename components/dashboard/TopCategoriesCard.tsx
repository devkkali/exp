'use client';

import { Card } from '@/components/ui/Card';
import { CategoryRow } from './CategoryRow';
import { Category } from '@/lib/types';

interface TopCategoriesCardProps {
  categories: { category: Category; amount: number }[];
  totalExpenses: number;
}

export function TopCategoriesCard({ categories, totalExpenses }: TopCategoriesCardProps) {
  if (categories.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-semibold">Top Categories</h2>
        <p className="mt-2 text-sm text-white/40">No expenses this month yet.</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Top Categories</h2>
          <p className="text-sm text-white/45">Your biggest expense areas</p>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {categories.slice(0, 5).map(({ category, amount }) => (
          <CategoryRow
            key={category}
            category={category}
            amount={amount}
            totalExpenses={totalExpenses}
          />
        ))}
      </div>
    </Card>
  );
}
