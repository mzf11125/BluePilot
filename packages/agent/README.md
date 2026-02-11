# BluePilot Agent API

AI-powered agent API for hands-free DeFi trading with natural language commands, policy enforcement, and instant x402 payments.

## 🌟 Key Differentiators

### 1. ✅ Complete Trade Analysis
Enhanced `/simulate` endpoint returns USD values, price impact, gas estimates, and ready-to-sign transactions in one call.

### 2. ✅ Instant, Accountless Payments (x402)
No API keys or signups—just pay with USDC per request.

### 3. ✅ AI/Agent-Ready
Natural language interface via OpenClaw Gateway with intent-based endpoints.

### 4. ✅ Real-Time, On-Chain Data
**CoinGecko API** for live token prices, direct smart contract calls, and live blockchain event monitoring.

### 5. ✅ Customizable Policies
Set trade limits, slippage tolerance, cooldowns, and token allowlists.

### 6. ✅ Transparent Pricing

| Endpoint | Price | What You Get |
|----------|-------|--------------|
| `/simulate` | $0.001 | Full trade analysis + ready-to-sign tx |
| `/execute` | $0.005 | AI parsing + policy check + tx encoding |
| `/policy/:address` | $0.0005 | On-chain policy retrieval |
| `/policy/set` | $0.0005 | Policy update tx preparation |
| `/portfolio/:address` | $0.001 | All balances + USD values |
| `/alerts` | FREE | Token launch notifications |
| `/price/:token` | FREE | Current token price |

### 7. ✅ Developer Experience
Complete TypeScript SDK with one-line trade execution.

## Features

- 🔍 **Event Monitoring**: Real-time tracking of RobinPump token launches
- 🤖 **AI Intent Parsing**: Natural language trade commands via OpenClaw Gateway (Gemini)
- 💰 **Price Data**: Token prices from CoinGecko API
- 📊 **Trade Simulation**: Preview trades with complete analysis before execution
- 🔐 **Policy Enforcement**: User-defined trading rules via smart contracts
- 💳 **x402 Payments**: Instant USDC payments without API keys

## Quick Start

### SDK Usage

```typescript
import { BluePilotClient } from '@bluepilot/sdk';

const client = new BluePilotClient({
  privateKey: process.env.PRIVATE_KEY,
  x402Enabled: true
});

// One-line trade execution
const result = await client.simulateAndExecute("swap 0.1 ETH for USDC");
console.log(`Trade executed! TX: ${result.txHash}`);
```

## Setup

### 1. Install Dependencies

```bash
cd packages/agent
npm install
```

### 2. Environment Variables

The `.env` file is already configured with:

```env
# Base Sepolia Network
BASE_SEPOLIA_RPC=https://sepolia.base.org
BASE_SEPOLIA_WSS=wss://sepolia.base.org

# Deployed Contracts
VAULT_ROUTER_ADDRESS=0xB17C9849ef7d21C7c771128be7Dd852f7D5298a9
TRADE_EXECUTOR_ADDRESS=0x856d02e138f8707cA90346c657A537e8C67475E0

# RobinPump
ROBINPUMP_FACTORY_ADDRESS=0x236c6ea9DDc48ae72DCFb8724BF8a136aa3C6EBB
TRACKED_TOKEN_ADDRESS=0x07dfaec8e182c5ef79844adc70708c1c15aa60fb

# API Keys
COINGECKO_API_KEY=CG-hXsejVzrnLRUfRqBiH32Knt2
OPENCLAW_GATEWAY_TOKEN=lWLoDamMh2HnisTUn3zTMmrbmbWTrSG1

# Server
PORT=3000
```

### 3. Run the Server

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

## API Endpoints

### Health Check
```bash
GET /health
```

### Simulate Trade
```bash
POST /api/agent/simulate
Content-Type: application/json

{
  "command": "swap 0.1 ETH for USDC"
}
```

**Response:**
```json
{
  "intent": {
    "tokenIn": "0x0000000000000000000000000000000000000000",
    "tokenOut": "0x...",
    "amountIn": "100000000000000000"
  },
  "amountOut": "150000000",
  "success": true
}
```

### Execute Trade
```bash
POST /api/agent/execute
Content-Type: application/json

{
  "command": "buy 100 USDC with ETH",
  "userAddress": "0x..."
}
```

**Response:**
```json
{
  "intent": {...},
  "transaction": {
    "to": "0xB17C9849ef7d21C7c771128be7Dd852f7D5298a9",
    "data": "0x...",
    "value": "0"
  },
  "message": "Transaction prepared. User must sign and submit."
}
```

### Get User Policy
```bash
GET /api/agent/policy/0x...
```

**Response:**
```json
{
  "maxSlippageBps": 300,
  "maxTradeSize": "10000000000000000000",
  "cooldownSeconds": 60,
  "lastTradeTimestamp": 1707654321,
  "tokenAllowlist": ["0x..."]
}
```

