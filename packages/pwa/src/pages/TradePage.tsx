import { useState } from 'react';
import { ChatInterface } from '../components/ChatInterface';
import { AdvancedSettings } from '../components/AdvancedSettings';
import { Card } from '../components/ui/Card';

// SVG Icon Components
const LightbulbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 inline mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-9c-2.964 0-5.5 1.735-6.75 4.5a6.01 6.01 0 0 1 1.5 9M12 18a2.25 2.25 0 0 0 2.25 2.25M12 18a2.25 2.25 0 0 1 2.25-2.25m-2.25 0a2.25 2.25 0 0 0-2.25 2.25m2.25-2.25h12" />
  </svg>
);

export const TradePage = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const tips = [
    { icon: <LightbulbIcon />, text: "Snipe coins from RobinPump.fun with high market cap" },
    { icon: <LightbulbIcon />, text: "Try: 'buy PEPE when market cap > $1M'" },
    { icon: <LightbulbIcon />, text: "Set stop-loss: 'sell if DOGE drops 10%'" },
    { icon: <LightbulbIcon />, text: "Monitor trending: 'show top gainers on RobinPump'" },
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
          <h3 className="font-bold mb-2 text-sm flex items-center">
            <LightbulbIcon />
            <span>Quick Tips</span>
          </h3>
          <div className="space-y-1">
            {tips.map((tip, i) => (
              <p key={i} className="text-xs font-mono flex items-start">
                {tip.icon}
                <span>{tip.text}</span>
              </p>
            ))}
          </div>
        </Card>
      )}

      {/* Content */}
      {!showAdvanced ? <ChatInterface /> : <AdvancedSettings />}
    </div>
  );
};
