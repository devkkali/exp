'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatMonthShort } from '@/lib/format';

interface MonthComparisonTeaserProps {
  currentMonthKey: string;
  previousMonthKey: string;
  currentExpenses: number;
  previousExpenses: number;
}

export function MonthComparisonTeaser({
  currentMonthKey,
  previousMonthKey,
  currentExpenses,
  previousExpenses,
}: MonthComparisonTeaserProps) {
  const maxVal = Math.max(currentExpenses, previousExpenses, 1);
  const delta = currentExpenses - previousExpenses;

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">vs Last Month</h2>
          <p className="text-sm text-white/45">Expense comparison</p>
        </div>
        <Link
          href="/compare"
          className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/70 hover:bg-white/12 transition"
        >
          Full compare →
        </Link>
      </div>

      <div className="mt-5 space-y-3">
        {/* Current month bar */}
        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-white/65">{formatMonthShort(currentMonthKey)}</span>
            <span className="font-medium">{formatCurrency(currentExpenses)}</span>
          </div>
          <div className="h-3 w-full rounded-full bg-white/10">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-500"
              style={{ width: `${(currentExpenses / maxVal) * 100}%` }}
            />
          </div>
        </div>

        {/* Previous month bar */}
        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-white/65">{formatMonthShort(previousMonthKey)}</span>
            <span className="font-medium">{formatCurrency(previousExpenses)}</span>
          </div>
          <div className="h-3 w-full rounded-full bg-white/10">
            <div
              className="h-3 rounded-full bg-white/20 transition-all duration-500"
              style={{ width: `${(previousExpenses / maxVal) * 100}%` }}
            />
          </div>
        </div>

        {previousExpenses > 0 && (
          <p className="text-center text-xs text-white/50">
            {delta > 0
              ? `${formatCurrency(delta)} more than last month`
              : delta < 0
              ? `${formatCurrency(Math.abs(delta))} less than last month`
              : 'Same as last month'}
          </p>
        )}
      </div>
    </Card>
  );
}
