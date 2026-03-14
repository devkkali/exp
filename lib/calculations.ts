import { Transaction, Category, MonthlyBudget, MonthComparison, CategoryDelta } from './types';
import { CATEGORIES, EXPENSE_CATEGORIES } from './constants';
import { getMonthKey } from './format';

// ── Filtering ────────────────────────────────────

export function filterByMonth(transactions: Transaction[], monthKey: string): Transaction[] {
  return transactions.filter((tx) => getMonthKey(tx.date) === monthKey);
}

export function filterActual(transactions: Transaction[]): Transaction[] {
  return transactions.filter((tx) => !tx.isEstimated);
}

export function filterEstimated(transactions: Transaction[]): Transaction[] {
  return transactions.filter((tx) => tx.isEstimated);
}

export function filterByType(transactions: Transaction[], type: 'income' | 'expense'): Transaction[] {
  return transactions.filter((tx) => tx.type === type);
}

// ── Totals ───────────────────────────────────────

export function totalIncome(transactions: Transaction[]): number {
  return transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);
}

export function totalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);
}

export function netBalance(transactions: Transaction[]): number {
  return totalIncome(transactions) - totalExpenses(transactions);
}

export function actualExpenses(transactions: Transaction[]): number {
  return totalExpenses(filterActual(transactions));
}

export function estimatedExpenses(transactions: Transaction[]): number {
  return totalExpenses(filterEstimated(transactions));
}

export function actualIncome(transactions: Transaction[]): number {
  return totalIncome(filterActual(transactions));
}

// ── Category breakdown ───────────────────────────

export function expensesByCategory(transactions: Transaction[]): Partial<Record<Category, number>> {
  const result: Partial<Record<Category, number>> = {};
  transactions
    .filter((tx) => tx.type === 'expense')
    .forEach((tx) => {
      result[tx.category] = (result[tx.category] || 0) + tx.amount;
    });
  return result;
}

export function incomeByCategory(transactions: Transaction[]): Partial<Record<Category, number>> {
  const result: Partial<Record<Category, number>> = {};
  transactions
    .filter((tx) => tx.type === 'income')
    .forEach((tx) => {
      result[tx.category] = (result[tx.category] || 0) + tx.amount;
    });
  return result;
}

/** Returns sorted array of { category, amount } descending by amount */
export function topExpenseCategories(
  transactions: Transaction[]
): { category: Category; amount: number }[] {
  const byCategory = expensesByCategory(transactions);
  return Object.entries(byCategory)
    .map(([category, amount]) => ({ category: category as Category, amount: amount ?? 0 }))
    .sort((a, b) => b.amount - a.amount);
}

export function biggestCategory(
  transactions: Transaction[]
): { category: Category; amount: number } | null {
  const top = topExpenseCategories(transactions);
  return top.length > 0 ? top[0] : null;
}

// ── Budget analysis ──────────────────────────────

export function overBudgetAmount(actual: number, budget: number): number {
  return Math.max(0, actual - budget);
}

export function budgetProgress(actual: number, budget: number): number {
  if (budget <= 0) return 0;
  return (actual / budget) * 100;
}

export function categoryBudgetStatus(
  actual: number,
  budget: number
): 'under' | 'near' | 'over' {
  if (budget <= 0) return 'under';
  const pct = (actual / budget) * 100;
  if (pct > 100) return 'over';
  if (pct >= 75) return 'near';
  return 'under';
}

/** Sum of all per-category budgets */
export function totalCategoryBudgets(budget: MonthlyBudget): number {
  return Object.values(budget.categoryBudgets).reduce((s, v) => s + (v ?? 0), 0);
}

// ── Comparison ───────────────────────────────────

export function compareMonths(
  txA: Transaction[],
  txB: Transaction[],
  monthAKey: string,
  monthBKey: string
): MonthComparison {
  const incA = totalIncome(txA);
  const incB = totalIncome(txB);
  const expA = totalExpenses(txA);
  const expB = totalExpenses(txB);
  const netA = incA - expA;
  const netB = incB - expB;

  return {
    monthAKey,
    monthBKey,
    incomeA: incA,
    incomeB: incB,
    incomeDelta: incB - incA,
    expenseA: expA,
    expenseB: expB,
    expenseDelta: expB - expA,
    netA,
    netB,
    netDelta: netB - netA,
  };
}

export function categoryComparison(txA: Transaction[], txB: Transaction[]): CategoryDelta[] {
  const catA = expensesByCategory(txA);
  const catB = expensesByCategory(txB);

  const allCategories = new Set<Category>([
    ...(Object.keys(catA) as Category[]),
    ...(Object.keys(catB) as Category[]),
  ]);

  return EXPENSE_CATEGORIES
    .filter((c) => allCategories.has(c))
    .map((category) => {
      const amountA = catA[category] ?? 0;
      const amountB = catB[category] ?? 0;
      const delta = amountB - amountA;
      const percentChange = amountA > 0 ? ((delta / amountA) * 100) : null;
      return { category, amountA, amountB, delta, percentChange };
    })
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
}

// ── Grouping ─────────────────────────────────────
export type TransactionGroupBy = 'date' | 'category' | 'type';

export function getTransactionGroupKey(
  transaction: Transaction,
  groupBy: TransactionGroupBy
): string {
  switch (groupBy) {
    case 'category':
      return transaction.category;
    case 'type':
      return transaction.type;
    case 'date':
    default:
      return transaction.date;
  }
}

function sortTransactionGroupKeys(keys: string[], groupBy: TransactionGroupBy): string[] {
  const next = [...keys];

  if (groupBy === 'date') {
    return next.sort((a, b) => (a < b ? 1 : -1));
  }

  if (groupBy === 'type') {
    const typeOrder: Record<string, number> = { income: 0, expense: 1 };
    return next.sort((a, b) => (typeOrder[a] ?? 99) - (typeOrder[b] ?? 99));
  }

  const categoryOrder = new Map(CATEGORIES.map((c, index) => [c.key, index]));
  return next.sort((a, b) => {
    const indexA = categoryOrder.get(a as Category);
    const indexB = categoryOrder.get(b as Category);
    if (indexA === undefined && indexB === undefined) return a.localeCompare(b);
    if (indexA === undefined) return 1;
    if (indexB === undefined) return -1;
    return indexA - indexB;
  });
}

/** Group transactions by an arbitrary group key with stable key ordering */
export function groupTransactions(
  transactions: Transaction[],
  groupBy: TransactionGroupBy
): Record<string, Transaction[]> {
  const sorted = [...transactions].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  const groups: Record<string, Transaction[]> = {};
  for (const transaction of sorted) {
    const key = getTransactionGroupKey(transaction, groupBy);
    if (!groups[key]) groups[key] = [];
    groups[key].push(transaction);
  }

  const ordered: Record<string, Transaction[]> = {};
  for (const key of sortTransactionGroupKeys(Object.keys(groups), groupBy)) {
    ordered[key] = groups[key];
  }
  return ordered;
}

/** Group transactions by date string, sorted descending */
export function groupByDate(transactions: Transaction[]): Record<string, Transaction[]> {
  return groupTransactions(transactions, 'date');
}
