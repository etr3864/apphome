import { useState } from 'react';
import { useFirebaseData } from '@/lib/firebase/hooks';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDateFull } from '@/lib/utils/format';
import { calculateNetWorth } from '@/lib/utils/finance';
import { AssetForm } from './components/AssetForm';
import { LiabilityForm } from './components/LiabilityForm';

export const BalanceSheet = () => {
  const { household, transactions, assets, liabilities } = useFirebaseData();
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [showLiabilityForm, setShowLiabilityForm] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [editingLiabilityId, setEditingLiabilityId] = useState<string | null>(null);

  const initialBalance = household?.initialBalance || 0;
  const currentBalance = initialBalance + 
    transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0) -
    transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);

  const totalAssets = assets.reduce((sum, a) => sum + a.value, 0);
  const totalLiabilities = liabilities.reduce((sum, l) => sum + l.remainingAmount, 0);
  const netWorth = calculateNetWorth(currentBalance, assets, liabilities);

  const handleEditAsset = (id: string) => {
    setEditingAssetId(id);
    setShowAssetForm(true);
  };

  const handleEditLiability = (id: string) => {
    setEditingLiabilityId(id);
    setShowLiabilityForm(true);
  };

  const handleCloseAsset = () => {
    setShowAssetForm(false);
    setEditingAssetId(null);
  };

  const handleCloseLiability = () => {
    setShowLiabilityForm(false);
    setEditingLiabilityId(null);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Net Worth */}
      <Card className="text-center bg-gradient-to-br from-primary-50 to-blue-50 border-2 border-primary-200">
        <div className="text-base text-gray-600 mb-2 font-semibold">💎 שווי נטו</div>
        <div className={`text-4xl font-extrabold mb-1 ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(netWorth)}
        </div>
        <div className="text-xs text-gray-600 mt-2 bg-white/60 rounded-full px-3 py-1 inline-block">
          נכסים - התחייבויות
        </div>
      </Card>

      {/* Assets */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">💎 נכסים</h2>
          <Button size="sm" onClick={() => setShowAssetForm(true)} className="font-bold">
            ➕ הוסף
          </Button>
        </div>

        <div className="space-y-3 mb-4">
          <Card className="bg-green-50 border-2 border-green-200">
            <div className="text-center">
              <div className="text-sm text-gray-700 mb-2 font-semibold">💰 יתרה בחשבון</div>
              <div className="text-3xl font-extrabold text-green-600">
                {formatCurrency(currentBalance)}
              </div>
              <div className="text-xs text-gray-600 mt-2 bg-white/60 rounded-full px-3 py-1 inline-block">
                מחושב אוטומטית
              </div>
            </div>
          </Card>

          <Card className="text-center">
            <div className="text-sm text-gray-700 mb-2 font-semibold">🚗 נכסים אחרים</div>
            <div className="text-sm text-gray-500 mb-2">(רכב, השקעות, נדל״ן וכו׳)</div>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalAssets)}
            </div>
          </Card>
        </div>

        <Card className="mb-4 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 text-center">
          <div className="text-base text-gray-700 mb-2 font-semibold">סה״כ כל הנכסים</div>
          <div className="text-3xl font-extrabold text-blue-600">
            {formatCurrency(currentBalance + totalAssets)}
          </div>
        </Card>

        {assets.length === 0 ? (
          <Card className="text-center py-8">
            <div className="text-4xl mb-2">📦</div>
            <p className="text-gray-500 font-medium">אין נכסים רשומים</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {assets.map(asset => (
              <Card key={asset.id} onClick={() => handleEditAsset(asset.id)} className="hover:border-blue-200">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <div className="font-bold text-gray-800">{asset.name}</div>
                    <div className="text-xs text-gray-500 mt-2">
                      עודכן: {formatDateFull(asset.lastUpdatedAt)}
                    </div>
                  </div>
                  <div className="text-xl font-extrabold text-blue-600">
                    {formatCurrency(asset.value)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Liabilities */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">📋 התחייבויות</h2>
          <Button size="sm" onClick={() => setShowLiabilityForm(true)} className="font-bold">
            ➕ הוסף
          </Button>
        </div>

        <Card className="mb-4 bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 text-center">
          <div className="text-base text-gray-700 mb-2 font-semibold">סה״כ התחייבויות</div>
          <div className="text-3xl font-extrabold text-orange-600">
            {formatCurrency(totalLiabilities)}
          </div>
        </Card>

        {liabilities.length === 0 ? (
          <Card className="text-center py-8">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-gray-500 font-medium">אין התחייבויות רשומות</p>
            <p className="text-gray-400 text-sm mt-1">מצוין! 🎉</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {liabilities.map(liability => (
              <Card key={liability.id} onClick={() => handleEditLiability(liability.id)} className="hover:border-orange-200">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <div className="font-bold text-gray-800">{liability.name}</div>
                    {liability.monthlyPayment && (
                      <div className="text-sm text-gray-600 mt-1">
                        💳 תשלום חודשי: {formatCurrency(liability.monthlyPayment)}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-2">
                      עודכן: {formatDateFull(liability.lastUpdatedAt)}
                    </div>
                  </div>
                  <div className="text-xl font-extrabold text-orange-600">
                    {formatCurrency(liability.remainingAmount)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {showAssetForm && (
        <AssetForm editingId={editingAssetId} onClose={handleCloseAsset} />
      )}

      {showLiabilityForm && (
        <LiabilityForm editingId={editingLiabilityId} onClose={handleCloseLiability} />
      )}
    </div>
  );
};

