import { useState } from 'react';
import { useFirebaseData } from '@/lib/firebase/hooks';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { TransactionForm } from './components/TransactionForm';
import type { TransactionType } from '@/types/finance';

export const Transactions = () => {
  const { transactions } = useFirebaseData();
  const [selectedType, setSelectedType] = useState<TransactionType>('EXPENSE');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear] = useState(new Date().getFullYear());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredTransactions = transactions.filter(tx => {
    const date = new Date(tx.date);
    return (
      tx.type === selectedType &&
      date.getMonth() === selectedMonth &&
      date.getFullYear() === selectedYear
    );
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const total = filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* Tabs */}
      <div className="flex gap-3">
        <Button
          variant={selectedType === 'EXPENSE' ? 'primary' : 'secondary'}
          onClick={() => setSelectedType('EXPENSE')}
          className="flex-1 text-base font-bold py-3"
        >
          💸 הוצאות
        </Button>
        <Button
          variant={selectedType === 'INCOME' ? 'primary' : 'secondary'}
          onClick={() => setSelectedType('INCOME')}
          className="flex-1 text-base font-bold py-3"
        >
          💰 הכנסות
        </Button>
      </div>

      {/* Month Filter */}
      <Card>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          📅 בחר חודש
        </label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl font-medium text-right bg-white"
          dir="rtl"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {new Date(2025, i).toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })}
            </option>
          ))}
        </select>
      </Card>

      {/* Total */}
      <Card className="text-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-base text-gray-700 mb-2 font-semibold">סה״כ {selectedType === 'EXPENSE' ? 'הוצאות' : 'הכנסות'}</div>
        <div className={`text-3xl font-extrabold ${selectedType === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(total)}
        </div>
      </Card>

      {/* Add Button */}
      <Button onClick={() => setShowForm(true)} className="w-full text-lg font-bold py-4">
        ➕ הוסף {selectedType === 'EXPENSE' ? 'הוצאה' : 'הכנסה'}
      </Button>

      {/* List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-500 font-medium">אין תנועות להצגה</p>
            <p className="text-gray-400 text-sm mt-1">לחץ על הכפתור למעלה כדי להוסיף</p>
          </Card>
        ) : (
          filteredTransactions.map(tx => (
            <Card key={tx.id} onClick={() => handleEdit(tx.id)} className="hover:border-primary-200">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <div className="font-bold text-gray-800 text-base">{tx.category}</div>
                  {tx.description && (
                    <div className="text-sm text-gray-600 mt-1">{tx.description}</div>
                  )}
                  <div className="text-xs text-gray-500 mt-2">{formatDate(tx.date)}</div>
                  {tx.isFixed && (
                    <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                      📌 קבועה
                    </span>
                  )}
                </div>
                <div className={`text-xl font-extrabold ${selectedType === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(tx.amount)}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {showForm && (
        <TransactionForm
          type={selectedType}
          editingId={editingId}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

