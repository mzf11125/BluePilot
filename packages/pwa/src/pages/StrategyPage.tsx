import { Card } from '../components/ui/Card';

export const StrategyPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Strategy Cheat Sheet</h1>
        <p className="text-gray-600">Advanced commands and trading strategies</p>
      </div>

      {/* RobinPump Strategies */}
      <Card>
        <h2 className="text-xl font-bold mb-4">🚀 RobinPump.fun Strategies</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-bold mb-2">Snipe High Market Cap Coins</h3>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
              buy PEPE when market cap &gt; $1M
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-2">Monitor Trending Tokens</h3>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
              show top gainers on RobinPump
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-2">Auto-Buy New Listings</h3>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
              buy 0.1 ETH of new tokens on RobinPump
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-2">Set Stop-Loss</h3>
            <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
              sell DOGE if price drops 10%
            </div>
          </div>
        </div>
      </Card>

      {/* Prediction Markets */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <h2 className="text-xl font-bold mb-4">🔮 Prediction Markets (Coming Soon)</h2>
        
        <div className="space-y-3">
          <div className="p-3 bg-white border-2 border-black">
            <h3 className="font-bold mb-1">AI-Powered Predictions</h3>
            <p className="text-sm">Get AI predictions on token price movements before trading</p>
            <div className="mt-2 bg-gray-900 text-green-400 p-2 rounded font-mono text-xs">
              predict PEPE price in 24h
            </div>
          </div>

          <div className="p-3 bg-white border-2 border-black">
            <h3 className="font-bold mb-1">Market Sentiment Analysis</h3>
            <p className="text-sm">Real-time sentiment from social media and on-chain data</p>
            <div className="mt-2 bg-gray-900 text-green-400 p-2 rounded font-mono text-xs">
              show sentiment for DOGE
            </div>
          </div>

          <div className="p-3 bg-white border-2 border-black">
            <h3 className="font-bold mb-1">Risk Score</h3>
            <p className="text-sm">AI calculates risk score for each trade</p>
            <div className="mt-2 bg-gray-900 text-green-400 p-2 rounded font-mono text-xs">
              analyze risk for buying SHIB
            </div>
          </div>
        </div>
      </Card>

      {/* Rank-Based Fees */}
      <Card>
        <h2 className="text-xl font-bold mb-4">🏆 Rank-Based Fee Tiers</h2>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-100 border-2 border-black">
            <div>
              <span className="font-bold">Bronze</span>
              <p className="text-sm text-gray-600">0-10 trades</p>
            </div>
            <span className="text-lg font-bold">0.3% fee</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-yellow-100 border-2 border-black">
            <div>
              <span className="font-bold">Silver</span>
              <p className="text-sm text-gray-600">11-50 trades</p>
            </div>
            <span className="text-lg font-bold">0.2% fee</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-yellow-200 border-2 border-black">
            <div>
              <span className="font-bold">Gold</span>
              <p className="text-sm text-gray-600">51-100 trades</p>
            </div>
            <span className="text-lg font-bold">0.15% fee</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-purple-200 border-2 border-black">
            <div>
              <span className="font-bold">Platinum</span>
              <p className="text-sm text-gray-600">100+ trades</p>
            </div>
            <span className="text-lg font-bold">0.1% fee</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-sky-50 border-2 border-black">
          <p className="text-sm font-bold">💡 Trade more to unlock lower fees!</p>
          <p className="text-xs text-gray-600 mt-1">Your current rank: Bronze (3 trades)</p>
        </div>
      </Card>

      {/* Advanced Commands */}
      <Card>
        <h2 className="text-xl font-bold mb-4">⚡ Advanced Commands</h2>
        
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-sm mb-1">Conditional Trading</h3>
            <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-xs">
              buy PEPE if price &lt; $0.001
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm mb-1">Dollar Cost Averaging</h3>
            <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-xs">
              buy $100 of ETH daily for 30 days
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm mb-1">Portfolio Rebalancing</h3>
            <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-xs">
              rebalance portfolio to 50% ETH 50% USDC
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm mb-1">Limit Orders</h3>
            <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-xs">
              sell 1 ETH when price reaches $3000
            </div>
          </div>
        </div>
      </Card>

      {/* Pro Tips */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <h2 className="text-xl font-bold mb-4">💎 Pro Tips</h2>
        
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="font-bold">1.</span>
            <span>Always set max slippage to protect against price manipulation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">2.</span>
            <span>Use cooldown periods to avoid emotional trading</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">3.</span>
            <span>Start with small amounts when trying new strategies</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">4.</span>
            <span>Monitor RobinPump trending page for early opportunities</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">5.</span>
            <span>Trade more to unlock lower fees and better rates</span>
          </li>
        </ul>
      </Card>
    </div>
  );
};
