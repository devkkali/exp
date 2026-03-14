'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Category } from '@/lib/types';
import { CATEGORY_MAP } from '@/lib/constants';
import { formatCurrency } from '@/lib/format';
import { Card } from '@/components/ui/Card';

interface CategoryPieChartProps {
  data: { category: Category; amount: number }[];
  title?: string;
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  payload: { category: Category; amount: number; fill: string };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const meta = CATEGORY_MAP[item.payload.category];

  return (
    <div className="rounded-xl border border-white/10 bg-[#12182b] px-3 py-2 shadow-lg">
      <p className="text-xs font-medium">
        {meta.emoji} {meta.label}
      </p>
      <p className="text-sm font-semibold">{formatCurrency(item.value)}</p>
    </div>
  );
}

export function CategoryPieChart({ data, title = 'Expense Breakdown' }: CategoryPieChartProps) {
  if (data.length === 0) return null;

  const chartData = data.map((d) => ({
    ...d,
    name: CATEGORY_MAP[d.category].label,
    fill: CATEGORY_MAP[d.category].chartColor,
  }));

  return (
    <Card>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-white/45">Category distribution</p>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="amount"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        {chartData.slice(0, 6).map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.fill }}
            />
            <span className="text-[11px] text-white/50">{entry.name}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
