'use client';

import { useMemo } from 'react';
import { useAppData } from '@/providers/DataProvider';
import { EXPENSE_CATEGORIES } from '@/lib/constants';
import { filterByMonth, actualExpenses, expensesByCategory } from '@/lib/calculations';
import { PageHeader } from '@/components/layout/PageHeader';
import { MonthPicker } from '@/components/ui/MonthPicker';
import { Card } from '@/components/ui/Card';
import { BudgetOverviewCard } from './BudgetOverviewCard';
import { CategoryBudgetItem } from './CategoryBudgetItem';

export function BudgetScreen() {
  const {
    transactions,
    selectedMonth,
    setSelectedMonth,
    getBudgetForMonth,
    setBudget,
    setCategoryBudget,
    isLoaded,
  } = useAppData();

  const monthTx = useMemo(
    () => filterByMonth(transactions, selectedMonth),
    [transactions, selectedMonth]
  );
  const actual = useMemo(() => actualExpenses(monthTx), [monthTx]);
  const catSpend = useMemo(() => expensesByCategory(monthTx), [monthTx]);
  const budget = getBudgetForMonth(selectedMonth);

  if (!isLoaded) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Budget" subtitle="Plan and track your spending" />
      <div className="space-y-4">
        <MonthPicker value={selectedMonth} onChange={setSelectedMonth} />

        <BudgetOverviewCard
          totalBudget={budget?.totalBudget ?? 0}
          actualSpend={actual}
          onBudgetChange={(amount) => setBudget(selectedMonth, amount)}
        />

        <Card>
          <h2 className="text-lg font-semibold">Category Budgets</h2>
          <p className="text-sm text-white/45">Set limits per category</p>
          <div className="mt-4 space-y-3">
            {EXPENSE_CATEGORIES.map((cat) => (
              <CategoryBudgetItem
                key={cat}
                category={cat}
                budgetAmount={budget?.categoryBudgets[cat] ?? 0}
                actualAmount={catSpend[cat] ?? 0}
                onBudgetChange={(amount) => setCategoryBudget(selectedMonth, cat, amount)}
              />
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
