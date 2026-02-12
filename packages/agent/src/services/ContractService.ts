import { ethers } from 'ethers';
import VaultRouterABI from '../../../contracts/artifacts/VaultRouter.sol/VaultRouter.json';
import TradeExecutorABI from '../../../contracts/artifacts/TradeExecutor.sol/TradeExecutor.json';
import { UserPolicy, SimulationResult, PolicyCheck } from '../types';
import { withRpcRetry } from '../utils/retry';
import { ApiError, Errors } from '../middleware/errorHandler';

export class ContractService {
  private provider: ethers.JsonRpcProvider;
  private vaultRouter: ethers.Contract;
  private _tradeExecutor: ethers.Contract;

  constructor(
    rpcUrl: string,
    vaultRouterAddress: string,
    tradeExecutorAddress: string
  ) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.vaultRouter = new ethers.Contract(vaultRouterAddress, VaultRouterABI.abi, this.provider);
    this._tradeExecutor = new ethers.Contract(tradeExecutorAddress, TradeExecutorABI.abi, this.provider);
  }

  async simulateTrade(tokenIn: string, tokenOut: string, amountIn: string): Promise<SimulationResult> {
    try {
      const amountOut = await withRpcRetry(() =>
        this.vaultRouter.simulateTrade(tokenIn, tokenOut, amountIn)
      );

      const gasEstimate = await withRpcRetry(() =>
        this.vaultRouter.executeTrade.estimateGas(tokenIn, tokenOut, amountIn, 0)
      );

      return {
        amountOut: amountOut.toString(),
        amountOutUSD: '0',
        priceImpact: '0',
        gasEstimate: gasEstimate.toString(),
        route: [tokenIn, tokenOut],
        bestDex: 'Uniswap V2'
      };
    } catch (error: any) {
      throw this.handleContractError(error, 'simulate trade');
    }
  }

  async checkPolicy(userAddress: string, _tokenIn: string, tokenOut: string, amountIn: string): Promise<PolicyCheck> {
    try {
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
    } catch (error: any) {
      throw this.handleContractError(error, 'check policy');
    }
  }

  async getUserPolicy(userAddress: string): Promise<UserPolicy> {
    try {
      const policy = await withRpcRetry(() =>
        this.vaultRouter.getPolicy(userAddress)
      );
      return {
        maxSlippageBps: Number(policy.maxSlippageBps),
        maxTradeSize: policy.maxTradeSize.toString(),
        cooldownSeconds: Number(policy.cooldownSeconds),
        lastTradeTimestamp: Number(policy.lastTradeTimestamp),
        tokenAllowlist: policy.tokenAllowlist
      };
    } catch (error: any) {
      throw this.handleContractError(error, 'get user policy');
    }
  }

  async getVaultBalance(userAddress: string, tokenAddress: string): Promise<string> {
    try {
      const balance = await withRpcRetry(() =>
        this.vaultRouter.getVaultBalance(userAddress, tokenAddress)
      );
      return balance.toString();
    } catch (error: any) {
      throw this.handleContractError(error, 'get vault balance');
    }
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

  /**
   * Handle contract errors and convert to standardized API errors
   */
  private handleContractError(error: any, operation: string): ApiError {
    // Check for rate limiting
    if (error.status === 429 || error.message?.includes('rate limit')) {
      return Errors.rateLimited(60);
    }

    // Check for common contract errors
    const message = error.message?.toLowerCase() || '';

    if (message.includes('insufficient funds') || message.includes('insufficient balance')) {
      return Errors.badRequest('Insufficient balance', { operation });
    }

    if (message.includes('gas') && message.includes('estimate')) {
      return Errors.simulationFailed('Gas estimation failed - transaction would revert');
    }

    if (message.includes('revert') || message.includes('execution failed')) {
      return Errors.contractError(`Contract call failed during ${operation}`, {
        reason: error.reason || error.message
      });
    }

    if (message.includes('network') || message.includes('timeout') || message.includes('econn')) {
      return Errors.rpcError(`Network error during ${operation}`, {
        originalError: error.message
      });
    }

    // Default to RPC error
    return Errors.rpcError(`Failed to ${operation}: ${error.message}`);
  }
}
