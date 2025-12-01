import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { TransactionForm } from '@/features/transactions/components/TransactionForm';
import { AssetForm } from '@/features/balance-sheet/components/AssetForm';
import { LiabilityForm } from '@/features/balance-sheet/components/LiabilityForm';

interface AddMenuProps {
  onClose: () => void;
}

type FormType = 'expense' | 'income' | 'asset' | 'liability' | null;

export const AddMenu = ({ onClose }: AddMenuProps) => {
  const [selectedForm, setSelectedForm] = useState<FormType>(null);

  const menuItems = [
    { type: 'expense' as const, label: 'הוצאה חדשה', icon: '💸' },
    { type: 'income' as const, label: 'הכנסה חדשה', icon: '💰' },
    { type: 'asset' as const, label: 'נכס חדש', icon: '🏦' },
    { type: 'liability' as const, label: 'התחייבות חדשה', icon: '📋' },
  ];

  const handleFormClose = () => {
    setSelectedForm(null);
    onClose();
  };

  if (selectedForm === 'expense' || selectedForm === 'income') {
    return (
      <TransactionForm
        type={selectedForm === 'expense' ? 'EXPENSE' : 'INCOME'}
        onClose={handleFormClose}
      />
    );
  }

  if (selectedForm === 'asset') {
    return <AssetForm onClose={handleFormClose} />;
  }

  if (selectedForm === 'liability') {
    return <LiabilityForm onClose={handleFormClose} />;
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="➕ הוסף חדש">
      <div className="space-y-3" dir="rtl">
        {menuItems.map(item => (
          <button
            key={item.type}
            onClick={() => setSelectedForm(item.type)}
            className="w-full flex items-center gap-4 p-5 bg-gradient-to-l from-gray-50 to-gray-100 hover:from-primary-50 hover:to-blue-50 rounded-xl transition-all border-2 border-transparent hover:border-primary-200 shadow-sm hover:shadow-md"
          >
            <span className="text-3xl">{item.icon}</span>
            <span className="font-bold text-lg text-gray-800">{item.label}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
};

