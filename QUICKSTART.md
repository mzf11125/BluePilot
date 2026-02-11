# BluePilot MVP - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd packages/agent
npm install
```

### Step 2: Build the Project
```bash
npm run build
```

### Step 3: Start the Server
```bash
npm start
```

You should see:
```
🔍 Starting event monitor...
📍 Tracking token: 0x07dfaec8e182c5ef79844adc70708c1c15aa60fb
🚀 BluePilot Agent API running on port 3000
📡 Event monitoring active
✅ Event monitor started (polling mode)
```

## 🧪 Test the API

### Health Check
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"ok","timestamp":"2026-02-11T14:37:23.302Z"}
```

### Get Token Launch Alerts
```bash
curl http://localhost:3000/api/agent/alerts
```

Expected response:
```json
{"alerts":[],"count":0}
```

### Simulate a Trade
```bash
curl -X POST http://localhost:3000/api/agent/simulate \
  -H "Content-Type: application/json" \
  -d '{"command": "swap 0.1 ETH for USDC"}'
```

### Get User Policy
```bash
curl http://localhost:3000/api/agent/policy/0xYourWalletAddress
```

### Get Token Price
```bash
curl http://localhost:3000/api/agent/price/0xTokenAddress
```

## 📊 What's Running

- **Event Monitor**: Polls Base Sepolia every 15 seconds for new RobinPump token launches
- **API Server**: Listens on port 3000 for HTTP requests
- **Contract Integration**: Connected to VaultRouter and TradeExecutor on Base Sepolia
- **Price Service**: Ready to fetch token prices from CoinGecko
- **AI Service**: OpenClaw Gateway with Gemini for natural language parsing

## 🔧 Configuration

All settings are in `packages/agent/.env`:

```env
BASE_SEPOLIA_RPC=https://sepolia.base.org
VAULT_ROUTER_ADDRESS=0xB17C9849ef7d21C7c771128be7Dd852f7D5298a9
TRADE_EXECUTOR_ADDRESS=0x856d02e138f8707cA90346c657A537e8C67475E0
ROBINPUMP_FACTORY_ADDRESS=0x236c6ea9DDc48ae72DCFb8724BF8a136aa3C6EBB
TRACKED_TOKEN_ADDRESS=0x07dfaec8e182c5ef79844adc70708c1c15aa60fb
COINGECKO_API_KEY=CG-hXsejVzrnLRUfRqBiH32Knt2
OPENCLAW_GATEWAY_TOKEN=lWLoDamMh2HnisTUn3zTMmrbmbWTrSG1
PORT=3000
```

## 📝 Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| POST | `/api/agent/simulate` | Simulate a trade |
| POST | `/api/agent/execute` | Prepare unsigned transaction |
| GET | `/api/agent/policy/:address` | Get user's trading policy |
| GET | `/api/agent/price/:token` | Get token price from CoinGecko |
| GET | `/api/agent/alerts` | Get recent token launch alerts |

## 🎯 What Happens When a New Token Launches

When the event monitor detects a new token on RobinPump:

1. **Console Output:**
```
🚀 NEW TOKEN LAUNCHED!
Token: 0x07dfaec8e182c5ef79844adc70708c1c15aa60fb
Name: MyToken (MTK)
Creator: 0x...
Block: 12345678
Time: 2026-02-11T14:37:23.302Z
⭐ THIS IS THE TRACKED TOKEN!
```

2. **Stored in Memory:** Alert is added to the alerts array (accessible via `/api/agent/alerts`)

3. **Available for Query:** Can be retrieved by any client polling the alerts endpoint

## 🛠️ Development Mode

For development with auto-reload:

```bash
npm run dev
```

This uses `ts-node` to run TypeScript directly without building.

## 📚 More Information

- Full documentation: `packages/agent/README.md`
- Implementation details: `IMPLEMENTATION_SUMMARY.md`
- Project structure: `structure.md`
- Requirements: `requirements.md`

## ✅ Success Checklist

- [x] Server starts without errors
- [x] Health endpoint responds
- [x] Event monitor initializes
- [x] All 6 API endpoints are accessible
- [x] Contract addresses are configured
- [x] API keys are set

## 🐛 Troubleshooting

**Server won't start:**
- Check Node.js version (>= 18)
- Run `npm install` again
- Check port 3000 is not in use

**Event monitor errors:**
- Verify BASE_SEPOLIA_RPC is accessible
- Check internet connection
- RPC endpoint might be rate-limited

**API returns errors:**
- Check request format matches examples
- Verify contract addresses are correct
- Check API keys are valid

## 🎉 You're Ready!

The BluePilot MVP is now running and ready to:
- Monitor RobinPump token launches
- Simulate trades
- Fetch token prices
- Interact with deployed smart contracts
- Parse natural language trading commands

Happy trading! 🚀
