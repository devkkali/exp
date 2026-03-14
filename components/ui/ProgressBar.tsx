'use client';

interface ProgressBarProps {
  value: number; // 0-100+
  max?: number;
  size?: 'sm' | 'md';
  colorClass?: string; // override gradient
}

export function ProgressBar({
  value,
  max = 100,
  size = 'md',
  colorClass,
}: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  const overBudget = value > max;

  const defaultColor = overBudget
    ? 'bg-gradient-to-r from-red-500 to-rose-400'
    : pct >= 75
    ? 'bg-gradient-to-r from-amber-500 to-orange-400'
    : 'bg-gradient-to-r from-violet-500 to-pink-500';

  const barColor = colorClass || defaultColor;
  const height = size === 'sm' ? 'h-2' : 'h-3';

  return (
    <div className={`${height} w-full rounded-full bg-white/10`}>
      <div
        className={`${height} rounded-full transition-all duration-500 ease-out ${barColor}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
