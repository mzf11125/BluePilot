import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { parseIntent } from '../lib/intentParser';

export const HistoryPage = () => {
  const { transactions } = useApp();
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<string | null>(null);

  const handleQuery = () => {
    if (!input.trim()) return;
    
    const intent = parseIntent(input.trim());
    
    if (intent.type === 'query') {
      if (intent.action === 'show_history') {
        setFilter(null);
      } else if (intent.action === 'show_transaction' && intent.params?.hash) {
        setFilter(intent.params.hash);
      }
    }
    
    setInput('');
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'success';
    }
  };

  const filteredTxs = filter 
    ? transactions.filter(tx => tx.hash.includes(filter))
    : transactions;

  return (
    <div className="space-y-4">
      {/* Quick Search */}
      <Card>
        <div className="space-y-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
            placeholder='Try: "show my recent trades" or "show transaction 0x..."'
            className="w-full px-4 py-3 border-3 border-black font-mono text-sm"
          />
          <button
            onClick={handleQuery}
            className="w-full px-4 py-2 bg-sky border-3 border-black font-bold hover:translate-x-1 hover:translate-y-1 transition-transform"
          >
            Search
          </button>
        </div>
      </Card>

      {/* Transaction List */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">
            {filter ? 'Search Results' : 'All Transactions'}
          </h2>
          {filter && (
            <button
              onClick={() => setFilter(null)}
              className="text-sm font-bold text-sky hover:underline"
            >
              Clear
            </button>
          )}
        </div>

        {filteredTxs.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-xl font-bold text-gray-400">
              {filter ? 'No matching transactions' : 'No transactions yet'}
            </p>
            <p className="text-gray-500 mt-2">
              {filter ? 'Try a different search' : 'Your trades will appear here'}
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredTxs.slice().reverse().map(tx => (
              <Card key={tx.hash} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-lg mb-1">
                      {tx.fromAmount} {tx.from} → {tx.toAmount} {tx.to}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(tx.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant={getStatusVariant(tx.status)}>
                    {tx.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm font-mono">
                  <span className="text-gray-600">
                    {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                  </span>
                  <a
                    href={`https://basescan.org/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky font-bold hover:underline"
                  >
                    View →
                  </a>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
