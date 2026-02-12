import { useState, useCallback, useEffect } from 'react';
import { useAccount, useSignMessage, useChainId } from 'wagmi';
import {
  createSIWEMessage,
  generateNonce,
  getSession,
  setSession,
  clearSession,
  isValidChain,
  SIWESession,
} from '../lib/siwe';

interface UseSIWEReturn {
  isSignedIn: boolean;
  isSigningIn: boolean;
  signInError: string | null;
  session: SIWESession | null;
  signIn: () => Promise<void>;
  signOut: () => void;
}

export function useSIWE(): UseSIWEReturn {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();

  const [session, setSessionState] = useState<SIWESession | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  // Load existing session on mount
  useEffect(() => {
    const existingSession = getSession();
    if (existingSession) {
      setSessionState(existingSession);
    }
  }, []);

  // Clear session if wallet disconnects or changes
  useEffect(() => {
    if (!isConnected) {
      clearSession();
      setSessionState(null);
    } else if (session && address && session.address.toLowerCase() !== address.toLowerCase()) {
      // Wallet changed - clear session
      clearSession();
      setSessionState(null);
    }
  }, [isConnected, address, session]);

  const signIn = useCallback(async () => {
    if (!address || !isConnected) {
      setSignInError('Please connect your wallet first');
      return;
    }

    if (!isValidChain(chainId)) {
      setSignInError('Please connect to Base or Base Sepolia');
      return;
    }

    setIsSigningIn(true);
    setSignInError(null);

    try {
      const nonce = generateNonce();
      const message = createSIWEMessage(address, chainId, nonce);
      const messageStr = message.prepareMessage();

      // Request signature from wallet
      await signMessageAsync({ message: messageStr });

      // Store session (in production, verify server-side first)
      setSession(address, chainId);

      const newSession = getSession();
      setSessionState(newSession);
    } catch (error: unknown) {
      console.error('SIWE sign-in error:', error);
      const err = error as { code?: number; message?: string };
      if (err.code === 4001) {
        setSignInError('Signature rejected');
      } else {
        setSignInError(err.message || 'Failed to sign in');
      }
    } finally {
      setIsSigningIn(false);
    }
  }, [address, isConnected, chainId, signMessageAsync]);

  const signOut = useCallback(() => {
    clearSession();
    setSessionState(null);
    setSignInError(null);
  }, []);

  return {
    isSignedIn: session !== null,
    isSigningIn,
    signInError,
    session,
    signIn,
    signOut,
  };
}
