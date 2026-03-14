'use client';

import { Card } from '@/components/ui/Card';
import { CategoryDelta } from '@/lib/types';
import { CategoryComparisonItem } from './CategoryComparisonItem';

interface CategoryComparisonListProps {
  deltas: CategoryDelta[];
}

export function CategoryComparisonList({ deltas }: CategoryComparisonListProps) {
  if (deltas.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-semibold">Category Breakdown</h2>
        <p className="mt-2 text-sm text-white/40">No category data to compare.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold">Category Breakdown</h2>
      <p className="text-sm text-white/45">Expense changes per category</p>
      <div className="mt-4 space-y-2">
        {deltas.map((d) => (
          <CategoryComparisonItem key={d.category} data={d} />
        ))}
      </div>
    </Card>
  );
}
