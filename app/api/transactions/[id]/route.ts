import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// PUT /api/transactions/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const tx = await prisma.transaction.update({
    where: { id },
    data: {
      type: body.type,
      date: body.date,
      title: body.title,
      amount: body.amount,
      category: body.category,
      note: body.note ?? '',
      isEstimated: body.isEstimated ?? false,
    },
  });

  return NextResponse.json(tx);
}

// DELETE /api/transactions/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.transaction.delete({ where: { id } });

  return NextResponse.json({ deleted: true });
}
