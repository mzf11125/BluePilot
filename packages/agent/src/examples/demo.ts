import { BluePilotClient } from './sdk/BluePilotClient';

async function main() {
  // Initialize client with your private key
  const client = new BluePilotClient({
    baseUrl: 'http://localhost:3000/api/agent',
    privateKey: process.env.PRIVATE_KEY,
    x402Enabled: true
  });

  console.log('🚀 BluePilot API Demo\n');

  // 1. Simulate a trade
  console.log('1️⃣ Simulating trade...');
  const simulation = await client.simulate('swap 0.1 ETH for USDC');
  console.log(`   Expected output: ${simulation.simulation.amountOutUSD}`);
  console.log(`   Price impact: ${simulation.simulation.priceImpact}`);
  console.log(`   Policy compliant: ${simulation.policy.compliant}\n`);

  // 2. Check current policy
  console.log('2️⃣ Checking policy...');
  const policy = await client.getPolicy('0xYourAddress');
  console.log(`   Max trade size: ${policy.maxTradeSize}`);
  console.log(`   Max slippage: ${policy.maxSlippageBps / 100}%`);
  console.log(`   Cooldown: ${policy.cooldownSeconds}s\n`);

  // 3. Update policy
  console.log('3️⃣ Updating policy...');
  const policyTx = await client.setPolicy('0xYourAddress', {
    maxSlippageBps: 500,
    maxTradeSize: '2000000000000000000',
    cooldownSeconds: 30
  });
  console.log(`   Transaction prepared: ${policyTx.transaction.to}\n`);

  // 4. Get portfolio
  console.log('4️⃣ Fetching portfolio...');
  const portfolio = await client.getPortfolio('0xYourAddress', [
    '0x0000000000000000000000000000000000000000', // ETH
    '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'  // USDC
  ]);
  console.log(`   Total value: ${portfolio.totalUSD}`);
  portfolio.portfolio.forEach(item => {
    console.log(`   - ${item.symbol}: ${item.usdValue}`);
  });
  console.log();

  // 5. Get token price
  console.log('5️⃣ Getting ETH price...');
  const price = await client.getPrice('ethereum');
  console.log(`   ETH: $${price.price}\n`);

  // 6. Check alerts
  console.log('6️⃣ Checking token alerts...');
  const alerts = await client.getAlerts();
  console.log(`   ${alerts.count} new token launches\n`);

  // 7. Execute trade (one-liner!)
  console.log('7️⃣ Executing trade...');
  const result = await client.simulateAndExecute('swap 0.01 ETH for USDC');
  console.log(`   ✅ Trade executed!`);
  console.log(`   TX: ${result.txHash}`);
  console.log(`   Block: ${result.blockNumber}`);
}

main().catch(console.error);
