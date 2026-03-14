export type TransactionType = 'income' | 'expense';

export type Category =
  | 'salary'
  | 'freelance'
  | 'loan'
  | 'food'
  | 'ai'
  | 'party'
  | 'travel'
  | 'shopping'
  | 'bills'
  | 'entertainment'
  | 'health'
  | 'transport'
  | 'other';

export interface Transaction {
  id: string;
  type: TransactionType;
  date: string; // YYYY-MM-DD
  title: string;
  amount: number; // always positive
  category: Category;
  note: string;
  isEstimated: boolean; // true = planned, false = actual
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface MonthlyBudget {
  monthKey: string; // YYYY-MM
  totalBudget: number;
  categoryBudgets: Partial<Record<Category, number>>;
}

export interface CategoryMeta {
  key: Category;
  label: string;
  emoji: string;
  color: string; // Tailwind bg class
  chartColor: string; // hex for recharts
}

export interface MonthComparison {
  monthAKey: string;
  monthBKey: string;
  incomeA: number;
  incomeB: number;
  incomeDelta: number;
  expenseA: number;
  expenseB: number;
  expenseDelta: number;
  netA: number;
  netB: number;
  netDelta: number;
}

export interface CategoryDelta {
  category: Category;
  amountA: number;
  amountB: number;
  delta: number;
  percentChange: number | null; // null if amountA is 0
}

export type TransactionFormData = Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>;
