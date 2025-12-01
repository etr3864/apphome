import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { generateId } from '@/lib/utils/id';
import type { TransactionType, TransactionCategory } from '@/types/finance';

interface TransactionFormProps {
  type: TransactionType;
  editingId?: string | null;
  onClose: () => void;
}

const CATEGORIES: Record<TransactionType, TransactionCategory[]> = {
  EXPENSE: ['RENT', 'MORTGAGE', 'GROCERIES', 'FUEL', 'UTILITIES', 'SUBSCRIPTION', 'ENTERTAINMENT', 'HEALTH', 'EDUCATION', 'OTHER'],
  INCOME: ['SALARY', 'OTHER'],
};

const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  RENT: 'שכירות',
  MORTGAGE: 'משכנתא',
  GROCERIES: 'קניות',
  FUEL: 'דלק',
  UTILITIES: 'חשמל/מים/גז',
  SUBSCRIPTION: 'מנויים',
  SALARY: 'משכורת',
  ENTERTAINMENT: 'בילויים',
  HEALTH: 'בריאות',
  EDUCATION: 'חינוך',
  OTHER: 'אחר',
};

export const TransactionForm = ({ type, editingId, onClose }: TransactionFormProps) => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useStore();
  
  const editingTransaction = editingId 
    ? transactions.find(t => t.id === editingId)
    : null;

  const [amount, setAmount] = useState(editingTransaction?.amount.toString() || '');
  const [category, setCategory] = useState<TransactionCategory>(editingTransaction?.category || CATEGORIES[type][0]);
  const [description, setDescription] = useState(editingTransaction?.description || '');
  const [date, setDate] = useState(
    editingTransaction?.date 
      ? new Date(editingTransaction.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [isFixed, setIsFixed] = useState(editingTransaction?.isFixed || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transaction = {
      id: editingId || generateId(),
      type,
      amount: Number(amount),
      category,
      description: description.trim() || undefined,
      date: new Date(date).toISOString(),
      isFixed,
      createdAt: editingTransaction?.createdAt || new Date().toISOString(),
    };

    if (editingId) {
      updateTransaction(editingId, transaction);
    } else {
      addTransaction(transaction);
    }
    
    onClose();
  };

  const handleDelete = () => {
    if (editingId && confirm('למחוק את התנועה?')) {
      deleteTransaction(editingId);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={editingId ? '✏️ ערוך תנועה' : `➕ הוסף ${type === 'EXPENSE' ? 'הוצאה' : 'הכנסה'}`}
    >
      <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
        <Input
          label="סכום"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="0"
          step="0.01"
        />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            קטגוריה
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TransactionCategory)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl font-medium text-right bg-white"
            required
            dir="rtl"
          >
            {CATEGORIES[type].map(cat => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="תיאור (אופציונלי)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Input
          label="תאריך"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        {type === 'EXPENSE' && (
          <label className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl p-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isFixed}
              onChange={(e) => setIsFixed(e.target.checked)}
              className="w-5 h-5"
            />
            <span className="text-sm font-semibold">📌 הוצאה קבועה (חוזרת כל חודש)</span>
          </label>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="submit" className="flex-1 text-base font-bold py-3">
            💾 שמור
          </Button>
          {editingId && (
            <Button type="button" variant="danger" onClick={handleDelete} className="px-6">
              🗑️ מחק
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
};

