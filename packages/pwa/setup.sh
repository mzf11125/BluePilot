#!/bin/bash
# BluePilot PWA - Quick Start Script

echo "🚀 BluePilot PWA Setup"
echo "====================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Please run this script from packages/pwa directory"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Installation failed"
    exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Update WalletConnect Project ID in src/lib/wagmi.ts"
echo "2. Run: npm run dev"
echo "3. Visit: http://localhost:5173"
echo ""
echo "📚 Documentation:"
echo "- SETUP.md - Detailed setup guide"
echo "- IMPLEMENTATION_SUMMARY.md - What was built"
echo "- PWA_README.md - Feature overview"
echo ""
echo "✈️ Happy flying with BluePilot!"
