import type { Token, Policy, SimulationResult } from './types';

export const simulateTrade = (
  fromToken: Token,
  toToken: Token,
  amount: number,
  policy: Policy
): SimulationResult => {
  const slippage = Math.random() * 1.5 + 0.5;
  const rate = toToken.price / fromToken.price;
  const outputAmount = (amount * rate * (1 - slippage / 100)).toFixed(6);
  
  const violations: string[] = [];
  
  if (amount > policy.maxTradeSize) {
    violations.push(`Trade size exceeds maximum of ${policy.maxTradeSize} ${fromToken.symbol}`);
  }
  
  if (slippage > policy.maxSlippage) {
    violations.push(`Slippage ${slippage.toFixed(2)}% exceeds maximum of ${policy.maxSlippage}%`);
  }
  
  if (!policy.allowedTokens.includes(fromToken.symbol) || !policy.allowedTokens.includes(toToken.symbol)) {
    violations.push('Token not in allowlist');
  }
  
  return {
    outputAmount,
    slippage: parseFloat(slippage.toFixed(2)),
    gasEstimate: '0.0012',
    policyViolations: violations
  };
};
