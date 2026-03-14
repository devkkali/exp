'use client';

import { useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Transaction } from '@/lib/types';
import { CATEGORY_MAP } from '@/lib/constants';
import { formatCurrency } from '@/lib/format';
import { Badge } from '@/components/ui/Badge';

interface TransactionItemProps {
  transaction: Transaction;
  isSelecting: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onLongPress: (id: string) => void;
}

const LONG_PRESS_MS = 500;

export function TransactionItem({
  transaction,
  isSelecting,
  isSelected,
  onSelect,
  onLongPress,
}: TransactionItemProps) {
  const router = useRouter();
  const meta = CATEGORY_MAP[transaction.category];
  const isIncome = transaction.type === 'income';
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  const handlePointerDown = useCallback(() => {
    didLongPress.current = false;
    timerRef.current = setTimeout(() => {
      didLongPress.current = true;
      onLongPress(transaction.id);
    }, LONG_PRESS_MS);
  }, [transaction.id, onLongPress]);

  const handlePointerUp = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleClick = useCallback(() => {
    if (didLongPress.current) return;
    if (isSelecting) {
      onSelect(transaction.id);
    } else {
      router.push(`/edit/${transaction.id}`);
    }
  }, [isSelecting, transaction.id, onSelect, router]);

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={handleClick}
      className={`flex cursor-pointer items-center justify-between rounded-2xl px-4 py-3 transition active:scale-[0.99] ${
        isSelected
          ? 'bg-violet-500/20 border border-violet-500/40'
          : 'bg-white/5 hover:bg-white/8 border border-transparent'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {isSelecting && (
          <div
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition ${
              isSelected
                ? 'border-violet-500 bg-violet-500'
                : 'border-white/20 bg-transparent'
            }`}
          >
            {isSelected && <span className="text-xs text-white">✓</span>}
          </div>
        )}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-lg">
          {meta.emoji}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{transaction.title}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/45">{meta.label}</span>
            {transaction.isEstimated && (
              <Badge variant="muted" className="!px-1.5 !py-0 !text-[10px]">
                Planned
              </Badge>
            )}
          </div>
        </div>
      </div>
      <p
        className={`shrink-0 text-sm font-semibold ${
          isIncome ? 'text-emerald-400' : 'text-red-400'
        }`}
      >
        {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
      </p>
    </div>
  );
}
