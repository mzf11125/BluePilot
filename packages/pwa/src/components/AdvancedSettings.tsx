import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

const ALL_TOKENS = ['ETH', 'USDC', 'WETH', 'DAI', 'WBTC'];

export const AdvancedSettings = () => {
  const { policy, updatePolicy } = useApp();
  const [maxSlippage, setMaxSlippage] = useState(policy.maxSlippage.toString());
  const [maxTradeSize, setMaxTradeSize] = useState(policy.maxTradeSize.toString());
  const [cooldown, setCooldown] = useState(policy.cooldown.toString());
  const [allowedTokens, setAllowedTokens] = useState(policy.allowedTokens);
  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    updatePolicy({
      maxSlippage: parseFloat(maxSlippage),
      maxTradeSize: parseFloat(maxTradeSize),
      cooldown: parseInt(cooldown),
      allowedTokens,
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const toggleToken = (token: string) => {
    setAllowedTokens((prev) =>
      prev.includes(token) ? prev.filter((t) => t !== token) : [...prev, token]
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <h3 className="text-lg font-bold mb-4">Advanced Settings</h3>

        <div className="space-y-3">
          <Input
            label="Max Slippage (%)"
            type="number"
            value={maxSlippage}
            onChange={(e) => setMaxSlippage(e.target.value)}
          />

          <Input
            label="Max Trade Size (ETH)"
            type="number"
            value={maxTradeSize}
            onChange={(e) => setMaxTradeSize(e.target.value)}
          />

          <Input
            label="Cooldown (min)"
            type="number"
            value={cooldown}
            onChange={(e) => setCooldown(e.target.value)}
          />

          <div>
            <label className="block font-bold mb-2 text-sm">Allowed Tokens</label>
            <div className="space-y-1">
              {ALL_TOKENS.map((token) => (
                <label key={token} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowedTokens.includes(token)}
                    onChange={() => toggleToken(token)}
                    className="w-4 h-4 border-2 border-black"
                  />
                  <span className="text-sm font-bold">{token}</span>
                </label>
              ))}
            </div>
          </div>

          <Button onClick={handleSave} className="w-full">
            Save Settings
          </Button>
        </div>
      </Card>

      {showToast && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-green-400 border-3 border-black px-4 py-2 shadow-brutal">
          <p className="font-bold text-sm">✓ Saved!</p>
        </div>
      )}
    </div>
  );
};
