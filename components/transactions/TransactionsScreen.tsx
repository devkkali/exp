'use client';
import { useMemo, useState, useCallback } from 'react';
import { useAppData } from '@/providers/DataProvider';
import {
  filterByMonth,
  totalIncome,
  totalExpenses,
  totalOpening,
  TransactionGroupBy,
} from '@/lib/calculations';
import { formatCurrency } from '@/lib/format';
import { CATEGORIES } from '@/lib/constants';
import { PageHeader } from '@/components/layout/PageHeader';
import { MonthPicker } from '@/components/ui/MonthPicker';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { TransactionList } from './TransactionList';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { OpeningBalanceModal } from './OpeningBalanceModal';
import { PlannedToggle } from '@/components/ui/PlannedToggle';
const GROUP_BY_OPTIONS = [
  { value: 'date', label: 'Date' },
  { value: 'category', label: 'Category' },
  { value: 'type', label: 'Type' },
] as const;

export function TransactionsScreen() {
  const {
    transactions,
    selectedMonth,
    setSelectedMonth,
    deleteTransactionsBulk,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    isLoaded,
  } = useAppData();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showOpeningModal, setShowOpeningModal] = useState(false);
  const [groupBy, setGroupBy] = useState<TransactionGroupBy>('date');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const isSelecting = selectedIds.size > 0;
  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const { monthStart, monthEnd } = useMemo(() => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const lastDay = new Date(y, m, 0).getDate();
    return {
      monthStart: `${selectedMonth}-01`,
      monthEnd: `${selectedMonth}-${String(lastDay).padStart(2, '0')}`,
    };
  }, [selectedMonth]);

  const monthTx = useMemo(
    () => filterByMonth(transactions, selectedMonth),
    [transactions, selectedMonth]
  );
  const visibleTx = useMemo(() => {
    const from = fromDate || monthStart;
    const to = toDate || monthEnd;
    // Opening balance is edited through the 🏦 button, never listed as a row
    const listable = monthTx.filter((tx) => tx.type !== 'opening');
    const byDate = listable.filter((tx) => tx.date >= from && tx.date <= to);
    const byCategory = categoryFilter === 'all'
      ? byDate
      : byDate.filter((tx) => tx.category === categoryFilter);
    const query = searchQuery.trim().toLowerCase();
    if (!query) return byCategory;
    return byCategory.filter((tx) => tx.title.toLowerCase().includes(query));
  }, [monthTx, categoryFilter, searchQuery, fromDate, toDate, monthStart, monthEnd]);

  const income = useMemo(() => totalIncome(visibleTx), [visibleTx]);
  const expenses = useMemo(() => totalExpenses(visibleTx), [visibleTx]);
  // Month-wide: the opening balance is not part of the filtered list
  const opening = useMemo(() => totalOpening(monthTx), [monthTx]);
  const net = opening + income - expenses;

  // One opening entry per month; the modal creates it if absent, edits it if present
  const openingTx = useMemo(
    () => monthTx.find((tx) => tx.type === 'opening'),
    [monthTx]
  );

  const handleSaveOpening = useCallback(
    async (amount: number) => {
      const data = {
        type: 'opening' as const,
        date: `${selectedMonth}-01`,
        title: 'Opening balance',
        amount,
        // never rendered — opening entries are excluded from the list
        category: 'other' as const,
        note: '',
        isEstimated: false,
      };
      if (openingTx) await updateTransaction(openingTx.id, data);
      else await addTransaction(data);
      setShowOpeningModal(false);
    },
    [selectedMonth, openingTx, addTransaction, updateTransaction]
  );

  const handleRemoveOpening = useCallback(async () => {
    if (openingTx) await deleteTransaction(openingTx.id);
    setShowOpeningModal(false);
  }, [openingTx, deleteTransaction]);

  const activeFilterCount =
    (fromDate ? 1 : 0) +
    (toDate ? 1 : 0) +
    (categoryFilter !== 'all' ? 1 : 0) +
    (groupBy !== 'date' ? 1 : 0);

  const resetFilters = useCallback(() => {
    setFromDate('');
    setToDate('');
    setCategoryFilter('all');
    setGroupBy('date');
    clearSelection();
  }, [clearSelection]);

  const handleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleLongPress = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === visibleTx.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(visibleTx.map((tx) => tx.id)));
    }
  }, [selectedIds.size, visibleTx]);

  const handleBulkDelete = useCallback(async () => {
    await deleteTransactionsBulk(Array.from(selectedIds));
    clearSelection();
    setShowDeleteModal(false);
  }, [selectedIds, deleteTransactionsBulk, clearSelection]);

  if (!isLoaded) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Transactions"
        subtitle={isSelecting ? `${selectedIds.size} selected` : `${visibleTx.length} entries`}
        rightAction={
          isSelecting ? (
            <button
              onClick={clearSelection}
              className="text-sm text-violet-400 hover:text-violet-300"
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={() => setShowOpeningModal(true)}
              title="Opening balance"
              aria-label="Edit opening balance"
              className={`flex h-10 items-center gap-1.5 rounded-xl px-3 text-base transition ${
                openingTx
                  ? 'bg-violet-500/20 text-violet-200 hover:bg-violet-500/30'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>🏦</span>
              {openingTx && (
                <span className="text-xs font-semibold">{formatCurrency(openingTx.amount)}</span>
              )}
            </button>
          )
        }
      />

      {isSelecting && (
        <div className="mb-3 flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleSelectAll}>
            {selectedIds.size === visibleTx.length ? 'Deselect All' : 'Select All'}
          </Button>
          <div className="flex-1" />
          <Button variant="danger" size="sm" onClick={() => setShowDeleteModal(true)}>
            Delete ({selectedIds.size})
          </Button>
        </div>
      )}

      <div className="space-y-3">
        <MonthPicker
          value={selectedMonth}
          onChange={(value) => {
            clearSelection();
            setFromDate('');
            setToDate('');
            setSelectedMonth(value);
          }}
        />

        <Input
          type="search"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => {
            clearSelection();
            setSearchQuery(e.target.value);
          }}
        />

        <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm">
          {opening !== 0 && (
            <span className="text-violet-300">
              <span className="text-white/40">Start</span> {formatCurrency(opening)}
            </span>
          )}
          <span className="text-emerald-300">
            <span className="text-white/40">In</span> {formatCurrency(income)}
          </span>
          <span className="text-red-300">
            <span className="text-white/40">Out</span> {formatCurrency(expenses)}
          </span>
          <span className={net >= 0 ? 'text-white' : 'text-red-400'}>
            <span className="text-white/40">Net</span> {formatCurrency(net)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => setShowFilters((s) => !s)}
            className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10 transition"
          >
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-violet-500/30 px-1.5 text-[10px] text-violet-200">
                {activeFilterCount}
              </span>
            )}
            <span className="text-white/40">{showFilters ? '▴' : '▾'}</span>
          </button>
          <div className="flex items-center gap-2">
            <PlannedToggle />
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-white/50 hover:text-white/80 transition"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="From"
                type="date"
                min={monthStart}
                max={monthEnd}
                value={fromDate}
                onChange={(e) => {
                  clearSelection();
                  setFromDate(e.target.value);
                }}
              />
              <Input
                label="To"
                type="date"
                min={monthStart}
                max={monthEnd}
                value={toDate}
                onChange={(e) => {
                  clearSelection();
                  setToDate(e.target.value);
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Group by"
                value={groupBy}
                onChange={(e) => {
                  clearSelection();
                  setGroupBy(e.target.value as TransactionGroupBy);
                }}
                options={GROUP_BY_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label }))}
              />
              <Select
                label="Category"
                value={categoryFilter}
                onChange={(e) => {
                  clearSelection();
                  setCategoryFilter(e.target.value);
                }}
                options={[
                  { value: 'all', label: 'All categories' },
                  ...CATEGORIES.map((category) => ({
                    value: category.key,
                    label: `${category.emoji} ${category.label}`,
                  })),
                ]}
              />
            </div>
          </div>
        )}

        <TransactionList
          transactions={visibleTx}
          groupBy={groupBy}
          isSelecting={isSelecting}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onLongPress={handleLongPress}
        />
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onConfirm={handleBulkDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      {showOpeningModal && (
        <OpeningBalanceModal
          monthKey={selectedMonth}
          currentAmount={openingTx?.amount ?? null}
          onSave={handleSaveOpening}
          onRemove={handleRemoveOpening}
          onCancel={() => setShowOpeningModal(false)}
        />
      )}
    </>
  );
}
