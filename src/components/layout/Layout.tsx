import type { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-24" dir="rtl">
      <header className="bg-gradient-to-l from-primary-600 to-primary-700 shadow-md sticky top-0 z-40">
        <div className="max-w-md lg:max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center sm:text-right">
            🏠 משק הבית שלי
          </h1>
        </div>
      </header>
      <main className="max-w-md lg:max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

