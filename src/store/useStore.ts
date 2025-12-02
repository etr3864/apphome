import { create } from 'zustand';
import type { Transaction, Asset, Liability } from '@/types/finance';
import type { Household } from '@/types/household';
import { storage } from '@/lib/storage/storage';

interface AppState {
  // Data
  household: Household | null;
  transactions: Transaction[];
  assets: Asset[];
  liabilities: Liability[];

  // Actions
  setHousehold: (household: Household) => void;
  updateInitialBalance: (balance: number) => void;
  updateApiKey: (apiKey: string) => void;
  
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, asset: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  
  addLiability: (liability: Liability) => void;
  updateLiability: (id: string, liability: Partial<Liability>) => void;
  deleteLiability: (id: string) => void;

  loadFromStorage: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  household: null,
  transactions: [],
  assets: [],
  liabilities: [],

  setHousehold: (household) => {
    set({ household });
    storage.set('HOUSEHOLD', household);
  },

  updateInitialBalance: (balance) => {
    const household = get().household;
    if (household) {
      const updated = {
        ...household,
        initialBalance: balance,
        balanceUpdatedAt: new Date().toISOString(),
      };
      set({ household: updated });
      storage.set('HOUSEHOLD', updated);
    }
  },

  updateApiKey: (apiKey: string) => {
    const household = get().household;
    if (household) {
      const updated = {
        ...household,
        openaiApiKey: apiKey,
      };
      set({ household: updated });
      storage.set('HOUSEHOLD', updated);
    }
  },

  addTransaction: (transaction) => {
    const transactions = [...get().transactions, transaction];
    set({ transactions });
    storage.set('TRANSACTIONS', transactions);
  },

  updateTransaction: (id, updates) => {
    const transactions = get().transactions.map(t =>
      t.id === id ? { ...t, ...updates } : t
    );
    set({ transactions });
    storage.set('TRANSACTIONS', transactions);
  },

  deleteTransaction: (id) => {
    const transactions = get().transactions.filter(t => t.id !== id);
    set({ transactions });
    storage.set('TRANSACTIONS', transactions);
  },

  addAsset: (asset) => {
    const assets = [...get().assets, asset];
    set({ assets });
    storage.set('ASSETS', assets);
  },

  updateAsset: (id, updates) => {
    const assets = get().assets.map(a =>
      a.id === id ? { ...a, ...updates } : a
    );
    set({ assets });
    storage.set('ASSETS', assets);
  },

  deleteAsset: (id) => {
    const assets = get().assets.filter(a => a.id !== id);
    set({ assets });
    storage.set('ASSETS', assets);
  },

  addLiability: (liability) => {
    const liabilities = [...get().liabilities, liability];
    set({ liabilities });
    storage.set('LIABILITIES', liabilities);
  },

  updateLiability: (id, updates) => {
    const liabilities = get().liabilities.map(l =>
      l.id === id ? { ...l, ...updates } : l
    );
    set({ liabilities });
    storage.set('LIABILITIES', liabilities);
  },

  deleteLiability: (id) => {
    const liabilities = get().liabilities.filter(l => l.id !== id);
    set({ liabilities });
    storage.set('LIABILITIES', liabilities);
  },

  loadFromStorage: () => {
    let household = storage.get<Household>('HOUSEHOLD');
    const transactions = storage.get<Transaction[]>('TRANSACTIONS') || [];
    const assets = storage.get<Asset[]>('ASSETS') || [];
    const liabilities = storage.get<Liability[]>('LIABILITIES') || [];

    // Create default household if none exists
    if (!household) {
      household = {
        id: 'default',
        name: 'משק הבית שלי',
        currency: '₪',
        monthStartDay: 1,
        initialBalance: 0,
        balanceUpdatedAt: new Date().toISOString(),
        ownerIds: [],
        householdCode: '000000',
        createdAt: new Date().toISOString(),
      };
      storage.set('HOUSEHOLD', household);
    }

    set({
      household,
      transactions,
      assets,
      liabilities,
    });
  },
}));

