import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'בית', icon: '🏠' },
  { path: '/transactions', label: 'תנועות', icon: '💰' },
  { path: '/balance-sheet', label: 'מאזן', icon: '📊' },
  { path: '/settings', label: 'הגדרות', icon: '⚙️' },
];

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl" dir="rtl">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex justify-around items-center">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-3 px-3 min-w-[75px] transition-all ${
                location.pathname === item.path
                  ? 'text-primary-600 scale-105'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-[11px] font-semibold">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

