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
    const { command } = req.body;
    
    const intent = await openClaw.parseTradeIntent(command);
    if (!intent) {
      return res.status(400).json({ error: 'Could not parse trade intent' });
    }

    const amountOut = await contracts.simulateTrade(
      intent.tokenIn,
      intent.tokenOut,
      intent.amountIn
    );

    res.json({
      intent,
      amountOut,
      success: true
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

    // Return unsigned transaction data
    res.json({
      intent,
      transaction: {
        to: process.env.VAULT_ROUTER_ADDRESS,
        data: '0x', // Would encode executeTrade call here
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

export default router;
