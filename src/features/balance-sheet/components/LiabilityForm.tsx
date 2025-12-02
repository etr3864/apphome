import { useState } from 'react';
import { useFirebaseData } from '@/lib/firebase/hooks';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { LiabilityType } from '@/types/finance';

interface LiabilityFormProps {
  editingId?: string | null;
  onClose: () => void;
}

const LIABILITY_TYPES: LiabilityType[] = ['LOAN', 'CREDIT_CARD', 'MORTGAGE', 'OTHER'];

const LIABILITY_TYPE_LABELS: Record<LiabilityType, string> = {
  LOAN: 'הלוואה',
  CREDIT_CARD: 'כרטיס אשראי',
  MORTGAGE: 'משכנתא',
  OTHER: 'אחר',
};

export const LiabilityForm = ({ editingId, onClose }: LiabilityFormProps) => {
  const { liabilities, addLiability, updateLiability, deleteLiability } = useFirebaseData();
  
  const editingLiability = editingId 
    ? liabilities.find(l => l.id === editingId) 
    : null;

  const [type, setType] = useState<LiabilityType>(editingLiability?.type || 'LOAN');
  const [name, setName] = useState(editingLiability?.name || '');
  const [totalAmount, setTotalAmount] = useState(editingLiability?.totalAmount.toString() || '');
  const [remainingAmount, setRemainingAmount] = useState(editingLiability?.remainingAmount.toString() || '');
  const [monthlyPayment, setMonthlyPayment] = useState(editingLiability?.monthlyPayment?.toString() || '');
  const [dueDate, setDueDate] = useState(
    editingLiability?.dueDate 
      ? new Date(editingLiability.dueDate).toISOString().split('T')[0]
      : ''
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const liabilityData: any = {
      type,
      name: name.trim(),
      totalAmount: Number(totalAmount),
      remainingAmount: Number(remainingAmount),
      lastUpdatedAt: new Date().toISOString(),
    };

    // רק אם יש ערך - נוסיף את הפילד (Firestore לא אוהב undefined)
    if (monthlyPayment) {
      liabilityData.monthlyPayment = Number(monthlyPayment);
    }
    if (dueDate) {
      liabilityData.dueDate = new Date(dueDate).toISOString();
    }

    try {
      if (editingId) {
        await updateLiability(editingId, liabilityData);
      } else {
        await addLiability(liabilityData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving liability:', error);
      alert('שגיאה בשמירה');
    }
  };

  const handleDelete = async () => {
    if (editingId && confirm('למחוק את ההתחייבות?')) {
      try {
        await deleteLiability(editingId);
        onClose();
      } catch (error) {
        console.error('Error deleting liability:', error);
        alert('שגיאה במחיקה');
      }
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={editingId ? '✏️ ערוך התחייבות' : '➕ הוסף התחייבות'}
    >
      <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            סוג התחייבות
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as LiabilityType)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl font-medium text-right bg-white"
            required
            dir="rtl"
          >
            {LIABILITY_TYPES.map(t => (
              <option key={t} value={t}>
                {LIABILITY_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="שם ההתחייבות"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="לדוגמה: הלוואת רכב"
          required
        />

        <Input
          label="סכום כולל"
          type="number"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          required
          min="0"
          step="0.01"
        />

        <Input
          label="יתרת חוב נוכחית"
          type="number"
          value={remainingAmount}
          onChange={(e) => setRemainingAmount(e.target.value)}
          required
          min="0"
          step="0.01"
        />

        <Input
          label="תשלום חודשי (אופציונלי)"
          type="number"
          value={monthlyPayment}
          onChange={(e) => setMonthlyPayment(e.target.value)}
          min="0"
          step="0.01"
        />

        <Input
          label="תאריך סיום משוער (אופציונלי)"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

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

