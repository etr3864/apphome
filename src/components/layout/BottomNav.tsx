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

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50 safe-area-bottom" dir="rtl">
      <div className="max-w-md lg:max-w-4xl mx-auto">
        <div className="flex justify-around items-center px-2 lg:px-8">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                relative flex flex-col items-center 
                py-3 px-3 min-w-[70px] 
                lg:py-4 lg:px-6 lg:min-w-[100px]
                transition-all duration-200 rounded-xl
                ${isActive(item.path)
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              {/* Active Indicator */}
              {isActive(item.path) && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 lg:w-16 h-1 bg-primary-600 rounded-b-full" />
              )}
              
              <span className={`
                text-2xl lg:text-3xl mb-1 
                transition-transform 
                ${isActive(item.path) ? 'scale-110' : ''}
              `}>
                {item.icon}
              </span>
              <span className={`
                text-[11px] lg:text-sm font-semibold 
                ${isActive(item.path) ? 'font-bold' : ''}
              `}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

