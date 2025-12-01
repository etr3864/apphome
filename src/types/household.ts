export interface Household {
  id: string;
  name: string;
  currency: string;
  monthStartDay: number; // 1-31
  initialBalance: number; // Starting bank balance
  balanceUpdatedAt: string; // When initial balance was set
  openaiApiKey?: string; // Optional OpenAI API key
  createdAt: string;
}

export interface CategoryConfig {
  id: string;
  name: string;
  icon?: string;
  type: 'INCOME' | 'EXPENSE';
}

