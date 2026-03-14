'use client';

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { Transaction, MonthlyBudget, Category, TransactionFormData } from '@/lib/types';
import { getCurrentMonthKey } from '@/lib/format';
import * as api from '@/lib/api';

// ── Context shape ────────────────────────────────

interface AppData {
  transactions: Transaction[];
  budgets: MonthlyBudget[];
  selectedMonth: string;
  isLoaded: boolean;

  addTransaction: (data: TransactionFormData) => Promise<void>;
  addTransactionsBulk: (data: TransactionFormData[]) => Promise<void>;
  updateTransaction: (id: string, data: TransactionFormData) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  deleteTransactionsBulk: (ids: string[]) => Promise<void>;

  setBudget: (monthKey: string, totalBudget: number) => Promise<void>;
  setCategoryBudget: (monthKey: string, category: Category, amount: number) => Promise<void>;
  getBudgetForMonth: (monthKey: string) => MonthlyBudget | undefined;

  setSelectedMonth: (monthKey: string) => void;
  refresh: () => Promise<void>;
}

const DataContext = createContext<AppData | null>(null);

// ── Provider ─────────────────────────────────────

export function DataProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<MonthlyBudget[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthKey());
  const [isLoaded, setIsLoaded] = useState(false);

  // ── Initial fetch ────────────────────────────

  const loadAll = useCallback(async () => {
    try {
      const [tx, bg] = await Promise.all([
        api.fetchTransactions(),
        api.fetchBudgets(),
      ]);
      setTransactions(tx);
      setBudgets(bg);
    } catch (e) {
      console.error('Failed to load data:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ── Transaction CRUD ─────────────────────────

  const addTransaction = useCallback(async (data: TransactionFormData) => {
    const tx = await api.createTransaction(data);
    setTransactions((prev) => [tx, ...prev]);
  }, []);

  const addTransactionsBulk = useCallback(async (data: TransactionFormData[]) => {
    const created = await api.createTransactionsBulk(data);
    setTransactions((prev) => [...created, ...prev]);
  }, []);

  const updateTransaction = useCallback(async (id: string, data: TransactionFormData) => {
    const updated = await api.updateTransaction(id, data);
    setTransactions((prev) => prev.map((tx) => (tx.id === id ? updated : tx)));
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    await api.deleteTransaction(id);
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }, []);

  const deleteTransactionsBulk = useCallback(async (ids: string[]) => {
    await api.deleteTransactionsBulk(ids);
    const idSet = new Set(ids);
    setTransactions((prev) => prev.filter((tx) => !idSet.has(tx.id)));
  }, []);

  // ── Budget CRUD ──────────────────────────────

  const getBudgetForMonth = useCallback(
    (monthKey: string) => budgets.find((b) => b.monthKey === monthKey),
    [budgets]
  );

  const setBudget = useCallback(async (monthKey: string, totalBudget: number) => {
    const existing = budgets.find((b) => b.monthKey === monthKey);
    const result = await api.upsertBudget(
      monthKey,
      totalBudget,
      existing?.categoryBudgets ?? {}
    );
    setBudgets((prev) => {
      const idx = prev.findIndex((b) => b.monthKey === monthKey);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = result;
        return next;
      }
      return [...prev, result];
    });
  }, [budgets]);

  const setCategoryBudget = useCallback(async (
    monthKey: string,
    category: Category,
    amount: number
  ) => {
    const existing = budgets.find((b) => b.monthKey === monthKey);
    const newCatBudgets = { ...(existing?.categoryBudgets ?? {}), [category]: amount };
    const result = await api.upsertBudget(
      monthKey,
      existing?.totalBudget ?? 0,
      newCatBudgets
    );
    setBudgets((prev) => {
      const idx = prev.findIndex((b) => b.monthKey === monthKey);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = result;
        return next;
      }
      return [...prev, result];
    });
  }, [budgets]);

  // ── Memoized value ───────────────────────────

  const value = useMemo<AppData>(
    () => ({
      transactions,
      budgets,
      selectedMonth,
      isLoaded,
      addTransaction,
      addTransactionsBulk,
      updateTransaction,
      deleteTransaction,
      deleteTransactionsBulk,
      setBudget,
      setCategoryBudget,
      getBudgetForMonth,
      setSelectedMonth,
      refresh: loadAll,
    }),
    [
      transactions, budgets, selectedMonth, isLoaded,
      addTransaction, addTransactionsBulk, updateTransaction,
      deleteTransaction, deleteTransactionsBulk,
      setBudget, setCategoryBudget, getBudgetForMonth,
      loadAll,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// ── Hook ─────────────────────────────────────────

export function useAppData(): AppData {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useAppData must be used within DataProvider');
  return ctx;
}
