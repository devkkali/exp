'use client';

import { Card } from '@/components/ui/Card';
import { MonthComparison } from '@/lib/types';
import { formatCurrency, formatMonthShort } from '@/lib/format';

interface ComparisonSummaryCardProps {
  comparison: MonthComparison;
}

function DeltaValue({ delta, invert = false }: { delta: number; invert?: boolean }) {
  const isPositive = invert ? delta < 0 : delta > 0;
  const isNegative = invert ? delta > 0 : delta < 0;
  return (
    <span
      className={`text-xs font-medium ${
        isPositive ? 'text-emerald-400' : isNegative ? 'text-red-400' : 'text-white/40'
      }`}
    >
      {delta > 0 ? '+' : ''}{formatCurrency(delta)}
    </span>
  );
}

export function ComparisonSummaryCard({ comparison }: ComparisonSummaryCardProps) {
  const monthA = formatMonthShort(comparison.monthAKey);
  const monthB = formatMonthShort(comparison.monthBKey);

  return (
    <Card>
      <h2 className="text-lg font-semibold">Summary</h2>

      {/* Header labels */}
      <div className="mt-4 grid grid-cols-4 gap-2 text-xs text-white/40">
        <span></span>
        <span className="text-center">{monthA}</span>
        <span className="text-center">{monthB}</span>
        <span className="text-center">Delta</span>
      </div>

      {/* Income row */}
      <div className="mt-3 grid grid-cols-4 items-center gap-2 rounded-2xl bg-white/5 px-3 py-3">
        <span className="text-sm font-medium text-emerald-300">Income</span>
        <span className="text-center text-sm">{formatCurrency(comparison.incomeA)}</span>
        <span className="text-center text-sm">{formatCurrency(comparison.incomeB)}</span>
        <span className="text-center">
          <DeltaValue delta={comparison.incomeDelta} />
        </span>
      </div>

      {/* Expense row */}
      <div className="mt-2 grid grid-cols-4 items-center gap-2 rounded-2xl bg-white/5 px-3 py-3">
        <span className="text-sm font-medium text-red-300">Expenses</span>
        <span className="text-center text-sm">{formatCurrency(comparison.expenseA)}</span>
        <span className="text-center text-sm">{formatCurrency(comparison.expenseB)}</span>
        <span className="text-center">
          <DeltaValue delta={comparison.expenseDelta} invert />
        </span>
      </div>

      {/* Net row */}
      <div className="mt-2 grid grid-cols-4 items-center gap-2 rounded-2xl bg-violet-500/10 px-3 py-3">
        <span className="text-sm font-medium">Net</span>
        <span className="text-center text-sm">{formatCurrency(comparison.netA)}</span>
        <span className="text-center text-sm">{formatCurrency(comparison.netB)}</span>
        <span className="text-center">
          <DeltaValue delta={comparison.netDelta} />
        </span>
      </div>
    </Card>
  );
}
