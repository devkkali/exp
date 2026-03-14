'use client';
import { MONTH_NAMES } from '@/lib/constants';
import { getPreviousMonthKey } from '@/lib/format';

interface MonthPickerProps {
  value: string; // YYYY-MM
  onChange: (monthKey: string) => void;
}

function getNextMonthKey(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  if (month === 12) return `${year + 1}-01`;
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

export function MonthPicker({ value, onChange }: MonthPickerProps) {
  const [yearRaw, monthRaw] = value.split('-');
  const selectedYear = Number(yearRaw);
  const selectedMonth = Number(monthRaw);
  const yearOptions = Array.from({ length: 21 }, (_, i) => selectedYear - 10 + i);

  function updateMonth(month: number) {
    onChange(`${selectedYear}-${String(month).padStart(2, '0')}`);
  }

  function updateYear(year: number) {
    onChange(`${year}-${String(selectedMonth).padStart(2, '0')}`);
  }
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-2 py-1.5">
      <button
        onClick={() => onChange(getPreviousMonthKey(value))}
        className="rounded-xl px-3 py-2 text-white/50 hover:bg-white/5 hover:text-white transition"
        aria-label="Previous month"
      >
        ‹
      </button>
      <div className="flex items-center gap-2">
        <select
          value={selectedMonth}
          onChange={(e) => updateMonth(Number(e.target.value))}
          className="rounded-xl border border-white/10 bg-white/5 px-2 py-1.5 text-sm font-semibold text-white focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition"
          aria-label="Select month"
        >
          {MONTH_NAMES.map((name, index) => (
            <option key={name} value={index + 1} className="bg-[#12182b]">
              {name}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => updateYear(Number(e.target.value))}
          className="rounded-xl border border-white/10 bg-white/5 px-2 py-1.5 text-sm font-semibold text-white focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition"
          aria-label="Select year"
        >
          {yearOptions.map((year) => (
            <option key={year} value={year} className="bg-[#12182b]">
              {year}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={() => onChange(getNextMonthKey(value))}
        className="rounded-xl px-3 py-2 text-white/50 hover:bg-white/5 hover:text-white transition"
        aria-label="Next month"
      >
        ›
      </button>
    </div>
  );
}
