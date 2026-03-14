import { Transaction, MonthlyBudget, TransactionFormData, Category } from './types';

const BASE = '/api';

// ── Transactions ─────────────────────────────────

export async function fetchTransactions(): Promise<Transaction[]> {
  const res = await fetch(`${BASE}/transactions`);
  if (!res.ok) throw new Error(`Failed to fetch transactions (${res.status})`);
  const data = await res.json();
  // Normalize Prisma DateTime to ISO string
  return data.map(normalizeTx);
}

export async function createTransaction(data: TransactionFormData): Promise<Transaction> {
  const res = await fetch(`${BASE}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create transaction');
  return normalizeTx(await res.json());
}

export async function createTransactionsBulk(data: TransactionFormData[]): Promise<Transaction[]> {
  const res = await fetch(`${BASE}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to import transactions');
  const result = await res.json();
  return result.map(normalizeTx);
}

export async function updateTransaction(id: string, data: TransactionFormData): Promise<Transaction> {
  const res = await fetch(`${BASE}/transactions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update transaction');
  return normalizeTx(await res.json());
}

export async function deleteTransaction(id: string): Promise<void> {
  const res = await fetch(`${BASE}/transactions/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete transaction');
}

export async function deleteTransactionsBulk(ids: string[]): Promise<number> {
  const res = await fetch(`${BASE}/transactions`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error('Failed to delete transactions');
  const result = await res.json();
  return result.deleted;
}

// ── Budgets ──────────────────────────────────────

export async function fetchBudgets(): Promise<MonthlyBudget[]> {
  const res = await fetch(`${BASE}/budgets`);
  if (!res.ok) throw new Error(`Failed to fetch budgets (${res.status})`);
  return res.json();
}

export async function upsertBudget(
  monthKey: string,
  totalBudget?: number,
  categoryBudgets?: Partial<Record<Category, number>>
): Promise<MonthlyBudget> {
  const res = await fetch(`${BASE}/budgets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ monthKey, totalBudget, categoryBudgets }),
  });
  if (!res.ok) throw new Error('Failed to update budget');
  return res.json();
}

// ── Helpers ──────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeTx(raw: any): Transaction {
  return {
    ...raw,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date(raw.createdAt).toISOString(),
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : new Date(raw.updatedAt).toISOString(),
  };
}
