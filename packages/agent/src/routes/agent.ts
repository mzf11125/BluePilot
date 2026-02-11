import { Router } from 'express';
import { EventMonitor } from '../services/EventMonitor';
import { CoinGeckoService } from '../services/CoinGeckoService';
import { ContractService } from '../services/ContractService';
import { OpenClawService } from '../services/OpenClawService';

const router = Router();

let eventMonitor: EventMonitor;
let coinGecko: CoinGeckoService;
let contracts: ContractService;
let openClaw: OpenClawService;

export function initializeServices() {
  const {
    BASE_SEPOLIA_RPC,
    ROBINPUMP_FACTORY_ADDRESS,
    TRACKED_TOKEN_ADDRESS,
    COINGECKO_API_KEY,
    VAULT_ROUTER_ADDRESS,
    TRADE_EXECUTOR_ADDRESS,
    OPENCLAW_GATEWAY_TOKEN
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

  eventMonitor.start();
}

// POST /api/agent/simulate
router.post('/simulate', async (req, res) => {
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

// POST /api/agent/execute
router.post('/execute', async (req, res) => {
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

// GET /api/agent/policy/:address
router.get('/policy/:address', async (req, res) => {
  try {
    const policy = await contracts.getUserPolicy(req.params.address);
    res.json(policy);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/agent/price/:token
router.get('/price/:token', async (req, res) => {
  try {
    const price = await coinGecko.getTokenPrice(req.params.token);
    res.json({ token: req.params.token, price });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/agent/alerts
router.get('/alerts', (req, res) => {
  try {
    const alerts = eventMonitor.getAlerts();
    res.json({ alerts, count: alerts.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
