import { useState, useRef, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { parseIntent } from '../lib/intentParser';
import { simulateTrade } from '../lib/simulation';
import { generateMockTxHash } from '../lib/mockData';
import { Button } from './ui/Button';
import type { SimulationResult } from '../lib/types';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  simulation?: SimulationResult;
  action?: () => void;
  actionLabel?: string;
}

export const ChatInterface = () => {
  const { tokens, policy, transactions, updatePolicy, addTransaction, updateTransaction } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'ai',
      content: "Hi! I'm BluePilot. Tell me what you'd like to do:\n• Swap tokens (e.g., 'swap 0.5 ETH for USDC')\n• Update policy (e.g., 'set max slippage to 3%')\n• Check history (e.g., 'show my recent trades')",
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

  const handleSend = () => {
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    addMessage('user', userMessage);
    setInput('');
    setIsProcessing(true);

    setTimeout(() => {
      processIntent(userMessage);
      setIsProcessing(false);
    }, 500);
  };

  const processIntent = (userInput: string) => {
    const intent = parseIntent(userInput);

    switch (intent.type) {
      case 'trade':
        handleTradeIntent(intent.params!);
        break;
      case 'policy':
        handlePolicyIntent(intent.action!, intent.params!);
        break;
      case 'query':
        handleQueryIntent(intent.action!, intent.params);
        break;
      default:
        addMessage(
          'ai',
          "I didn't understand that. Try:\n• 'swap 0.5 ETH for USDC'\n• 'set max slippage to 3%'\n• 'show my recent trades'"
        );
    }
  };

  const handleTradeIntent = (params: any) => {
    const { amount, fromToken, toToken } = params;
    const from = tokens.find((t) => t.symbol === fromToken);
    const to = tokens.find((t) => t.symbol === toToken);

    if (!from || !to) {
      addMessage('ai', `Token not found. Available tokens: ${tokens.map((t) => t.symbol).join(', ')}`);
      return;
    }

    const simulation = simulateTrade(from, to, parseFloat(amount), policy);

    if (simulation.policyViolations.length > 0) {
      addMessage(
        'ai',
        `⚠️ Cannot execute trade:\n${simulation.policyViolations.map((v) => `• ${v}`).join('\n')}`
      );
      return;
    }

    const executeAction = () => {
      const txHash = generateMockTxHash();
      addTransaction({
        hash: txHash,
        from: fromToken,
        to: toToken,
        fromAmount: amount,
        toAmount: simulation.outputAmount,
        timestamp: Date.now(),
        status: 'pending',
      });

      addMessage('ai', `✓ Trade submitted! Transaction: ${txHash.slice(0, 10)}...`);

      setTimeout(() => {
        updateTransaction(txHash, { status: 'confirmed' });
        addMessage('ai', '✓ Trade confirmed!');
      }, 2500);
    };

    addMessage(
      'ai',
      `Simulation complete:\n• Output: ${simulation.outputAmount} ${toToken}\n• Slippage: ${simulation.slippage}%\n• Gas: ${simulation.gasEstimate} ETH`,
      {
        simulation,
        action: executeAction,
        actionLabel: 'Execute Trade',
      }
    );
  };

  const handlePolicyIntent = (action: string, params: any) => {
    switch (action) {
      case 'update_slippage':
        updatePolicy({ ...policy, maxSlippage: params.maxSlippage });
        addMessage('ai', `✓ Max slippage updated to ${params.maxSlippage}%`);
        break;
      case 'update_trade_size':
        updatePolicy({ ...policy, maxTradeSize: params.maxTradeSize });
        addMessage('ai', `✓ Max trade size updated to ${params.maxTradeSize} ETH`);
        break;
      case 'update_cooldown':
        updatePolicy({ ...policy, cooldown: params.cooldown });
        addMessage('ai', `✓ Cooldown updated to ${params.cooldown} minutes`);
        break;
    }
  };

  const handleQueryIntent = (action: string, params?: any) => {
    switch (action) {
      case 'show_history':
        if (transactions.length === 0) {
          addMessage('ai', 'No transactions yet.');
        } else {
          const recent = transactions.slice(-5).reverse();
          const list = recent
            .map(
              (tx) =>
                `• ${tx.from} → ${tx.to} (${tx.fromAmount} → ${tx.toAmount}) - ${tx.status}`
            )
            .join('\n');
          addMessage('ai', `Recent trades:\n${list}`);
        }
        break;
      case 'show_policy':
        addMessage(
          'ai',
          `Current policy:\n• Max Slippage: ${policy.maxSlippage}%\n• Max Trade Size: ${policy.maxTradeSize} ETH\n• Cooldown: ${policy.cooldown} min\n• Allowed Tokens: ${policy.allowedTokens.join(', ')}`
        );
        break;
      case 'show_balance':
        const balances = tokens.map((t) => `• ${t.symbol}: ${t.balance}`).join('\n');
        addMessage('ai', `Your balances:\n${balances}`);
        break;
      case 'show_transaction':
        const tx = transactions.find((t) => t.hash === params.hash);
        if (tx) {
          addMessage(
            'ai',
            `Transaction ${tx.hash}:\n• ${tx.from} → ${tx.to}\n• Amount: ${tx.fromAmount} → ${tx.toAmount}\n• Status: ${tx.status}`
          );
        } else {
          addMessage('ai', 'Transaction not found.');
        }
        break;
    }
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 16rem)' }}>
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
