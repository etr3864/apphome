import { useState } from 'react';
import { useFirebaseData } from '@/lib/firebase/hooks';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDateFull } from '@/lib/utils/format';
import { formatHouseholdCode } from '@/lib/utils/household';
import { householdService } from '@/lib/firebase/household.service';
import { migrateFromLocalStorage, hasMigrated } from '@/lib/firebase/migration';

export const Settings = () => {
  const { household, updateInitialBalance, updateApiKey } = useFirebaseData();
  const { signOut, user } = useAuth();
  const [balance, setBalance] = useState(household?.initialBalance.toString() || '0');
  const [apiKey, setApiKey] = useState(household?.openaiApiKey || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isApiKeySaving, setIsApiKeySaving] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationDone, setMigrationDone] = useState(hasMigrated());
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateInitialBalance(Number(balance));
      setTimeout(() => setIsSaving(false), 500);
    } catch (error) {
      console.error('Error saving balance:', error);
      alert('שגיאה בשמירה');
      setIsSaving(false);
    }
  };

  const handleSaveApiKey = async () => {
    setIsApiKeySaving(true);
    try {
      await updateApiKey(apiKey);
      setTimeout(() => setIsApiKeySaving(false), 500);
    } catch (error) {
      console.error('Error saving API key:', error);
      alert('שגיאה בשמירה');
      setIsApiKeySaving(false);
    }
  };

  const handleMigration = async () => {
    if (!user?.householdId) {
      alert('שגיאה: לא נמצא household ID');
      return;
    }

    if (!confirm('האם לייבא את כל הנתונים מהמכשיר? (תנועות, נכסים, התחייבויות)')) {
      return;
    }

    setIsMigrating(true);
    try {
      await migrateFromLocalStorage(user.householdId);
      setMigrationDone(true);
      alert('✅ הייבוא הושלם בהצלחה!');
    } catch (error) {
      console.error('Migration error:', error);
      alert('שגיאה בייבוא: ' + (error as Error).message);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleGenerateCode = async () => {
    if (!user?.householdId) {
      alert('שגיאה: לא נמצא household ID');
      return;
    }

    setIsGeneratingCode(true);
    try {
      const code = await householdService.generateCode(user.householdId);
      alert(`✅ הקוד נוצר בהצלחה: ${code.slice(0,3)}-${code.slice(3)}`);
    } catch (error) {
      console.error('Generate code error:', error);
      alert('שגיאה ביצירת קוד: ' + (error as Error).message);
    } finally {
      setIsGeneratingCode(false);
    }
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

      {user?.role === 'owner' && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="text-4xl">🔑</div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">קוד משק הבית</h2>
                <p className="text-gray-700 leading-relaxed">
                  שתף את הקוד הזה עם בן/בת הזוג שלך כדי שיוכלו להצטרף למשק הבית המשותף
                </p>
              </div>
            </div>

            {household?.householdCode ? (
              <>
                <div className="bg-white rounded-xl p-5 border-2 border-green-300">
                  <div className="text-center mb-3">
                    <p className="text-sm text-gray-600 font-semibold mb-2">הקוד שלך:</p>
                    <div className="text-4xl font-bold text-primary-600 tracking-wider" dir="ltr">
                      {formatHouseholdCode(household.householdCode)}
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(household.householdCode);
                      alert('✅ הקוד הועתק ללוח!');
                    }}
                    className="w-full text-lg font-bold py-3 bg-green-600 hover:bg-green-700"
                  >
                    📋 העתק קוד
                  </Button>
                </div>

                <div className="bg-white rounded-lg p-3 text-sm border border-green-200">
                  <p className="font-semibold text-gray-800 mb-2">💡 איך זה עובד?</p>
                  <ol className="space-y-1 text-gray-700">
                    <li>1. שלח את הקוד לבן/בת הזוג (WhatsApp, SMS, וכו')</li>
                    <li>2. בעת ההרשמה, הם יסמנו "הצטרף למשק בית קיים"</li>
                    <li>3. יזינו את הקוד - ותראו את אותם הנתונים! 🎉</li>
                  </ol>
                </div>
              </>
            ) : (
              <>
                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                  <p className="text-sm text-gray-700 mb-3">
                    ⚠️ משק הבית שלך עדיין אין לו קוד. צור קוד עכשיו כדי לאפשר לבן/בת הזוג להצטרף!
                  </p>
                </div>

                <Button
                  onClick={handleGenerateCode}
                  disabled={isGeneratingCode}
                  className="w-full text-lg font-bold py-4 bg-green-600 hover:bg-green-700"
                >
                  {isGeneratingCode ? '⏳ יוצר קוד...' : '✨ צור קוד משק בית'}
                </Button>
              </>
            )}
          </div>
        </Card>
      )}

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

      {!migrationDone && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="text-4xl">📦</div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">ייבא נתונים קיימים</h2>
                <p className="text-gray-700 leading-relaxed">
                  יש לך נתונים שמורים מהגרסה הקודמת? 
                  <br />
                  <strong>לחץ כאן לייבא אותם ל-Firebase</strong> (תנועות, נכסים, התחייבויות)
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 text-sm border border-green-200">
              <p className="font-semibold text-gray-800 mb-2">💡 מה זה עושה?</p>
              <ul className="space-y-1 text-gray-700">
                <li>✅ מעתיק את כל התנועות שלך</li>
                <li>✅ מעתיק את הנכסים (רכב, ביטקוין, וכו')</li>
                <li>✅ מעתיק את ההתחייבויות (הלוואות, משכנתא)</li>
                <li>✅ מעתיק את היתרה ההתחלתית</li>
              </ul>
            </div>

            <Button 
              onClick={handleMigration} 
              className="w-full text-lg font-bold py-4 bg-green-600 hover:bg-green-700"
              disabled={isMigrating}
            >
              {isMigrating ? '⏳ מייבא נתונים...' : '📦 ייבא נתונים עכשיו'}
            </Button>
          </div>
        </Card>
      )}

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

      <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200">
        <Button 
          onClick={signOut} 
          variant="danger"
          className="w-full text-lg font-bold py-4"
        >
          🚪 התנתק
        </Button>
      </Card>
    </div>
  );
};

