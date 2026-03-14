import { Transaction, MonthlyBudget } from './types';
import { STORAGE_KEYS } from './constants';

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable — silently fail for MVP
  }
}

// ── Transactions ─────────────────────────────────

export function loadTransactions(): Transaction[] {
  return read<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
}

export function saveTransactions(transactions: Transaction[]): void {
  write(STORAGE_KEYS.TRANSACTIONS, transactions);
}

// ── Budgets ──────────────────────────────────────

export function loadBudgets(): MonthlyBudget[] {
  return read<MonthlyBudget[]>(STORAGE_KEYS.BUDGETS, []);
}

export function saveBudgets(budgets: MonthlyBudget[]): void {
  write(STORAGE_KEYS.BUDGETS, budgets);
}
