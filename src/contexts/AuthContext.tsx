import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { authService, AppUser } from '@/lib/firebase/auth';

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  joinHousehold: (email: string, password: string, name: string, householdCode: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (fbUser) => {
      setFirebaseUser(fbUser);
      
      if (fbUser) {
        const appUser = await authService.getCurrentUser(fbUser);
        setUser(appUser);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    const appUser = await authService.signIn(email, password);
    setUser(appUser);
  };

  const signUp = async (email: string, password: string, name: string) => {
    const appUser = await authService.register(email, password, name);
    setUser(appUser);
  };

  const joinHousehold = async (email: string, password: string, name: string, householdCode: string) => {
    const appUser = await authService.joinHousehold(email, password, name, householdCode);
    setUser(appUser);
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, signIn, signUp, joinHousehold, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

