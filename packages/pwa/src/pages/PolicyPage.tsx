import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card } from '../components/ui/Card';
import { parseIntent } from '../lib/intentParser';

export const PolicyPage = () => {
  const { policy, updatePolicy } = useApp();
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleCommand = () => {
    if (!input.trim()) return;
    
    const intent = parseIntent(input.trim());
    
    if (intent.type === 'policy') {
      switch (intent.action) {
        case 'update_slippage':
          updatePolicy({ ...policy, maxSlippage: intent.params!.maxSlippage });
          setFeedback(`✓ Max slippage updated to ${intent.params!.maxSlippage}%`);
          break;
        case 'update_trade_size':
          updatePolicy({ ...policy, maxTradeSize: intent.params!.maxTradeSize });
          setFeedback(`✓ Max trade size updated to ${intent.params!.maxTradeSize} ETH`);
          break;
        case 'update_cooldown':
          updatePolicy({ ...policy, cooldown: intent.params!.cooldown });
          setFeedback(`✓ Cooldown updated to ${intent.params!.cooldown} minutes`);
          break;
      }
    } else if (intent.type === 'query' && intent.action === 'show_policy') {
      setFeedback('See current policy below ↓');
    } else {
      setFeedback('Try: "set max slippage to 3%" or "set cooldown to 10"');
    }
    
    setInput('');
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Current Policy Display */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Current Policy</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-sky-50 border-2 border-black">
            <span className="font-bold">Max Slippage</span>
            <span className="text-lg">{policy.maxSlippage}%</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-sky-50 border-2 border-black">
            <span className="font-bold">Max Trade Size</span>
            <span className="text-lg">{policy.maxTradeSize} ETH</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-sky-50 border-2 border-black">
            <span className="font-bold">Cooldown</span>
            <span className="text-lg">{policy.cooldown} min</span>
          </div>
          <div className="p-3 bg-sky-50 border-2 border-black">
            <span className="font-bold block mb-2">Allowed Tokens</span>
            <div className="flex flex-wrap gap-2">
              {policy.allowedTokens.map(token => (
                <span key={token} className="px-3 py-1 bg-white border-2 border-black font-bold">
                  {token}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Update via Chat */}
      <Card>
        <h3 className="font-bold mb-3">Quick Update</h3>
        <div className="space-y-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCommand()}
            placeholder='Try: "set max slippage to 3%"'
            className="w-full px-4 py-3 border-3 border-black font-mono"
          />
          <button
            onClick={handleCommand}
            className="w-full px-4 py-3 bg-sky border-3 border-black font-bold hover:translate-x-1 hover:translate-y-1 transition-transform"
          >
            Update
          </button>
          {feedback && (
            <div className="p-3 bg-green-100 border-2 border-green-500 font-bold">
              {feedback}
            </div>
          )}
        </div>
      </Card>

      {/* Help */}
      <Card className="bg-sky-50">
        <h3 className="font-bold mb-2">💡 Quick Commands</h3>
        <ul className="text-sm space-y-1 font-mono">
          <li>• set max slippage to 3</li>
          <li>• set max trade size to 2</li>
          <li>• set cooldown to 10</li>
        </ul>
      </Card>
    </div>
  );
};
