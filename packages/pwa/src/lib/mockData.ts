import type { Token, Transaction, Policy } from './types';

export const MOCK_TOKENS: Token[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    balance: '2.5',
    usdValue: 6250,
    price: 2500
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    decimals: 6,
    balance: '3500',
    usdValue: 3500,
    price: 1
  },
  {
    symbol: 'WETH',
    name: 'Wrapped Ether',
    address: '0x4200000000000000000000000000000000000006',
    decimals: 18,
    balance: '0.15',
    usdValue: 375,
    price: 2500
  }
];

export const DEFAULT_POLICY: Policy = {
  maxSlippage: 2,
  maxTradeSize: 1,
  cooldown: 5,
  allowedTokens: ['ETH', 'USDC', 'WETH']
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    from: 'ETH',
    to: 'USDC',
    fromAmount: '0.5',
    toAmount: '1250',
    timestamp: Date.now() - 3600000,
    status: 'confirmed'
  },
  {
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    from: 'USDC',
    to: 'WETH',
    fromAmount: '500',
    toAmount: '0.2',
    timestamp: Date.now() - 7200000,
    status: 'confirmed'
  }
];

export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatAmount = (amount: string | number, decimals = 4): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Handle very small numbers
  if (num < 0.0001 && num > 0) {
    return num.toFixed(8).replace(/\.?0+$/, '');
  }
  
  return num.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: decimals 
  });
};

export const formatBalance = (balance: string | number): string => {
  const num = typeof balance === 'string' ? parseFloat(balance) : balance;
  
  // Handle zero
  if (num === 0) return '0.00';
  
  // Handle very small numbers (show up to 8 decimals)
  if (num < 0.0001) {
    return num.toFixed(8).replace(/\.?0+$/, '');
  }
  
  // Handle small numbers (show up to 6 decimals)
  if (num < 1) {
    return num.toFixed(6).replace(/\.?0+$/, '');
  }
  
  // Handle normal numbers
  return num.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 4 
  });
};

export const generateMockTxHash = (): string => {
  return '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};
