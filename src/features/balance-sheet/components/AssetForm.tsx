import { useState } from 'react';
import { useFirebaseData } from '@/lib/firebase/hooks';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import type { AssetType } from '@/types/finance';

interface AssetFormProps {
  editingId?: string | null;
  onClose: () => void;
}

const ASSET_TYPES: AssetType[] = ['CAR', 'PROPERTY', 'INVESTMENT', 'SAVING_PLAN', 'JEWELRY', 'OTHER'];

const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  CAR: 'רכב',
  PROPERTY: 'נדל״ן',
  INVESTMENT: 'השקעות',
  SAVING_PLAN: 'חסכונות/קופ״ג',
  JEWELRY: 'תכשיטים/זהב',
  OTHER: 'אחר',
};

export const AssetForm = ({ editingId, onClose }: AssetFormProps) => {
  const { assets, addAsset, updateAsset, deleteAsset } = useFirebaseData();
  
  const editingAsset = editingId ? assets.find(a => a.id === editingId) : null;

  const [type, setType] = useState<AssetType>(editingAsset?.type || 'CAR');
  const [name, setName] = useState(editingAsset?.name || '');
  const [value, setValue] = useState(editingAsset?.value.toString() || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const assetData = {
      type,
      name: name.trim(),
      value: Number(value),
      lastUpdatedAt: new Date().toISOString(),
    };

    try {
      if (editingId) {
        await updateAsset(editingId, assetData);
      } else {
        await addAsset(assetData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving asset:', error);
      alert('שגיאה בשמירה');
    }
  };

  const handleDelete = async () => {
    if (editingId && confirm('למחוק את הנכס?')) {
      try {
        await deleteAsset(editingId);
        onClose();
      } catch (error) {
        console.error('Error deleting asset:', error);
        alert('שגיאה במחיקה');
      }
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={editingId ? '✏️ ערוך נכס' : '➕ הוסף נכס'}
    >
      <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            סוג נכס
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as AssetType)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl font-medium text-right bg-white"
            required
            dir="rtl"
          >
            {ASSET_TYPES.map(t => (
              <option key={t} value={t}>
                {ASSET_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="שם הנכס"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="לדוגמה: טויוטה קורולה 2020"
          required
        />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          💡 <strong>שימו לב:</strong> יתרת חשבון הבנק מחושבת אוטומטית מההכנסות וההוצאות.
          כאן רושמים רק נכסים קבועים (רכב, דירה, השקעות וכו׳).
        </div>

        <Input
          label="ערך נוכחי"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          min="0"
          step="0.01"
        />

        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            שמור
          </Button>
          {editingId && (
            <Button type="button" variant="danger" onClick={handleDelete}>
              מחק
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
};

