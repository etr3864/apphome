import { storage } from '@/lib/storage/storage';
import { firestoreService } from './firestore.service';
import type { Transaction, Asset, Liability } from '@/types/finance';
import type { Household } from '@/types/household';

export const migrateFromLocalStorage = async (householdId: string) => {
  console.log('🔄 Starting migration from LocalStorage to Firebase...');

  try {
    // Load from LocalStorage
    const household = storage.get<Household>('HOUSEHOLD');
    const transactions = storage.get<Transaction[]>('TRANSACTIONS') || [];
    const assets = storage.get<Asset[]>('ASSETS') || [];
    const liabilities = storage.get<Liability[]>('LIABILITIES') || [];

    // Migrate household settings
    if (household) {
      console.log('📦 Migrating household...');
      await firestoreService.updateHousehold(householdId, {
        initialBalance: household.initialBalance,
        balanceUpdatedAt: household.balanceUpdatedAt,
        openaiApiKey: household.openaiApiKey,
      });
    }

    // Migrate transactions
    if (transactions.length > 0) {
      console.log(`📦 Migrating ${transactions.length} transactions...`);
      for (const tx of transactions) {
        const { id, ...data } = tx;
        await firestoreService.addTransaction(householdId, data);
      }
    }

    // Migrate assets
    if (assets.length > 0) {
      console.log(`📦 Migrating ${assets.length} assets...`);
      for (const asset of assets) {
        const { id, ...data } = asset;
        await firestoreService.addAsset(householdId, data);
      }
    }

    // Migrate liabilities
    if (liabilities.length > 0) {
      console.log(`📦 Migrating ${liabilities.length} liabilities...`);
      for (const liability of liabilities) {
        const { id, ...data } = liability;
        await firestoreService.addLiability(householdId, data);
      }
    }

    console.log('✅ Migration completed successfully!');
    
    // Mark as migrated
    storage.set('MIGRATED_TO_FIREBASE', true);
    
    return true;
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

export const hasMigrated = (): boolean => {
  return storage.get<boolean>('MIGRATED_TO_FIREBASE') || false;
};

