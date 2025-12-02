import { useState } from 'react';
import { useFirebaseData } from '@/lib/firebase/hooks';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { calculateMonthlySummary, getRecentTransactions } from '@/lib/utils/finance';
import { AddMenu } from './components/AddMenu';

export const Dashboard = () => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const { household, transactions, assets, liabilities } = useFirebaseData();
  const { user } = useAuth();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const summary = calculateMonthlySummary(transactions, currentMonth, currentYear);
  
  const initialBalance = household?.initialBalance || 0;
  const currentBalance = initialBalance + 
    transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0) -
    transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
  
  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.remainingAmount, 0);
  const recentTransactions = getRecentTransactions(transactions, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="text-right">
        <h1 className="text-3xl font-bold text-gray-800 mb-1">
          שלום {user?.name || 'אורח'} 👋
        </h1>
        <p className="text-gray-600">מה נשמע היום?</p>
      </div>

      {/* Current Balance - Main Card */}
      <Card className="bg-gradient-to-br from-primary-50 to-blue-50 border-2 border-primary-200">
        <div className="text-center">
          <div className="text-base text-gray-600 mb-2 font-semibold">💰 יתרה בחשבון</div>
          <div className={`text-4xl font-extrabold mb-1 ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(currentBalance)}
          </div>
          <div className="text-xs text-gray-600 mt-2 bg-white/60 rounded-full px-3 py-1 inline-block">
            מחושב אוטומטית מתנועות
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <div className="text-sm text-gray-600 mb-2 font-semibold">📈 הכנסות החודש</div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(summary.income)}
          </div>
        </Card>

        <Card className="text-center">
          <div className="text-sm text-gray-600 mb-2 font-semibold">📉 הוצאות החודש</div>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(summary.expenses)}
          </div>
        </Card>

        <Card className="text-center">
          <div className="text-sm text-gray-600 mb-2 font-semibold">💎 נכסים אחרים</div>
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(totalAssets)}
          </div>
        </Card>

        <Card className="text-center">
          <div className="text-sm text-gray-600 mb-2 font-semibold">📋 התחייבויות</div>
          <div className="text-2xl font-bold text-orange-600">
            {formatCurrency(totalLiabilities)}
          </div>
        </Card>
      </div>

      {/* Balance */}
      <Card className="text-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-base text-gray-700 mb-2 font-semibold">💵 יתרה חודשית</div>
        <div className={`text-3xl font-extrabold ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(summary.balance)}
        </div>
        <div className="text-sm font-medium mt-2">
          {summary.balance >= 0 ? '✅ החודש בפלוס!' : '⚠️ החודש במינוס'}
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <h2 className="text-xl font-bold mb-4 text-gray-800">📋 תנועות אחרונות</h2>
        {recentTransactions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">אין תנועות עדיין</p>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map(tx => (
              <div key={tx.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{tx.category}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{formatDate(tx.date)}</div>
                </div>
                <div className={`font-bold text-lg ${tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddMenu(true)}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 w-16 h-16 bg-primary-600 text-white rounded-full shadow-2xl hover:bg-primary-700 hover:scale-110 transition-all flex items-center justify-center"
        dir="rtl"
      >
        <span className="text-3xl font-bold">+</span>
      </button>

      {showAddMenu && <AddMenu onClose={() => setShowAddMenu(false)} />}
    </div>
  );
};

