import { create } from 'zustand';
import type { Transaction, Asset, Liability } from '@/types/finance';
import type { Household } from '@/types/household';
import { firestoreService } from '@/lib/firebase/firestore.service';
import type { Unsubscribe } from 'firebase/firestore';

interface AppState {
  // Data
  household: Household | null;
  transactions: Transaction[];
  assets: Asset[];
  liabilities: Liability[];
  
  // Loading state
  loading: boolean;
  
  // Listeners
  unsubscribers: Unsubscribe[];

  // Actions
  setHousehold: (household: Household) => void;
  setTransactions: (transactions: Transaction[]) => void;
  setAssets: (assets: Asset[]) => void;
  setLiabilities: (liabilities: Liability[]) => void;
  
  updateInitialBalance: (householdId: string, balance: number) => Promise<void>;
  updateApiKey: (householdId: string, apiKey: string) => Promise<void>;
  
  addTransaction: (householdId: string, transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (householdId: string, id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (householdId: string, id: string) => Promise<void>;
  
  addAsset: (householdId: string, asset: Omit<Asset, 'id'>) => Promise<void>;
  updateAsset: (householdId: string, id: string, asset: Partial<Asset>) => Promise<void>;
  deleteAsset: (householdId: string, id: string) => Promise<void>;
  
  addLiability: (householdId: string, liability: Omit<Liability, 'id'>) => Promise<void>;
  updateLiability: (householdId: string, id: string, liability: Partial<Liability>) => Promise<void>;
  deleteLiability: (householdId: string, id: string) => Promise<void>;

  setupListeners: (householdId: string) => void;
  cleanup: () => void;
}

export const useFirebaseStore = create<AppState>((set, get) => ({
  household: null,
  transactions: [],
  assets: [],
  liabilities: [],
  loading: true,
  unsubscribers: [],

  setHousehold: (household) => set({ household }),
  setTransactions: (transactions) => set({ transactions }),
  setAssets: (assets) => set({ assets }),
  setLiabilities: (liabilities) => set({ liabilities }),

  // ========== HOUSEHOLD ==========
  
  updateInitialBalance: async (householdId: string, balance: number) => {
    await firestoreService.updateHousehold(householdId, {
      initialBalance: balance,
      balanceUpdatedAt: new Date().toISOString(),
    });
  },

  updateApiKey: async (householdId: string, apiKey: string) => {
    await firestoreService.updateHousehold(householdId, {
      openaiApiKey: apiKey,
    });
  },

  // ========== TRANSACTIONS ==========
  
  addTransaction: async (householdId: string, transaction: Omit<Transaction, 'id'>) => {
    await firestoreService.addTransaction(householdId, transaction);
  },

  updateTransaction: async (householdId: string, id: string, updates: Partial<Transaction>) => {
    await firestoreService.updateTransaction(householdId, id, updates);
  },

  deleteTransaction: async (householdId: string, id: string) => {
    await firestoreService.deleteTransaction(householdId, id);
  },

  // ========== ASSETS ==========
  
  addAsset: async (householdId: string, asset: Omit<Asset, 'id'>) => {
    await firestoreService.addAsset(householdId, asset);
  },

  updateAsset: async (householdId: string, id: string, updates: Partial<Asset>) => {
    await firestoreService.updateAsset(householdId, id, updates);
  },

  deleteAsset: async (householdId: string, id: string) => {
    await firestoreService.deleteAsset(householdId, id);
  },

  // ========== LIABILITIES ==========
  
  addLiability: async (householdId: string, liability: Omit<Liability, 'id'>) => {
    await firestoreService.addLiability(householdId, liability);
  },

  updateLiability: async (householdId: string, id: string, updates: Partial<Liability>) => {
    await firestoreService.updateLiability(householdId, id, updates);
  },

  deleteLiability: async (householdId: string, id: string) => {
    await firestoreService.deleteLiability(householdId, id);
  },

  // ========== LISTENERS ==========
  
  setupListeners: (householdId: string) => {
    const unsubscribers: Unsubscribe[] = [];

    // Listen to household
    unsubscribers.push(
      firestoreService.onHouseholdSnapshot(householdId, (household) => {
        set({ household, loading: false });
      })
    );

    // Listen to transactions
    unsubscribers.push(
      firestoreService.onTransactionsSnapshot(householdId, (transactions) => {
        set({ transactions });
      })
    );

    // Listen to assets
    unsubscribers.push(
      firestoreService.onAssetsSnapshot(householdId, (assets) => {
        set({ assets });
      })
    );

    // Listen to liabilities
    unsubscribers.push(
      firestoreService.onLiabilitiesSnapshot(householdId, (liabilities) => {
        set({ liabilities });
      })
    );

    set({ unsubscribers });
  },

  cleanup: () => {
    const { unsubscribers } = get();
    unsubscribers.forEach(unsub => unsub());
    set({ unsubscribers: [], household: null, transactions: [], assets: [], liabilities: [] });
  },
}));

