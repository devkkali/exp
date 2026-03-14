import { Category, CategoryMeta } from './types';

export const CURRENCY_SYMBOL = '€';

export const STORAGE_KEYS = {
  TRANSACTIONS: 'pb_transactions',
  BUDGETS: 'pb_budgets',
} as const;

export const CATEGORIES: CategoryMeta[] = [
  { key: 'salary', label: 'Salary', emoji: '💰', color: 'bg-emerald-400', chartColor: '#34d399' },
  { key: 'freelance', label: 'Freelance', emoji: '💻', color: 'bg-cyan-400', chartColor: '#22d3ee' },
  { key: 'loan', label: 'Loan', emoji: '💳', color: 'bg-yellow-400', chartColor: '#facc15' },
  { key: 'food', label: 'Food', emoji: '🍔', color: 'bg-orange-400', chartColor: '#fb923c' },
  { key: 'ai', label: 'AI', emoji: '🤖', color: 'bg-sky-400', chartColor: '#38bdf8' },
  { key: 'party', label: 'Party', emoji: '🎉', color: 'bg-pink-400', chartColor: '#f472b6' },
  { key: 'travel', label: 'Travel', emoji: '✈️', color: 'bg-violet-400', chartColor: '#a78bfa' },
  { key: 'shopping', label: 'Shopping', emoji: '🛍️', color: 'bg-rose-400', chartColor: '#fb7185' },
  { key: 'bills', label: 'Bills', emoji: '📄', color: 'bg-amber-400', chartColor: '#fbbf24' },
  { key: 'entertainment', label: 'Entertainment', emoji: '🎬', color: 'bg-indigo-400', chartColor: '#818cf8' },
  { key: 'health', label: 'Health', emoji: '❤️', color: 'bg-red-400', chartColor: '#f87171' },
  { key: 'transport', label: 'Transport', emoji: '🚗', color: 'bg-teal-400', chartColor: '#2dd4bf' },
  { key: 'other', label: 'Other', emoji: '📦', color: 'bg-gray-400', chartColor: '#9ca3af' },
];

export const CATEGORY_MAP: Record<Category, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c])
) as Record<Category, CategoryMeta>;

export const INCOME_CATEGORIES: Category[] = ['salary', 'freelance', 'other'];
export const EXPENSE_CATEGORIES: Category[] = [
  'loan', 'food', 'ai', 'party', 'travel', 'shopping', 'bills',
  'entertainment', 'health', 'transport', 'other',
];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
