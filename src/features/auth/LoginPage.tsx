import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const LoginPage = () => {
  const { signIn, signUp, joinHousehold } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [joinExisting, setJoinExisting] = useState(false);
  const [householdCode, setHouseholdCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        if (!name.trim()) {
          setError('נא להזין שם');
          return;
        }
        
        if (joinExisting) {
          // Join existing household
          if (!householdCode.trim()) {
            setError('נא להזין קוד משק בית');
            return;
          }
          await joinHousehold(email, password, name, householdCode.trim());
        } else {
          // Create new household
          await signUp(email, password, name);
        }
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('המייל כבר בשימוש');
      } else if (err.code === 'auth/weak-password') {
        setError('הסיסמה חייבת להכיל לפחות 6 תווים');
      } else if (err.code === 'auth/invalid-email') {
        setError('מייל לא תקין');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('מייל או סיסמה שגויים');
      } else {
        setError('שגיאה: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center p-4" dir="rtl">
      <Card className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600 mb-2">
            🏠 משק הבית שלי
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'התחבר לחשבון שלך' : 'צור חשבון חדש'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <Input
              label="שם מלא"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="איתן כהן"
              required={!isLogin}
            />
          )}

          <Input
            label="מייל"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            required
          />

          <Input
            label="סיסמה"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="לפחות 6 תווים"
            required
          />

          {!isLogin && (
            <>
              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="joinExisting"
                  checked={joinExisting}
                  onChange={(e) => setJoinExisting(e.target.checked)}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                />
                <label htmlFor="joinExisting" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  🏠 הצטרף למשק בית קיים
                </label>
              </div>

              {joinExisting && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <Input
                    label="קוד משק בית (6 ספרות)"
                    value={householdCode}
                    onChange={(e) => setHouseholdCode(e.target.value)}
                    placeholder="748392"
                    maxLength={6}
                    required={joinExisting}
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    💡 קבל את הקוד מבן/בת הזוג בהגדרות האפליקציה
                  </p>
                </div>
              )}
            </>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full text-lg font-bold py-4"
          >
            {loading ? '⏳ טוען...' : isLogin ? '🔐 התחבר' : '✨ הרשם'}
          </Button>

          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {isLogin ? 'אין לך חשבון? הרשם כאן' : 'יש לך חשבון? התחבר כאן'}
          </button>
        </form>
      </Card>
    </div>
  );
};

