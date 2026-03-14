'use client';
import { useMemo, useState, useCallback } from 'react';
import { useAppData } from '@/providers/DataProvider';
import {
  filterByMonth,
  totalIncome,
  totalExpenses,
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
const GROUP_BY_OPTIONS = [
  { value: 'date', label: 'Date' },
  { value: 'category', label: 'Category' },
  { value: 'type', label: 'Type' },
] as const;

export function TransactionsScreen() {
  const { transactions, selectedMonth, setSelectedMonth, deleteTransactionsBulk, isLoaded } = useAppData();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [groupBy, setGroupBy] = useState<TransactionGroupBy>('date');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isSelecting = selectedIds.size > 0;
  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const monthTx = useMemo(
    () => filterByMonth(transactions, selectedMonth),
    [transactions, selectedMonth]
  );
  const visibleTx = useMemo(() => {
    const byCategory = categoryFilter === 'all'
      ? monthTx
      : monthTx.filter((tx) => tx.category === categoryFilter);
    const query = searchQuery.trim().toLowerCase();
    if (!query) return byCategory;
    return byCategory.filter((tx) => tx.title.toLowerCase().includes(query));
  }, [monthTx, categoryFilter, searchQuery]);

  const income = useMemo(() => totalIncome(visibleTx), [visibleTx]);
  const expenses = useMemo(() => totalExpenses(visibleTx), [visibleTx]);

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
          ) : undefined
        }
      />

      {/* Selection toolbar */}
      {isSelecting && (
        <div className="mb-4 flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleSelectAll}>
            {selectedIds.size === visibleTx.length ? 'Deselect All' : 'Select All'}
          </Button>
          <div className="flex-1" />
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete ({selectedIds.size})
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <MonthPicker
          value={selectedMonth}
          onChange={(value) => {
            clearSelection();
            setSelectedMonth(value);
          }}
        />
        <Input
          label="Search by name"
          placeholder="Type transaction name..."
          value={searchQuery}
          onChange={(e) => {
            clearSelection();
            setSearchQuery(e.target.value);
          }}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
            label="Filter (category)"
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

        <div className="flex gap-3">
          <div className="flex-1 rounded-2xl bg-emerald-500/10 px-4 py-3 text-center">
            <p className="text-xs text-emerald-300/70">Income</p>
            <p className="text-sm font-semibold text-emerald-300">{formatCurrency(income)}</p>
          </div>
          <div className="flex-1 rounded-2xl bg-red-500/10 px-4 py-3 text-center">
            <p className="text-xs text-red-300/70">Expenses</p>
            <p className="text-sm font-semibold text-red-300">{formatCurrency(expenses)}</p>
          </div>
        </div>

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
    </>
  );
}
