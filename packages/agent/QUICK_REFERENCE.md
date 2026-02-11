# BluePilot API Quick Reference

## 🚀 5-Minute Quickstart

```typescript
import { BluePilotClient } from '@bluepilot/sdk';

const client = new BluePilotClient({
  privateKey: process.env.PRIVATE_KEY
});

// Trade in one line
await client.simulateAndExecute("swap 0.1 ETH for USDC");
```

## 📡 Endpoints

```
POST   /api/agent/simulate              $0.001  - Full trade analysis
POST   /api/agent/execute               $0.005  - Prepare trade tx
POST   /api/agent/batch/simulate        $0.002  - Batch analysis (up to 10)
POST   /api/agent/batch/execute         $0.01   - Batch execution (~30% gas)
GET    /api/agent/policy/:address       $0.0005 - Get user policy
POST   /api/agent/policy/set            $0.0005 - Update policy
GET    /api/agent/portfolio/:address    $0.001  - Get balances
GET    /api/agent/price/:token          FREE    - Token price
GET    /api/agent/alerts                FREE    - Token launches
```

## 💡 Common Use Cases

### Simulate Trade
```typescript
const sim = await client.simulate("swap 0.1 ETH for USDC");
console.log(sim.simulation.amountOutUSD);  // "$150.00"
console.log(sim.simulation.priceImpact);   // "0.15%"
```

### Execute Trade
```typescript
const result = await client.simulateAndExecute("swap 0.1 ETH for USDC");
console.log(result.txHash);  // "0x..."
```

### Check Policy
```typescript
const policy = await client.getPolicy("0xYourAddress");
console.log(policy.maxTradeSize);      // "1000000000000000000"
console.log(policy.maxSlippageBps);    // 300 (3%)
```

### Update Policy
```typescript
await client.setPolicy("0xYourAddress", {
  maxSlippageBps: 500,           // 5% max slippage
  maxTradeSize: "2000000000000000000",  // 2 ETH max
  cooldownSeconds: 30,           // 30s between trades
  tokenAllowlist: ["0x..."]     // Only allow specific tokens
});
```

### Get Portfolio
```typescript
const portfolio = await client.getPortfolio("0xYourAddress", [
  "0x0000000000000000000000000000000000000000",  // ETH
  "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"   // USDC
]);
console.log(portfolio.totalUSD);  // "$1500.00"
```

### Get Token Price
```typescript
const price = await client.getPrice("ethereum");
console.log(price.price);  // 1500.00
```

### Monitor Token Launches
```typescript
const alerts = await client.getAlerts();
alerts.alerts.forEach(alert => {
  console.log(`New token: ${alert.symbol} at ${alert.token}`);
});
```

### Batch Trading (Gas Savings)
```typescript
// Execute multiple trades in one transaction
const batch = await client.batchSimulateAndExecute([
  "swap 0.1 ETH for USDC",
  "swap 0.05 ETH for DAI",
  "swap 100 USDC for WETH"
]);
console.log(`Gas savings: ${batch.gasSavings}`); // "~30%"
```

## 🔐 x402 Payments

No API keys needed! Just include payment headers:

```bash
curl -X POST https://api.bluepilot.xyz/api/agent/simulate \
  -H "Content-Type: application/json" \
  -H "X-Payment-Address: 0xYourAddress" \
  -H "X-Payment-Signature: 0x..." \
  -H "X-Payment-Amount: 1000" \
  -d '{"command": "swap 0.1 ETH for USDC"}'
```

Or use the SDK which handles payments automatically.

## 💰 Pricing

| Action | Cost | What You Get |
|--------|------|--------------|
| Simulate | $0.001 | Full analysis + ready-to-sign tx |
| Execute | $0.005 | AI parsing + policy check + tx |
| Batch Simulate | $0.002 | Batch analysis (up to 10 trades) |
| Batch Execute | $0.01 | Batch execution (~30% gas savings) |
| Policy Get | $0.0005 | On-chain policy data |
| Policy Set | $0.0005 | Policy update tx |
| Portfolio | $0.001 | All balances + USD values |
| Price | FREE | Current token price |
| Alerts | FREE | Token launch notifications |

## 🛠️ Error Handling

```typescript
try {
  const result = await client.simulateAndExecute("swap 0.1 ETH for USDC");
} catch (error) {
  if (error.message.includes('Policy violation')) {
    console.log('Trade exceeds your limits');
  } else if (error.message.includes('Payment required')) {
    console.log('Insufficient USDC for payment');
  } else {
    console.log('Trade failed:', error.message);
  }
}
```

## 📚 Resources

- **Full Docs**: [API_DOCS.md](./API_DOCS.md)
- **x402 Setup**: [X402_INTEGRATION.md](./X402_INTEGRATION.md)
- **Example Code**: [src/examples/demo.ts](./src/examples/demo.ts)
- **GitHub**: https://github.com/yourusername/bluepilot

## 🆘 Support

- Discord: https://discord.gg/bluepilot
- Email: support@bluepilot.xyz
- Issues: https://github.com/yourusername/bluepilot/issues
