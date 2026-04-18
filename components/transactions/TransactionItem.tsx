'use client';

import { useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Transaction } from '@/lib/types';
import { CATEGORY_MAP } from '@/lib/constants';
import { formatCurrency } from '@/lib/format';
import { Badge } from '@/components/ui/Badge';
import { useAppData } from '@/providers/DataProvider';
import { MarkActualModal } from './MarkActualModal';

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
  const { updateTransaction } = useAppData();
  const meta = CATEGORY_MAP[transaction.category];
  const isIncome = transaction.type === 'income';
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);
  const [showMarkActual, setShowMarkActual] = useState(false);

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

  const handleConfirmActual = useCallback(
    async (date: string) => {
      await updateTransaction(transaction.id, {
        type: transaction.type,
        date,
        title: transaction.title,
        amount: transaction.amount,
        category: transaction.category,
        note: transaction.note,
        isEstimated: false,
      });
      setShowMarkActual(false);
    },
    [updateTransaction, transaction]
  );

  const showMarkActualButton = transaction.isEstimated && !isSelecting;

  return (
    <>
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onClick={handleClick}
        className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 transition active:scale-[0.99] ${
          isSelected
            ? 'bg-violet-500/20 border border-violet-500/40'
            : 'bg-white/5 hover:bg-white/8 border border-transparent'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {isSelecting && (
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${
                isSelected
                  ? 'border-violet-500 bg-violet-500'
                  : 'border-white/20 bg-transparent'
              }`}
            >
              {isSelected && <span className="text-[10px] text-white">✓</span>}
            </div>
          )}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-base">
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
        <div className="flex shrink-0 items-center gap-2">
          <p
            className={`text-sm font-semibold ${
              isIncome ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
          </p>
          {showMarkActualButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMarkActual(true);
              }}
              title="Mark as actual"
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-sm text-emerald-300 hover:bg-emerald-500/25 transition"
            >
              ✓
            </button>
          )}
        </div>
      </div>
      <MarkActualModal
        isOpen={showMarkActual}
        defaultDate={transaction.date}
        onConfirm={handleConfirmActual}
        onCancel={() => setShowMarkActual(false)}
      />
    </>
  );
}
