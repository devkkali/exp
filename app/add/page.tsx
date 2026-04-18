'use client';

import { useRouter } from 'next/navigation';
import { useAppData } from '@/providers/DataProvider';
import { PageHeader } from '@/components/layout/PageHeader';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { ExcelImportButton } from '@/components/transactions/ExcelImportButton';
import { Card } from '@/components/ui/Card';
import { TransactionFormData } from '@/lib/types';

export default function AddTransactionPage() {
  const router = useRouter();
  const { addTransaction } = useAppData();

  async function handleSubmit(data: TransactionFormData) {
    await addTransaction(data);
    router.push('/transactions');
  }

  return (
    <>
      <PageHeader title="Add Transaction" subtitle="Record income or expense" />
      <div className="space-y-4">
        <TransactionForm onSubmit={handleSubmit} />

        <div className="relative flex items-center gap-4 py-2">
          <div className="flex-1 border-t border-white/10" />
          <span className="text-xs text-white/30">or</span>
          <div className="flex-1 border-t border-white/10" />
        </div>

        <Card padding="md">
          <ExcelImportButton />
        </Card>
      </div>
    </>
  );
}
