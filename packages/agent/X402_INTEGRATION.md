# x402 Payment Integration

BluePilot Agent API now supports **x402 payment protocol** for pay-per-use API access. Users pay with USDC on Base Sepolia for each API call.

## What is x402?

x402 is an HTTP-native payment protocol that uses the `402 Payment Required` status code. Instead of subscriptions or API keys, users pay with cryptocurrency for each request.

**Benefits:**
- No accounts or subscriptions needed
- Pay only for what you use
- Instant, on-chain payments
- Works with AI agents and autonomous systems

## Payment Pricing

| Endpoint | Price (USDC) | Description |
|----------|--------------|-------------|
| `POST /api/agent/simulate` | $0.001 | Simulate a trade |
| `POST /api/agent/execute` | $0.005 | Prepare transaction |
| `GET /api/agent/policy/:address` | $0.0005 | Get user policy |
| `GET /api/agent/price/:token` | FREE | Get token price |
| `GET /api/agent/alerts` | FREE | Get token alerts |

## Setup

### 1. Configure Your Wallet

Update `.env` with your receiving wallet address:

```env
X402_WALLET_ADDRESS=0xYourWalletAddressHere
X402_USDC_ADDRESS=0x036CbD53842c5426634e7929541eC2318f3dCF7e
X402_CHAIN_ID=eip155:84532
X402_DEFAULT_AMOUNT=0.001
```

### 2. Get Test USDC

Get free test USDC from Circle's faucet:
https://faucet.circle.com/

Select **Base Sepolia** network and enter your wallet address.

## How It Works

### Step 1: Call API Without Payment

```bash
curl -X POST http://localhost:3000/api/agent/simulate \
  -H "Content-Type: application/json" \
  -d '{"command": "swap 0.1 ETH for USDC"}'
```

### Step 2: Receive 402 Payment Required

```json
{
  "x402Version": 2,
  "error": "Payment required to access this resource",
  "resource": {
    "url": "http://localhost:3000/api/agent/simulate",
    "description": "Payment required for /api/agent/simulate",
    "mimeType": "application/json"
  },
  "accepts": [
    {
      "scheme": "exact",
      "network": "eip155:84532",
      "amount": "1000",
      "asset": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      "payTo": "0xYourWalletAddress",
      "maxTimeoutSeconds": 600,
      "extra": {
        "name": "USDC",
        "version": "2"
      }
    }
  ]
}
```

### Step 3: Generate Payment Signature

Use the provided utility to generate a payment signature:

```typescript
import { generateX402Payment } from './utils/generatePayment';

const paymentHeader = await generateX402Payment(
  '0xYourPrivateKey',
  '0xRecipientAddress',
  '0.001', // Amount in USDC
  '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // USDC on Base Sepolia
  84532 // Base Sepolia chain ID
);
```

### Step 4: Retry with Payment Header

```bash
curl -X POST http://localhost:3000/api/agent/simulate \
  -H "Content-Type: application/json" \
  -H "PAYMENT-SIGNATURE: eyJ4NDAyVmVyc2lvbiI6MiwicGF5ZXIiOi..." \
  -d '{"command": "swap 0.1 ETH for USDC"}'
```

### Step 5: Get Successful Response

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

## Client Implementation

### Node.js/TypeScript

```typescript
import axios from 'axios';
import { generateX402Payment } from './utils/generatePayment';

async function callAPI() {
  const url = 'http://localhost:3000/api/agent/simulate';
  
  try {
    // Try without payment first
    const response = await axios.post(url, {
      command: 'swap 0.1 ETH for USDC'
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 402) {
      // Payment required - generate signature
      const paymentInfo = error.response.data.accepts[0];
      
      const paymentHeader = await generateX402Payment(
        process.env.PRIVATE_KEY!,
        paymentInfo.payTo,
        '0.001',
        paymentInfo.asset,
        parseInt(paymentInfo.network.split(':')[1])
      );
      
      // Retry with payment
      const paidResponse = await axios.post(url, {
        command: 'swap 0.1 ETH for USDC'
      }, {
        headers: {
          'PAYMENT-SIGNATURE': paymentHeader
        }
      });
      
      return paidResponse.data;
    }
    throw error;
  }
}
```

### Python

