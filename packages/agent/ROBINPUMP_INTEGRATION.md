# RobinPump.fun Integration Documentation

## Overview

BluePilot has full integration with **RobinPump.fun**, a pump.fun-style token launch platform on Base L2. This enables users to discover and trade newly launched tokens in real-time.

## What is RobinPump.fun?

RobinPump.fun is a fair launch token platform on Base L2 featuring:
- Bonding curve pricing mechanism
- No presales or team allocations
- Instant liquidity
- Community-driven token launches
- Similar to pump.fun on Solana

## BluePilot Integration

### 1. Event Monitoring

**EventMonitor Service** (`src/services/EventMonitor.ts`):
- Polls RobinPump Factory contract every 15 seconds
- Listens for `TokenLaunched` events
- Stores last 100 token alerts in memory
- Logs new launches to console

**Configuration:**
```env
ROBINPUMP_FACTORY_ADDRESS=0x236c6ea9DDc48ae72DCFb8724BF8a136aa3C6EBB
TRACKED_TOKEN_ADDRESS=0x07dfaec8e182c5ef79844adc70708c1c15aa60fb
```

### 2. Trading Support

**Smart Contracts:**
- `IRRobinPumpRouter` interface in contracts
- `TradeExecutor` supports `ROBINPUMP` enum for routing
- `VaultRouter` can route trades to RobinPump Router
- Multi-DEX routing: Uniswap V2 + RobinPump

**Trade Flow:**
1. User requests trade via natural language
2. Agent parses intent
3. Contract determines routing (Uniswap or RobinPump)
4. Executes trade through appropriate router

### 3. API Endpoint

**GET /api/agent/alerts** (FREE)

Returns recent token launches from RobinPump:

```json
{
  "alerts": [
    {
      "token": "0x07dfaec8e182c5ef79844adc70708c1c15aa60fb",
      "creator": "0x123...",
      "name": "NewMemeCoin",
      "symbol": "MEME",
      "timestamp": 1707667200,
      "blockNumber": 12345678
    }
  ],
  "count": 1
}
```

## Use Cases

### 1. Token Launch Sniping
```
"buy 0.1 ETH of new tokens on RobinPump"
```
Automatically buy newly launched tokens within policy limits.

### 2. Early Entry Monitoring
```javascript
// Poll alerts endpoint
const alerts = await client.getAlerts();
// Trade immediately after detection
await client.simulateAndExecute(`buy 0.05 ETH of ${alerts[0].token}`);
```

### 3. Trending Token Discovery
```
"show top gainers on RobinPump"
```
Monitor trending tokens for opportunities.

### 4. Automated Strategies
Set policies to auto-buy new launches:
- Max trade size: 0.1 ETH
- Cooldown: 60 seconds
- Token allowlist: RobinPump tokens only

## Architecture

```
Mobile App
    ↓ Natural Language
Agent API
    ├→ Event Monitor
    │   └→ RobinPump Factory (polls every 15s)
    │       └→ TokenLaunched events
    │
    └→ Smart Contracts
        └→ TradeExecutor
            ├→ Uniswap V2 Router
            └→ RobinPump Router
```

## Technical Details

### Event Structure
```solidity
event TokenLaunched(
    address indexed token,
    address indexed creator,
    string name,
    string symbol,
    uint256 timestamp
)
```

### Polling Mechanism
- Interval: 15 seconds
- Method: `queryFilter` on past blocks
- Storage: Last 100 alerts in memory
- Tracking: Monitors specific token address

### Smart Contract Support
- `IRRobinPumpRouter` interface
- `DEXType.ROBINPUMP` enum
- Multi-DEX routing logic
- Policy enforcement for RobinPump trades

## Benefits

1. **Real-Time Discovery** - Detect new tokens within 15 seconds
2. **Immediate Trading** - Trade newly launched tokens instantly
3. **Policy Protection** - All trades respect user-defined limits
4. **Natural Language** - Simple commands like "buy new RobinPump tokens"
5. **FREE Alerts** - No cost to monitor token launches
6. **Multi-DEX** - Seamless routing between Uniswap and RobinPump

## Deployed Addresses (Base Sepolia)

- **RobinPump Factory**: `0x236c6ea9DDc48ae72DCFb8724BF8a136aa3C6EBB`
- **VaultRouter**: `0xB17C9849ef7d21C7c771128be7Dd852f7D5298a9`
- **TradeExecutor**: `0x856d02e138f8707cA90346c657A537e8C67475E0`

## Future Enhancements

- [ ] RobinPump token price feeds
- [ ] Bonding curve analytics
- [ ] Launch success metrics
- [ ] Trending token rankings
- [ ] Creator reputation tracking

## Summary

BluePilot is the **first AI trading agent with native RobinPump.fun support**, enabling users to:
- Monitor token launches in real-time
- Trade new tokens immediately
- Use natural language commands
- Stay protected by on-chain policies

This integration makes BluePilot ideal for memecoin traders and early-stage token investors on Base L2.
