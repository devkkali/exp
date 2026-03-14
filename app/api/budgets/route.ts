import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/budgets?month=2026-03 (optional filter)
export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get('month');

  if (month) {
    const budget = await prisma.monthlyBudget.findUnique({
      where: { monthKey: month },
    });
    // Return the budget with parsed categoryBudgets
    if (budget) {
      return NextResponse.json({
        ...budget,
        categoryBudgets: JSON.parse(budget.categoryBudgets),
      });
    }
    return NextResponse.json(null);
  }

  const budgets = await prisma.monthlyBudget.findMany({
    orderBy: { monthKey: 'desc' },
  });

  return NextResponse.json(
    budgets.map((b) => ({
      ...b,
      categoryBudgets: JSON.parse(b.categoryBudgets),
    }))
  );
}

// POST /api/budgets — upsert a budget
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { monthKey, totalBudget, categoryBudgets } = body;

  if (!monthKey) {
    return NextResponse.json({ error: 'monthKey required' }, { status: 400 });
  }

  const budget = await prisma.monthlyBudget.upsert({
    where: { monthKey },
    create: {
      monthKey,
      totalBudget: totalBudget ?? 0,
      categoryBudgets: JSON.stringify(categoryBudgets ?? {}),
    },
    update: {
      ...(totalBudget !== undefined && { totalBudget }),
      ...(categoryBudgets !== undefined && {
        categoryBudgets: JSON.stringify(categoryBudgets),
      }),
    },
  });

  return NextResponse.json({
    ...budget,
    categoryBudgets: JSON.parse(budget.categoryBudgets),
  });
}
