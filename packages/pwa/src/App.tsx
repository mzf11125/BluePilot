import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from './lib/wagmi';
import { AppProvider } from './contexts/AppContext';
import { LandingPage } from './pages/LandingPage';
import { DocsPage } from './pages/DocsPage';
import { AppLayout } from './components/AppLayout';
import { HomePage } from './pages/HomePage';
import { TradePage } from './pages/TradePage';
import { PolicyPage } from './pages/PolicyPage';
import { HistoryPage } from './pages/HistoryPage';

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AppProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/docs" element={<DocsPage />} />
                <Route path="/app" element={<AppLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="trade" element={<TradePage />} />
                  <Route path="policy" element={<PolicyPage />} />
                  <Route path="history" element={<HistoryPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </AppProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
