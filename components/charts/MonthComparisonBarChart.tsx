'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { MonthComparison } from '@/lib/types';
import { formatCurrency, formatMonthShort } from '@/lib/format';
import { Card } from '@/components/ui/Card';

interface MonthComparisonBarChartProps {
  comparison: MonthComparison;
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#12182b] px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-white/60">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function MonthComparisonBarChart({ comparison }: MonthComparisonBarChartProps) {
  const data = [
    {
      name: formatMonthShort(comparison.monthAKey),
      Income: comparison.incomeA,
      Expenses: comparison.expenseA,
    },
    {
      name: formatMonthShort(comparison.monthBKey),
      Income: comparison.incomeB,
      Expenses: comparison.expenseB,
    },
  ];

  return (
    <Card>
      <h2 className="text-lg font-semibold">Monthly Comparison</h2>
      <p className="text-sm text-white/45">Income &amp; expenses side by side</p>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={8}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#ffffff80', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#ffffff40', fontSize: 11 }}
              tickFormatter={(v) => `€${v}`}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Legend
              wrapperStyle={{ fontSize: '11px', color: '#ffffff80' }}
            />
            <Bar dataKey="Income" fill="#34d399" radius={[8, 8, 0, 0]} />
            <Bar dataKey="Expenses" fill="#f472b6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
