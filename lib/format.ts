import { CURRENCY_SYMBOL, MONTH_NAMES } from './constants';

export function formatCurrency(amount: number): string {
  const formatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  const sign = amount < 0 ? '-' : '';
  return `${sign}${CURRENCY_SYMBOL}${formatted}`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

/** Returns YYYY-MM from a Date or date string */
export function getMonthKey(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/** Returns current month as YYYY-MM */
export function getCurrentMonthKey(): string {
  return getMonthKey(new Date());
}

/** Returns previous month key from a given YYYY-MM */
export function getPreviousMonthKey(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  if (month === 1) return `${year - 1}-12`;
  return `${year}-${String(month - 1).padStart(2, '0')}`;
}

/** Returns "March 2026" from "2026-03" */
export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

/** Returns "Mar" from "2026-03" */
export function formatMonthShort(monthKey: string): string {
  const [, month] = monthKey.split('-').map(Number);
  return MONTH_NAMES[month - 1].slice(0, 3);
}

/** Returns "14 Mar" from "2026-03-14" */
export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDate();
  const month = MONTH_NAMES[d.getMonth()].slice(0, 3);
  return `${day} ${month}`;
}

/** Returns today as YYYY-MM-DD */
export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Returns a list of recent month keys (current + N previous) */
export function getRecentMonthKeys(count: number): string[] {
  const keys: string[] = [];
  let current = getCurrentMonthKey();
  for (let i = 0; i < count; i++) {
    keys.push(current);
    current = getPreviousMonthKey(current);
  }
  return keys;
}
