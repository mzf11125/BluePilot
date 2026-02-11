import { createContext, useContext, useState, ReactNode } from 'react';
import type { Token, Policy, Transaction } from '../lib/types';
import { MOCK_TOKENS, DEFAULT_POLICY, MOCK_TRANSACTIONS } from '../lib/mockData';

interface AppState {
  tokens: Token[];
  policy: Policy;
  transactions: Transaction[];
  lastTradeTime: number | null;
  updatePolicy: (policy: Policy) => void;
  addTransaction: (tx: Transaction) => void;
  updateTransaction: (hash: string, updates: Partial<Transaction>) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [tokens] = useState<Token[]>(MOCK_TOKENS);
  const [policy, setPolicy] = useState<Policy>(DEFAULT_POLICY);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [lastTradeTime, setLastTradeTime] = useState<number | null>(null);

  const updatePolicy = (newPolicy: Policy) => {
    setPolicy(newPolicy);
  };

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
    setLastTradeTime(Date.now());
  };

  const updateTransaction = (hash: string, updates: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(tx => tx.hash === hash ? { ...tx, ...updates } : tx)
    );
  };

  return (
    <AppContext.Provider value={{
      tokens,
      policy,
      transactions,
      lastTradeTime,
      updatePolicy,
      addTransaction,
      updateTransaction
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
