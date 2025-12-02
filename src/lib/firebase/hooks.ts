import { useFirebaseStore } from '@/store/useFirebaseStore';
import { useAuth } from '@/contexts/AuthContext';

export const useFirebaseData = () => {
  const { user } = useAuth();
  const store = useFirebaseStore();

  const householdId = user?.householdId || '';

  return {
    ...store,
    
    // Wrapped actions with householdId
    addTransaction: (transaction: any) => store.addTransaction(householdId, transaction),
    updateTransaction: (id: string, updates: any) => store.updateTransaction(householdId, id, updates),
    deleteTransaction: (id: string) => store.deleteTransaction(householdId, id),
    
    addAsset: (asset: any) => store.addAsset(householdId, asset),
    updateAsset: (id: string, updates: any) => store.updateAsset(householdId, id, updates),
    deleteAsset: (id: string) => store.deleteAsset(householdId, id),
    
    addLiability: (liability: any) => store.addLiability(householdId, liability),
    updateLiability: (id: string, updates: any) => store.updateLiability(householdId, id, updates),
    deleteLiability: (id: string) => store.deleteLiability(householdId, id),
    
    updateInitialBalance: (balance: number) => store.updateInitialBalance(householdId, balance),
    updateApiKey: (apiKey: string) => store.updateApiKey(householdId, apiKey),
  };
};

