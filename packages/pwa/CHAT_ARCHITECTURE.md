# Chat Interface Architecture

## Component Structure

```
AppLayout (Full Screen Flexbox)
├── Header (Fixed)
│   └── Logo + WalletConnect
├── Main Content (Flex-1, Scrollable)
│   └── Router Outlet
│       ├── HomePage (Dashboard)
│       ├── TradePage (80/20 Split)
│       │   ├── Chat Tab (80%) ──> ChatInterface
│       │   └── Advanced Tab (20%) ──> AdvancedSettings
│       ├── PolicyPage ──> ChatInterface
│       └── HistoryPage ──> ChatInterface
└── Bottom Nav (Fixed)
    └── Home | Trade | Policy | History
```

## Data Flow

```
User Input
    ↓
intentParser.ts (Regex Pattern Matching)
    ↓
ParsedIntent { type, action, params }
    ↓
ChatInterface.processIntent()
    ↓
    ├── Trade Intent → simulateTrade() → Show Results + Execute Button
    ├── Policy Intent → updatePolicy() → Confirmation Message
    └── Query Intent → Fetch Data → Display in Chat
```

## Message Flow Example

```
1. User types: "swap 0.5 ETH for USDC"
   ↓
2. intentParser extracts:
   {
     type: 'trade',
     action: 'swap',
     params: { amount: '0.5', fromToken: 'ETH', toToken: 'USDC' }
   }
   ↓
3. ChatInterface.handleTradeIntent():
   - Validates tokens exist
   - Runs simulateTrade()
   - Checks policy violations
   ↓
4. AI responds with simulation:
   "Simulation complete:
    • Output: 1250 USDC
    • Slippage: 1.2%
    • Gas: 0.002 ETH"
   [Execute Trade] button
   ↓
5. User clicks Execute Trade
   ↓
6. Transaction submitted:
   "✓ Trade submitted! Transaction: 0x1234..."
   ↓
7. After 2.5s:
   "✓ Trade confirmed!"
```

## UI Layout (Mobile)

```
┌─────────────────────────────┐
│ 🛩️ BluePilot  [Connect]    │ ← Header (Fixed)
├─────────────────────────────┤
│                             │
│  ┌─────────────────────┐   │
│  │ AI: Hi! Tell me...  │   │ ← AI Message (Left)
│  └─────────────────────┘   │
│                             │
│         ┌───────────────┐  │
│         │ User: swap... │  │ ← User Message (Right)
│         └───────────────┘  │
│                             │
│  ┌─────────────────────┐   │
│  │ AI: Simulation...   │   │
│  │ [Execute Trade]     │   │ ← AI with Action
│  └─────────────────────┘   │
│                             │ ← Scrollable Chat Area
│                             │
│                             │
├─────────────────────────────┤
│ [Type your command...]  [→] │ ← Input (Fixed)
├─────────────────────────────┤
│ 🏠  💱  ⚙️  📜            │ ← Bottom Nav (Fixed)
└─────────────────────────────┘
```

## Trade Page Tabs

```
┌─────────────────────────────┐
│ [  Chat  ] [ Advanced ]     │ ← Tab Toggle
├─────────────────────────────┤
│                             │
│  Chat Interface (80%)       │
│  or                         │
│  Advanced Settings (20%)    │
│                             │
└─────────────────────────────┘
```

## Intent Patterns

### Trade Patterns
- `swap X TOKEN for TOKEN`
- `trade X TOKEN for TOKEN`
- `buy X TOKEN with TOKEN`
- `sell X TOKEN for TOKEN`

### Policy Patterns
- `set max slippage to X%`
- `set max trade size to X`
- `set cooldown to X minutes`
- `change slippage to X%`

### Query Patterns
- `show my recent trades`
- `show my current policy`
- `what's my balance`
- `show transaction 0x...`

## State Management

```typescript
// ChatInterface State
messages: Message[] = [
  {
    id: string,
    role: 'user' | 'ai',
    content: string,
    simulation?: SimulationResult,
    action?: () => void,
    actionLabel?: string
  }
]

// AppContext (Global)
- tokens: Token[]
- policy: Policy
- transactions: Transaction[]
- updatePolicy()
- addTransaction()
- updateTransaction()
```
