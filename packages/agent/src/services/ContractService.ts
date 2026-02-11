import { ethers } from 'ethers';
import VaultRouterABI from '../../../contracts/artifacts/VaultRouter.sol/VaultRouter.json';
import TradeExecutorABI from '../../../contracts/artifacts/TradeExecutor.sol/TradeExecutor.json';
import { UserPolicy, SimulationResult, PolicyCheck } from '../types';

export class ContractService {
  private provider: ethers.JsonRpcProvider;
  private vaultRouter: ethers.Contract;
  private tradeExecutor: ethers.Contract;

  constructor(
    rpcUrl: string,
    vaultRouterAddress: string,
    tradeExecutorAddress: string
  ) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.vaultRouter = new ethers.Contract(vaultRouterAddress, VaultRouterABI.abi, this.provider);
    this.tradeExecutor = new ethers.Contract(tradeExecutorAddress, TradeExecutorABI.abi, this.provider);
  }

  async simulateTrade(tokenIn: string, tokenOut: string, amountIn: string): Promise<SimulationResult> {
    const amountOut = await this.vaultRouter.simulateTrade(tokenIn, tokenOut, amountIn);
    const gasEstimate = await this.vaultRouter.executeTrade.estimateGas(tokenIn, tokenOut, amountIn, 0);
    
    return {
      amountOut: amountOut.toString(),
      amountOutUSD: '0',
      priceImpact: '0',
      gasEstimate: gasEstimate.toString(),
      route: [tokenIn, tokenOut],
      bestDex: 'Uniswap V2'
    };
  }

  async checkPolicy(userAddress: string, tokenIn: string, tokenOut: string, amountIn: string): Promise<PolicyCheck> {
    const policy = await this.getUserPolicy(userAddress);
    const violations: string[] = [];

    if (BigInt(amountIn) > BigInt(policy.maxTradeSize)) {
      violations.push(`Trade size exceeds limit: ${amountIn} > ${policy.maxTradeSize}`);
    }

    const now = Math.floor(Date.now() / 1000);
    if (now - policy.lastTradeTimestamp < policy.cooldownSeconds) {
      violations.push(`Cooldown active: ${policy.cooldownSeconds - (now - policy.lastTradeTimestamp)}s remaining`);
    }

    if (policy.tokenAllowlist.length > 0 && !policy.tokenAllowlist.includes(tokenOut)) {
      violations.push(`Token ${tokenOut} not in allowlist`);
    }

    return { compliant: violations.length === 0, violations };
  }

  async getUserPolicy(userAddress: string): Promise<UserPolicy> {
    const policy = await this.vaultRouter.getPolicy(userAddress);
    return {
      maxSlippageBps: Number(policy.maxSlippageBps),
      maxTradeSize: policy.maxTradeSize.toString(),
      cooldownSeconds: Number(policy.cooldownSeconds),
      lastTradeTimestamp: Number(policy.lastTradeTimestamp),
      tokenAllowlist: policy.tokenAllowlist
    };
  }

  async getVaultBalance(userAddress: string, tokenAddress: string): Promise<string> {
    const balance = await this.vaultRouter.getVaultBalance(userAddress, tokenAddress);
    return balance.toString();
  }

  encodePolicyUpdate(maxSlippageBps: number, maxTradeSize: string, cooldownSeconds: number, tokenAllowlist: string[]): string {
    return this.vaultRouter.interface.encodeFunctionData('setPolicy', [
      maxSlippageBps,
      maxTradeSize,
      cooldownSeconds,
      tokenAllowlist
    ]);
  }

  encodeExecuteTrade(tokenIn: string, tokenOut: string, amountIn: string, minAmountOut: string): string {
    return this.vaultRouter.interface.encodeFunctionData('executeTrade', [
      tokenIn,
      tokenOut,
      amountIn,
      minAmountOut
    ]);
  }

  encodeBatchTrades(trades: Array<{tokenIn: string, tokenOut: string, amountIn: string, minAmountOut: string}>): string {
    // Encode multiple trades into a single multicall transaction
    const calls = trades.map(trade => 
      this.vaultRouter.interface.encodeFunctionData('executeTrade', [
        trade.tokenIn,
        trade.tokenOut,
        trade.amountIn,
        trade.minAmountOut
      ])
    );
    
    // Return multicall encoding (if VaultRouter supports it)
    // For now, return array of encoded calls
    return JSON.stringify(calls);
  }
}
