import { useFirebaseData } from '@/lib/firebase/hooks';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils/format';

export const FixedExpenses = () => {
  const { transactions } = useFirebaseData();

  const fixedExpenses = transactions
    .filter(tx => tx.type === 'EXPENSE' && tx.isFixed)
    .sort((a, b) => a.category.localeCompare(b.category));

  const total = fixedExpenses.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="space-y-4" dir="rtl">
      <Card className="text-center bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200">
        <div className="text-base text-gray-700 mb-2 font-semibold">📌 סה״כ הוצאות קבועות</div>
        <div className="text-4xl font-extrabold text-red-600 mb-1">
          {formatCurrency(total)}
        </div>
        <div className="text-sm text-gray-600 bg-white/60 rounded-full px-3 py-1 inline-block">
          לחודש
        </div>
      </Card>

      {fixedExpenses.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-5xl mb-3">📌</div>
          <p className="text-gray-500 font-semibold mb-2">
            אין הוצאות קבועות עדיין
          </p>
          <p className="text-sm text-gray-400">
            סמן תנועות כ״הוצאה קבועה״ במסך התנועות
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {fixedExpenses.map(tx => (
            <Card key={tx.id} className="border-red-100">
              <div className="flex justify-between items-center gap-3">
                <div className="flex-1">
                  <div className="font-bold text-gray-800">{tx.category}</div>
                  {tx.description && (
                    <div className="text-sm text-gray-600 mt-1">{tx.description}</div>
                  )}
                  <div className="text-xs text-gray-400 mt-2">
                    📅 תאריך: {new Date(tx.date).getDate()} בכל חודש
                  </div>
                </div>
                <div className="text-xl font-extrabold text-red-600">
                  {formatCurrency(tx.amount)}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
        <div className="flex gap-3">
          <div className="text-3xl">💡</div>
          <div>
            <div className="font-bold text-gray-800 mb-2">מה זה הוצאות קבועות?</div>
            <p className="text-sm text-gray-700 leading-relaxed">
              הוצאות שחוזרות כל חודש (שכירות, חשמל, מנויים וכו׳). הן נספרות באופן אוטומטי בסיכום החודשי.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

