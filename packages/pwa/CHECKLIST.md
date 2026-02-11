# ✅ BluePilot PWA - Launch Checklist

## 🚀 Before First Run

### 1. Install Dependencies
```bash
cd packages/pwa
npm install
```
- [ ] Dependencies installed successfully
- [ ] No error messages in console

### 2. Configure WalletConnect (Optional but Recommended)
- [ ] Visit https://cloud.walletconnect.com
- [ ] Create free account
- [ ] Create new project
- [ ] Copy Project ID
- [ ] Update `src/lib/wagmi.ts` line 7:
  ```typescript
  projectId: 'YOUR_PROJECT_ID_HERE'
  ```

### 3. Start Development Server
```bash
npm run dev
```
- [ ] Server starts on http://localhost:5173
- [ ] No compilation errors
- [ ] Browser opens automatically

## 🧪 Testing Checklist

### Landing Page
- [ ] Page loads with sky blue gradient background
- [ ] Plane animation flies across screen
- [ ] "BluePilot" title displays
- [ ] "Hands-Free DeFi Trading" tagline shows
- [ ] 4 feature cards render correctly
- [ ] "Enter App" button is clickable
- [ ] Clicking button navigates to /app

### Home Screen
- [ ] Portfolio value shows $10,125.00
- [ ] 3 tokens display (ETH, USDC, WETH)
- [ ] Token balances and USD values correct
- [ ] Recent trades section shows 2 trades
- [ ] RainbowKit "Connect Wallet" button appears
- [ ] Bottom navigation shows 4 tabs
- [ ] Home tab is highlighted

### Trade Screen
- [ ] "From" token selector works
- [ ] "To" token selector works
- [ ] Amount input accepts numbers
- [ ] MAX button fills token balance
- [ ] "Simulate Trade" button clickable
- [ ] Simulation shows:
  - [ ] Expected output amount
  - [ ] Slippage percentage
  - [ ] Gas estimate
  - [ ] Policy status
- [ ] "Execute Trade" button enabled after simulation
- [ ] Policy violations show in red box (if any)

### Trade Execution
- [ ] Clicking "Execute Trade" opens modal
- [ ] Modal explains demo mode
- [ ] "Continue Demo" button works
- [ ] Modal closes
- [ ] "Executing..." state shows
- [ ] After 2.5s, success message appears
- [ ] Transaction added to history
- [ ] Form resets

### Policy Screen
- [ ] Max Slippage input shows current value (2)
- [ ] Max Trade Size input shows current value (1)
- [ ] Cooldown input shows current value (5)
- [ ] Token checkboxes show (ETH, USDC, WETH checked)
- [ ] Checkboxes are toggleable
- [ ] "Update Policy" button works
- [ ] Success toast appears for 3 seconds
- [ ] Policy explanation card displays

### History Screen
- [ ] Transaction list displays
- [ ] Each transaction shows:
  - [ ] Token pair (e.g., "0.5 ETH → 1250 USDC")
  - [ ] Timestamp
  - [ ] Status badge (green for confirmed)
  - [ ] Transaction hash (shortened)
  - [ ] Copy button (📋)
  - [ ] "View →" link
- [ ] Refresh button (↻) adds new transaction
- [ ] Copy button copies hash to clipboard
- [ ] "View →" opens Basescan in new tab

### Wallet Connection
- [ ] Click "Connect Wallet" button
- [ ] RainbowKit modal opens
- [ ] Wallet options display
- [ ] Can connect wallet (if available)
- [ ] Connected address shows in header
- [ ] Can disconnect wallet

### Navigation
- [ ] All 4 bottom tabs clickable
- [ ] Active tab highlighted in sky blue
- [ ] Navigation smooth, no flicker
- [ ] Back button works in browser
- [ ] Direct URL navigation works

### Responsive Design
- [ ] Test on mobile width (320px)
- [ ] Test on tablet width (768px)
- [ ] Test on desktop width (1024px+)
- [ ] All elements visible and usable
- [ ] No horizontal scroll
- [ ] Touch targets adequate size

