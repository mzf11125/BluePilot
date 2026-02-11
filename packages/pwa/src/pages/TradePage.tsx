import { useState } from 'react';
import { ChatInterface } from '../components/ChatInterface';
import { AdvancedSettings } from '../components/AdvancedSettings';

export const TradePage = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);

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

      {/* Content */}
      {!showAdvanced ? <ChatInterface /> : <AdvancedSettings />}
    </div>
  );
};
