import { ethers } from 'ethers';
import VaultRouterABI from '../../../contracts/artifacts/VaultRouter.sol/VaultRouter.json';
import TradeExecutorABI from '../../../contracts/artifacts/TradeExecutor.sol/TradeExecutor.json';
import { UserPolicy, SimulationResult } from '../types';

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

  async simulateTrade(tokenIn: string, tokenOut: string, amountIn: string): Promise<string> {
    try {
      const amountOut = await this.vaultRouter.simulateTrade(tokenIn, tokenOut, amountIn);
      return amountOut.toString();
    } catch (error: any) {
      console.error('Simulation error:', error.message);
      throw error;
    }
  }

  async getUserPolicy(userAddress: string): Promise<UserPolicy> {
    try {
      const policy = await this.vaultRouter.getPolicy(userAddress);
      return {
        maxSlippageBps: Number(policy.maxSlippageBps),
        maxTradeSize: policy.maxTradeSize.toString(),
        cooldownSeconds: Number(policy.cooldownSeconds),
        lastTradeTimestamp: Number(policy.lastTradeTimestamp),
        tokenAllowlist: policy.tokenAllowlist
      };
    } catch (error: any) {
      console.error('Get policy error:', error.message);
      throw error;
    }
  }

  async getVaultBalance(userAddress: string, tokenAddress: string): Promise<string> {
    try {
      const balance = await this.vaultRouter.getVaultBalance(userAddress, tokenAddress);
      return balance.toString();
    } catch (error: any) {
      console.error('Get balance error:', error.message);
      throw error;
    }
  }
}
