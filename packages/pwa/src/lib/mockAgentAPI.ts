// Mock BluePilot Agent API
// Simulates all 9 API endpoints without calling the real API

import { MOCK_TOKENS } from './mockData';

export interface SimulateResponse {
  intent: {
    tokenIn: string;
    tokenOut: string;
    amountIn: string;
  };
  simulation: {
    amountOut: string;
    amountOutUSD: string;
    priceImpact: string;
    gasEstimate: string;
    route: string[];
    bestDex: string;
  };
  prices: Record<string, number>;
  policy: {
    compliant: boolean;
    violations: string[];
  };
  readyToSign: {
    to: string;
    data: string;
    value: string;
  };
}

export interface BatchSimulateResponse {
  trades: Array<{
    intent: any;
    simulation: any;
    policy: any;
  }>;
  totalGasEstimate: string;
  gasSavings: string;
  gasSavingsPercent: string;
}

export interface PolicyResponse {
  maxSlippageBps: number;
  maxTradeSize: string;
  cooldownSeconds: number;
  lastTradeTimestamp: number;
  tokenAllowlist: string[];
}

export interface PortfolioResponse {
  address: string;
  portfolio: Array<{
    token: string;
    symbol: string;
    balance: string;
    usdValue: string;
  }>;
  totalUSD: string;
}

export interface AlertResponse {
  alerts: Array<{
    token: string;
    creator: string;
    name: string;
    symbol: string;
    timestamp: number;
    blockNumber: number;
  }>;
  count: number;
}

class MockAgentAPI {
  private baseDelay = 500; // Simulate network delay

  private delay(ms: number = this.baseDelay): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private parseCommand(command: string): { tokenIn: string; tokenOut: string; amountIn: string } | null {
    // Simple parser for "swap X ETH for USDC" format
    const swapMatch = command.match(/swap\s+([\d.]+)\s+(\w+)\s+for\s+(\w+)/i);
    if (swapMatch) {
      const [, amount, tokenIn, tokenOut] = swapMatch;
      return {
        tokenIn: tokenIn.toUpperCase(),
        tokenOut: tokenOut.toUpperCase(),
        amountIn: amount
      };
    }
    return null;
  }

  private getTokenPrice(symbol: string): number {
    const token = MOCK_TOKENS.find(t => t.symbol === symbol);
    return token?.price || 1;
  }

  async simulate(command: string, _userAddress?: string): Promise<SimulateResponse> {
    await this.delay();

    const intent = this.parseCommand(command);
    if (!intent) {
      throw new Error('Could not parse trade intent');
    }

    const tokenInPrice = this.getTokenPrice(intent.tokenIn);
    const tokenOutPrice = this.getTokenPrice(intent.tokenOut);
    
    const amountInNum = parseFloat(intent.amountIn);
    const amountOutNum = (amountInNum * tokenInPrice) / tokenOutPrice;
    const priceImpact = (Math.random() * 0.5).toFixed(2); // 0-0.5%

    return {
      intent: {
        tokenIn: intent.tokenIn,
        tokenOut: intent.tokenOut,
        amountIn: intent.amountIn
      },
      simulation: {
        amountOut: amountOutNum.toFixed(6),
        amountOutUSD: `$${(amountOutNum * tokenOutPrice).toFixed(2)}`,
        priceImpact: `${priceImpact}%`,
        gasEstimate: '200000',
        route: [intent.tokenIn, intent.tokenOut],
        bestDex: 'Uniswap V2'
      },
      prices: {
        [intent.tokenIn]: tokenInPrice,
        [intent.tokenOut]: tokenOutPrice
      },
      policy: {
        compliant: true,
        violations: []
      },
      readyToSign: {
        to: '0xB17C9849ef7d21C7c771128be7Dd852f7D5298a9',
        data: '0x' + '0'.repeat(136),
        value: intent.tokenIn === 'ETH' ? intent.amountIn : '0'
      }
    };
  }

  async execute(command: string, _userAddress: string): Promise<any> {
    await this.delay();

    const intent = this.parseCommand(command);
    if (!intent) {
      throw new Error('Could not parse trade intent');
    }

    return {
      intent,
      transaction: {
        to: '0xB17C9849ef7d21C7c771128be7Dd852f7D5298a9',
        data: '0x' + '0'.repeat(136),
        value: intent.tokenIn === 'ETH' ? intent.amountIn : '0'
      },
      message: 'Transaction prepared. User must sign and submit.'
    };
  }

