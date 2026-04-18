'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  LabelList,
} from 'recharts';
import { Transaction } from '@/lib/types';
import { formatCurrency, formatMonthShort } from '@/lib/format';
import { Card } from '@/components/ui/Card';

interface DailyCumulativeChartProps {
  monthAKey: string;
  monthBKey: string;
  txA: Transaction[];
  txB: Transaction[];
}

interface Row {
  day: number;
  a: number | null;
  b: number | null;
}

function daysInMonth(monthKey: string) {
  const [y, m] = monthKey.split('-').map(Number);
  return new Date(y, m, 0).getDate();
}

function cumulativeByDay(tx: Transaction[], days: number): number[] {
  const daily = new Array(days + 1).fill(0) as number[];
  for (const t of tx) {
    if (t.type !== 'expense') continue;
    const day = Number(t.date.slice(8, 10));
    if (day >= 1 && day <= days) daily[day] += t.amount;
  }
  const out = new Array(days).fill(0) as number[];
  let running = 0;
  for (let d = 1; d <= days; d++) {
    running += daily[d];
    out[d - 1] = running;
  }
  return out;
}

function buildRows(
  txA: Transaction[],
  txB: Transaction[],
  aDays: number,
  bDays: number,
): Row[] {
  const maxDays = Math.max(aDays, bDays);
  const cumA = cumulativeByDay(txA, aDays);
  const cumB = cumulativeByDay(txB, bDays);
  const rows: Row[] = [];
  for (let i = 0; i < maxDays; i++) {
    rows.push({
      day: i + 1,
      a: i < aDays ? cumA[i] : null,
      b: i < bDays ? cumB[i] : null,
    });
  }
  return rows;
}

interface TooltipItem {
  name: string;
  value: number;
  color: string;
}

interface EndLabelProps {
  x?: number | string;
  y?: number | string;
  value?: unknown;
  index?: number;
  lastIndex: number;
  color: string;
}

function EndLabel({ x, y, value, index, lastIndex, color }: EndLabelProps) {
  if (index !== lastIndex || typeof value !== 'number' || typeof x !== 'number' || typeof y !== 'number') {
    return null;
  }
  return (
    <text x={x + 6} y={y} dy={4} fill={color} fontSize={11} fontWeight={600}>
      {formatCurrency(value)}
    </text>
  );
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipItem[];
  label?: number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#12182b] px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-white/60">Day {label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function DailyCumulativeChart({
  monthAKey,
  monthBKey,
  txA,
  txB,
}: DailyCumulativeChartProps) {
  const aDays = daysInMonth(monthAKey);
  const bDays = daysInMonth(monthBKey);
  const rows = buildRows(txA, txB, aDays, bDays);
  const labelA = formatMonthShort(monthAKey);
  const labelB = formatMonthShort(monthBKey);

  const aFinal = rows[aDays - 1]?.a ?? 0;
  const bFinal = rows[bDays - 1]?.b ?? 0;
  const delta = bFinal - aFinal;

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Spending pace</h2>
          <p className="text-sm text-white/45">Running expense total by day</p>
        </div>
        <div className="text-right text-xs">
          <p
            className={
              delta > 0 ? 'text-red-400' : delta < 0 ? 'text-emerald-400' : 'text-white/50'
            }
          >
            {delta > 0 ? '+' : delta < 0 ? '−' : ''}
            {formatCurrency(Math.abs(delta))}
          </p>
          <p className="text-white/40">vs {labelA}</p>
        </div>
      </div>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 5, right: 48, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#ffffff60', fontSize: 11 }}
              interval="preserveStartEnd"
              minTickGap={20}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#ffffff40', fontSize: 11 }}
              tickFormatter={(v) => `€${v}`}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20' }} />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#ffffff80' }} />
            <Line
              type="monotone"
              dataKey="a"
              name={labelA}
              stroke="#a78bfa"
              strokeWidth={2}
              dot={false}
              connectNulls
            >
              <LabelList
                dataKey="a"
                content={(props) => (
                  <EndLabel {...props} lastIndex={aDays - 1} color="#a78bfa" />
                )}
              />
            </Line>
            <Line
              type="monotone"
              dataKey="b"
              name={labelB}
              stroke="#f472b6"
              strokeWidth={2}
              dot={false}
              connectNulls
            >
              <LabelList
                dataKey="b"
                content={(props) => (
                  <EndLabel {...props} lastIndex={bDays - 1} color="#f472b6" />
                )}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
