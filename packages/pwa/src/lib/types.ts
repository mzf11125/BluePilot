export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  balance: string;
  usdValue: number;
  price: number;
}

export interface Policy {
  maxSlippage: number;
  maxTradeSize: number;
  cooldown: number;
  allowedTokens: string[];
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  fromAmount: string;
  toAmount: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface SimulationResult {
  outputAmount: string;
  slippage: number;
  gasEstimate: string;
  policyViolations: string[];
}
