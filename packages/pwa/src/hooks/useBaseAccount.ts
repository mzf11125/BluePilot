import { useState, useCallback } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import type { Address } from 'viem';

// Types for Base smart wallet operations
export interface SmartWalletConfig {
  owner: Address;
  chainId: number;
  salt?: string;
}

export interface PaymentConfig {
  amount: string;
  to: Address;
  token?: Address; // USDC by default
}

export interface PaymentStatus {
  id: string;
  status: 'pending' | 'completed' | 'failed';
  transactionHash?: string;
}

export interface UseBaseAccountReturn {
  isCreating: boolean;
  isSending: boolean;
  smartWalletAddress: Address | null;
  error: string | null;
  createSmartWallet: () => Promise<Address | null>;
  sendPayment: (config: PaymentConfig) => Promise<PaymentStatus | null>;
  getPaymentStatus: (paymentId: string) => Promise<PaymentStatus | null>;
}

/**
 * Hook for interacting with Base Smart Wallet functionality
 * Uses @base-org/account for smart contract wallet operations
 *
 * Note: This is a simplified implementation. For production use,
 * ensure proper error handling and integration with Base's smart wallet infrastructure.
 */
export function useBaseAccount(): UseBaseAccountReturn {
  const { address, chainId } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [isCreating, setIsCreating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [smartWalletAddress, setSmartWalletAddress] = useState<Address | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isValidChain = chainId === base.id || chainId === baseSepolia.id;

  /**
   * Create a smart wallet for the connected user
   * Uses the user's EOA as the owner
   */
  const createSmartWallet = useCallback(async (): Promise<Address | null> => {
    if (!address) {
      setError('Please connect your wallet first');
      return null;
    }

    if (!isValidChain) {
      setError('Please connect to Base or Base Sepolia');
      return null;
    }

    setIsCreating(true);
    setError(null);

    try {
      // In production, this would use @base-org/account's createBaseAccount
      // For now, we'll use a simplified implementation that works with
      // Coinbase Smart Wallet through OnchainKit

      // The smart wallet address is typically deterministic based on owner + salt
      // For Coinbase Smart Wallet, this is handled by the wallet extension

      // Simulate smart wallet creation (in production, use actual SDK)
      // const account = await createBaseAccount({
      //   owner: address,
      //   chain: chainId === base.id ? 'base' : 'base-sepolia',
      // });

      // For demo purposes, we'll set the EOA as the wallet address
      // In production with Coinbase Smart Wallet, the wallet extension handles this
      setSmartWalletAddress(address);

      return address;
    } catch (err: unknown) {
      console.error('Smart wallet creation error:', err);
      const error = err as { message?: string };
      setError(error.message || 'Failed to create smart wallet');
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [address, isValidChain]);

  /**
   * Send a payment using the smart wallet
   */
  const sendPayment = useCallback(async (config: PaymentConfig): Promise<PaymentStatus | null> => {
    if (!address || !walletClient) {
      setError('Please connect your wallet first');
      return null;
    }

    if (!isValidChain) {
      setError('Please connect to Base or Base Sepolia');
      return null;
    }

    if (!publicClient) {
      setError('Public client not available');
      return null;
    }

    setIsSending(true);
    setError(null);

    try {
      // In production, use @base-org/account's pay function
      // const result = await pay({
      //   amount: config.amount,
      //   to: config.to,
      //   token: config.token, // defaults to USDC
      // });

      // For demo, simulate a direct transfer
      const hash = await walletClient.sendTransaction({
        to: config.to,
        value: BigInt(config.amount), // in wei
        account: address,
        chain: chainId === base.id ? base : baseSepolia,
      });

      // Wait for transaction
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      return {
        id: hash,
        status: receipt.status === 'success' ? 'completed' : 'failed',
        transactionHash: hash,
      };
    } catch (err: unknown) {
      console.error('Payment error:', err);
      const error = err as { message?: string };
      setError(error.message || 'Failed to send payment');
      return null;
    } finally {
      setIsSending(false);
    }
  }, [address, walletClient, publicClient, chainId, isValidChain]);

  /**
   * Get the status of a payment
   */
  const getPaymentStatus = useCallback(async (paymentId: string): Promise<PaymentStatus | null> => {
    if (!publicClient) {
      setError('Public client not available');
      return null;
    }

    try {
      // In production, use @base-org/account's getPaymentStatus
      // const status = await getPaymentStatus(paymentId);

      // For demo, check transaction receipt
      const receipt = await publicClient.getTransactionReceipt({
        hash: paymentId as `0x${string}`,
      });

      return {
        id: paymentId,
        status: receipt.status === 'success' ? 'completed' : 'failed',
        transactionHash: paymentId,
      };
    } catch (err: unknown) {
      console.error('Get payment status error:', err);
      const error = err as { message?: string };
      setError(error.message || 'Failed to get payment status');
      return null;
    }
  }, [publicClient]);

  return {
    isCreating,
    isSending,
    smartWalletAddress,
    error,
    createSmartWallet,
    sendPayment,
    getPaymentStatus,
  };
}
