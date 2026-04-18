'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getTodayString } from '@/lib/format';

interface MarkActualModalProps {
  isOpen: boolean;
  defaultDate?: string;
  onConfirm: (date: string) => void;
  onCancel: () => void;
}

export function MarkActualModal({ isOpen, defaultDate, onConfirm, onCancel }: MarkActualModalProps) {
  const [date, setDate] = useState(defaultDate ?? getTodayString());

  useEffect(() => {
    if (isOpen) setDate(defaultDate ?? getTodayString());
  }, [isOpen, defaultDate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
      <div className="w-full max-w-sm rounded-[28px] border border-white/10 bg-[#12182b] p-6 shadow-2xl">
        <h3 className="text-lg font-semibold">Mark as actual</h3>
        <p className="mt-2 text-sm text-white/50">
          When did this transaction happen? The date will be updated.
        </p>
        <div className="mt-4">
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" fullWidth onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" fullWidth onClick={() => onConfirm(date)} disabled={!date}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
