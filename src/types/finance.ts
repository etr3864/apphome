export type TransactionType = 'INCOME' | 'EXPENSE';

export type TransactionCategory =
  | 'RENT'
  | 'MORTGAGE'
  | 'GROCERIES'
  | 'FUEL'
  | 'UTILITIES'
  | 'SUBSCRIPTION'
  | 'SALARY'
  | 'ENTERTAINMENT'
  | 'HEALTH'
  | 'EDUCATION'
  | 'OTHER';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description?: string;
  date: string; // ISO date
  isFixed: boolean;
  createdAt: string;
}

export type AssetType =
  | 'CAR'
  | 'PROPERTY'
  | 'INVESTMENT'
  | 'SAVING_PLAN'
  | 'JEWELRY'
  | 'OTHER';

export interface Asset {
  id: string;
  type: AssetType;
  name: string;
  value: number;
  lastUpdatedAt: string;
}

export type LiabilityType =
  | 'LOAN'
  | 'CREDIT_CARD'
  | 'MORTGAGE'
  | 'OTHER';

export interface Liability {
  id: string;
  type: LiabilityType;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  monthlyPayment?: number;
  dueDate?: string;
  lastUpdatedAt: string;
}

export interface MonthlySummary {
  income: number;
  expenses: number;
  balance: number;
}

