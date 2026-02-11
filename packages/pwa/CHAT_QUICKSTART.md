# BluePilot Chat Interface - Quick Start

## What Changed?

BluePilot now features a **conversational AI interface** instead of traditional forms. Talk to BluePilot naturally to trade, manage policies, and check history.

## How to Use

### 1. Trading (80% Chat + 20% Advanced)

Navigate to **Trade** tab:

**Chat Mode (Default)**
```
You: swap 0.5 ETH for USDC
AI: Simulation complete:
    • Output: 1250 USDC
    • Slippage: 1.2%
    • Gas: 0.002 ETH
    [Execute Trade]
```

**Advanced Mode**
- Click "Advanced" tab
- Set custom parameters manually
- For power users who want precise control

### 2. Policy Management

Navigate to **Policy** tab:

```
You: set max slippage to 3%
AI: ✓ Max slippage updated to 3%

You: show my current policy
AI: Current policy:
    • Max Slippage: 3%
    • Max Trade Size: 1 ETH
    • Cooldown: 5 min
    • Allowed Tokens: ETH, USDC, WETH, DAI
```

### 3. Transaction History

Navigate to **History** tab:

```
You: show my recent trades
AI: Recent trades:
    • ETH → USDC (0.5 → 1250) - confirmed
    • USDC → DAI (100 → 99.8) - confirmed

You: what's my balance
AI: Your balances:
    • ETH: 2.5
    • USDC: 5000
```

## Supported Commands

### Trading
- `swap [amount] [token] for [token]`
- `trade [amount] [token] to [token]`
- `buy [amount] [token] with [token]`
- `sell [amount] [token] for [token]`

### Policy Updates
- `set max slippage to [number]`
- `set max trade size to [number]`
- `set cooldown to [number]`
- `change slippage to [number]`

### Queries
- `show my recent trades`
- `show my current policy`
- `what's my balance`
- `show transaction [hash]`

## Development

### Running the App

```bash
cd packages/pwa
npm install
npm run dev
```

### Testing Intent Parser

```bash
npm test -- intentParser
```

### Building for Production

```bash
npm run build
```

## Architecture

```
User Input → intentParser → ChatInterface → Action
                                ↓
                          AI Response + Button
```

### Key Files

- `src/lib/intentParser.ts` - Natural language parser
- `src/components/ChatInterface.tsx` - Main chat UI
- `src/components/AdvancedSettings.tsx` - Manual settings panel
- `src/pages/TradePage.tsx` - 80/20 split interface

## Customization

### Adding New Commands

Edit `src/lib/intentParser.ts`:

```typescript
// Add pattern
const NEW_PATTERNS = [
  /your\s+regex\s+pattern/i,
];

// Add handler in parseIntent()
if (NEW_PATTERNS[0].test(trimmed)) {
  return {
    type: 'your_type',
    action: 'your_action',
    params: { /* extracted data */ },
    raw: trimmed,
  };
}
```

### Styling Chat Messages

Edit `src/components/ChatInterface.tsx`:

```typescript
// User message styling
className="bg-sky-200"

// AI message styling
className="bg-white"
```

## Future Enhancements

1. **Voice Input**: Add speech-to-text for true hands-free
2. **LLM Integration**: Replace regex with actual AI model
3. **Multi-language**: Support commands in multiple languages
4. **Chat History**: Persist conversations
5. **Suggestions**: Auto-complete common commands

## Troubleshooting

**Q: Chat not responding?**
- Check browser console for errors
- Verify intentParser patterns match your input

**Q: Trade not executing?**
- Check for policy violations in AI response
- Ensure wallet is connected

**Q: Want to use forms instead?**
- Click "Advanced" tab in Trade page
- Manual controls available there

## Support

For issues or questions:
- Check `CHAT_ARCHITECTURE.md` for technical details
- See `CHAT_INTERFACE.md` for implementation notes
- Open an issue on GitHub
