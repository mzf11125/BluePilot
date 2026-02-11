import { ethers } from 'ethers';

/**
 * Generate x402 payment signature for API access
 * 
 * @param privateKey - User's private key (with 0x prefix)
 * @param payTo - Recipient wallet address
 * @param amount - Amount in USDC (e.g., "0.001")
 * @param usdcAddress - USDC contract address
 * @param chainId - Chain ID (e.g., 84532 for Base Sepolia)
 * @returns Base64 encoded payment signature header
 */
export async function generateX402Payment(
  privateKey: string,
  payTo: string,
  amount: string,
  usdcAddress: string,
  chainId: number
): Promise<string> {
  const wallet = new ethers.Wallet(privateKey);
  const amountWei = ethers.parseUnits(amount, 6); // USDC has 6 decimals
  const timestamp = Math.floor(Date.now() / 1000);

  // EIP-712 domain
  const domain = {
    name: 'x402 Payment',
    version: '2',
    chainId: chainId,
    verifyingContract: usdcAddress
  };

  // EIP-712 types
  const types = {
    Payment: [
      { name: 'payer', type: 'address' },
      { name: 'payTo', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'asset', type: 'address' },
      { name: 'timestamp', type: 'uint256' }
    ]
  };

  // Payment data
  const value = {
    payer: wallet.address,
    payTo: payTo,
    amount: amountWei.toString(),
    asset: usdcAddress,
    timestamp: timestamp
  };

  // Sign the typed data
  const signature = await wallet.signTypedData(domain, types, value);

  // Create payment proof
  const proof = {
    x402Version: 2,
    payer: wallet.address,
    payTo: payTo,
    amount: amountWei.toString(),
    asset: usdcAddress,
    network: `eip155:${chainId}`,
    signature: signature,
    timestamp: timestamp
  };

  // Encode as base64
  const encoded = Buffer.from(JSON.stringify(proof)).toString('base64');
  return encoded;
}

// Example usage
async function example() {
  const payment = await generateX402Payment(
    '0xYourPrivateKeyHere',
    '0xRecipientAddressHere',
    '0.001',
    '0x036CbD53842c5426634e7929541eC2318f3dCF7e', // USDC on Base Sepolia
    84532 // Base Sepolia chain ID
  );

  console.log('Payment Header:', payment);
  console.log('\nUse this in your API request:');
  console.log(`curl -H "PAYMENT-SIGNATURE: ${payment}" http://localhost:3000/api/agent/simulate`);
}

// Uncomment to run example
// example();
