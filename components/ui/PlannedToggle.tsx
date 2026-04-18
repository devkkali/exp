'use client';

import { useAppData } from '@/providers/DataProvider';

export function PlannedToggle() {
  const { includePlanned, setIncludePlanned } = useAppData();
  return (
    <button
      onClick={() => setIncludePlanned(!includePlanned)}
      className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
        includePlanned
          ? 'border-violet-500/40 bg-violet-500/15 text-violet-200'
          : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
      }`}
      aria-pressed={includePlanned}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          includePlanned ? 'bg-violet-300' : 'bg-white/30'
        }`}
      />
      Planned {includePlanned ? 'on' : 'off'}
    </button>
  );
}
