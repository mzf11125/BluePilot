import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useSIWE } from '../hooks/useSIWE';

// SVG Icon Components
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955m.001 0c.029-.309.026-.619.026-.931 0-6.075-4.926-11-11-11S4.925 1.25 11 1.25c2.538 0 4.905.77 6.935 2.095l.002.001a9.94 9.94 0 0 1 4.992 4.992m-6.828 2.028a3 3 0 1 1-4.243-4.243m9.878 0a3 3 0 1 0 4.243 4.243m-9.1 9.1a9 9 0 0 1 12.728 0" />
  </svg>
);

const TradeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3-9.75m0 0L7.5 21m3-9.75V3a2.25 2.25 0 0 1 4.5 0v13.5M9 6.75h1.5m-1.5 3h1.5m-6 3h12m-12 3h12m-6-3.75V3a2.25 2.25 0 0 1 4.5 0v9" />
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.896.974 2.765a1.5 1.5 0 0 0 2.246 0c.39-.87.72-1.803.974-2.765m0-9.18a5.403 5.403 0 0 0-.974-2.765 1.5 1.5 0 0 0-2.246 0c-.39.869-.72 1.803-.974 2.765M6.75 12h.008v.008H6.75V12Zm6 0h.008v.008H12.75V12Zm6 0h.008v.008H18.75V12Z" />
  </svg>
);

const HistoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const iconMap: Record<string, () => React.ReactElement> = {
  home: HomeIcon,
  trade: TradeIcon,
  strategy: ChartIcon,
  policy: SettingsIcon,
  history: HistoryIcon,
};

export const AppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isConnected } = useAccount();
  const { isSignedIn, isSigningIn, signInError, signIn, signOut } = useSIWE();

  const tabs = [
    { path: '/app', label: 'Home', iconKey: 'home' },
    { path: '/app/trade', label: 'Trade', iconKey: 'trade' },
    { path: '/app/strategy', label: 'Strategy', iconKey: 'strategy' },
    { path: '/app/policy', label: 'Policy', iconKey: 'policy' },
    { path: '/app/history', label: 'History', iconKey: 'history' }
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
          <div className="flex items-center gap-3">
            {isConnected && !isSignedIn && (
              <button
                onClick={signIn}
                disabled={isSigningIn}
                className="px-4 py-2 bg-sky text-white font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSigningIn ? 'Signing...' : 'Sign In'}
              </button>
            )}
            {isSignedIn && (
              <button
                onClick={signOut}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
              >
                Sign Out
              </button>
            )}
            <ConnectButton />
          </div>
        </div>
        {signInError && (
          <div className="container mx-auto mt-2">
            <p className="text-red-500 text-sm font-medium">{signInError}</p>
          </div>
        )}
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
          {tabs.map(tab => {
            const IconComponent = iconMap[tab.iconKey];
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                aria-label={tab.label}
                aria-current={isActive(tab.path) ? 'page' : undefined}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 cursor-pointer ${
                  isActive(tab.path)
                    ? 'bg-sky text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span className={`mb-1 ${isActive(tab.path) ? 'text-white' : 'text-gray-700'}`}>
                  <IconComponent />
                </span>
                <span className="text-xs font-bold">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
