# BluePilot Agent API

AI-powered agent API for BluePilot DeFi trading platform. Monitors RobinPump token launches, provides natural language trade execution, and integrates with deployed smart contracts on Base Sepolia.

## Features

- 🔍 **Event Monitoring**: Real-time tracking of RobinPump token launches
- 🤖 **AI Intent Parsing**: Natural language trade commands via OpenClaw Gateway (Gemini)
- 💰 **Price Data**: Token prices from CoinGecko API
- 📊 **Trade Simulation**: Preview trades before execution
- 🔐 **Policy Enforcement**: User-defined trading rules via smart contracts

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
┌─────────────────┐
│  Mobile/Web UI  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Agent API     │
│  (Express.js)   │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬──────────┐
    ▼         ▼          ▼          ▼
┌────────┐ ┌──────┐ ┌────────┐ ┌────────┐
│OpenClaw│ │Coin  │ │Contract│ │Event   │
│Gateway │ │Gecko │ │Service │ │Monitor │
└────────┘ └──────┘ └────────┘ └────────┘
    │                    │          │
    ▼                    ▼          ▼
┌────────┐         ┌─────────┐ ┌─────────┐
│ Gemini │         │  Base   │ │RobinPump│
│  API   │         │Contracts│ │ Events  │
└────────┘         └─────────┘ └─────────┘
```

## Services

### EventMonitor
- Listens to RobinPump `TokenLaunched` events via WebSocket
- Filters for tracked token address
- Stores last 100 alerts in memory
- Logs to console when new tokens are detected

### CoinGeckoService
- Fetches token prices from CoinGecko API
- Supports single and batch price queries
- Handles rate limiting and errors

### ContractService
- Interacts with VaultRouter and TradeExecutor contracts
- Simulates trades using view functions
- Fetches user policies and vault balances
- Read-only operations (no private keys)

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
