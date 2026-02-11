# BluePilot Chat Interface - Quick Reference Card

## 🚀 Quick Start
```bash
cd packages/pwa
npm install
npm run dev
```
Open http://localhost:5173

## 💬 Command Reference

### Trading Commands
| Command | Example | Result |
|---------|---------|--------|
| `swap [amount] [token] for [token]` | `swap 0.5 ETH for USDC` | Simulates and executes trade |
| `trade [amount] [token] to [token]` | `trade 1 WETH to DAI` | Alternative syntax |
| `buy [amount] [token] with [token]` | `buy 100 USDC with ETH` | Buy-focused syntax |
| `sell [amount] [token] for [token]` | `sell 0.1 ETH for USDC` | Sell-focused syntax |

### Policy Commands
| Command | Example | Result |
|---------|---------|--------|
| `set max slippage to [number]` | `set max slippage to 3` | Updates max slippage to 3% |
| `set max trade size to [number]` | `set max trade size to 2` | Updates max trade size to 2 ETH |
| `set cooldown to [number]` | `set cooldown to 10` | Updates cooldown to 10 minutes |
| `change slippage to [number]` | `change slippage to 2.5` | Alternative syntax |

### Query Commands
| Command | Example | Result |
|---------|---------|--------|
| `show my recent trades` | `show my recent trades` | Lists last 5 transactions |
| `show my current policy` | `show my current policy` | Displays all policy settings |
| `what's my balance` | `what's my balance` | Shows all token balances |
| `show transaction [hash]` | `show transaction 0x123...` | Shows specific transaction |

## 🎯 Common Workflows

### Execute a Trade
```
1. Type: "swap 0.5 ETH for USDC"
2. Review simulation results
3. Click: [Execute Trade]
4. Wait for confirmation
```

### Update Policy
```
1. Navigate to Policy tab
2. Type: "set max slippage to 3%"
3. Confirm update message
```

### Check History
```
1. Navigate to History tab
2. Type: "show my recent trades"
3. Review transaction list
```

## 🔧 Advanced Settings

### Access Advanced Mode
```
1. Navigate to Trade tab
2. Click: "Advanced" tab
3. Manually adjust settings
4. Click: "Save Settings"
```

### Available Settings
- Max Slippage (%)
- Max Trade Size (ETH)
- Cooldown Period (minutes)
- Allowed Tokens (checkboxes)

## 🎨 UI Layout

```
┌─────────────────────────────┐
│ Header (Logo + Wallet)      │
├─────────────────────────────┤
│                             │
│  Chat Messages              │
│  (Scrollable)               │
│                             │
├─────────────────────────────┤
│ Input Field + Send Button   │
├─────────────────────────────┤
│ Bottom Nav (4 tabs)         │
└─────────────────────────────┘
```

## 📱 Navigation

| Tab | Icon | Purpose |
|-----|------|---------|
| Home | 🏠 | Dashboard & portfolio |
| Trade | 💱 | Chat trading interface |
| Policy | ⚙️ | Policy management |
| History | 📜 | Transaction history |

## ⚠️ Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Token not found" | Invalid token symbol | Use: ETH, USDC, WETH, DAI, WBTC |
| "Policy violation" | Trade exceeds limits | Adjust policy or trade amount |
| "I didn't understand" | Unknown command | Check command syntax |

## 🔐 Safety Features

### Policy Enforcement
- ✅ Max slippage checked
- ✅ Max trade size enforced
- ✅ Cooldown period respected
- ✅ Token whitelist validated

### Transaction Flow
1. User types command
2. AI simulates trade
3. Policy checks run
4. User confirms execution
5. Transaction submitted
6. Confirmation received

## 📊 Status Indicators

| Status | Meaning |
|--------|---------|
| "Thinking..." | AI processing command |
| "✓" | Action completed successfully |
| "⚠️" | Warning or policy violation |
| "Pending" | Transaction submitted |
| "Confirmed" | Transaction completed |

## 🎓 Tips & Tricks

### For Faster Trading
- Use short commands: `swap 0.5 ETH for USDC`
- Press Enter to send (no need to click)
- Check simulation before executing

### For Better Results
- Be specific with amounts
- Use uppercase for tokens (ETH, not eth)
- Include "to" or "for" in swap commands

### For Power Users
- Use Advanced tab for precise control
- Set policies once, trade freely
- Check history regularly

## 🐛 Troubleshooting

### Command Not Working?
1. Check spelling
2. Verify token symbols
3. Include amount
4. Use "for" or "to"

### Trade Not Executing?
1. Check policy violations
2. Verify wallet connected
3. Ensure sufficient balance
4. Check network status

### UI Issues?
1. Refresh browser
2. Clear cache
3. Check console for errors
4. Try different browser

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `CHAT_QUICKSTART.md` | User guide |
| `CHAT_ARCHITECTURE.md` | Technical docs |
| `CHAT_INTERFACE.md` | Implementation notes |
| `BEFORE_AFTER.md` | Visual comparison |
| `TESTING_CHECKLIST.md` | QA guide |
| `DEMO_SCRIPT.md` | Demo instructions |

## 🔗 Quick Links

### Development
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm test         # Run tests
```

### Files to Know
```
src/lib/intentParser.ts              # Command parser
src/components/ChatInterface.tsx     # Chat UI
src/components/AdvancedSettings.tsx  # Settings panel
src/pages/TradePage.tsx              # Main trade page
```

## 💡 Examples

### Simple Trade
```
User: swap 0.5 ETH for USDC
AI: Simulation complete:
    • Output: 1250 USDC
    • Slippage: 1.2%
    • Gas: 0.002 ETH
    [Execute Trade]
```

### Policy Update
```
User: set max slippage to 3%
AI: ✓ Max slippage updated to 3%
```

### Balance Check
```
User: what's my balance
AI: Your balances:
    • ETH: 2.5
    • USDC: 5000
    • WETH: 1.0
```

## 🎯 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Enter | Send message |
| Tab | Navigate UI |
| Esc | Close modals |

## 📞 Support

### Need Help?
1. Check documentation
2. Review examples
3. Test in demo mode
4. Open GitHub issue

### Found a Bug?
1. Note the command used
2. Check console errors
3. Document steps to reproduce
4. Report on GitHub

---

## 🎉 Quick Win Commands

Try these to get started:

```
swap 0.5 ETH for USDC
show my balance
set max slippage to 3%
show my recent trades
```

---

**Print this card and keep it handy!** 📋
