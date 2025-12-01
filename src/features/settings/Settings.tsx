import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDateFull } from '@/lib/utils/format';

export const Settings = () => {
  const { household, updateInitialBalance, updateApiKey } = useStore();
  const [balance, setBalance] = useState(household?.initialBalance.toString() || '0');
  const [apiKey, setApiKey] = useState(household?.openaiApiKey || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isApiKeySaving, setIsApiKeySaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    updateInitialBalance(Number(balance));
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleSaveApiKey = () => {
    setIsApiKeySaving(true);
    updateApiKey(apiKey);
    setTimeout(() => setIsApiKeySaving(false), 500);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <Card>
        <h2 className="text-2xl font-bold mb-5 text-gray-800">💰 יתרה התחלתית בחשבון</h2>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <div className="text-3xl">💡</div>
              <div className="flex-1">
                <p className="font-bold text-gray-800 mb-2">למה צריך את זה?</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  היתרה ההתחלתית היא הסכום שהיה לך בחשבון הבנק <strong>לפני</strong> שהתחלת לעקוב אחר התנועות באפליקציה.
                </p>
              </div>
            </div>
            <p className="text-gray-700 text-sm mb-3">
              מרגע שאתה מזין אותה, היתרה הנוכחית תחושב אוטומטית:
            </p>
            <div className="text-center font-bold bg-white rounded-xl p-4 shadow-sm border border-blue-200">
              יתרה נוכחית = יתרה התחלתית + הכנסות - הוצאות
            </div>
          </div>

          <Input
            label="יתרה התחלתית (₪)"
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            step="0.01"
          />

          {household?.balanceUpdatedAt && (
            <p className="text-xs text-gray-500">
              עודכן לאחרונה: {formatDateFull(household.balanceUpdatedAt)}
            </p>
          )}

          <Button 
            onClick={handleSave} 
            className="w-full text-lg font-bold py-4"
            disabled={isSaving}
          >
            {isSaving ? '✅ נשמר בהצלחה!' : '💾 שמור יתרה התחלתית'}
          </Button>
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">ℹ️ מידע על משק הבית</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 font-semibold">שם:</span>
            <span className="font-bold text-gray-800">{household?.name}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 font-semibold">מטבע:</span>
            <span className="font-bold text-gray-800">{household?.currency}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 font-semibold">יתרה התחלתית:</span>
            <span className="font-bold text-green-600 text-lg">{formatCurrency(household?.initialBalance || 0)}</span>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold mb-5 text-gray-800">🤖 עוזר AI חכם</h2>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-5">
            <div className="flex gap-3 mb-3">
              <div className="text-3xl">🚀</div>
              <div className="flex-1">
                <p className="font-bold text-gray-800 mb-2">מה זה?</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  עוזר AI שיעזור לך להבין מה זה נכס, התחייבות, הכנסה והוצאה.
                  פשוט שאל אותו כל שאלה!
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 text-sm space-y-1">
              <p className="text-gray-700"><strong>דוגמאות לשאלות:</strong></p>
              <p className="text-gray-600">• "ביטקוין זה נכס או הכנסה?"</p>
              <p className="text-gray-600">• "רכב שקניתי - זה הוצאה או נכס?"</p>
              <p className="text-gray-600">• "מה ההבדל בין נכס להתחייבות?"</p>
            </div>
          </div>

          <Input
            label="OpenAI API Key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-proj-..."
          />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
            <p className="font-semibold text-gray-800 mb-2">📌 איך מקבלים API Key?</p>
            <ol className="space-y-1 text-gray-700">
              <li>1. כנס ל־ <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary-600 underline font-semibold">platform.openai.com</a></li>
              <li>2. צור חשבון חדש (אם אין לך)</li>
              <li>3. לחץ על "Create new secret key"</li>
              <li>4. העתק והדבק כאן</li>
            </ol>
            <p className="text-xs text-gray-500 mt-2">
              💰 עלות: ~$0.30 ל-20 שאלות (מודל o1 - המתקדם ביותר!)
            </p>
          </div>

          <Button 
            onClick={handleSaveApiKey} 
            className="w-full text-lg font-bold py-4"
            disabled={isApiKeySaving}
          >
            {isApiKeySaving ? '✅ נשמר!' : '💾 שמור API Key'}
          </Button>
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
        <div className="flex gap-3">
          <div className="text-3xl">⚠️</div>
          <div>
            <h3 className="font-bold text-gray-800 mb-3">חשוב לדעת</h3>
            <ul className="text-sm space-y-2 text-gray-700">
              <li className="flex gap-2">
                <span>•</span>
                <span>היתרה ההתחלתית היא נקודת המוצא לחישוב</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>כל הכנסה או הוצאה משפיעה על היתרה הנוכחית</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span><strong>אין צורך</strong> לעדכן את היתרה ההתחלתית כל חודש</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>עדכנו רק אם מצאתם טעות או התחלתם מחדש</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