```python
import requests
import json
from eth_account import Account
from eth_account.messages import encode_typed_data
import base64

def generate_payment(private_key, pay_to, amount, usdc_address, chain_id):
    account = Account.from_key(private_key)
    amount_wei = int(float(amount) * 1_000_000)  # USDC has 6 decimals
    timestamp = int(time.time())
    
    # EIP-712 typed data
    typed_data = {
        "types": {
            "EIP712Domain": [
                {"name": "name", "type": "string"},
                {"name": "version", "type": "string"},
                {"name": "chainId", "type": "uint256"},
                {"name": "verifyingContract", "type": "address"}
            ],
            "Payment": [
                {"name": "payer", "type": "address"},
                {"name": "payTo", "type": "address"},
                {"name": "amount", "type": "uint256"},
                {"name": "asset", "type": "address"},
                {"name": "timestamp", "type": "uint256"}
            ]
        },
        "primaryType": "Payment",
        "domain": {
            "name": "x402 Payment",
            "version": "2",
            "chainId": chain_id,
            "verifyingContract": usdc_address
        },
        "message": {
            "payer": account.address,
            "payTo": pay_to,
            "amount": str(amount_wei),
            "asset": usdc_address,
            "timestamp": timestamp
        }
    }
    
    # Sign
    encoded = encode_typed_data(typed_data)
    signature = account.sign_message(encoded).signature.hex()
    
    # Create proof
    proof = {
        "x402Version": 2,
        "payer": account.address,
        "payTo": pay_to,
        "amount": str(amount_wei),
        "asset": usdc_address,
        "network": f"eip155:{chain_id}",
        "signature": signature,
        "timestamp": timestamp
    }
    
    return base64.b64encode(json.dumps(proof).encode()).decode()

# Usage
url = "http://localhost:3000/api/agent/simulate"
response = requests.post(url, json={"command": "swap 0.1 ETH for USDC"})

if response.status_code == 402:
    payment_info = response.json()["accepts"][0]
    payment_header = generate_payment(
        "0xYourPrivateKey",
        payment_info["payTo"],
        "0.001",
        payment_info["asset"],
        int(payment_info["network"].split(":")[1])
    )
    
    response = requests.post(url, 
        json={"command": "swap 0.1 ETH for USDC"},
        headers={"PAYMENT-SIGNATURE": payment_header}
    )
    print(response.json())
```

## Security

- **Private Keys**: Never commit private keys to version control
- **Signature Verification**: All payments are verified using EIP-712 signatures
- **Timestamp Validation**: Payments expire after 10 minutes
- **Amount Verification**: Exact amount matching required
- **Network Verification**: Chain ID must match
- **Recipient Verification**: Payment must be to configured wallet

## Testing

### 1. Start the Server

```bash
cd packages/agent
npm run build
npm start
```

### 2. Test Free Endpoint

```bash
curl http://localhost:3000/api/agent/alerts
```

Should return alerts without payment.

### 3. Test Paid Endpoint

```bash
curl -X POST http://localhost:3000/api/agent/simulate \
  -H "Content-Type: application/json" \
  -d '{"command": "swap 0.1 ETH for USDC"}'
```

Should return 402 Payment Required.

### 4. Generate Payment and Retry

Use the `generatePayment.ts` utility to create a valid payment signature, then retry with the header.

## Troubleshooting

**"Payment verification failed"**
- Check private key is correct
- Verify wallet has USDC on Base Sepolia
- Ensure timestamp hasn't expired (10 min limit)
- Confirm chain ID matches (84532 for Base Sepolia)

**"Invalid signature"**
- EIP-712 domain must match exactly
- Check USDC contract address is correct
- Verify all payment fields are included

**"Amount mismatch"**
- Payment amount must match endpoint requirement exactly
- USDC uses 6 decimals (1 USDC = 1,000,000 units)

## Production Deployment

For production:

1. **Use Mainnet**: Change to Base Mainnet (chain ID 8453)
2. **Update USDC Address**: Use mainnet USDC contract
3. **Secure Wallet**: Use hardware wallet or secure key management
4. **Monitor Payments**: Set up alerts for incoming payments
5. **Add Database**: Store payment records for accounting

## Resources

- **x402 Protocol**: https://www.x402.org/
- **x402 Documentation**: https://x402.gitbook.io/x402
- **Interface402 API**: https://docs.interface402.dev/
- **Circle USDC Faucet**: https://faucet.circle.com/
- **Base Sepolia Explorer**: https://sepolia.basescan.org/

---

Content was rephrased for compliance with licensing restrictions.

References:
[1] x402 Payment Integration with Rails APIs - https://www.quicknode.com/guides/infrastructure/x402-payment-integration-with-rails
[2] Introduction - https://docs.interface402.dev/
