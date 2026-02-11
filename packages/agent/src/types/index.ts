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
  priceImpact: string;
  gasEstimate: string;
  policyViolations: string[];
}

export interface UserPolicy {
  maxSlippageBps: number;
  maxTradeSize: string;
  cooldownSeconds: number;
  lastTradeTimestamp: number;
  tokenAllowlist: string[];
}
