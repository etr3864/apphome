import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { OpenAIService } from '@/lib/services/openai.service';
import { Button } from '@/components/ui/Button';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIHelperProps {
  onClose: () => void;
}

export const AIHelper = ({ onClose }: AIHelperProps) => {
  const { household } = useStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiServiceRef = useRef<OpenAIService | null>(null);

  useEffect(() => {
    if (household?.openaiApiKey) {
      aiServiceRef.current = new OpenAIService(household.openaiApiKey);
      
      // Load existing conversation
      const history = aiServiceRef.current.getHistory();
      if (history.length > 0) {
        setMessages(history);
      } else {
        // Show welcome message only if no history
        setMessages([{
          role: 'assistant',
          content: 'שלום! 👋 אני העוזר הפיננסי שלך. שאל אותי כל שאלה על נכסים, התחייבויות, הכנסות והוצאות!'
        }]);
      }
    }
  }, [household?.openaiApiKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!household?.openaiApiKey) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ לא הוגדר API Key. אנא הגדר API Key של OpenAI בהגדרות כדי להשתמש בעוזר החכם.'
      }]);
      return;
    }

    const userMessage = input.trim();
    setInput('');
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await aiServiceRef.current?.ask(userMessage);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response || 'מצטער, לא הצלחתי לענות'
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ שגיאה: ${error instanceof Error ? error.message : 'משהו השתבש'}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearHistory = () => {
    if (confirm('למחוק את כל ההיסטוריה?')) {
      aiServiceRef.current?.clearHistory();
      setMessages([{
        role: 'assistant',
        content: 'שלום! 👋 אני העוזר הפיננסי שלך. שאל אותי כל שאלה על נכסים, התחייבויות, הכנסות והוצאות!'
      }]);
    }
  };

  const quickQuestions = [
    'מה זה נכס?',
    'מה זה התחייבות?',
    'ביטקוין זה נכס?',
    'רכב שקניתי זה הוצאה או נכס?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" dir="rtl" onClick={onClose}>
      <div 
        className="w-full max-w-2xl bg-white rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-l from-primary-600 to-primary-700 px-6 py-5 rounded-t-3xl flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🤖</span>
            <div>
              <h2 className="text-xl font-bold text-white">העוזר הפיננסי</h2>
              <p className="text-xs text-primary-100">מופעל על ידי OpenAI o1 🧠</p>
            </div>
          </div>
          <div className="flex gap-2">
            {messages.length > 1 && (
              <button
                onClick={handleClearHistory}
                className="text-white hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center text-lg transition-colors"
                title="מחק היסטוריה"
              >
                🗑️
              </button>
            )}
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center text-2xl transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.filter(m => m.role !== 'system').map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                  msg.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-end">
              <div className="bg-gray-100 rounded-2xl px-5 py-3">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-6 pb-3">
            <p className="text-xs text-gray-500 mb-2 font-semibold">שאלות מהירות:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(q)}
                  className="text-xs bg-primary-50 text-primary-700 px-3 py-2 rounded-full hover:bg-primary-100 transition-colors border border-primary-200"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t bg-gray-50 rounded-b-3xl">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="שאל שאלה... (למשל: 'ביטקוין זה נכס?')"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-right"
              dir="rtl"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-6 font-bold"
            >
              {isLoading ? '⏳' : '📤'}
            </Button>
          </div>
          {!household?.openaiApiKey && (
            <p className="text-xs text-red-600 mt-2 text-center">
              ⚠️ נדרש API Key של OpenAI - הגדר בהגדרות
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

