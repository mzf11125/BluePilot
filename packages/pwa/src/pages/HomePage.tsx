import { useApp } from '../contexts/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { formatAmount } from '../lib/mockData';

export const HomePage = () => {
  const { tokens, transactions } = useApp();

  const totalValue = tokens.reduce((sum, token) => sum + token.usdValue, 0);
  const recentTrades = transactions.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Portfolio Value */}
      <Card>
        <h2 className="text-lg font-bold mb-2">Total Portfolio</h2>
        <p className="text-4xl font-bold text-sky">${formatAmount(totalValue)}</p>
      </Card>

      {/* Token List */}
      <div>
        <h2 className="text-xl font-bold mb-4">Your Tokens</h2>
        <div className="space-y-3">
          {tokens.map(token => (
            <Card key={token.symbol} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">{token.symbol}</p>
                  <p className="text-sm text-gray-600">{token.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{token.balance} {token.symbol}</p>
                  <p className="text-sm text-gray-600">${formatAmount(token.usdValue)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Trades */}
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Trades</h2>
        <div className="space-y-3">
          {recentTrades.map(tx => (
            <Card key={tx.hash} className="p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="font-bold">
                  {tx.fromAmount} {tx.from} → {tx.toAmount} {tx.to}
                </p>
                <Badge variant="success">{tx.status}</Badge>
              </div>
              <p className="text-sm text-gray-600 font-mono">
                {new Date(tx.timestamp).toLocaleString()}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
