'use client';

import { useState } from 'react';
import { Transaction, TransactionFormData, TransactionType, Category } from '@/lib/types';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES, CATEGORY_MAP } from '@/lib/constants';
import { getTodayString } from '@/lib/format';

import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Toggle } from '@/components/ui/Toggle';
import { Button } from '@/components/ui/Button';

interface TransactionFormProps {
  initialData?: Transaction;
  onSubmit: (data: TransactionFormData) => void;
  onDelete?: () => void;
  isEditing?: boolean;
}

export function TransactionForm({
  initialData,
  onSubmit,
  onDelete,
  isEditing = false,
}: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>(initialData?.type ?? 'expense');
  const [date, setDate] = useState(initialData?.date ?? getTodayString());
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [amount, setAmount] = useState(initialData?.amount?.toString() ?? '');
  const [category, setCategory] = useState<Category>(initialData?.category ?? 'other');
  const [note, setNote] = useState(initialData?.note ?? '');
  const [isEstimated, setIsEstimated] = useState(initialData?.isEstimated ?? false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const categoryOptions = categories.map((key) => ({
    value: key,
    label: `${CATEGORY_MAP[key].emoji} ${CATEGORY_MAP[key].label}`,
  }));

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (!amount || parseFloat(amount) <= 0) errs.amount = 'Enter a valid amount';
    if (!date) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      type,
      date,
      title: title.trim(),
      amount: parseFloat(amount),
      category,
      note: note.trim(),
      isEstimated,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type toggle */}
      <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
        <button
          type="button"
          onClick={() => {
            setType('expense');
            if (INCOME_CATEGORIES.includes(category) && !EXPENSE_CATEGORIES.includes(category)) {
              setCategory('other');
            }
          }}
          className={`flex-1 rounded-xl py-3 text-sm font-semibold transition ${
            type === 'expense'
              ? 'bg-red-500/20 text-red-300'
              : 'text-white/50 hover:text-white'
          }`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => {
            setType('income');
            if (EXPENSE_CATEGORIES.includes(category) && !INCOME_CATEGORIES.includes(category)) {
              setCategory('salary');
            }
          }}
          className={`flex-1 rounded-xl py-3 text-sm font-semibold transition ${
            type === 'income'
              ? 'bg-emerald-500/20 text-emerald-300'
              : 'text-white/50 hover:text-white'
          }`}
        >
          Income
        </button>
      </div>

      <Input
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        error={errors.date}
      />

      <Input
        label="Title"
        placeholder="e.g. Grocery shopping"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
      />

      <Input
        label="Amount (€)"
        type="number"
        placeholder="0.00"
        min="0"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        error={errors.amount}
      />

      <Select
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value as Category)}
        options={categoryOptions}
      />

      <Textarea
        label="Note (optional)"
        placeholder="Add a note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <Toggle
        label="Estimated / Planned"
        description="Mark this as a planned or estimated entry"
        checked={isEstimated}
        onChange={setIsEstimated}
      />

      <div className="space-y-3 pt-2">
        <Button type="submit" fullWidth size="lg">
          {isEditing ? 'Update Transaction' : 'Save Transaction'}
        </Button>

        {isEditing && onDelete && (
          <Button type="button" variant="danger" fullWidth size="md" onClick={onDelete}>
            Delete Transaction
          </Button>
        )}
      </div>
    </form>
  );
}
