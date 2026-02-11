# x402 Quick Start

## 1. Configure (30 seconds)

Edit `.env`:
```env
X402_WALLET_ADDRESS=0xYourWalletAddressHere
```

## 2. Get Test USDC (2 minutes)

Visit: https://faucet.circle.com/
- Select **Base Sepolia**
- Enter your wallet address
- Get free test USDC

## 3. Start Server

```bash
npm run build
npm start
```

Look for: `💰 x402 payment enabled`

## 4. Test Without Payment

```bash
curl -X POST http://localhost:3000/api/agent/simulate \
  -H "Content-Type: application/json" \
  -d '{"command": "swap 0.1 ETH for USDC"}'
```

Response: **402 Payment Required** ✅

## 5. Generate Payment

```typescript
import { generateX402Payment } from './utils/generatePayment';

const payment = await generateX402Payment(
  '0xYourPrivateKey',
  '0xYourWalletAddress', // From .env
  '0.001',
  '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  84532
);

console.log(payment); // Copy this
```

## 6. Test With Payment

```bash
curl -X POST http://localhost:3000/api/agent/simulate \
  -H "Content-Type: application/json" \
  -H "PAYMENT-SIGNATURE: <paste-payment-here>" \
  -d '{"command": "swap 0.1 ETH for USDC"}'
```

Response: **200 OK** with trade data ✅

## Pricing

- `/simulate` = $0.001
- `/execute` = $0.005  
- `/policy/:address` = $0.0005
- `/price/:token` = FREE
- `/alerts` = FREE

## Done! 🎉

Your API now accepts crypto payments.

Full docs: `X402_INTEGRATION.md`
