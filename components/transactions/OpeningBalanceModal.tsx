'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatMonthShort } from '@/lib/format';

interface OpeningBalanceModalProps {
  monthKey: string;
  /** Current opening balance for the month, or null if none is set yet */
  currentAmount: number | null;
  onSave: (amount: number) => void;
  onRemove: () => void;
  onCancel: () => void;
}

/** Rendered only while open, so the initial state is always fresh — no sync effect needed */
export function OpeningBalanceModal({
  monthKey,
  currentAmount,
  onSave,
  onRemove,
  onCancel,
}: OpeningBalanceModalProps) {
  const [amount, setAmount] = useState(currentAmount !== null ? String(currentAmount) : '');

  const parsed = parseFloat(amount);
  const canSave = !isNaN(parsed) && parsed > 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-[28px] border border-white/10 bg-[#12182b] p-6 shadow-2xl">
        <h3 className="text-lg font-semibold">🏦 Opening balance</h3>
        <p className="mt-2 text-sm text-white/50">
          Money you already had at the start of {formatMonthShort(monthKey)}. It counts toward
          this month&apos;s net.
        </p>

        <div className="mt-4">
          <Input
            label="Amount (€)"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            autoFocus
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canSave) onSave(parsed);
            }}
          />
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="secondary" fullWidth onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" fullWidth onClick={() => onSave(parsed)} disabled={!canSave}>
            Save
          </Button>
        </div>

        {currentAmount !== null && (
          <button
            onClick={onRemove}
            className="mt-3 w-full rounded-xl py-2 text-sm text-red-400 transition hover:bg-red-500/10"
          >
            Remove opening balance
          </button>
        )}
      </div>
    </div>
  );
}
