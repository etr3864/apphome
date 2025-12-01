import type { Transaction, Asset, Liability, MonthlySummary } from '@/types/finance';

export const calculateMonthlySummary = (
  transactions: Transaction[],
  month: number,
  year: number
): MonthlySummary => {
  const filtered = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });

  const income = filtered
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = filtered
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expenses,
    balance: income - expenses,
  };
};

export const calculateCurrentBalance = (
  initialBalance: number,
  transactions: Transaction[]
): number => {
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  return initialBalance + totalIncome - totalExpenses;
};

export const calculateNetWorth = (
  currentBalance: number,
  assets: Asset[],
  liabilities: Liability[]
): number => {
  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.remainingAmount, 0);
  return currentBalance + totalAssets - totalLiabilities;
};

export const getRecentTransactions = (
  transactions: Transaction[],
  limit = 10
): Transaction[] => {
  return [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
};

