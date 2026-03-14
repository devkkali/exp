'use client';

import { Card } from '@/components/ui/Card';
import { type Insight } from '@/lib/insights';

interface InsightCardProps {
  insights: Insight[];
}

const typeColors: Record<Insight['type'], string> = {
  info: 'bg-violet-500/12',
  warning: 'bg-amber-500/12',
  success: 'bg-emerald-500/12',
};

const dotColors: Record<Insight['type'], string> = {
  info: 'bg-violet-400',
  warning: 'bg-amber-400',
  success: 'bg-emerald-400',
};

export function InsightCard({ insights }: InsightCardProps) {
  if (insights.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-semibold">Quick Insight</h2>
        <p className="mt-2 text-sm text-white/40">Add some transactions to see insights.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold">Quick Insights</h2>
      <p className="text-sm text-white/45">Based on your data</p>
      <div className="mt-4 space-y-3">
        {insights.map((insight, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 rounded-2xl p-4 ${typeColors[insight.type]}`}
          >
            <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotColors[insight.type]}`} />
            <p className="text-sm leading-6 text-white/80">{insight.text}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
