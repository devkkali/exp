'use client';

import { Transaction } from '@/lib/types';
import { CATEGORY_MAP } from '@/lib/constants';
import {
  groupTransactions,
  TransactionGroupBy,
  totalIncome,
  totalExpenses,
} from '@/lib/calculations';
import { formatDateShort, formatCurrency } from '@/lib/format';
import { TransactionItem } from './TransactionItem';

interface TransactionListProps {
  transactions: Transaction[];
  groupBy: TransactionGroupBy;
  isSelecting: boolean;
  selectedIds: Set<string>;
  onSelect: (id: string) => void;
  onLongPress: (id: string) => void;
}

export function TransactionList({
  transactions,
  groupBy,
  isSelecting,
  selectedIds,
  onSelect,
  onLongPress,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-4xl">📭</p>
        <p className="mt-3 text-sm font-medium text-white/50">No transactions for this view</p>
        <p className="text-xs text-white/30">Try changing month, grouping, or filter</p>
      </div>
    );
  }

  const groups = groupTransactions(transactions, groupBy);

  function renderGroupLabel(groupKey: string): string {
    if (groupBy === 'date') return formatDateShort(groupKey);
    if (groupBy === 'type') return groupKey === 'income' ? 'Income' : 'Expense';
    const meta = CATEGORY_MAP[groupKey as keyof typeof CATEGORY_MAP];
    return meta ? `${meta.emoji} ${meta.label}` : groupKey;
  }

  return (
    <div className="space-y-5">
      {Object.entries(groups).map(([groupKey, txList]) => (
        <div key={groupKey}>
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-wider text-white/40">
              {renderGroupLabel(groupKey)}
            </p>
            {(groupBy === 'date' || groupBy === 'category') && (
              <div className="flex items-center gap-2 text-[11px]">
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-300">
                  +{formatCurrency(totalIncome(txList))}
                </span>
                <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-red-300">
                  -{formatCurrency(totalExpenses(txList))}
                </span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            {txList.map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                isSelecting={isSelecting}
                isSelected={selectedIds.has(tx.id)}
                onSelect={onSelect}
                onLongPress={onLongPress}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
