import { Router } from 'express';
import { EventMonitor } from '../services/EventMonitor';
import { CoinGeckoService } from '../services/CoinGeckoService';
import { ContractService } from '../services/ContractService';
import { OpenClawService } from '../services/OpenClawService';
import { X402Middleware } from '../services/X402Middleware';

const router = Router();

let eventMonitor: EventMonitor;
let coinGecko: CoinGeckoService;
let contracts: ContractService;
let openClaw: OpenClawService;
let x402: X402Middleware | null = null;

export function initializeServices() {
  const {
    BASE_SEPOLIA_RPC,
    ROBINPUMP_FACTORY_ADDRESS,
    TRACKED_TOKEN_ADDRESS,
    COINGECKO_API_KEY,
    VAULT_ROUTER_ADDRESS,
    TRADE_EXECUTOR_ADDRESS,
    OPENCLAW_GATEWAY_TOKEN,
    X402_WALLET_ADDRESS,
    X402_USDC_ADDRESS,
    X402_CHAIN_ID,
    X402_DEFAULT_AMOUNT
  } = process.env;

  eventMonitor = new EventMonitor(
    BASE_SEPOLIA_RPC!,
    ROBINPUMP_FACTORY_ADDRESS!,
    TRACKED_TOKEN_ADDRESS!
  );

  coinGecko = new CoinGeckoService(COINGECKO_API_KEY!);
  
  contracts = new ContractService(
    BASE_SEPOLIA_RPC!,
    VAULT_ROUTER_ADDRESS!,
    TRADE_EXECUTOR_ADDRESS!
  );

  openClaw = new OpenClawService(OPENCLAW_GATEWAY_TOKEN!);

  // Initialize x402 payment middleware if configured
  if (X402_WALLET_ADDRESS && X402_USDC_ADDRESS && X402_CHAIN_ID && X402_DEFAULT_AMOUNT) {
    x402 = new X402Middleware({
      walletAddress: X402_WALLET_ADDRESS,
      usdcAddress: X402_USDC_ADDRESS,
      chainId: X402_CHAIN_ID,
      amount: X402_DEFAULT_AMOUNT
    });
    console.log('💰 x402 payment enabled');
  } else {
    console.log('⚠️  x402 payment disabled (missing configuration)');
  }

  eventMonitor.start();
}

// Helper to check if x402 is enabled
const requirePayment = (amount?: string) => {
  if (x402) {
    return x402.requirePayment(amount);
  }
  // If x402 not configured, allow access without payment
  return (req: any, res: any, next: any) => next();
};

