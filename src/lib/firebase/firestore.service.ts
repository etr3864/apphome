import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import type { Transaction, Asset, Liability } from '@/types/finance';
import type { Household } from '@/types/household';

export const firestoreService = {
  // ========== HOUSEHOLD ==========
  
  async updateHousehold(householdId: string, data: Partial<Household>) {
    await updateDoc(doc(db, 'households', householdId), data);
  },

  onHouseholdSnapshot(householdId: string, callback: (household: Household) => void): Unsubscribe {
    return onSnapshot(doc(db, 'households', householdId), (snapshot) => {
      if (snapshot.exists()) {
        callback({ id: snapshot.id, ...snapshot.data() } as Household);
      }
    });
  },

  // ========== TRANSACTIONS ==========
  
  async addTransaction(householdId: string, transaction: Omit<Transaction, 'id'>) {
    const docRef = await addDoc(
      collection(db, 'transactions', householdId, 'items'),
      {
        ...transaction,
        createdAt: serverTimestamp(),
      }
    );
    return docRef.id;
  },

  async updateTransaction(householdId: string, transactionId: string, data: Partial<Transaction>) {
    await updateDoc(
      doc(db, 'transactions', householdId, 'items', transactionId),
      data
    );
  },

  async deleteTransaction(householdId: string, transactionId: string) {
    await deleteDoc(doc(db, 'transactions', householdId, 'items', transactionId));
  },

  onTransactionsSnapshot(householdId: string, callback: (transactions: Transaction[]) => void): Unsubscribe {
    const q = query(collection(db, 'transactions', householdId, 'items'));
    
    return onSnapshot(q, (snapshot) => {
      const transactions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[];
      callback(transactions);
    });
  },

  // ========== ASSETS ==========
  
  async addAsset(householdId: string, asset: Omit<Asset, 'id'>) {
    const docRef = await addDoc(
      collection(db, 'assets', householdId, 'items'),
      asset
    );
    return docRef.id;
  },

  async updateAsset(householdId: string, assetId: string, data: Partial<Asset>) {
    await updateDoc(
      doc(db, 'assets', householdId, 'items', assetId),
      data
    );
  },

  async deleteAsset(householdId: string, assetId: string) {
    await deleteDoc(doc(db, 'assets', householdId, 'items', assetId));
  },

  onAssetsSnapshot(householdId: string, callback: (assets: Asset[]) => void): Unsubscribe {
    const q = query(collection(db, 'assets', householdId, 'items'));
    
    return onSnapshot(q, (snapshot) => {
      const assets = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Asset[];
      callback(assets);
    });
  },

  // ========== LIABILITIES ==========
  
  async addLiability(householdId: string, liability: Omit<Liability, 'id'>) {
    const docRef = await addDoc(
      collection(db, 'liabilities', householdId, 'items'),
      liability
    );
    return docRef.id;
  },

  async updateLiability(householdId: string, liabilityId: string, data: Partial<Liability>) {
    await updateDoc(
      doc(db, 'liabilities', householdId, 'items', liabilityId),
      data
    );
  },

  async deleteLiability(householdId: string, liabilityId: string) {
    await deleteDoc(doc(db, 'liabilities', householdId, 'items', liabilityId));
  },

  onLiabilitiesSnapshot(householdId: string, callback: (liabilities: Liability[]) => void): Unsubscribe {
    const q = query(collection(db, 'liabilities', householdId, 'items'));
    
    return onSnapshot(q, (snapshot) => {
      const liabilities = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Liability[];
      callback(liabilities);
    });
  },
};

