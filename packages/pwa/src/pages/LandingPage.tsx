import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-300 relative overflow-hidden">
      {/* Animated plane */}
      <div className="absolute top-20 animate-[fly_20s_linear_infinite]">
        <img src="/plane.svg" alt="Plane" className="w-24 h-24" />
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 pt-20">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-black">
            BluePilot
          </h1>
          <p className="text-3xl md:text-4xl font-bold mb-8 text-black">
            Hands-Free DeFi Trading ✈️
          </p>
          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-black">
            Set your rules once—trade automatically and safely within them
          </p>
          <Button
            onClick={() => navigate('/app')}
            className="text-xl px-12 py-6"
          >
            Enter App →
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white border-4 border-black shadow-brutal-lg p-8">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-2xl font-bold mb-3">Policy-Based Automation</h3>
            <p className="text-lg">Set limits for trade size, slippage, and cooldowns. Smart contracts enforce them on-chain.</p>
          </div>

          <div className="bg-white border-4 border-black shadow-brutal-lg p-8">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-2xl font-bold mb-3">Conversational Control</h3>
            <p className="text-lg">Adjust strategies and manage policies through simple commands.</p>
          </div>

          <div className="bg-white border-4 border-black shadow-brutal-lg p-8">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-2xl font-bold mb-3">Mobile-First</h3>
            <p className="text-lg">Clean, fast interface with wallet connection and dark mode.</p>
          </div>

          <div className="bg-white border-4 border-black shadow-brutal-lg p-8">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-3">On-Chain Auditability</h3>
            <p className="text-lg">Every action is transparent and verifiable via Basescan.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-black">
          <p className="text-lg font-bold">Built on Base L2 🔵</p>
        </div>
      </div>

      <style>{`
        @keyframes fly {
          from {
            transform: translateX(-100px);
          }
          to {
            transform: translateX(calc(100vw + 100px));
          }
        }
      `}</style>
    </div>
  );
};
