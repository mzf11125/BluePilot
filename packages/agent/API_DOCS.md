# BluePilot API Documentation

## Overview

BluePilot API provides hands-free DeFi trading with AI-powered intent parsing, policy enforcement, and instant x402 payments. No API keys, no signups—just pay with USDC and trade.

**Real-time data powered by:**
- **CoinGecko API** - Live token prices and USD conversions
- **Base L2 Blockchain** - Direct smart contract calls for trade simulation
- **Event Monitoring** - Real-time token launch tracking

**Base URL:** `https://api.bluepilot.xyz/api/agent` (or `http://localhost:3000/api/agent` for local)

**Deployed Contracts (Base Sepolia):**
- VaultRouter: `0xB17C9849ef7d21C7c771128be7Dd852f7D5298a9`
- TradeExecutor: `0x856d02e138f8707cA90346c657A537e8C67475E0`

## Authentication

BluePilot uses **x402 Payment Required** protocol. Include payment headers in requests:

```
X-Payment-Address: 0xYourWalletAddress
X-Payment-Signature: <signature>
X-Payment-Amount: <USDC amount in wei>
```

Or use the SDK which handles payments automatically.

## Endpoints

### 🔹 POST /simulate

Simulate a trade with complete analysis including USD values, price impact, gas estimates, and ready-to-sign transaction.

**Cost:** $0.001 USDC

**Request:**
```json
{
  "command": "swap 0.1 ETH for USDC",
  "userAddress": "0x..." // optional, for policy check
}
```

**Response:**
```json
{
  "intent": {
    "tokenIn": "0x0000000000000000000000000000000000000000",
    "tokenOut": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    "amountIn": "100000000000000000"
  },
  "simulation": {
    "amountOut": "150000000",
    "amountOutUSD": "$150.00",
    "priceImpact": "0.15%",
    "gasEstimate": "200000",
    "route": ["ETH", "USDC"],
    "bestDex": "Uniswap V2"
  },
  "prices": {
    "0x0000000000000000000000000000000000000000": 1500.00,
    "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913": 1.00
  },
  "policy": {
    "compliant": true,
    "violations": []
  },
  "readyToSign": {
    "to": "0xVaultRouter",
    "data": "0x...",
    "value": "100000000000000000"
  }
}
```

---

### 🔹 POST /execute

Parse command, check policy, and prepare transaction for execution.

**Cost:** $0.005 USDC

**Request:**
```json
{
  "command": "swap 0.1 ETH for USDC",
  "userAddress": "0x..."
}
```

**Response:**
```json
{
  "intent": { ... },
  "transaction": {
    "to": "0xVaultRouter",
    "data": "0x...",
    "value": "100000000000000000"
  },
  "message": "Transaction prepared. User must sign and submit."
}
```

**Errors:**
- `400` - Policy violation
- `500` - Execution error

---

### 🔹 GET /policy/:address

Retrieve user's on-chain trading policy.

**Cost:** $0.0005 USDC

**Response:**
```json
{
  "maxSlippageBps": 300,
  "maxTradeSize": "1000000000000000000",
  "cooldownSeconds": 60,
  "lastTradeTimestamp": 1707667200,
  "tokenAllowlist": ["0x..."]
}
```

---

### 🔹 POST /policy/set

Prepare transaction to update user's trading policy.

**Cost:** $0.0005 USDC

**Request:**
```json
{
  "userAddress": "0x...",
  "maxSlippageBps": 300,
  "maxTradeSize": "1000000000000000000",
  "cooldownSeconds": 60,
  "tokenAllowlist": ["0x..."]
}
```

**Response:**
```json
{
  "transaction": {
    "to": "0xVaultRouter",
    "data": "0x..."
  }
}
```

---

### 🔹 GET /portfolio/:address

Get all vault balances with USD values and total portfolio value.

**Cost:** $0.001 USDC

**Query Parameters:**
- `tokens` - Comma-separated token addresses

**Example:** `/portfolio/0x123?tokens=0xETH,0xUSDC`

**Response:**
```json
{
  "address": "0x...",
  "portfolio": [
    {
      "token": "0x...",
      "symbol": "ETH",
      "balance": "1000000000000000000",
      "usdValue": "$1500.00"
    }
  ],
  "totalUSD": "$1500.00"
}
```

---

### 🔹 GET /price/:token

Get current token price in USD from **CoinGecko API**.

**Cost:** FREE

**Response:**
```json
{
  "token": "0x...",
  "price": 1500.00
}
```

---

### 🔹 GET /alerts

Get token launch notifications from monitored contracts.

**Cost:** FREE

**Response:**
```json
{
  "alerts": [
    {
      "token": "0x...",
      "creator": "0x...",
      "name": "NewToken",
      "symbol": "NEW",
      "timestamp": 1707667200,
      "blockNumber": 12345678
    }
  ],
  "count": 1
}
```

---

## SDK Usage

### Installation

```bash
npm install @bluepilot/sdk ethers
```

### Quick Start

```typescript
import { BluePilotClient } from '@bluepilot/sdk';

const client = new BluePilotClient({
  privateKey: process.env.PRIVATE_KEY,
  x402Enabled: true
});

// Simulate trade
const sim = await client.simulate("swap 0.1 ETH for USDC");
console.log(`Expected output: ${sim.simulation.amountOutUSD}`);

// Execute trade (auto-signs and submits)
const result = await client.simulateAndExecute("swap 0.1 ETH for USDC");
console.log(`Trade executed! TX: ${result.txHash}`);

// Get portfolio
const portfolio = await client.getPortfolio(
  "0x...",
  ["0xETH", "0xUSDC"]
);
console.log(`Total value: ${portfolio.totalUSD}`);

// Update policy
await client.setPolicy("0x...", {
  maxSlippageBps: 500,
  maxTradeSize: "2000000000000000000"
});
```

---

## Pricing Summary

| Endpoint | Price | Description |
|----------|-------|-------------|
| `/simulate` | $0.001 | Full trade analysis + ready-to-sign tx |
| `/execute` | $0.005 | AI parsing + policy check + tx encoding |
| `/policy/:address` | $0.0005 | On-chain policy retrieval |
| `/policy/set` | $0.0005 | Policy update tx preparation |
| `/portfolio/:address` | $0.001 | All balances + USD values |
| `/price/:token` | FREE | Current token price |
| `/alerts` | FREE | Token launch notifications |

---

## Error Codes

- `400` - Bad request (invalid command, policy violation)
- `402` - Payment required (x402 payment missing/invalid)
- `500` - Server error (contract call failed, network issue)

---

## Rate Limits

No rate limits when using x402 payments. Each request is individually paid.

---

## Support

- GitHub: https://github.com/yourusername/bluepilot
- Discord: https://discord.gg/bluepilot
- Email: support@bluepilot.xyz
