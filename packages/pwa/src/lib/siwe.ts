import { SiweMessage } from 'siwe';
import { base, baseSepolia } from 'wagmi/chains';

export interface SIWESession {
  address: string;
  chainId: number;
  expiresAt: number;
}

const SESSION_KEY = 'bluepilot_siwe_session';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function createSIWEMessage(
  address: string,
  chainId: number,
  nonce: string
): SiweMessage {
  const domain = window.location.host;
  const origin = window.location.origin;

  return new SiweMessage({
    domain,
    address,
    statement: 'Sign in to BluePilot with your wallet.',
    uri: origin,
    version: '1',
    chainId,
    nonce,
    // ERC-6492 compatible - allows for smart contract wallet signatures
    // The signature verification will handle both EOA and smart contract wallets
  });
}

export function generateNonce(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function getSession(): SIWESession | null {
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;

  try {
    const session: SIWESession = JSON.parse(stored);
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function setSession(address: string, chainId: number): void {
  const session: SIWESession = {
    address,
    chainId,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function isValidChain(chainId: number): boolean {
  return chainId === base.id || chainId === baseSepolia.id;
}

/**
 * Verifies a SIWE signature.
 * For production, this should be done server-side with proper ERC-6492 support.
 * This client-side implementation is a simplified version for demo purposes.
 */
export async function verifySignature(
  message: SiweMessage,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _signature: string
): Promise<boolean> {
  try {
    // In production, verify server-side with @base-org/account or similar
    // For demo: We trust the signature was created by the connected wallet
    // In production, use server-side verification with ERC-6492 support
    // to properly validate smart contract wallet signatures

    // Basic validation: ensure the message was properly constructed
    if (!message.address || !message.nonce || !message.chainId) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('SIWE verification error:', error);
    return false;
  }
}

/**
 * Server-side verification helper (for future implementation)
 * This would be called from your backend API
 */
export interface VerifyRequest {
  message: string;
  signature: string;
}

export interface VerifyResponse {
  success: boolean;
  error?: string;
  session?: SIWESession;
}
