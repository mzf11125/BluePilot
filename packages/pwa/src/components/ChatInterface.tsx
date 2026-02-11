import { useState, useRef, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { mockAgentAPI } from '../lib/mockAgentAPI';
import { generateMockTxHash } from '../lib/mockData';
import { Button } from './ui/Button';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  simulation?: any;
  action?: () => void;
  actionLabel?: string;
  batchData?: any;
}

export const ChatInterface = () => {
  const { tokens, policy, transactions, updatePolicy, addTransaction, updateTransaction } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'ai',
      content: "Hi! I'm BluePilot. Tell me what you'd like to do:\n\n💱 Trading:\n• 'swap 0.5 ETH for USDC' - Single trade\n• 'batch: swap 0.1 ETH for USDC, swap 0.05 ETH for DAI' - Batch trade (30% gas savings)\n\n📊 Portfolio:\n• 'show my portfolio' - View all balances\n• 'price of ETH' - Get token price\n\n🚀 RobinPump:\n• 'show new tokens' - Recent token launches\n\n🛡️ Policy:\n• 'show my policy' - View trading limits\n• 'set max slippage to 5%' - Update policy",
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (role: 'user' | 'ai', content: string, extras?: Partial<Message>) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role, content, ...extras },
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    addMessage('user', userMessage);
    setInput('');
    setIsProcessing(true);

    try {
      await processIntent(userMessage);
    } catch (error: any) {
      addMessage('ai', `❌ Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const processIntent = async (userInput: string) => {
    const lower = userInput.toLowerCase();

    // Batch trading
    if (lower.startsWith('batch:')) {
      await handleBatchTrade(userInput);
      return;
    }

    // Single trade
    if (lower.includes('swap')) {
      await handleTrade(userInput);
      return;
    }

    // Portfolio
    if (lower.includes('portfolio') || lower.includes('balance')) {
      await handlePortfolio();
      return;
    }

    // Token price
    if (lower.includes('price of') || lower.includes('price for')) {
      await handlePrice(userInput);
      return;
    }

    // Alerts
    if (lower.includes('alert') || lower.includes('new token') || lower.includes('launch')) {
      await handleAlerts();
      return;
    }

    // Policy update
    if (lower.includes('set') && (lower.includes('slippage') || lower.includes('limit') || lower.includes('cooldown'))) {
      await handlePolicyUpdate(userInput);
      return;
    }

    // Policy view
    if (lower.includes('policy') || lower.includes('show') && lower.includes('limit')) {
      await handlePolicy(userInput);
      return;
    }

    addMessage(
      'ai',
      "I didn't understand that. Try:\n• 'swap 0.5 ETH for USDC'\n• 'batch: swap 0.1 ETH for USDC, swap 0.05 ETH for DAI'\n• 'show my portfolio'\n• 'price of ETH'\n• 'show new tokens'\n• 'show my policy'"
    );
  };

  const handleTrade = async (command: string) => {
    try {
      const simulation = await mockAgentAPI.simulate(command);
      
      const message = `✅ Trade Simulation:\n\n` +
        `📊 ${simulation.intent.amountIn} ${simulation.intent.tokenIn} → ${simulation.simulation.amountOut} ${simulation.intent.tokenOut}\n` +
        `💵 Value: ${simulation.simulation.amountOutUSD}\n` +
        `📉 Price Impact: ${simulation.simulation.priceImpact}\n` +
        `⛽ Gas: ${simulation.simulation.gasEstimate}\n` +
        `🔀 Route: ${simulation.simulation.route.join(' → ')}\n` +
        `🏪 DEX: ${simulation.simulation.bestDex}\n\n` +
        `${simulation.policy.compliant ? '✅ Policy compliant' : '⚠️ Policy violations'}`;

      const executeAction = async () => {
        const txHash = generateMockTxHash();
        addTransaction({
          hash: txHash,
          from: simulation.intent.tokenIn,
          to: simulation.intent.tokenOut,
          fromAmount: simulation.intent.amountIn,
          toAmount: simulation.simulation.amountOut,
          timestamp: Date.now(),
          status: 'pending'
        });

        addMessage('ai', `🚀 Trade submitted!\n\nTransaction: ${txHash.slice(0, 10)}...${txHash.slice(-8)}\n\nWaiting for confirmation...`);

        setTimeout(() => {
          updateTransaction(txHash, { status: 'confirmed' });
          addMessage('ai', `✅ Trade confirmed!\n\nYou received ${simulation.simulation.amountOut} ${simulation.intent.tokenOut}`);
        }, 3000);
      };

      addMessage('ai', message, {
        simulation,
        action: executeAction,
        actionLabel: '🚀 Execute Trade'
      });
    } catch (error: any) {
      addMessage('ai', `❌ Error: ${error.message}`);
    }
  };

  const handleBatchTrade = async (input: string) => {
    try {
      const commandsStr = input.replace(/^batch:\s*/i, '');
      const commands = commandsStr.split(',').map(c => c.trim());

      if (commands.length > 10) {
        addMessage('ai', '❌ Maximum 10 trades per batch');
        return;
      }

      const batchSim = await mockAgentAPI.batchSimulate(commands);

      const message = `✅ Batch Trade Simulation (${commands.length} trades):\n\n` +
        batchSim.trades.map((trade, i) => 
          `${i + 1}. ${trade.intent.amountIn} ${trade.intent.tokenIn} → ${trade.simulation.amountOut} ${trade.intent.tokenOut}`
        ).join('\n') +
        `\n\n⛽ Total Gas: ${batchSim.totalGasEstimate}\n` +
        `💰 Gas Savings: ${batchSim.gasSavingsPercent} (${batchSim.gasSavings} gas)\n` +
        `✅ All trades policy compliant`;

      const executeAction = async () => {
        const txHash = generateMockTxHash();
        addMessage('ai', `🚀 Batch trade submitted!\n\nTransaction: ${txHash.slice(0, 10)}...${txHash.slice(-8)}\n\nExecuting ${commands.length} trades...`);

        setTimeout(() => {
          addMessage('ai', `✅ Batch trade confirmed!\n\nAll ${commands.length} trades executed successfully with 30% gas savings!`);
        }, 3000);
      };

      addMessage('ai', message, {
        batchData: batchSim,
        action: executeAction,
        actionLabel: `🚀 Execute Batch (${commands.length} trades)`
      });
    } catch (error: any) {
      addMessage('ai', `❌ Error: ${error.message}`);
    }
  };

  const handlePortfolio = async () => {
    try {
      const tokenSymbols = tokens.map(t => t.symbol);
      const portfolio = await mockAgentAPI.getPortfolio('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', tokenSymbols);

      const message = `💼 Your Portfolio:\n\n` +
        portfolio.portfolio.map(item => 
          `${item.symbol}: ${item.balance} (${item.usdValue})`
        ).join('\n') +
        `\n\n💰 Total Value: ${portfolio.totalUSD}`;

      addMessage('ai', message);
    } catch (error: any) {
      addMessage('ai', `❌ Error: ${error.message}`);
    }
  };

  const handleAlerts = async () => {
    try {
      const alerts = await mockAgentAPI.getAlerts();

      if (alerts.count === 0) {
        addMessage('ai', '📢 No new token launches detected');
        return;
      }

      const message = `🚀 New Token Launches (${alerts.count}):\n\n` +
        alerts.alerts.map(alert => 
          `• ${alert.name} (${alert.symbol})\n  Address: ${alert.token.slice(0, 10)}...${alert.token.slice(-8)}\n  Creator: ${alert.creator.slice(0, 10)}...${alert.creator.slice(-8)}`
        ).join('\n\n');

      addMessage('ai', message);
    } catch (error: any) {
      addMessage('ai', `❌ Error: ${error.message}`);
    }
  };

  const handlePolicy = async (input: string) => {
    try {
      const policyData = await mockAgentAPI.getPolicy('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');

      const message = `🛡️ Your Trading Policy:\n\n` +
        `• Max Slippage: ${policyData.maxSlippageBps / 100}%\n` +
        `• Max Trade Size: ${parseFloat(policyData.maxTradeSize) / 1e18} ETH\n` +
        `• Cooldown: ${policyData.cooldownSeconds}s\n` +
        `• Token Allowlist: ${policyData.tokenAllowlist.length === 0 ? 'All tokens allowed' : policyData.tokenAllowlist.join(', ')}`;

      addMessage('ai', message);
    } catch (error: any) {
      addMessage('ai', `❌ Error: ${error.message}`);
    }
  };

  const handlePrice = async (input: string) => {
    try {
      // Extract token from "price of ETH" or "price for USDC"
      const match = input.match(/price\s+(?:of|for)\s+(\w+)/i);
      if (!match) {
        addMessage('ai', '❌ Please specify a token. Example: "price of ETH"');
        return;
      }

      const token = match[1].toUpperCase();
      const priceData = await mockAgentAPI.getPrice(token);

      addMessage('ai', `💰 ${token} Price: $${priceData.price.toLocaleString()}`);
    } catch (error: any) {
      addMessage('ai', `❌ Error: ${error.message}`);
    }
  };

  const handlePolicyUpdate = async (input: string) => {
    try {
      // Parse policy update command
      const slippageMatch = input.match(/slippage\s+to\s+([\d.]+)%?/i);
      const tradeSizeMatch = input.match(/trade\s+size\s+to\s+([\d.]+)/i);
      const cooldownMatch = input.match(/cooldown\s+to\s+(\d+)/i);

      const updates: any = {};
      if (slippageMatch) {
        updates.maxSlippageBps = Math.floor(parseFloat(slippageMatch[1]) * 100);
      }
      if (tradeSizeMatch) {
        updates.maxTradeSize = (parseFloat(tradeSizeMatch[1]) * 1e18).toString();
      }
      if (cooldownMatch) {
        updates.cooldownSeconds = parseInt(cooldownMatch[1]);
      }

      if (Object.keys(updates).length === 0) {
        addMessage('ai', '❌ Could not parse policy update. Try:\n• "set max slippage to 5%"\n• "set max trade size to 2"\n• "set cooldown to 30"');
        return;
      }

      await mockAgentAPI.setPolicy('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', updates);

      const updateMessages = [];
      if (updates.maxSlippageBps) updateMessages.push(`Max Slippage: ${updates.maxSlippageBps / 100}%`);
      if (updates.maxTradeSize) updateMessages.push(`Max Trade Size: ${parseFloat(updates.maxTradeSize) / 1e18} ETH`);
      if (updates.cooldownSeconds) updateMessages.push(`Cooldown: ${updates.cooldownSeconds}s`);

      addMessage('ai', `✅ Policy Updated:\n\n${updateMessages.map(m => `• ${m}`).join('\n')}\n\nTransaction ready to sign.`);
    } catch (error: any) {
      addMessage('ai', `❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-4 border-3 border-black shadow-brutal ${
                msg.role === 'user' ? 'bg-sky-200' : 'bg-white'
              }`}
            >
              <p className="whitespace-pre-line font-mono text-sm">{msg.content}</p>
              {msg.action && (
                <Button onClick={msg.action} className="mt-3 w-full">
                  {msg.actionLabel}
                </Button>
              )}
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white p-4 border-3 border-black shadow-brutal">
              <p className="font-mono text-sm">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t-3 border-black bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your command..."
            className="flex-1 px-4 py-3 border-3 border-black font-mono"
            disabled={isProcessing}
          />
          <Button onClick={handleSend} disabled={isProcessing || !input.trim()}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
