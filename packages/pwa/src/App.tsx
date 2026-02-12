import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Providers } from './components/Providers';
import { AppProvider } from './contexts/AppContext';
import { LandingPage } from './pages/LandingPage';
import { DocsPage } from './pages/DocsPage';
import { AppLayout } from './components/AppLayout';
import { HomePage } from './pages/HomePage';
import { TradePage } from './pages/TradePage';
import { StrategyPage } from './pages/StrategyPage';
import { PolicyPage } from './pages/PolicyPage';
import { HistoryPage } from './pages/HistoryPage';

function App() {
  return (
    <Providers>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<HomePage />} />
              <Route path="trade" element={<TradePage />} />
              <Route path="strategy" element={<StrategyPage />} />
              <Route path="policy" element={<PolicyPage />} />
              <Route path="history" element={<HistoryPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </Providers>
  );
}

export default App;
