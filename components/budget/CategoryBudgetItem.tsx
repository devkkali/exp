'use client';

import { useState } from 'react';
import { Category } from '@/lib/types';
import { CATEGORY_MAP } from '@/lib/constants';
import { formatCurrency } from '@/lib/format';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { categoryBudgetStatus } from '@/lib/calculations';

interface CategoryBudgetItemProps {
  category: Category;
  budgetAmount: number;
  actualAmount: number;
  onBudgetChange: (amount: number) => void;
}

export function CategoryBudgetItem({
  category,
  budgetAmount,
  actualAmount,
  onBudgetChange,
}: CategoryBudgetItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(budgetAmount > 0 ? budgetAmount.toString() : '');
  const meta = CATEGORY_MAP[category];
  const status = categoryBudgetStatus(actualAmount, budgetAmount);

  const statusColors = {
    under: 'text-emerald-300',
    near: 'text-amber-300',
    over: 'text-red-300',
  };

  function handleSave() {
    const val = parseFloat(inputValue);
    onBudgetChange(isNaN(val) ? 0 : val);
    setIsEditing(false);
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{meta.emoji}</span>
          <span className="text-sm font-medium">{meta.label}</span>
        </div>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              step="10"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="w-20 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-right text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500/30"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="rounded-lg bg-violet-600/60 px-2 py-1 text-xs font-medium"
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setInputValue(budgetAmount > 0 ? budgetAmount.toString() : '');
              setIsEditing(true);
            }}
            className="text-sm text-white/50 hover:text-white transition"
          >
            {budgetAmount > 0 ? formatCurrency(budgetAmount) : 'Set budget'}
          </button>
        )}
      </div>

      {budgetAmount > 0 && (
        <>
          <div className="mt-3">
            <ProgressBar value={actualAmount} max={budgetAmount} size="sm" />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-white/40">
              Spent: {formatCurrency(actualAmount)}
            </span>
            <span className={statusColors[status]}>
              {status === 'over'
                ? `Over by ${formatCurrency(actualAmount - budgetAmount)}`
                : `${formatCurrency(budgetAmount - actualAmount)} left`}
            </span>
          </div>
        </>
      )}

      {budgetAmount === 0 && actualAmount > 0 && (
        <p className="mt-2 text-xs text-white/30">
          Spent {formatCurrency(actualAmount)} (no budget set)
        </p>
      )}
    </div>
  );
}