## 🎨 Visual Quality Check

### Design System
- [ ] All buttons have 3px black borders
- [ ] All buttons have shadow-brutal effect
- [ ] Button hover removes shadow and translates
- [ ] All cards have 4px black borders
- [ ] All cards have shadow-brutal-lg effect
- [ ] Sky blue color (#0EA5E9) used consistently
- [ ] Typography: Inter for text, Roboto Mono for hashes
- [ ] No rounded corners (neo-brutalism)

### Animations
- [ ] Plane flies smoothly on landing page
- [ ] Button hover transitions smooth
- [ ] Page transitions smooth
- [ ] Loading states visible
- [ ] Toast appears and disappears smoothly

## 📦 PWA Features

### Build & Preview
```bash
npm run build
npm run preview
```
- [ ] Build completes without errors
- [ ] Preview server starts
- [ ] App loads in preview mode

### PWA Installation
- [ ] Open Chrome DevTools
- [ ] Go to Application tab
- [ ] Check Manifest section:
  - [ ] Name: "BluePilot - Hands-Free DeFi Trading"
  - [ ] Theme color: #0EA5E9
  - [ ] Icons present
- [ ] Check Service Worker section:
  - [ ] Service worker registered
  - [ ] Status: activated
- [ ] Install prompt appears in address bar
- [ ] Can install as PWA
- [ ] Installed app opens in standalone mode

### Offline Support
- [ ] Install PWA
- [ ] Open installed app
- [ ] Open DevTools → Network
- [ ] Check "Offline" mode
- [ ] Reload app
- [ ] App still loads (cached)

## 🐛 Error Handling

### Edge Cases
- [ ] Empty amount in trade form (button disabled)
- [ ] Negative amount (validation)
- [ ] Trade violating policy (warning shown)
- [ ] No transactions in history (empty state)
- [ ] Network offline (app still loads)

### Console
- [ ] No errors in browser console
- [ ] No warnings (except expected ones)
- [ ] No 404s for assets

## 🚢 Pre-Deployment

### Code Quality
- [ ] TypeScript compiles without errors:
  ```bash
  npx tsc --noEmit
  ```
- [ ] No unused imports
- [ ] No console.log statements (except intentional)

### Assets
- [ ] Replace SVG icons with PNG (192x192, 512x512)
- [ ] Add favicon.ico
- [ ] Optimize images if any

### Configuration
- [ ] WalletConnect Project ID added
- [ ] Base network configured correctly
- [ ] Manifest.json values correct
- [ ] Meta tags in index.html correct

### Documentation
- [ ] README.md updated
- [ ] SETUP.md reviewed
- [ ] Environment variables documented

## 🎯 Final Checks

- [ ] All 11 tasks from plan completed
- [ ] Landing page works
- [ ] All 4 app screens work
- [ ] Wallet connection works
- [ ] Trade simulation works
- [ ] Policy updates work
- [ ] Transaction history works
- [ ] PWA installable
- [ ] Offline support works
- [ ] Mobile responsive
- [ ] Neo-brutalism design consistent
- [ ] Sky blue + plane theme throughout

## 📝 Notes

**Known Limitations:**
- Demo mode only (no real blockchain)
- WalletConnect Project ID needs to be added
- Icons are SVG placeholders (should be PNG)
- Service worker only in production build

**Next Steps:**
1. Get WalletConnect Project ID
2. Convert icons to PNG format
3. Deploy to Vercel/Netlify
4. Test on real mobile devices
5. Share demo link!

---

## ✅ Sign-Off

- [ ] All critical features tested
- [ ] No blocking bugs found
- [ ] Ready for demo/pitch
- [ ] Documentation complete

**Tested by:** _________________
**Date:** _________________
**Status:** ⬜ Pass  ⬜ Fail  ⬜ Needs Work

---

🎉 **Congratulations! Your BluePilot PWA is ready to fly!** ✈️
