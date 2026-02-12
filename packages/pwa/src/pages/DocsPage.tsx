import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';

export const DocsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brutalism-bg">
      {/* Header */}
      <div className="bg-white border-b-4 border-black p-4">
        <div className="container mx-auto flex justify-between items-center max-w-4xl">
          <div className="flex items-center gap-2">
            <img src="/plane.svg" alt="BluePilot" className="w-8 h-8" />
            <h1 className="text-xl font-bold">BluePilot API</h1>
          </div>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-sky border-3 border-black font-bold hover:translate-x-1 hover:translate-y-1 transition-transform"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">BluePilot API</h1>
            <p className="text-gray-600">Integration guide for AI agents and developers</p>
          </div>

          {/* Quick Start */}
          <Card>
            <h2 className="text-xl font-bold mb-3">Quick Start</h2>
            <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm overflow-x-auto">
              <div>curl -X POST https://api.bluepilot.xyz/api/agent/simulate \</div>
              <div className="ml-4">-H &quot;Content-Type: application/json&quot; \</div>
              <div className="ml-4">-d &apos;{`{"command": "swap 0.5 ETH for USDC", "userAddress": "0x..."}`}&apos;</div>
            </div>
          </Card>

          {/* Base URL */}
          <Card>
            <h2 className="text-xl font-bold mb-3">Base URL</h2>
            <div className="bg-sky-50 p-3 border-2 border-black font-mono">
              https://api.bluepilot.xyz/api/agent
            </div>
          </Card>

          {/* Error Response Format */}
          <Card>
            <h2 className="text-xl font-bold mb-3">Error Response Format</h2>
            <p className="text-sm mb-3">All errors follow a standardized JSON envelope format:</p>

            <div className="bg-gray-900 text-red-400 p-3 rounded font-mono text-xs overflow-x-auto mb-4">
              <div>{`{`}</div>
              <div className="ml-4">&quot;code&quot;: &quot;RATE_LIMITED&quot;,</div>
              <div className="ml-4">&quot;message&quot;: &quot;Too many requests&quot;,</div>
              <div className="ml-4">&quot;details&quot;: {`{ "retryAfter": 60 }`},</div>
              <div className="ml-4">&quot;retryAfter&quot;: 60</div>
              <div>{`}`}</div>
            </div>

            <h3 className="font-bold text-sm mb-2">Error Codes</h3>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 bg-gray-100 border border-gray-300">
                <span className="text-red-600">BAD_REQUEST</span> - 400
              </div>
              <div className="p-2 bg-gray-100 border border-gray-300">
                <span className="text-red-600">UNAUTHORIZED</span> - 401
              </div>
              <div className="p-2 bg-gray-100 border border-gray-300">
                <span className="text-red-600">VALIDATION_ERROR</span> - 400
              </div>
              <div className="p-2 bg-gray-100 border border-gray-300">
                <span className="text-red-600">RATE_LIMITED</span> - 429
              </div>
              <div className="p-2 bg-gray-100 border border-gray-300">
                <span className="text-red-600">POLICY_VIOLATION</span> - 400
              </div>
              <div className="p-2 bg-gray-100 border border-gray-300">
                <span className="text-red-600">SIMULATION_FAILED</span> - 422
              </div>
              <div className="p-2 bg-gray-100 border border-gray-300">
                <span className="text-red-600">RPC_ERROR</span> - 502
              </div>
              <div className="p-2 bg-gray-100 border border-gray-300">
                <span className="text-red-600">INTERNAL_ERROR</span> - 500
              </div>
            </div>
          </Card>

          {/* Endpoints */}
          <Card>
            <h2 className="text-xl font-bold mb-4">Endpoints</h2>

            {/* Simulate Trade */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-green-400 border-2 border-black font-bold text-sm">POST</span>
                <code className="font-mono">/simulate</code>
                <span className="text-xs text-gray-500">0.001 USDC</span>
              </div>
              <p className="text-sm mb-3">Simulate a trade without executing</p>

              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto mb-2">
                <div>{`{`}</div>
                <div className="ml-4">&quot;command&quot;: &quot;swap 0.5 ETH for USDC&quot;,</div>
                <div className="ml-4">&quot;userAddress&quot;: &quot;0x...&quot; <span className="text-gray-500">// optional</span></div>
                <div>{`}`}</div>
              </div>

              <div className="bg-gray-900 text-blue-400 p-3 rounded font-mono text-xs overflow-x-auto">
                <div>{`{`}</div>
                <div className="ml-4">&quot;intent&quot;: {`{ "tokenIn": "0x...", "tokenOut": "0x...", "amountIn": "500000000000000000" }`},</div>
                <div className="ml-4">&quot;simulation&quot;: {`{ "amountOut": "...", "gasEstimate": "...", "priceImpact": "0.5%" }`},</div>
                <div className="ml-4">&quot;prices&quot;: {`{ "tokenIn": 2500, "tokenOut": 1 }`},</div>
                <div className="ml-4">&quot;policy&quot;: {`{ "compliant": true, "violations": [] }`},</div>
                <div className="ml-4">&quot;readyToSign&quot;: {`{ "to": "0x...", "data": "0x...", "value": "0" }`}</div>
                <div>{`}`}</div>
              </div>
            </div>

            {/* Execute Trade */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-green-400 border-2 border-black font-bold text-sm">POST</span>
                <code className="font-mono">/execute</code>
                <span className="text-xs text-gray-500">0.005 USDC</span>
              </div>
              <p className="text-sm mb-3">Prepare a trade transaction for signing (validates policy first)</p>

              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto mb-2">
                <div>{`{`}</div>
                <div className="ml-4">&quot;command&quot;: &quot;swap 0.5 ETH for USDC&quot;,</div>
                <div className="ml-4">&quot;userAddress&quot;: &quot;0x...&quot;</div>
                <div>{`}`}</div>
              </div>

              <div className="bg-gray-900 text-blue-400 p-3 rounded font-mono text-xs overflow-x-auto mb-2">
                <div>{`{`}</div>
                <div className="ml-4">&quot;intent&quot;: {`{ ... }`},</div>
                <div className="ml-4">&quot;transaction&quot;: {`{ "to": "0x...", "data": "0x...", "value": "0" }`},</div>
                <div className="ml-4">&quot;message&quot;: &quot;Transaction prepared. User must sign and submit.&quot;</div>
                <div>{`}`}</div>
              </div>

              <div className="bg-gray-900 text-red-400 p-3 rounded font-mono text-xs overflow-x-auto">
                <div className="text-gray-500">// Policy violation response</div>
                <div>{`{`}</div>
                <div className="ml-4">&quot;code&quot;: &quot;POLICY_VIOLATION&quot;,</div>
                <div className="ml-4">&quot;message&quot;: &quot;Policy violation&quot;,</div>
                <div className="ml-4">&quot;details&quot;: {`{ "violations": ["Trade size exceeds limit"] }`}</div>
                <div>{`}`}</div>
              </div>
            </div>

            {/* Batch Simulate */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-green-400 border-2 border-black font-bold text-sm">POST</span>
                <code className="font-mono">/batch/simulate</code>
                <span className="text-xs text-gray-500">0.002 USDC</span>
              </div>
              <p className="text-sm mb-3">Simulate multiple trades with ~30% gas savings</p>

              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto">
                <div>{`{`}</div>
                <div className="ml-4">&quot;commands&quot;: [</div>
                <div className="ml-8">&quot;swap 0.5 ETH for USDC&quot;,</div>
                <div className="ml-8">&quot;swap 100 USDC for DAI&quot;</div>
                <div className="ml-4">],</div>
                <div className="ml-4">&quot;userAddress&quot;: &quot;0x...&quot;</div>
                <div>{`}`}</div>
              </div>
            </div>

            {/* Batch Execute */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-green-400 border-2 border-black font-bold text-sm">POST</span>
                <code className="font-mono">/batch/execute</code>
                <span className="text-xs text-gray-500">0.01 USDC</span>
              </div>
              <p className="text-sm mb-3">Prepare batch transaction (max 10 trades)</p>
            </div>

            {/* Get Policy */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-400 border-2 border-black font-bold text-sm">GET</span>
                <code className="font-mono">/policy/:address</code>
                <span className="text-xs text-gray-500">0.0005 USDC</span>
              </div>
              <p className="text-sm mb-3">Get user&apos;s trading policy</p>

              <div className="bg-gray-900 text-blue-400 p-3 rounded font-mono text-xs overflow-x-auto">
                <div>{`{`}</div>
                <div className="ml-4">&quot;maxSlippageBps&quot;: 300,</div>
                <div className="ml-4">&quot;maxTradeSize&quot;: &quot;1000000000000000000&quot;,</div>
                <div className="ml-4">&quot;cooldownSeconds&quot;: 60,</div>
                <div className="ml-4">&quot;lastTradeTimestamp&quot;: 1234567890,</div>
                <div className="ml-4">&quot;tokenAllowlist&quot;: [&quot;0x...&quot;]</div>
                <div>{`}`}</div>
              </div>
            </div>

            {/* Set Policy */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-yellow-400 border-2 border-black font-bold text-sm">POST</span>
                <code className="font-mono">/policy/set</code>
                <span className="text-xs text-gray-500">0.0005 USDC</span>
              </div>
              <p className="text-sm mb-3">Update trading policy</p>

              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto">
                <div>{`{`}</div>
                <div className="ml-4">&quot;userAddress&quot;: &quot;0x...&quot;,</div>
                <div className="ml-4">&quot;maxSlippageBps&quot;: 300, <span className="text-gray-500">// default: 300 (3%)</span></div>
                <div className="ml-4">&quot;maxTradeSize&quot;: &quot;1000000000000000000&quot;, <span className="text-gray-500">// in wei</span></div>
                <div className="ml-4">&quot;cooldownSeconds&quot;: 60,</div>
                <div className="ml-4">&quot;tokenAllowlist&quot;: []</div>
                <div>{`}`}</div>
              </div>
            </div>

            {/* Get Portfolio */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-400 border-2 border-black font-bold text-sm">GET</span>
                <code className="font-mono">/portfolio/:address</code>
                <span className="text-xs text-gray-500">0.001 USDC</span>
              </div>
              <p className="text-sm mb-3">Get vault balances for tokens</p>

              <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto">
                <div>?tokens=0x...,0x...</div>
              </div>

              <div className="bg-gray-900 text-blue-400 p-3 rounded font-mono text-xs overflow-x-auto mt-2">
                <div>{`{`}</div>
                <div className="ml-4">&quot;address&quot;: &quot;0x...&quot;,</div>
                <div className="ml-4">&quot;portfolio&quot;: [{`{ "token": "0x...", "balance": "...", "usdValue": "$100.00" }`}],</div>
                <div className="ml-4">&quot;totalUSD&quot;: &quot;$100.00&quot;</div>
                <div>{`}`}</div>
              </div>
            </div>

            {/* Get Price */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-400 border-2 border-black font-bold text-sm">GET</span>
                <code className="font-mono">/price/:token</code>
                <span className="text-xs text-gray-500">Free</span>
              </div>
              <p className="text-sm mb-3">Get token price from CoinGecko</p>

              <div className="bg-gray-900 text-blue-400 p-3 rounded font-mono text-xs overflow-x-auto">
                <div>{`{ "token": "0x...", "price": 2500.00 }`}</div>
              </div>
            </div>

            {/* Get Alerts */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-400 border-2 border-black font-bold text-sm">GET</span>
                <code className="font-mono">/alerts</code>
                <span className="text-xs text-gray-500">Free</span>
              </div>
              <p className="text-sm mb-3">Get recent token launch alerts</p>

              <div className="bg-gray-900 text-blue-400 p-3 rounded font-mono text-xs overflow-x-auto">
                <div>{`{ "alerts": [...], "count": 5 }`}</div>
              </div>
            </div>
          </Card>

          {/* x402 Payments */}
          <Card>
            <h2 className="text-xl font-bold mb-3">x402 Payments</h2>
            <p className="text-sm mb-3">Premium endpoints require USDC payment via x402 protocol:</p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 bg-sky-50 border-2 border-black">
                <span className="font-bold">GET /price/:token</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between p-2 bg-sky-50 border-2 border-black">
                <span className="font-bold">GET /alerts</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between p-2 bg-sky-50 border-2 border-black">
                <span className="font-bold">GET /policy/:address</span>
                <span>0.0005 USDC</span>
              </div>
              <div className="flex justify-between p-2 bg-sky-50 border-2 border-black">
                <span className="font-bold">POST /policy/set</span>
                <span>0.0005 USDC</span>
              </div>
              <div className="flex justify-between p-2 bg-sky-50 border-2 border-black">
                <span className="font-bold">POST /simulate</span>
                <span>0.001 USDC</span>
              </div>
              <div className="flex justify-between p-2 bg-sky-50 border-2 border-black">
                <span className="font-bold">GET /portfolio/:address</span>
                <span>0.001 USDC</span>
              </div>
              <div className="flex justify-between p-2 bg-sky-50 border-2 border-black">
                <span className="font-bold">POST /batch/simulate</span>
                <span>0.002 USDC</span>
              </div>
              <div className="flex justify-between p-2 bg-sky-50 border-2 border-black">
                <span className="font-bold">POST /execute</span>
                <span>0.005 USDC</span>
              </div>
              <div className="flex justify-between p-2 bg-sky-50 border-2 border-black">
                <span className="font-bold">POST /batch/execute</span>
                <span>0.01 USDC</span>
              </div>
            </div>
          </Card>

          {/* Retry & Rate Limiting */}
          <Card>
            <h2 className="text-xl font-bold mb-3">Retry & Rate Limiting</h2>
            <p className="text-sm mb-3">The API implements exponential backoff for RPC failures:</p>

            <div className="space-y-2 text-sm">
              <div className="p-2 bg-sky-50 border-2 border-black">
                <span className="font-bold">Retry Strategy:</span> Exponential backoff with jitter
              </div>
              <div className="p-2 bg-sky-50 border-2 border-black">
                <span className="font-bold">Max Retries:</span> 3 attempts
              </div>
              <div className="p-2 bg-sky-50 border-2 border-black">
                <span className="font-bold">Base Delay:</span> 1 second
              </div>
              <div className="p-2 bg-sky-50 border-2 border-black">
                <span className="font-bold">Max Delay:</span> 30 seconds
              </div>
              <div className="p-2 bg-sky-50 border-2 border-black">
                <span className="font-bold">Retryable Codes:</span> 429, 502, 503, 504
              </div>
            </div>

            <p className="text-sm mt-3 text-gray-600">
              When you receive a <code className="bg-gray-100 px-1">RATE_LIMITED</code> error,
              check the <code className="bg-gray-100 px-1">retryAfter</code> field for the wait time in seconds.
            </p>
          </Card>

          {/* Example Integration */}
          <Card>
            <h2 className="text-xl font-bold mb-3">Example: Full Integration</h2>

            <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto">
              <pre className="whitespace-pre-wrap">{`// Complete trade flow
async function executeTrade(command, userAddress) {
  // 1. Simulate first
  const sim = await fetch('/api/agent/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command, userAddress })
  });
  const simResult = await sim.json();

  // Check for errors
  if (simResult.code) throw new Error(simResult.message);

  // 2. If policy compliant, prepare execution
  if (simResult.policy.compliant) {
    const exec = await fetch('/api/agent/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command, userAddress })
    });
    const execResult = await exec.json();

    // 3. Have user sign the transaction
    await wallet.sendTransaction(execResult.transaction);
  }
}`}</pre>
            </div>
          </Card>

          {/* SIWE Authentication */}
          <Card>
            <h2 className="text-xl font-bold mb-3">SIWE Authentication</h2>
            <p className="text-sm mb-3">Sign in with Ethereum using ERC-6492 compatible signatures:</p>

            <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto">
              <pre className="whitespace-pre-wrap">{`// 1. Request nonce from server
const nonce = crypto.randomUUID();

// 2. Create SIWE message
const message = new SiweMessage({
  domain: window.location.host,
  address: userAddress,
  statement: 'Sign in to BluePilot',
  uri: window.location.origin,
  version: '1',
  chainId: 8453, // Base mainnet
  nonce
}).prepareMessage();

// 3. Request signature
const signature = await wallet.signMessage(message);`}</pre>
            </div>
          </Card>

          {/* Supported Commands */}
          <Card>
            <h2 className="text-xl font-bold mb-3">Supported Natural Language Commands</h2>

            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-sm mb-1">Trading</h3>
                <ul className="text-sm space-y-1 font-mono text-gray-600">
                  <li>• swap [amount] [token] for [token]</li>
                  <li>• trade [amount] [token] to [token]</li>
                  <li>• buy [amount] [token] with [token]</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-sm mb-1">Policy</h3>
                <ul className="text-sm space-y-1 font-mono text-gray-600">
                  <li>• set max slippage to [number]%</li>
                  <li>• set max trade size to [number]</li>
                  <li>• set cooldown to [number] seconds</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Support */}
          <Card className="bg-sky-50">
            <h2 className="text-xl font-bold mb-3">Need Help?</h2>
            <div className="space-y-2 text-sm">
              <p>Email: <a href="mailto:api@bluepilot.xyz" className="font-bold text-sky-600 hover:underline">api@bluepilot.xyz</a></p>
              <p>GitHub: <a href="https://github.com/bluepilot" className="font-bold text-sky-600 hover:underline">github.com/bluepilot</a></p>
              <p>Discord: <a href="https://discord.gg/bluepilot" className="font-bold text-sky-600 hover:underline">discord.gg/bluepilot</a></p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
