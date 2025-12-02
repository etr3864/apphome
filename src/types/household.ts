export interface Household {
  id: string;
  name: string;
  currency: string;
  monthStartDay: number; // 1-31
  initialBalance: number; // Starting bank balance
  balanceUpdatedAt: string; // When initial balance was set
  openaiApiKey?: string; // Optional OpenAI API key
  ownerIds: string[]; // User IDs of household owners
  householdCode: string; // 6-digit code for joining
  createdAt: string;
}

export interface CategoryConfig {
  id: string;
  name: string;
  icon?: string;
  type: 'INCOME' | 'EXPENSE';
}

