import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useState, useEffect } from 'react';

// SVG Icon Components
const RocketIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.05-11.98L12 2.25l-5.64 2.14a14.98 14.98 0 0 0 6.05 11.98v4.8a6 6 0 0 1-5.84-7.38m0 0a6 6 0 0 1-1.12-3.82m.02 10.52c.55-.18.53-.38.9-.92l.05-.02m-5.74 2.5a14.98 14.98 0 0 1 6.06-11.95M12 2.25c-.9 0-1.78.12-2.61.34m7.98 10.02a14.98 14.98 0 0 0-6.06-11.95" />
  </svg>
);

const ChatIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.067.29 2.167.82 2.345 1.417a4.58 4.58 0 0 0 2.064-2.08c1.263-.086 2.486-.416 2.833-.82A4.56 4.56 0 0 0 15.724 8.383M7.5 8.25c0 .925.396 1.766 1.052 2.27" />
  </svg>
);

const ShieldIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.696q-.327-.093-.656-.198l-5.922-2.68a2.25 2.25 0 0 1-1.118-1.951L4.41 5.086a2.25 2.25 0 0 1 1.874-1.348L12 2.25l5.716 1.488a2.25 2.25 0 0 1 1.874 1.348l-.394 7.78a2.25 2.25 0 0 1-1.118 1.952l-5.922 2.68a2.25 2.25 0 0 1-.813-.157M12 2.25v15M4.41 5.086l7.59 3.664M19.59 5.086l-7.59 3.664" />
  </svg>
);

const TargetIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 3.75.09-3.75-9 10.5a3 3 0 0 1 3-1.5c1.66 0 3 1.34 3 3s-1.34 3-3 3c0 1.5.9 3 2.25 4.5M12 2.25v3.75m0 9.75v-3.75" />
  </svg>
);

const ControlIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.848 8.25c1.534 0 2.822-.15 3.924-.428l.514 1.48a.75.75 0 0 1-1.418.524l-.514-1.48a11.963 11.963 0 0 1-6.628 0l-.514 1.48a.75.75 0 0 1-1.418-.524l.514-1.48c1.102.278 2.39.428 3.924.428V6.75a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 .75.75v1.5c1.534 0 2.822-.15 3.924-.428l.514-1.48a.75.75 0 0 1 1.418.524l-.514 1.48a11.963 11.963 0 0 0 6.628 0l.514-1.48a.75.75 0 0 1 1.418-.524l-.514 1.48c-1.102.278-2.39.428-3.924.428V6.75a.75.75 0 0 0-.75-.75H9a.75.75 0 0 0-.75.75v1.5Z" />
  </svg>
);

const MobileIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 inline ml-1">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 inline ml-1">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
  </svg>
);

export const LandingPage = () => {
  const navigate = useNavigate();
  const [bannerIndex, setBannerIndex] = useState(0);

  const banners = [
    { text: "Trade memecoins from RobinPump.fun with AI!", color: "from-purple-400 to-pink-400", icon: <RocketIcon /> },
    { text: "Just say: 'swap 1 ETH for PEPE'", color: "from-green-400 to-blue-400", icon: <ChatIcon /> },
    { text: "Safe trading with on-chain policy enforcement", color: "from-yellow-400 to-orange-400", icon: <ShieldIcon /> },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-300 relative overflow-hidden">
      {/* Minecraft-style Banner */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <div className={`bg-gradient-to-r ${banners[bannerIndex].color} border-b-4 border-black py-4 px-4 text-center transform transition-all duration-500`}>
          <div className="flex items-center justify-center gap-3">
            <span className="text-black">
              {banners[bannerIndex].icon}
            </span>
            <p className="text-xl md:text-2xl font-bold text-black">
              {banners[bannerIndex].text}
            </p>
          </div>
        </div>
      </div>

      {/* Animated plane */}
      <div className="absolute top-32 animate-fly-slow">
        <img src="/plane.svg" alt="BluePilot airplane logo" className="w-24 h-24" />
      </div>

      <div className="container mx-auto px-4 py-12 pt-24">
        {/* Hero Section */}
        <div className="text-center mb-16 pt-12">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-black">
            BluePilot
          </h1>
          <p className="text-3xl md:text-4xl font-bold mb-8 text-black flex items-center justify-center gap-2">
            <span>Hands-Free DeFi Trading</span>
            <RocketIcon className="w-10 h-10" />
          </p>
          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto text-black">
            Set your rules once—trade automatically and safely within them
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate('/app')}
              className="text-xl px-12 py-6"
            >
              Enter App <ArrowRightIcon />
            </Button>
            <Button
              onClick={() => navigate('/docs')}
              variant="secondary"
              className="text-xl px-12 py-6"
            >
              API Docs <BookIcon />
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card interactive className="p-8">
            <div className="mb-4 text-sky">
              <TargetIcon className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold mb-3">RobinPump.fun Integration</h3>
            <p className="text-lg">Trade memecoins directly through conversation. Just tell the AI what you want!</p>
          </Card>

          <Card interactive className="p-8">
            <div className="mb-4 text-sky">
              <ShieldIcon className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Policy-Based Automation</h3>
            <p className="text-lg">Set limits for trade size, slippage, and cooldowns. Smart contracts enforce them on-chain.</p>
          </Card>

          <Card interactive className="p-8">
            <div className="mb-4 text-sky">
              <ControlIcon className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Conversational Control</h3>
            <p className="text-lg">Adjust strategies and manage policies through simple commands.</p>
          </Card>

          <Card interactive className="p-8">
            <div className="mb-4 text-sky">
              <MobileIcon className="w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Mobile-First</h3>
            <p className="text-lg">Clean, fast interface with wallet connection and dark mode.</p>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-black flex items-center justify-center gap-2 flex-wrap">
          <span className="text-lg font-bold">Built on Base L2</span>
          <span className="w-3 h-3 rounded-full bg-sky inline-block"></span>
          <span className="text-lg font-bold">Powered by RobinPump.fun</span>
          <RocketIcon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
