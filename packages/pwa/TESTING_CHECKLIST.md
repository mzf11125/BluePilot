# Chat Interface Testing Checklist

## Pre-Testing Setup

- [ ] Install dependencies: `npm install`
- [ ] Start dev server: `npm run dev`
- [ ] Open browser to `http://localhost:5173`
- [ ] Connect wallet (or use demo mode)

## Trade Page Tests

### Chat Tab (Default)

#### Basic Trading
- [ ] Type: "swap 0.5 ETH for USDC"
- [ ] Verify AI shows simulation results
- [ ] Verify "Execute Trade" button appears
- [ ] Click "Execute Trade"
- [ ] Verify transaction submitted message
- [ ] Wait 2.5s, verify confirmation message

#### Alternative Commands
- [ ] Try: "trade 1 WETH to DAI"
- [ ] Try: "buy 100 USDC with ETH"
- [ ] Try: "sell 0.1 ETH for USDC"

#### Policy Violations
- [ ] Type: "swap 10 ETH for USDC" (exceeds max trade size)
- [ ] Verify AI shows policy violation warning
- [ ] Verify no "Execute Trade" button

#### Invalid Tokens
- [ ] Type: "swap 1 BTC for ETH"
- [ ] Verify AI shows "Token not found" message

#### Unknown Commands
- [ ] Type: "hello world"
- [ ] Verify AI shows help message with examples

### Advanced Tab

- [ ] Click "Advanced" tab
- [ ] Verify settings panel appears
- [ ] Change max slippage to 3
- [ ] Change max trade size to 2
- [ ] Change cooldown to 10
- [ ] Toggle token checkboxes
- [ ] Click "Save Settings"
- [ ] Verify toast notification appears

### Tab Switching
- [ ] Switch between Chat and Advanced tabs
- [ ] Verify state persists
- [ ] Verify no errors in console

## Policy Page Tests

### Policy Updates
- [ ] Navigate to Policy tab
- [ ] Type: "set max slippage to 3%"
- [ ] Verify confirmation message
- [ ] Type: "set max trade size to 2"
- [ ] Verify confirmation message
- [ ] Type: "set cooldown to 10"
- [ ] Verify confirmation message

### Policy Queries
- [ ] Type: "show my current policy"
- [ ] Verify all policy settings displayed
- [ ] Verify values match what was set

## History Page Tests

### Transaction History
- [ ] Navigate to History tab
- [ ] Type: "show my recent trades"
- [ ] Verify transaction list appears
- [ ] Verify correct format (from → to, amounts, status)

### Balance Query
- [ ] Type: "what's my balance"
- [ ] Verify all token balances shown
- [ ] Verify correct format

### Transaction Details
- [ ] Execute a trade first
- [ ] Copy transaction hash
- [ ] Type: "show transaction [hash]"
- [ ] Verify transaction details shown

## Home Page Tests

### Dashboard
- [ ] Navigate to Home tab
- [ ] Verify portfolio value displayed
- [ ] Verify token list shown
- [ ] Verify recent trades shown (if any)

## UI/UX Tests

### Chat Interface
- [ ] Verify user messages appear on right (blue background)
- [ ] Verify AI messages appear on left (white background)
- [ ] Verify auto-scroll to latest message
- [ ] Verify "Thinking..." appears during processing
- [ ] Verify messages are readable (font size, spacing)

### Input Field
- [ ] Type in input field
- [ ] Press Enter to send
- [ ] Click Send button
- [ ] Verify input clears after sending
- [ ] Verify input disabled during processing

### Mobile Responsiveness
- [ ] Resize browser to mobile width
- [ ] Verify chat bubbles fit screen
- [ ] Verify input field accessible
- [ ] Verify bottom nav doesn't overlap chat

## Error Handling Tests

### Network Errors
- [ ] Disconnect network
- [ ] Try to execute trade
- [ ] Verify graceful error handling

### Invalid Input
- [ ] Type: "swap abc ETH for USDC"
- [ ] Verify appropriate error message
- [ ] Type: "set max slippage to -5"
- [ ] Verify validation

### Edge Cases
- [ ] Type empty message
- [ ] Verify send button disabled
- [ ] Type very long message
- [ ] Verify message wraps correctly

## Performance Tests

### Message List
- [ ] Send 20+ messages
- [ ] Verify smooth scrolling
- [ ] Verify no lag
- [ ] Verify all messages visible

### Tab Switching
- [ ] Rapidly switch between tabs
- [ ] Verify no flickering
- [ ] Verify state preserved

## Accessibility Tests

### Keyboard Navigation
- [ ] Tab through interface
- [ ] Verify focus indicators visible
- [ ] Press Enter in input field
- [ ] Verify message sent

### Screen Reader
- [ ] Enable screen reader
- [ ] Navigate through messages
- [ ] Verify messages announced correctly

## Browser Compatibility

- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] Test on mobile browser

## Integration Tests

### Wallet Connection
- [ ] Connect wallet
- [ ] Verify address shown in header
- [ ] Execute trade
- [ ] Verify wallet prompt appears

### State Persistence
- [ ] Execute trade
- [ ] Navigate to History
- [ ] Verify trade appears
- [ ] Navigate to Home
- [ ] Verify balance updated

## Documentation Tests

- [ ] Read CHAT_QUICKSTART.md
- [ ] Follow all examples
- [ ] Verify commands work as documented
- [ ] Check for typos or errors

## Final Checks

- [ ] No console errors
- [ ] No console warnings
- [ ] All features working
- [ ] UI looks polished
- [ ] Ready for demo

## Known Issues to Document

List any issues found during testing:

1. 
2. 
3. 

## Test Results

- **Date Tested**: ___________
- **Tester**: ___________
- **Browser**: ___________
- **Pass Rate**: _____ / _____
- **Status**: ☐ Pass ☐ Fail ☐ Needs Work

## Notes

Additional observations or feedback:

---

**Testing completed by**: ___________
**Date**: ___________
**Signature**: ___________
