'use client';

import { formatCurrency } from '@/lib/format';

interface SummaryStatCardProps {
  label: string;
  amount: number;
  subtext: string;
}

export function SummaryStatCard({ label, amount, subtext }: SummaryStatCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur">
      <p className="text-sm text-white/60">{label}</p>
      <h3 className="mt-2 text-2xl font-semibold tracking-tight">
        {formatCurrency(amount)}
      </h3>
      <p className="mt-1 text-xs text-white/45">{subtext}</p>
    </div>
  );
}
