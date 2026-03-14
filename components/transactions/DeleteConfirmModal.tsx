'use client';

import { Button } from '@/components/ui/Button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmModal({ isOpen, onConfirm, onCancel }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
      <div className="w-full max-w-sm rounded-[28px] border border-white/10 bg-[#12182b] p-6 shadow-2xl">
        <h3 className="text-lg font-semibold">Delete Transaction?</h3>
        <p className="mt-2 text-sm text-white/50">
          This action cannot be undone. This will permanently delete this transaction.
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" fullWidth onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" fullWidth onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