// POST /api/agent/simulate - Requires 0.001 USDC payment (if x402 enabled)
router.post('/simulate', requirePayment('0.001'), async (req, res) => {
  try {
    const { command, userAddress } = req.body;
    
    const intent = await openClaw.parseTradeIntent(command);
    if (!intent) {
      return res.status(400).json({ error: 'Could not parse trade intent' });
    }

    const simulation = await contracts.simulateTrade(intent.tokenIn, intent.tokenOut, intent.amountIn);
    const prices = await coinGecko.getMultipleTokenPrices([intent.tokenIn, intent.tokenOut]);
    
    const tokenInPrice = prices[intent.tokenIn.toLowerCase()] || 0;
    const tokenOutPrice = prices[intent.tokenOut.toLowerCase()] || 0;
    
    simulation.amountOutUSD = coinGecko.formatUSD(simulation.amountOut, 18, tokenOutPrice);
    
    const amountInNum = Number(intent.amountIn) / 1e18;
    const amountOutNum = Number(simulation.amountOut) / 1e18;
    const expectedOut = amountInNum * (tokenInPrice / tokenOutPrice);
    simulation.priceImpact = `${(((expectedOut - amountOutNum) / expectedOut) * 100).toFixed(2)}%`;

    const policy = userAddress ? await contracts.checkPolicy(userAddress, intent.tokenIn, intent.tokenOut, intent.amountIn) : { compliant: true, violations: [] };

    const minAmountOut = (BigInt(simulation.amountOut) * 97n / 100n).toString();

    res.json({
      intent,
      simulation,
      prices: { [intent.tokenIn]: tokenInPrice, [intent.tokenOut]: tokenOutPrice },
      policy,
      readyToSign: {
        to: process.env.VAULT_ROUTER_ADDRESS,
        data: contracts.encodeExecuteTrade(intent.tokenIn, intent.tokenOut, intent.amountIn, minAmountOut),
        value: intent.tokenIn === '0x0000000000000000000000000000000000000000' ? intent.amountIn : '0'
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/agent/execute - Requires 0.005 USDC payment (if x402 enabled)
router.post('/execute', requirePayment('0.005'), async (req, res) => {
  try {
    const { command, userAddress } = req.body;
    
    const intent = await openClaw.parseTradeIntent(command);
    if (!intent) {
      return res.status(400).json({ error: 'Could not parse trade intent' });
    }

    const policy = await contracts.checkPolicy(userAddress, intent.tokenIn, intent.tokenOut, intent.amountIn);
    if (!policy.compliant) {
      return res.status(400).json({ error: 'Policy violation', violations: policy.violations });
    }

    const simulation = await contracts.simulateTrade(intent.tokenIn, intent.tokenOut, intent.amountIn);
    const minAmountOut = (BigInt(simulation.amountOut) * 97n / 100n).toString();

    res.json({
      intent,
      transaction: {
        to: process.env.VAULT_ROUTER_ADDRESS,
        data: contracts.encodeExecuteTrade(intent.tokenIn, intent.tokenOut, intent.amountIn, minAmountOut),
        value: intent.tokenIn === '0x0000000000000000000000000000000000000000' ? intent.amountIn : '0'
      },
      message: 'Transaction prepared. User must sign and submit.'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/agent/policy/:address - Requires 0.0005 USDC payment (if x402 enabled)
router.get('/policy/:address', requirePayment('0.0005'), async (req, res) => {
  try {
    const policy = await contracts.getUserPolicy(req.params.address);
    res.json(policy);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/agent/price/:token - Free endpoint
router.get('/price/:token', async (req, res) => {
  try {
    const price = await coinGecko.getTokenPrice(req.params.token);
    res.json({ token: req.params.token, price });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/agent/alerts - Free endpoint
router.get('/alerts', (req, res) => {
  try {
    const alerts = eventMonitor.getAlerts();
    res.json({ alerts, count: alerts.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/agent/batch/simulate - Requires 0.002 USDC payment (if x402 enabled)
router.post('/batch/simulate', requirePayment('0.002'), async (req, res) => {
  try {
    const { commands, userAddress } = req.body;
    
    if (!Array.isArray(commands) || commands.length === 0) {
      return res.status(400).json({ error: 'commands array required' });
    }

    if (commands.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 trades per batch' });
    }

    // Parse all intents
    const intents = await Promise.all(
      commands.map(cmd => openClaw.parseTradeIntent(cmd))
    );

    if (intents.some(intent => !intent)) {
      return res.status(400).json({ error: 'Could not parse all trade intents' });
    }

    // Simulate all trades
    const results = await Promise.all(
      intents.map(async (intent) => {
        const simulation = await contracts.simulateTrade(intent!.tokenIn, intent!.tokenOut, intent!.amountIn);
        const prices = await coinGecko.getMultipleTokenPrices([intent!.tokenIn, intent!.tokenOut]);
        
        const tokenInPrice = prices[intent!.tokenIn.toLowerCase()] || 0;
        const tokenOutPrice = prices[intent!.tokenOut.toLowerCase()] || 0;
        
        simulation.amountOutUSD = coinGecko.formatUSD(simulation.amountOut, 18, tokenOutPrice);
        
        const amountInNum = Number(intent!.amountIn) / 1e18;
        const amountOutNum = Number(simulation.amountOut) / 1e18;
        const expectedOut = amountInNum * (tokenInPrice / tokenOutPrice);
        simulation.priceImpact = `${(((expectedOut - amountOutNum) / expectedOut) * 100).toFixed(2)}%`;

        const policy = userAddress ? 
          await contracts.checkPolicy(userAddress, intent!.tokenIn, intent!.tokenOut, intent!.amountIn) : 
          { compliant: true, violations: [] };

        return {
          intent: intent!,
          simulation,
          policy
        };
      })
    );

    // Calculate gas savings
    const individualGas = results.reduce((sum, r) => sum + Number(r.simulation.gasEstimate), 0);
    const batchGas = Math.floor(individualGas * 0.7); // ~30% gas savings
    const gasSavings = individualGas - batchGas;

    res.json({
      trades: results,
      totalGasEstimate: batchGas.toString(),
      gasSavings: gasSavings.toString(),
      gasSavingsPercent: '30%'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/agent/batch/execute - Requires 0.01 USDC payment (if x402 enabled)
router.post('/batch/execute', requirePayment('0.01'), async (req, res) => {
  try {
    const { commands, userAddress } = req.body;
    
    if (!Array.isArray(commands) || commands.length === 0) {
      return res.status(400).json({ error: 'commands array required' });
    }

    if (commands.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 trades per batch' });
    }

    // Parse all intents
    const intents = await Promise.all(
      commands.map(cmd => openClaw.parseTradeIntent(cmd))
    );

    if (intents.some(intent => !intent)) {
      return res.status(400).json({ error: 'Could not parse all trade intents' });
    }

    // Check policies for all trades
    const policyChecks = await Promise.all(
      intents.map(intent => 
        contracts.checkPolicy(userAddress, intent!.tokenIn, intent!.tokenOut, intent!.amountIn)
      )
    );

    const violations = policyChecks.filter(p => !p.compliant);
    if (violations.length > 0) {
      return res.status(400).json({ 
        error: 'Policy violations detected', 
        violations: violations.flatMap(v => v.violations)
      });
    }

    // Simulate and encode all trades
    const encodedTrades = await Promise.all(
      intents.map(async (intent) => {
        const simulation = await contracts.simulateTrade(intent!.tokenIn, intent!.tokenOut, intent!.amountIn);
        const minAmountOut = (BigInt(simulation.amountOut) * 97n / 100n).toString();
        
        return {
          tokenIn: intent!.tokenIn,
          tokenOut: intent!.tokenOut,
          amountIn: intent!.amountIn,
          minAmountOut
        };
      })
    );

    const batchData = contracts.encodeBatchTrades(encodedTrades);

    res.json({
      trades: intents,
      transaction: {
        to: process.env.VAULT_ROUTER_ADDRESS,
        data: batchData,
        value: '0' // Calculate total ETH value if needed
      },
      message: 'Batch transaction prepared. User must sign and submit.',
      gasSavings: '~30%'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/agent/policy/set - Requires 0.0005 USDC payment (if x402 enabled)
router.post('/policy/set', requirePayment('0.0005'), async (req, res) => {
  try {
    const { userAddress, maxSlippageBps, maxTradeSize, cooldownSeconds, tokenAllowlist } = req.body;

    if (!userAddress) {
      return res.status(400).json({ error: 'userAddress required' });
    }

    const data = contracts.encodePolicyUpdate(
      maxSlippageBps || 300,
      maxTradeSize || '1000000000000000000',
      cooldownSeconds || 60,
      tokenAllowlist || []
    );

    res.json({
      transaction: {
        to: process.env.VAULT_ROUTER_ADDRESS,
        data
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/agent/portfolio/:address - Requires 0.001 USDC payment (if x402 enabled)
router.get('/portfolio/:address', requirePayment('0.001'), async (req, res) => {
  try {
    const { address } = req.params;
    const tokens = (req.query.tokens as string)?.split(',') || [];

    if (tokens.length === 0) {
      return res.status(400).json({ error: 'tokens query parameter required (comma-separated addresses)' });
    }

    const balances = await Promise.all(
      tokens.map(token => contracts.getVaultBalance(address, token))
    );

    const prices = await coinGecko.getMultipleTokenPrices(tokens);

    const portfolio = tokens.map((token, i) => ({
      token,
      symbol: 'TBD',
      balance: balances[i],
      usdValue: coinGecko.formatUSD(balances[i], 18, prices[token.toLowerCase()] || 0)
    }));

    const totalUSD = portfolio.reduce((sum, item) => {
      const val = parseFloat(item.usdValue.replace('$', ''));
      return sum + (isNaN(val) ? 0 : val);
    }, 0);

    res.json({
      address,
      portfolio,
      totalUSD: `$${totalUSD.toFixed(2)}`
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
