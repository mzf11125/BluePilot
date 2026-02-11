import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/app', label: 'Home', icon: '🏠' },
    { path: '/app/trade', label: 'Trade', icon: '💱' },
    { path: '/app/policy', label: 'Policy', icon: '⚙️' },
    { path: '/app/history', label: 'History', icon: '📜' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="h-screen flex flex-col bg-brutalism-bg">
      {/* Header */}
      <div className="bg-white border-b-4 border-black p-4 flex-shrink-0">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/plane.svg" alt="BluePilot" className="w-8 h-8" />
            <h1 className="text-xl font-bold">BluePilot</h1>
          </div>
          <ConnectButton />
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          <Outlet />
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t-4 border-black flex-shrink-0">
        <div className="flex justify-around items-center h-16">
          {tabs.map(tab => (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive(tab.path)
                  ? 'bg-sky text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              <span className="text-2xl mb-1">{tab.icon}</span>
              <span className="text-xs font-bold">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};
