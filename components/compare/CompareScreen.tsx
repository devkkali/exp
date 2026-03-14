'use client';

import { useState, useMemo } from 'react';
import { useAppData } from '@/providers/DataProvider';
import { getCurrentMonthKey, getPreviousMonthKey } from '@/lib/format';
import { filterByMonth, compareMonths, categoryComparison } from '@/lib/calculations';
import { PageHeader } from '@/components/layout/PageHeader';
import { MonthPicker } from '@/components/ui/MonthPicker';
import { ComparisonSummaryCard } from './ComparisonSummaryCard';
import { CategoryComparisonList } from './CategoryComparisonList';
import { MonthComparisonBarChart } from '@/components/charts/MonthComparisonBarChart';

export function CompareScreen() {
  const { transactions, isLoaded } = useAppData();
  const currentMonth = getCurrentMonthKey();

  const [monthA, setMonthA] = useState(getPreviousMonthKey(currentMonth));
  const [monthB, setMonthB] = useState(currentMonth);

  const txA = useMemo(() => filterByMonth(transactions, monthA), [transactions, monthA]);
  const txB = useMemo(() => filterByMonth(transactions, monthB), [transactions, monthB]);

  const comparison = useMemo(
    () => compareMonths(txA, txB, monthA, monthB),
    [txA, txB, monthA, monthB]
  );

  const catDeltas = useMemo(
    () => categoryComparison(txA, txB),
    [txA, txB]
  );

  if (!isLoaded) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  const hasData = txA.length > 0 || txB.length > 0;

  return (
    <>
      <PageHeader title="Compare" subtitle="Month vs month analysis" />
      <div className="space-y-4">
        {/* Month selectors */}
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-white/40">
            Month A (baseline)
          </label>
          <MonthPicker value={monthA} onChange={setMonthA} />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-white/40">
            Month B (compare)
          </label>
          <MonthPicker value={monthB} onChange={setMonthB} />
        </div>

        {hasData ? (
          <>
            <ComparisonSummaryCard comparison={comparison} />
            <MonthComparisonBarChart comparison={comparison} />
            <CategoryComparisonList deltas={catDeltas} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-4xl">📊</p>
            <p className="mt-3 text-sm font-medium text-white/50">
              No data for the selected months
            </p>
            <p className="text-xs text-white/30">
              Add transactions to see comparisons
            </p>
          </div>
        )}
      </div>
    </>
  );
}
