import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from './config';
import { generateId } from '../utils/id';
import { generateHouseholdCode } from '../utils/household';

export interface AppUser {
  id: string;
  email: string;
  name: string;
  householdId: string;
  role: 'owner' | 'member';
  createdAt: string;
}

export const authService = {
  // Register new user with new household
  async register(email: string, password: string, name: string): Promise<AppUser> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create household for new user
    const householdId = generateId();
    const householdCode = generateHouseholdCode();
    const household = {
      id: householdId,
      name: `משק הבית של ${name}`,
      currency: '₪',
      monthStartDay: 1,
      initialBalance: 0,
      balanceUpdatedAt: new Date().toISOString(),
      ownerIds: [user.uid],
      householdCode,
      createdAt: new Date().toISOString(),
    };

    // Save household
    await setDoc(doc(db, 'households', householdId), household);

    // Create user document
    const appUser: AppUser = {
      id: user.uid,
      email: user.email!,
      name,
      householdId,
      role: 'owner',
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', user.uid), appUser);

    return appUser;
  },

  // Join existing household with code
  async joinHousehold(email: string, password: string, name: string, householdCode: string): Promise<AppUser> {
    console.log('🔍 Starting joinHousehold with code:', householdCode);
    
    // Find household by code
    console.log('📂 Querying households...');
    const householdsRef = collection(db, 'households');
    const q = query(householdsRef, where('householdCode', '==', householdCode));
    
    console.log('⏳ Getting docs...');
    const querySnapshot = await getDocs(q);
    console.log('✅ Query successful! Found:', querySnapshot.size, 'households');

    if (querySnapshot.empty) {
      console.log('❌ No household found with this code');
      throw new Error('קוד משק בית לא תקין');
    }

    const householdDoc = querySnapshot.docs[0];
    const householdId = householdDoc.id;
    console.log('🏠 Found household:', householdId);

    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document
    const appUser: AppUser = {
      id: user.uid,
      email: user.email!,
      name,
      householdId,
      role: 'member',
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', user.uid), appUser);

    // Add user to household's ownerIds
    await updateDoc(doc(db, 'households', householdId), {
      ownerIds: arrayUnion(user.uid),
    });

    return appUser;
  },

  // Sign in
  async signIn(email: string, password: string): Promise<AppUser> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    return userDoc.data() as AppUser;
  },

  // Sign out
  async signOut() {
    await firebaseSignOut(auth);
  },

  // Get current user data
  async getCurrentUser(firebaseUser: FirebaseUser): Promise<AppUser | null> {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (!userDoc.exists()) {
      return null;
    }

    return userDoc.data() as AppUser;
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },
};

