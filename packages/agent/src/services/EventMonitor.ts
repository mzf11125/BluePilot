import { ethers } from 'ethers';
import { TokenAlert } from '../types';

const ROBINPUMP_FACTORY_ABI = [
  'event TokenLaunched(address indexed token, address indexed creator, string name, string symbol, uint256 timestamp)'
];

export class EventMonitor {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  private alerts: TokenAlert[] = [];
  private trackedToken: string;
  private lastBlock: number = 0;

  constructor(
    rpcUrl: string,
    factoryAddress: string,
    trackedToken: string
  ) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.contract = new ethers.Contract(factoryAddress, ROBINPUMP_FACTORY_ABI, this.provider);
    this.trackedToken = trackedToken.toLowerCase();
  }

  async start() {
    console.log('🔍 Starting event monitor...');
    console.log(`📍 Tracking token: ${this.trackedToken}`);

    // Get current block
    this.lastBlock = await this.provider.getBlockNumber();

    // Poll for events every 15 seconds
    setInterval(() => this.pollEvents(), 15000);

    console.log('✅ Event monitor started (polling mode)');
  }

  private async pollEvents() {
    try {
      const currentBlock = await this.provider.getBlockNumber();
      
      if (currentBlock > this.lastBlock) {
        const events = await this.contract.queryFilter(
          'TokenLaunched',
          this.lastBlock + 1,
          currentBlock
        );

        for (const event of events) {
          if ('args' in event) {
            const alert: TokenAlert = {
              token: (event.args[0] as string).toLowerCase(),
              creator: event.args[1] as string,
              name: event.args[2] as string,
              symbol: event.args[3] as string,
              timestamp: Number(event.args[4]),
              blockNumber: event.blockNumber
            };

            // Store alert
            this.alerts.unshift(alert);
            if (this.alerts.length > 100) this.alerts.pop();

            // Log to console
            console.log('\n🚀 NEW TOKEN LAUNCHED!');
            console.log(`Token: ${alert.token}`);
            console.log(`Name: ${alert.name} (${alert.symbol})`);
            console.log(`Creator: ${alert.creator}`);
            console.log(`Block: ${alert.blockNumber}`);
            console.log(`Time: ${new Date(alert.timestamp * 1000).toISOString()}`);

            // Check if it's the tracked token
            if (alert.token === this.trackedToken) {
              console.log('⭐ THIS IS THE TRACKED TOKEN!');
            }
          }
        }

        this.lastBlock = currentBlock;
      }
    } catch (error: any) {
      console.error('Event polling error:', error.message);
    }
  }

  getAlerts(): TokenAlert[] {
    return this.alerts;
  }
}
