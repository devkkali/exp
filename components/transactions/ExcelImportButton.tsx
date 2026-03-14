'use client';

import { useRef, useState } from 'react';
import { useAppData } from '@/providers/DataProvider';
import { parseExcelFile, ImportResult, downloadImportTemplate } from '@/lib/excel-import';
import { Button } from '@/components/ui/Button';

export function ExcelImportButton() {
  const fileRef = useRef<HTMLInputElement>(null);
  const { addTransactionsBulk } = useAppData();
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [result, setResult] = useState<ImportResult | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('loading');
    try {
      const parsed = await parseExcelFile(file);
      if (parsed.success.length > 0) {
        await addTransactionsBulk(parsed.success);
      }
      setResult(parsed);
      setStatus('done');
    } catch {
      setResult({ success: [], skipped: 0, errors: ['Failed to parse file.'] });
      setStatus('done');
    }

    // Reset input so same file can be re-selected
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <div className="space-y-3">
      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={() => fileRef.current?.click()}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Importing...' : '📁 Import from Excel'}
        </Button>

        <Button
          type="button"
          variant="ghost"
          fullWidth
          onClick={downloadImportTemplate}
          disabled={status === 'loading'}
        >
          ⬇ Download template
        </Button>
      </div>

      {status === 'done' && result && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm space-y-1">
          {result.success.length > 0 && (
            <p className="text-emerald-300">
              ✓ {result.success.length} transaction{result.success.length > 1 ? 's' : ''} imported
            </p>
          )}
          {result.skipped > 0 && (
            <p className="text-amber-300">⚠ {result.skipped} row(s) skipped</p>
          )}
          {result.errors.length > 0 && result.success.length === 0 && (
            <p className="text-red-300">{result.errors[0]}</p>
          )}
          <button
            className="text-xs text-white/40 hover:text-white/60"
            onClick={() => { setStatus('idle'); setResult(null); }}
          >
            Dismiss
          </button>
        </div>
      )}

      <p className="text-xs text-white/30 text-center">
        Excel columns: date, title, amount, category, note, estimated
      </p>
      <p className="text-xs text-white/30 text-center">
        Use amount sign for type: negative = expense, positive = income.
      </p>
      <p className="text-xs text-white/30 text-center">
        Import adds new records and does not replace existing data.
      </p>
    </div>
  );
}
