import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/transactions?month=2026-03 (optional filter)
export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get('month');

  const where = month
    ? { date: { startsWith: month } }
    : {};

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { date: 'desc' },
  });

  return NextResponse.json(transactions);
}

// POST /api/transactions — create one or many
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Support bulk import: body can be an array
  if (Array.isArray(body)) {
    const created = await prisma.$transaction(
      body.map((tx: Record<string, unknown>) =>
        prisma.transaction.create({
          data: {
            type: tx.type as string,
            date: tx.date as string,
            title: tx.title as string,
            amount: tx.amount as number,
            category: tx.category as string,
            note: (tx.note as string) || '',
            isEstimated: (tx.isEstimated as boolean) || false,
          },
        })
      )
    );
    return NextResponse.json(created, { status: 201 });
  }

  const tx = await prisma.transaction.create({
    data: {
      type: body.type,
      date: body.date,
      title: body.title,
      amount: body.amount,
      category: body.category,
      note: body.note || '',
      isEstimated: body.isEstimated || false,
    },
  });

  return NextResponse.json(tx, { status: 201 });
}

// DELETE /api/transactions — bulk delete by ids
export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const ids: string[] = body.ids;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'ids array required' }, { status: 400 });
  }

  const result = await prisma.transaction.deleteMany({
    where: { id: { in: ids } },
  });

  return NextResponse.json({ deleted: result.count });
}
