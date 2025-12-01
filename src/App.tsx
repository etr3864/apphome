import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStore } from './store/useStore';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './features/dashboard/Dashboard';
import { Transactions } from './features/transactions/Transactions';
import { FixedExpenses } from './features/fixed-expenses/FixedExpenses';
import { BalanceSheet } from './features/balance-sheet/BalanceSheet';
import { Settings } from './features/settings/Settings';
import { AIHelper } from './features/ai-helper/AIHelper';

function App() {
  const loadFromStorage = useStore(state => state.loadFromStorage);
  const [showAIHelper, setShowAIHelper] = useState(false);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/fixed" element={<FixedExpenses />} />
          <Route path="/balance-sheet" element={<BalanceSheet />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>

        {/* Floating AI Button */}
        <button
          onClick={() => setShowAIHelper(true)}
          className="fixed bottom-24 left-6 w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all z-40 flex items-center justify-center"
          title="שאל את העוזר החכם"
        >
          <span className="text-4xl">🤖</span>
        </button>

        {showAIHelper && <AIHelper onClose={() => setShowAIHelper(false)} />}
      </Layout>
    </BrowserRouter>
  );
}

export default App;
