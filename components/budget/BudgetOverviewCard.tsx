'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Input } from '@/components/ui/Input';
import { formatCurrency } from '@/lib/format';

interface BudgetOverviewCardProps {
  totalBudget: number;
  actualSpend: number;
  onBudgetChange: (amount: number) => void;
}

export function BudgetOverviewCard({
  totalBudget,
  actualSpend,
  onBudgetChange,
}: BudgetOverviewCardProps) {
  const over = actualSpend - totalBudget;
  const hasBudget = totalBudget > 0;

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Monthly Budget</h2>
        {hasBudget && (
          <Badge variant={over > 0 ? 'danger' : over > -totalBudget * 0.25 ? 'warning' : 'success'}>
            {over > 0
              ? `Over by ${formatCurrency(over)}`
              : `${formatCurrency(Math.abs(over))} remaining`}
          </Badge>
        )}
      </div>

      <div className="mt-4">
        <Input
          label="Total Monthly Budget (€)"
          type="number"
          min="0"
          step="50"
          placeholder="e.g. 1500"
          value={totalBudget > 0 ? totalBudget.toString() : ''}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            onBudgetChange(isNaN(val) ? 0 : val);
          }}
        />
      </div>

      {hasBudget && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-white/65">Spent</span>
            <span className="font-medium">
              {formatCurrency(actualSpend)} / {formatCurrency(totalBudget)}
            </span>
          </div>
          <ProgressBar value={actualSpend} max={totalBudget} />
        </div>
      )}
    </Card>
  );
}