### Get Token Price
```bash
GET /api/agent/price/0x...
```

**Response:**
```json
{
  "token": "0x...",
  "price": 1.23
}
```

### Get Token Launch Alerts
```bash
GET /api/agent/alerts
```

**Response:**
```json
{
  "alerts": [
    {
      "token": "0x07dfaec8e182c5ef79844adc70708c1c15aa60fb",
      "creator": "0x...",
      "name": "MyToken",
      "symbol": "MTK",
      "timestamp": 1707654321,
      "blockNumber": 12345678
    }
  ],
  "count": 1
}
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Mobile/Web UI                        │
└────────────────────┬────────────────────────────────────┘
                     │ Natural Language Commands
                     ▼
┌─────────────────────────────────────────────────────────┐
│              BluePilot Agent API (Express.js)           │
│  Endpoints: /simulate, /execute, /policy, /portfolio   │
│             /price, /alerts, /policy/set                │
└──────┬──────────┬──────────┬──────────┬────────────────┘
       │          │          │          │
       ▼          ▼          ▼          ▼
┌──────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐
│OpenClaw  │ │CoinGecko│ │Contract  │ │Event     │
│Service   │ │Service  │ │Service   │ │Monitor   │
└────┬─────┘ └────┬───┘ └────┬─────┘ └────┬─────┘
     │            │           │             │
     │            │           │             │
     ▼            ▼           ▼             ▼
┌─────────┐ ┌─────────┐ ┌──────────┐ ┌──────────┐
│ Gemini  │ │CoinGecko│ │  Base L2 │ │RobinPump │
│   AI    │ │   API   │ │Contracts │ │  Events  │
└─────────┘ └─────────┘ └──────────┘ └──────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │  VaultRouter   │
                    │ TradeExecutor  │
                    │  (Base Sepolia)│
                    └────────────────┘
```

### Data Flow

1. **User Request** → Natural language command (e.g., "swap 0.1 ETH for USDC")
2. **OpenClaw** → Parses intent into structured data
3. **CoinGecko** → Fetches real-time token prices
4. **Contract Service** → Simulates trade on-chain
5. **Policy Check** → Validates against user's limits
6. **Response** → Complete analysis + ready-to-sign transaction

## Services

### EventMonitor
- Listens to RobinPump `TokenLaunched` events via WebSocket
- Filters for tracked token address
- Stores last 100 alerts in memory
- Logs to console when new tokens are detected

### CoinGeckoService
- Fetches real-time token prices from CoinGecko API
- Supports single and batch price queries
- Provides USD formatting helper for conversions
- Powers /simulate, /portfolio, and /price endpoints
- Handles rate limiting and errors

### ContractService
- Interacts with VaultRouter and TradeExecutor contracts on Base Sepolia
- Simulates trades using view functions
- Checks policy compliance (trade size, cooldown, allowlist)
- Encodes transactions for user signing
- Fetches user policies and vault balances
- Read-only operations (no private keys required)

### OpenClawService
- Parses natural language trading commands
- Uses OpenClaw Gateway with Gemini model
- Extracts tokenIn, tokenOut, and amountIn from user input
- Returns structured trade intents

## Development

### Project Structure
```
packages/agent/
├── src/
│   ├── index.ts              # Main server
│   ├── routes/
│   │   └── agent.ts          # API routes
│   ├── services/
│   │   ├── EventMonitor.ts   # Blockchain event listener
│   │   ├── CoinGeckoService.ts
│   │   ├── ContractService.ts
│   │   └── OpenClawService.ts
│   └── types/
│       └── index.ts          # TypeScript types
├── package.json
├── tsconfig.json
└── .env
```

### Testing

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test simulate endpoint
curl -X POST http://localhost:3000/api/agent/simulate \
  -H "Content-Type: application/json" \
  -d '{"command": "swap 0.1 ETH for USDC"}'

# Test alerts endpoint
curl http://localhost:3000/api/agent/alerts
```

## Notes

- Event monitoring starts automatically on server startup
- WebSocket connection to Base Sepolia for real-time events
- No private keys stored - all transactions require user signing
- Alerts stored in memory (resets on server restart)
- OpenClaw Gateway timeout: 10 seconds

## Troubleshooting

**WebSocket connection fails:**
- Check BASE_SEPOLIA_WSS URL
- Verify network connectivity
- Try using HTTP RPC as fallback

**OpenClaw Gateway errors:**
- Verify OPENCLAW_GATEWAY_TOKEN is correct
- Check API rate limits
- Ensure request format matches expected schema

**Contract calls fail:**
- Verify contract addresses are correct
- Check RPC endpoint is responsive
- Ensure contracts are deployed on Base Sepolia

## License

MIT
