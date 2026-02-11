export interface TokenAlert {
  token: string;
  creator: string;
  name: string;
  symbol: string;
  timestamp: number;
  blockNumber: number;
}

export interface TradeIntent {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
}

export interface SimulationResult {
  amountOut: string;
  amountOutUSD: string;
  priceImpact: string;
  gasEstimate: string;
  route: string[];
  bestDex: string;
}

export interface UserPolicy {
  maxSlippageBps: number;
  maxTradeSize: string;
  cooldownSeconds: number;
  lastTradeTimestamp: number;
  tokenAllowlist: string[];
}

export interface PolicyCheck {
  compliant: boolean;
  violations: string[];
}

export interface TokenBalance {
  token: string;
  symbol: string;
  balance: string;
  usdValue: string;
}
