import { useState } from 'react';
import { ChatInterface } from '../components/ChatInterface';
import { AdvancedSettings } from '../components/AdvancedSettings';
import { Card } from '../components/ui/Card';

export const TradePage = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const tips = [
    "💡 Snipe coins from RobinPump.fun with high market cap",
    "🎯 Try: 'buy PEPE when market cap > $1M'",
    "⚡ Set stop-loss: 'sell if DOGE drops 10%'",
    "🔥 Monitor trending: 'show top gainers on RobinPump'",
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Tab Toggle */}
      <div className="flex border-b-3 border-black bg-white mb-4">
        <button
          onClick={() => setShowAdvanced(false)}
          className={`flex-1 py-3 font-bold border-r-3 border-black ${
            !showAdvanced ? 'bg-sky-200' : 'bg-white'
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setShowAdvanced(true)}
          className={`flex-1 py-3 font-bold ${showAdvanced ? 'bg-sky-200' : 'bg-white'}`}
        >
          Advanced
        </button>
      </div>

      {/* Trading Tips */}
      {!showAdvanced && (
        <Card className="mb-4 bg-gradient-to-r from-purple-100 to-pink-100">
          <h3 className="font-bold mb-2 text-sm">💡 Quick Tips</h3>
          <div className="space-y-1">
            {tips.map((tip, i) => (
              <p key={i} className="text-xs font-mono">{tip}</p>
            ))}
          </div>
        </Card>
      )}

      {/* Content */}
      {!showAdvanced ? <ChatInterface /> : <AdvancedSettings />}
    </div>
  );
};
