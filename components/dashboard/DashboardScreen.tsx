'use client';

import { useMemo } from 'react';
import { useAppData } from '@/providers/DataProvider';
import { getPreviousMonthKey } from '@/lib/format';
import {
  filterByMonth,
  totalIncome,
  totalExpenses,
  netBalance,
  topExpenseCategories,
  categoryComparison,
} from '@/lib/calculations';
import { generateInsights } from '@/lib/insights';

import { WelcomeCard } from './WelcomeCard';
import { TopCategoriesCard } from './TopCategoriesCard';
import { InsightCard } from './InsightCard';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { PlannedToggle } from '@/components/ui/PlannedToggle';

export function DashboardScreen() {
  const { transactions, selectedMonth, setSelectedMonth, getBudgetForMonth, isLoaded } = useAppData();

  const monthTx = useMemo(() => filterByMonth(transactions, selectedMonth), [transactions, selectedMonth]);
  const prevMonthKey = getPreviousMonthKey(selectedMonth);
  const prevMonthTx = useMemo(() => filterByMonth(transactions, prevMonthKey), [transactions, prevMonthKey]);

  const income = useMemo(() => totalIncome(monthTx), [monthTx]);
  const expenses = useMemo(() => totalExpenses(monthTx), [monthTx]);
  const balance = useMemo(() => netBalance(monthTx), [monthTx]);
  const topCats = useMemo(() => topExpenseCategories(monthTx), [monthTx]);
  const categoryDeltas = useMemo(
    () => categoryComparison(prevMonthTx, monthTx),
    [prevMonthTx, monthTx]
  );
  const budget = getBudgetForMonth(selectedMonth);
  const insights = useMemo(
    () => generateInsights(monthTx, prevMonthTx, budget),
    [monthTx, prevMonthTx, budget]
  );

  if (!isLoaded) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <PlannedToggle />
      </div>

      <WelcomeCard
        monthKey={selectedMonth}
        onMonthChange={setSelectedMonth}
        netBalance={balance}
        income={income}
        expenses={expenses}
      />

      <TopCategoriesCard categories={topCats} totalExpenses={expenses} deltas={categoryDeltas} />

      <CategoryPieChart data={topCats} />

      <InsightCard insights={insights} />
    </div>
  );
}
