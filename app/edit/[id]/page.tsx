'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppData } from '@/providers/DataProvider';
import { PageHeader } from '@/components/layout/PageHeader';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { DeleteConfirmModal } from '@/components/transactions/DeleteConfirmModal';
import { TransactionFormData } from '@/lib/types';

export default function EditTransactionPage() {
  const params = useParams();
  const router = useRouter();
  const { transactions, updateTransaction, deleteTransaction, isLoaded } = useAppData();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const id = params.id as string;
  const transaction = transactions.find((tx) => tx.id === id);

  if (!isLoaded) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-4xl">🔍</p>
        <p className="mt-3 text-sm font-medium text-white/50">Transaction not found</p>
        <button
          onClick={() => router.push('/transactions')}
          className="mt-4 text-sm text-violet-400 hover:underline"
        >
          Go to transactions
        </button>
      </div>
    );
  }

  function handleUpdate(data: TransactionFormData) {
    updateTransaction(id, data);
    router.push('/transactions');
  }

  function handleDelete() {
    deleteTransaction(id);
    router.push('/transactions');
  }

  return (
    <>
      <PageHeader title="Edit Transaction" showBack />
      <TransactionForm
        initialData={transaction}
        onSubmit={handleUpdate}
        onDelete={() => setShowDeleteModal(true)}
        isEditing
      />
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}
