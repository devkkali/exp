import * as XLSX from 'xlsx';
import { TransactionFormData, Category, TransactionType } from './types';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from './constants';

/**
 * Expected Excel columns:
 *   date       | title     | amount | category | note | estimated
 *   2026-03-14 | Groceries | -45.50 | food     | ...  | yes/no or true/false or 1/0
 *   2026-03-15 | Salary    | 3200   | salary   | ...  | yes/no or true/false or 1/0
 *
 * - Amount sign controls type: negative = expense, positive = income
 * - Zero amount is invalid and skipped
 * - Category is matched case-insensitively for the detected type; defaults to 'other' if unrecognized
 * - Estimated defaults to false if missing or unrecognized
 * - Date accepts multiple formats; falls back to today if unparseable
 */

interface RawRow {
  date?: string | number;
  title?: string;
  amount?: string | number;
  category?: string;
  note?: string;
  estimated?: string | number | boolean;
  planned?: string | number | boolean;
}

function normalizeCategory(raw: string | undefined, type: TransactionType): Category {
  if (!raw) return 'other';
  const lower = raw.trim().toLowerCase();
  const allowedCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const match = allowedCategories.find((c) => c === lower);
  return match ?? 'other';
}

function normalizeEstimated(raw: unknown): boolean {
  if (raw === undefined || raw === null || raw === '') return false;
  if (typeof raw === 'boolean') return raw;
  if (typeof raw === 'number') return raw === 1;
  const str = String(raw).trim().toLowerCase();
  return ['yes', 'true', '1', 'y', 'planned', 'estimated'].includes(str);
}

function normalizeDate(raw: string | number | undefined): string {
  if (!raw) return todayString();

  // XLSX stores dates as serial numbers
  if (typeof raw === 'number') {
    try {
      const parsed = XLSX.SSF.parse_date_code(raw);
      if (parsed) {
        const y = parsed.y;
        const m = String(parsed.m).padStart(2, '0');
        const d = String(parsed.d).padStart(2, '0');
        return `${y}-${m}-${d}`;
      }
    } catch {
      // fall through
    }
  }

  // Try parsing as string
  const str = String(raw).trim();
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  return todayString();
}

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export interface ImportResult {
  success: TransactionFormData[];
  skipped: number;
  errors: string[];
}

export async function parseExcelFile(file: File): Promise<ImportResult> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: false });

  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    return { success: [], skipped: 0, errors: ['No sheets found in the file.'] };
  }

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<RawRow>(sheet, {
    defval: '',
    raw: true,
  });

  if (rows.length === 0) {
    return { success: [], skipped: 0, errors: ['The sheet is empty.'] };
  }

  const result: ImportResult = { success: [], skipped: 0, errors: [] };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // +2 for header row + 1-indexed

    const title = row.title?.toString().trim();
    const parsedAmount = parseFloat(String(row.amount));

    if (!title) {
      result.skipped++;
      result.errors.push(`Row ${rowNum}: missing title, skipped`);
      continue;
    }

    if (isNaN(parsedAmount) || parsedAmount === 0) {
      result.skipped++;
      result.errors.push(`Row ${rowNum}: invalid amount "${row.amount}", skipped`);
      continue;
    }
    const type: TransactionType = parsedAmount < 0 ? 'expense' : 'income';
    const amount = Math.abs(parsedAmount);

    const estimated = row.estimated ?? row.planned;

    result.success.push({
      type,
      date: normalizeDate(row.date),
      title,
      amount,
      category: normalizeCategory(row.category?.toString(), type),
      note: row.note?.toString().trim() ?? '',
      isEstimated: normalizeEstimated(estimated),
    });
  }

  return result;
}

export function downloadImportTemplate() {
  const link = document.createElement('a');
  link.href = '/api/import-template';
  link.download = 'pocket-budget-import-template.xlsx';
  document.body.appendChild(link);
  link.click();
  link.remove();
}