  async batchSimulate(commands: string[], userAddress?: string): Promise<BatchSimulateResponse> {
    await this.delay(800);

    if (commands.length > 10) {
      throw new Error('Maximum 10 trades per batch');
    }

    const trades = await Promise.all(
      commands.map(async (cmd) => {
        const sim = await this.simulate(cmd, userAddress);
        return {
          intent: sim.intent,
          simulation: sim.simulation,
          policy: sim.policy
        };
      })
    );

    const individualGas = trades.length * 200000;
    const batchGas = Math.floor(individualGas * 0.7);
    const gasSavings = individualGas - batchGas;

    return {
      trades,
      totalGasEstimate: batchGas.toString(),
      gasSavings: gasSavings.toString(),
      gasSavingsPercent: '30%'
    };
  }

  async batchExecute(commands: string[], _userAddress: string): Promise<any> {
    await this.delay(800);

    if (commands.length > 10) {
      throw new Error('Maximum 10 trades per batch');
    }

    const intents = commands.map(cmd => this.parseCommand(cmd)).filter(Boolean);

    return {
      trades: intents,
      transaction: {
        to: '0xB17C9849ef7d21C7c771128be7Dd852f7D5298a9',
        data: '0x' + '0'.repeat(200),
        value: '0'
      },
      message: 'Batch transaction prepared. User must sign and submit.',
      gasSavings: '~30%'
    };
  }

  async getPolicy(_address: string): Promise<PolicyResponse> {
    await this.delay();

    return {
      maxSlippageBps: 300, // 3%
      maxTradeSize: '1000000000000000000', // 1 ETH
      cooldownSeconds: 60,
      lastTradeTimestamp: Math.floor(Date.now() / 1000) - 120,
      tokenAllowlist: []
    };
  }

  async setPolicy(_userAddress: string, _policy: Partial<PolicyResponse>): Promise<any> {
    await this.delay();

    return {
      transaction: {
        to: '0xB17C9849ef7d21C7c771128be7Dd852f7D5298a9',
        data: '0x' + '0'.repeat(136)
      }
    };
  }

  async getPortfolio(address: string, tokens: string[]): Promise<PortfolioResponse> {
    await this.delay();

    const portfolio = tokens.map(tokenSymbol => {
      const token = MOCK_TOKENS.find(t => t.symbol === tokenSymbol);
      return {
        token: token?.address || '0x0',
        symbol: tokenSymbol,
        balance: token?.balance || '0',
        usdValue: `$${token?.usdValue.toFixed(2) || '0.00'}`
      };
    });

    const totalUSD = portfolio.reduce((sum, item) => {
      const val = parseFloat(item.usdValue.replace('$', ''));
      return sum + (isNaN(val) ? 0 : val);
    }, 0);

    return {
      address,
      portfolio,
      totalUSD: `$${totalUSD.toFixed(2)}`
    };
  }

  async getPrice(token: string): Promise<{ token: string; price: number }> {
    await this.delay(200);

    const price = this.getTokenPrice(token.toUpperCase());
    return { token, price };
  }

  async getAlerts(): Promise<AlertResponse> {
    await this.delay(200);

    // Mock recent token launches
    const mockAlerts = [
      {
        token: '0x07dfaec8e182c5ef79844adc70708c1c15aa60fb',
        creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        name: 'PepeCoin',
        symbol: 'PEPE',
        timestamp: Math.floor(Date.now() / 1000) - 300,
        blockNumber: 12345678
      },
      {
        token: '0x1234567890abcdef1234567890abcdef12345678',
        creator: '0x9876543210fedcba9876543210fedcba98765432',
        name: 'MoonToken',
        symbol: 'MOON',
        timestamp: Math.floor(Date.now() / 1000) - 600,
        blockNumber: 12345650
      }
    ];

    return {
      alerts: mockAlerts,
      count: mockAlerts.length
    };
  }
}

export const mockAgentAPI = new MockAgentAPI();
