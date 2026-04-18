'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAppData } from '@/providers/DataProvider';
import { getCurrentMonthKey, getPreviousMonthKey } from '@/lib/format';
import { filterByMonth, compareMonths, categoryComparison } from '@/lib/calculations';
import { CATEGORIES, CATEGORY_MAP } from '@/lib/constants';
import { Category } from '@/lib/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { MonthPicker } from '@/components/ui/MonthPicker';
import { Select } from '@/components/ui/Select';
import { ComparisonSummaryCard } from './ComparisonSummaryCard';
import { CategoryComparisonList } from './CategoryComparisonList';
import { MonthComparisonBarChart } from '@/components/charts/MonthComparisonBarChart';
import { DailyCumulativeChart } from '@/components/charts/DailyCumulativeChart';
import { PlannedToggle } from '@/components/ui/PlannedToggle';

export function CompareScreen() {
  const { transactions, isLoaded } = useAppData();
  const currentMonth = getCurrentMonthKey();

  const [monthA, setMonthA] = useState(getPreviousMonthKey(currentMonth));
  const [monthB, setMonthB] = useState(currentMonth);
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');

  const txA = useMemo(() => filterByMonth(transactions, monthA), [transactions, monthA]);
  const txB = useMemo(() => filterByMonth(transactions, monthB), [transactions, monthB]);

  const scopedTxA = useMemo(
    () => (categoryFilter === 'all' ? txA : txA.filter((t) => t.category === categoryFilter)),
    [txA, categoryFilter]
  );
  const scopedTxB = useMemo(
    () => (categoryFilter === 'all' ? txB : txB.filter((t) => t.category === categoryFilter)),
    [txB, categoryFilter]
  );

  const comparison = useMemo(
    () => compareMonths(scopedTxA, scopedTxB, monthA, monthB),
    [scopedTxA, scopedTxB, monthA, monthB]
  );

  const catDeltas = useMemo(() => categoryComparison(txA, txB), [txA, txB]);

  const swap = useCallback(() => {
    setMonthA(monthB);
    setMonthB(monthA);
  }, [monthA, monthB]);

  if (!isLoaded) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  const hasData = scopedTxA.length > 0 || scopedTxB.length > 0;
  const isFiltered = categoryFilter !== 'all';
  const filteredLabel =
    categoryFilter === 'all'
      ? 'Month vs month analysis'
      : `${CATEGORY_MAP[categoryFilter].emoji} ${CATEGORY_MAP[categoryFilter].label} · month vs month`;

  return (
    <>
      <PageHeader
        title="Compare"
        subtitle={filteredLabel}
        rightAction={
          <div className="flex items-center gap-2">
            <PlannedToggle />
            <button
              onClick={swap}
              aria-label="Swap A and B"
              className="rounded-xl bg-white/5 px-3 py-1.5 text-sm text-white/70 hover:bg-white/10 transition"
            >
              ⇄
            </button>
          </div>
        }
      />
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-5 shrink-0 text-xs font-medium uppercase tracking-wider text-violet-300/80">A</span>
          <div className="flex-1">
            <MonthPicker value={monthA} onChange={setMonthA} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 shrink-0 text-xs font-medium uppercase tracking-wider text-pink-300/80">B</span>
          <div className="flex-1">
            <MonthPicker value={monthB} onChange={setMonthB} />
          </div>
        </div>

        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as Category | 'all')}
          options={[
            { value: 'all', label: 'All categories' },
            ...CATEGORIES.map((c) => ({ value: c.key, label: `${c.emoji} ${c.label}` })),
          ]}
        />

        {hasData ? (
          <>
            <ComparisonSummaryCard comparison={comparison} />
            <DailyCumulativeChart
              monthAKey={monthA}
              monthBKey={monthB}
              txA={scopedTxA}
              txB={scopedTxB}
            />
            <MonthComparisonBarChart comparison={comparison} />
            {!isFiltered && <CategoryComparisonList deltas={catDeltas} />}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-4xl">📊</p>
            <p className="mt-3 text-sm font-medium text-white/50">
              {isFiltered
                ? 'No transactions in this category for either month'
                : 'No data for the selected months'}
            </p>
            <p className="text-xs text-white/30">
              {isFiltered ? 'Pick a different category or month' : 'Add transactions to see comparisons'}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
