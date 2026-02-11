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
          <div>curl -X POST https://api.bluepilot.xyz/agent/trade \</div>
          <div className="ml-4">-H &quot;Content-Type: application/json&quot; \</div>
          <div className="ml-4">-d &apos;{`{"intent": "swap 0.5 ETH for USDC"}`}&apos;</div>
        </div>
      </Card>

      {/* Base URL */}
      <Card>
        <h2 className="text-xl font-bold mb-3">Base URL</h2>
        <div className="bg-sky-50 p-3 border-2 border-black font-mono">
          https://api.bluepilot.xyz
        </div>
      </Card>

      {/* Endpoints */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Endpoints</h2>

        {/* Trade Intent */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-green-400 border-2 border-black font-bold text-sm">POST</span>
            <code className="font-mono">/agent/trade</code>
          </div>
          <p className="text-sm mb-3">Execute a trade via natural language</p>
          
          <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto mb-2">
            <div>{`{`}</div>
            <div className="ml-4">&quot;intent&quot;: &quot;swap 0.5 ETH for USDC&quot;,</div>
            <div className="ml-4">&quot;walletAddress&quot;: &quot;0x...&quot;</div>
            <div>{`}`}</div>
          </div>
          
          <div className="bg-gray-900 text-blue-400 p-3 rounded font-mono text-xs overflow-x-auto">
            <div>{`{`}</div>
            <div className="ml-4">&quot;success&quot;: true,</div>
            <div className="ml-4">&quot;simulation&quot;: {`{`}</div>
            <div className="ml-8">&quot;outputAmount&quot;: &quot;1250&quot;,</div>
            <div className="ml-8">&quot;slippage&quot;: 1.2,</div>
            <div className="ml-8">&quot;gasEstimate&quot;: &quot;0.002&quot;</div>
            <div className="ml-4">{`}`},</div>
            <div className="ml-4">&quot;txHash&quot;: &quot;0x...&quot;</div>
            <div>{`}`}</div>
          </div>
        </div>

        {/* Policy Update */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-yellow-400 border-2 border-black font-bold text-sm">PUT</span>
            <code className="font-mono">/agent/policy</code>
          </div>
          <p className="text-sm mb-3">Update trading policy</p>
          
          <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto mb-2">
            <div>{`{`}</div>
            <div className="ml-4">&quot;intent&quot;: &quot;set max slippage to 3%&quot;,</div>
            <div className="ml-4">&quot;walletAddress&quot;: &quot;0x...&quot;</div>
            <div>{`}`}</div>
          </div>
        </div>

        {/* Query */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-blue-400 border-2 border-black font-bold text-sm">GET</span>
            <code className="font-mono">/agent/query</code>
          </div>
          <p className="text-sm mb-3">Query balances, history, or policy</p>
          
          <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto mb-2">
            <div>?intent=show my balance&wallet=0x...</div>
          </div>
        </div>
      </Card>

      {/* AI Agent Integration */}
      <Card>
        <h2 className="text-xl font-bold mb-3">AI Agent Integration</h2>
        <p className="text-sm mb-4">BluePilot can be integrated into any AI agent or chatbot:</p>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-bold mb-2">1. Natural Language Processing</h3>
            <p className="text-sm text-gray-600 mb-2">Send user intents directly:</p>
            <div className="bg-sky-50 p-3 border-2 border-black font-mono text-xs">
              "I want to swap 0.5 ETH for USDC"
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-2">2. Structured Commands</h3>
            <p className="text-sm text-gray-600 mb-2">Or use structured format:</p>
            <div className="bg-sky-50 p-3 border-2 border-black font-mono text-xs">
              {`{ "action": "swap", "from": "ETH", "to": "USDC", "amount": "0.5" }`}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-2">3. Policy Enforcement</h3>
            <p className="text-sm text-gray-600">All trades are validated against on-chain policies before execution</p>
          </div>
        </div>
      </Card>

      {/* Supported Commands */}
      <Card>
        <h2 className="text-xl font-bold mb-3">Supported Commands</h2>
        
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
              <li>• set max slippage to [number]</li>
              <li>• set max trade size to [number]</li>
              <li>• set cooldown to [number]</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm mb-1">Queries</h3>
            <ul className="text-sm space-y-1 font-mono text-gray-600">
              <li>• show my balance</li>
              <li>• show my recent trades</li>
              <li>• show my current policy</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Authentication */}
      <Card>
        <h2 className="text-xl font-bold mb-3">Authentication</h2>
        <p className="text-sm mb-3">Use wallet signatures for authentication:</p>
        
        <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto">
          <div>curl -X POST https://api.bluepilot.xyz/agent/trade \</div>
          <div className="ml-4">-H &quot;X-Wallet-Address: 0x...&quot; \</div>
          <div className="ml-4">-H &quot;X-Signature: 0x...&quot; \</div>
          <div className="ml-4">-d &apos;{`{"intent": "swap 0.5 ETH for USDC"}`}&apos;</div>
        </div>
      </Card>

      {/* Rate Limits */}
      <Card>
        <h2 className="text-xl font-bold mb-3">Rate Limits</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between p-2 bg-sky-50 border-2 border-black">
            <span className="font-bold">Free Tier</span>
            <span>100 requests/hour</span>
          </div>
          <div className="flex justify-between p-2 bg-sky-50 border-2 border-black">
            <span className="font-bold">Pro Tier</span>
            <span>1000 requests/hour</span>
          </div>
        </div>
      </Card>

      {/* Example Integration */}
      <Card>
        <h2 className="text-xl font-bold mb-3">Example: ChatGPT Plugin</h2>
        
        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto">
          <div className="text-gray-500">// ChatGPT Plugin Integration</div>
          <div>async function executeTrade(intent) {`{`}</div>
          <div className="ml-4">const response = await fetch(</div>
          <div className="ml-8">&apos;https://api.bluepilot.xyz/agent/trade&apos;,</div>
          <div className="ml-8">{`{`}</div>
          <div className="ml-12">method: &apos;POST&apos;,</div>
          <div className="ml-12">headers: {`{`}</div>
          <div className="ml-16">&apos;Content-Type&apos;: &apos;application/json&apos;,</div>
          <div className="ml-16">&apos;X-Wallet-Address&apos;: userWallet</div>
          <div className="ml-12">{`}`},</div>
          <div className="ml-12">body: JSON.stringify({`{`} intent {`}`})</div>
          <div className="ml-8">{`}`}</div>
          <div className="ml-4">);</div>
          <div className="ml-4">return await response.json();</div>
          <div>{`}`}</div>
        </div>
      </Card>

      {/* Support */}
      <Card className="bg-sky-50">
        <h2 className="text-xl font-bold mb-3">Need Help?</h2>
        <div className="space-y-2 text-sm">
          <p>📧 Email: <a href="mailto:api@bluepilot.xyz" className="font-bold text-sky-600 hover:underline">api@bluepilot.xyz</a></p>
          <p>📚 GitHub: <a href="https://github.com/bluepilot" className="font-bold text-sky-600 hover:underline">github.com/bluepilot</a></p>
          <p>💬 Discord: <a href="https://discord.gg/bluepilot" className="font-bold text-sky-600 hover:underline">discord.gg/bluepilot</a></p>
        </div>
      </Card>
    </div>
      </div>
    </div>
  );
};
