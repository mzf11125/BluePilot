import axios, { AxiosInstance } from 'axios';
import { ethers } from 'ethers';

interface BluePilotConfig {
  baseUrl?: string;
  privateKey?: string;
  x402Enabled?: boolean;
}

export class BluePilotClient {
  private client: AxiosInstance;
  private wallet?: ethers.Wallet;
  private x402Enabled: boolean;

  constructor(config: BluePilotConfig = {}) {
    this.client = axios.create({
      baseUrl: config.baseUrl || 'http://localhost:3000/api/agent'
    });

    if (config.privateKey) {
      this.wallet = new ethers.Wallet(config.privateKey);
    }

    this.x402Enabled = config.x402Enabled ?? true;
  }

  async simulate(command: string, userAddress?: string) {
    const response = await this.client.post('/simulate', { command, userAddress });
    return response.data;
  }

  async execute(command: string, userAddress: string) {
    const response = await this.client.post('/execute', { command, userAddress });
    return response.data;
  }

  async getPolicy(address: string) {
    const response = await this.client.get(`/policy/${address}`);
    return response.data;
  }

  async setPolicy(userAddress: string, policy: {
    maxSlippageBps?: number;
    maxTradeSize?: string;
    cooldownSeconds?: number;
    tokenAllowlist?: string[];
  }) {
    const response = await this.client.post('/policy/set', { userAddress, ...policy });
    return response.data;
  }

  async getPortfolio(address: string, tokens: string[]) {
    const response = await this.client.get(`/portfolio/${address}`, {
      params: { tokens: tokens.join(',') }
    });
    return response.data;
  }

  async getPrice(token: string) {
    const response = await this.client.get(`/price/${token}`);
    return response.data;
  }

  async getAlerts() {
    const response = await this.client.get('/alerts');
    return response.data;
  }

  async simulateAndExecute(command: string) {
    if (!this.wallet) {
      throw new Error('Wallet required for simulateAndExecute');
    }

    const userAddress = this.wallet.address;
    const simResult = await this.simulate(command, userAddress);

    if (!simResult.policy.compliant) {
      throw new Error(`Policy violation: ${simResult.policy.violations.join(', ')}`);
    }

    const provider = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC);
    const signer = this.wallet.connect(provider);

    const tx = await signer.sendTransaction({
      to: simResult.readyToSign.to,
      data: simResult.readyToSign.data,
      value: simResult.readyToSign.value
    });

    const receipt = await tx.wait();

    return {
      ...simResult,
      txHash: receipt?.hash,
      blockNumber: receipt?.blockNumber
    };
  }
}
