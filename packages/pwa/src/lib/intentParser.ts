export type IntentType = 'trade' | 'policy' | 'query' | 'unknown';

export interface ParsedIntent {
  type: IntentType;
  action?: string;
  params?: Record<string, any>;
  raw: string;
}

const TRADE_PATTERNS = [
  /swap\s+([\d.]+)\s+(\w+)\s+(?:for|to)\s+(\w+)/i,
  /trade\s+([\d.]+)\s+(\w+)\s+(?:for|to)\s+(\w+)/i,
  /buy\s+([\d.]+)\s+(\w+)\s+with\s+(\w+)/i,
  /sell\s+([\d.]+)\s+(\w+)\s+for\s+(\w+)/i,
];

const POLICY_PATTERNS = [
  /set\s+(?:max\s+)?slippage\s+(?:to\s+)?([\d.]+)/i,
  /set\s+(?:max\s+)?trade\s+size\s+(?:to\s+)?([\d.]+)/i,
  /set\s+cooldown\s+(?:to\s+)?([\d]+)/i,
  /change\s+slippage\s+(?:to\s+)?([\d.]+)/i,
  /update\s+(?:max\s+)?trade\s+size\s+(?:to\s+)?([\d.]+)/i,
];

export function parseIntent(input: string): ParsedIntent {
  const trimmed = input.trim();

  // Trade patterns
  for (const pattern of TRADE_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) {
      return {
        type: 'trade',
        action: 'swap',
        params: {
          amount: match[1],
          fromToken: match[2].toUpperCase(),
          toToken: match[3].toUpperCase(),
        },
        raw: trimmed,
      };
    }
  }

  // Policy patterns
  if (POLICY_PATTERNS[0].test(trimmed)) {
    const match = trimmed.match(POLICY_PATTERNS[0])!;
    return {
      type: 'policy',
      action: 'update_slippage',
      params: { maxSlippage: parseFloat(match[1]) },
      raw: trimmed,
    };
  }

  if (POLICY_PATTERNS[1].test(trimmed)) {
    const match = trimmed.match(POLICY_PATTERNS[1])!;
    return {
      type: 'policy',
      action: 'update_trade_size',
      params: { maxTradeSize: parseFloat(match[1]) },
      raw: trimmed,
    };
  }

  if (POLICY_PATTERNS[2].test(trimmed)) {
    const match = trimmed.match(POLICY_PATTERNS[2])!;
    return {
      type: 'policy',
      action: 'update_cooldown',
      params: { cooldown: parseInt(match[1]) },
      raw: trimmed,
    };
  }

  // Query patterns
  if (/show\s+(?:my\s+)?(?:recent\s+)?(?:trade|transaction)s?/i.test(trimmed)) {
    return { type: 'query', action: 'show_history', raw: trimmed };
  }

  if (/show\s+(?:my\s+)?(?:current\s+)?polic(?:y|ies)/i.test(trimmed)) {
    return { type: 'query', action: 'show_policy', raw: trimmed };
  }

  if (/what(?:'s|\s+is)\s+my\s+balance/i.test(trimmed)) {
    return { type: 'query', action: 'show_balance', raw: trimmed };
  }

  const txMatch = trimmed.match(/show\s+transaction\s+(0x[\da-f]+)/i);
  if (txMatch) {
    return {
      type: 'query',
      action: 'show_transaction',
      params: { hash: txMatch[1] },
      raw: trimmed,
    };
  }

  return { type: 'unknown', raw: trimmed };
}
