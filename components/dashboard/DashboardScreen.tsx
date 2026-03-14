'use client';

import { useMemo } from 'react';
import { useAppData } from '@/providers/DataProvider';
import { getPreviousMonthKey } from '@/lib/format';
import {
  filterByMonth,
  totalIncome,
  totalExpenses,
  netBalance,
  actualExpenses,
  topExpenseCategories,
} from '@/lib/calculations';
import { generateInsights } from '@/lib/insights';

import { WelcomeCard } from './WelcomeCard';
import { SummaryStatCard } from './SummaryStatCard';
import { BudgetProgressCard } from './BudgetProgressCard';
import { TopCategoriesCard } from './TopCategoriesCard';
import { InsightCard } from './InsightCard';
import { MonthComparisonTeaser } from './MonthComparisonTeaser';
import { MonthPicker } from '@/components/ui/MonthPicker';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';

export function DashboardScreen() {
  const { transactions, selectedMonth, setSelectedMonth, getBudgetForMonth, isLoaded } = useAppData();

  const monthTx = useMemo(() => filterByMonth(transactions, selectedMonth), [transactions, selectedMonth]);
  const prevMonthKey = getPreviousMonthKey(selectedMonth);
  const prevMonthTx = useMemo(() => filterByMonth(transactions, prevMonthKey), [transactions, prevMonthKey]);

  const income = useMemo(() => totalIncome(monthTx), [monthTx]);
  const expenses = useMemo(() => totalExpenses(monthTx), [monthTx]);
  const balance = useMemo(() => netBalance(monthTx), [monthTx]);
  const actual = useMemo(() => actualExpenses(monthTx), [monthTx]);
  const topCats = useMemo(() => topExpenseCategories(monthTx), [monthTx]);
  const budget = getBudgetForMonth(selectedMonth);
  const insights = useMemo(
    () => generateInsights(monthTx, prevMonthTx, budget),
    [monthTx, prevMonthTx, budget]
  );
  const prevExpenses = useMemo(() => totalExpenses(prevMonthTx), [prevMonthTx]);

  if (!isLoaded) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <MonthPicker value={selectedMonth} onChange={setSelectedMonth} />

      <WelcomeCard monthKey={selectedMonth} netBalance={balance} />

      <div className="grid grid-cols-2 gap-3">
        <SummaryStatCard label="Income" amount={income} subtext="All income this month" />
        <SummaryStatCard label="Expenses" amount={expenses} subtext="All spending this month" />
      </div>

      <BudgetProgressCard
        actualSpend={actual}
        budgetTotal={budget?.totalBudget ?? 0}
        topCategories={topCats}
      />

      <TopCategoriesCard categories={topCats} totalExpenses={expenses} />

      <CategoryPieChart data={topCats} />

      <InsightCard insights={insights} />

      <MonthComparisonTeaser
        currentMonthKey={selectedMonth}
        previousMonthKey={prevMonthKey}
        currentExpenses={expenses}
        previousExpenses={prevExpenses}
      />
    </div>
  );
}
