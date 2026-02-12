import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'BluePilot',
  projectId: 'f4ed498f2fa28af856138682ac2bebb4', // Replace with actual WalletConnect project ID
  chains: [base, baseSepolia],
  ssr: false,
});

// OnchainKit configuration
export const onchainKitConfig = {
  apiKey: import.meta.env.VITE_ONCHAINKIT_API_KEY,
  chain: base, // Default to Base mainnet
};

