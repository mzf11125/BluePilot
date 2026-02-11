# BluePilot PWA Showcase

A Progressive Web App demo showcasing BluePilot's hands-free DeFi trading platform.

## Features

- 🎨 Neo-brutalism design with sky blue + plane theme
- ✈️ Landing page with animated plane
- 📱 4 app screens: Home, Trade, Policy, History
- 🔗 RainbowKit wallet connection (Base network)
- 🎭 Interactive trade simulation with mock data
- 📦 Full PWA support (installable, offline-capable)

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Configuration

### WalletConnect Project ID

Update `src/lib/wagmi.ts` with your WalletConnect project ID:

```typescript
projectId: 'YOUR_PROJECT_ID'
```

Get one at: https://cloud.walletconnect.com

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS (neo-brutalism styling)
- RainbowKit + wagmi + viem
- React Router
- vite-plugin-pwa

## Project Structure

```
src/
├── pages/           # Route pages
├── components/      # Reusable components
│   └── ui/         # UI primitives
├── contexts/       # React contexts
├── lib/            # Utilities and config
└── assets/         # Static assets
```

## Demo Mode

This is a **demonstration app** with simulated blockchain interactions:
- No real transactions are executed
- Mock data for tokens, balances, and history
- Educational modals explain demo limitations
- RainbowKit connection is real (view-only)

## PWA Features

- Service worker for offline support
- Installable on mobile and desktop
- App manifest with Base brand colors
- Optimized caching strategy

## Design System

- **Colors**: Sky blue (#0EA5E9) primary, black borders
- **Typography**: Inter (sans), Roboto Mono (mono)
- **Style**: Neo-brutalism (thick borders, bold shadows)
- **Theme**: Plane in sky motif

## License

MIT
