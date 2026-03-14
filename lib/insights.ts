import { Transaction, MonthlyBudget } from './types';
import { CATEGORY_MAP } from './constants';
import { formatCurrency } from './format';
import {
  totalIncome,
  totalExpenses,
  actualExpenses,
  biggestCategory,
  categoryComparison,
} from './calculations';

export interface Insight {
  text: string;
  type: 'info' | 'warning' | 'success';
}

export function generateInsights(
  monthTx: Transaction[],
  prevMonthTx: Transaction[],
  budget: MonthlyBudget | undefined
): Insight[] {
  const insights: Insight[] = [];
  const income = totalIncome(monthTx);
  const expenses = totalExpenses(monthTx);
  const actual = actualExpenses(monthTx);

  // Budget comparison
  if (budget && budget.totalBudget > 0) {
    const diff = actual - budget.totalBudget;
    if (diff > 0) {
      insights.push({
        text: `You spent ${formatCurrency(diff)} more than your planned budget this month.`,
        type: 'warning',
      });
    } else if (diff < 0) {
      insights.push({
        text: `You're ${formatCurrency(Math.abs(diff))} under your planned budget. Nice!`,
        type: 'success',
      });
    }
  }

  // Biggest category
  const top = biggestCategory(monthTx);
  if (top) {
    const meta = CATEGORY_MAP[top.category];
    insights.push({
      text: `${meta.label} was your highest spending category at ${formatCurrency(top.amount)}.`,
      type: 'info',
    });
  }

  // vs previous month
  if (prevMonthTx.length > 0) {
    const prevExp = totalExpenses(prevMonthTx);
    if (expenses > 0 && prevExp > 0) {
      const delta = expenses - prevExp;
      if (delta > 0) {
        insights.push({
          text: `Your expenses increased by ${formatCurrency(delta)} compared to last month.`,
          type: 'warning',
        });
      } else if (delta < 0) {
        insights.push({
          text: `Your expenses decreased by ${formatCurrency(Math.abs(delta))} compared to last month.`,
          type: 'success',
        });
      }
    }

    // Category with biggest increase
    const catDeltas = categoryComparison(prevMonthTx, monthTx);
    const biggestIncrease = catDeltas.find((d) => d.delta > 0);
    if (biggestIncrease) {
      const meta = CATEGORY_MAP[biggestIncrease.category];
      insights.push({
        text: `${meta.label} spending increased by ${formatCurrency(biggestIncrease.delta)} vs last month.`,
        type: 'info',
      });
    }
  }

  // Savings
  if (income > 0 && expenses > 0) {
    const net = income - expenses;
    if (net > 0) {
      insights.push({
        text: `You saved ${formatCurrency(net)} this month.`,
        type: 'success',
      });
    } else if (net < 0) {
      insights.push({
        text: `You're overspending by ${formatCurrency(Math.abs(net))} — expenses exceed income.`,
        type: 'warning',
      });
    }
  }

  return insights.slice(0, 4); // max 4 insights
}
