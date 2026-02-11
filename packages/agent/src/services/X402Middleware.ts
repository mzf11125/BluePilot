import { Request, Response, NextFunction } from 'express';
import { ethers } from 'ethers';

interface X402Config {
  walletAddress: string;
  usdcAddress: string;
  chainId: string;
  amount: string; // in USDC (e.g., "0.001")
  facilitatorUrl?: string;
}

interface PaymentProof {
  x402Version: number;
  payer: string;
  payTo: string;
  amount: string;
  asset: string;
  network: string;
  signature: string;
  timestamp: number;
}

export class X402Middleware {
  private config: X402Config;

  constructor(config: X402Config) {
    this.config = {
      facilitatorUrl: 'https://facilitator.x402.org',
      ...config
    };
  }

  // Middleware to require payment
  requirePayment(amount?: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const paymentHeader = req.headers['payment-signature'] as string;

      if (!paymentHeader) {
        return this.send402Response(res, amount || this.config.amount, req.originalUrl);
      }

      try {
        const isValid = await this.verifyPayment(paymentHeader, amount || this.config.amount);
        
        if (isValid) {
          next();
        } else {
          return this.send402Response(res, amount || this.config.amount, req.originalUrl);
        }
      } catch (error: any) {
        console.error('Payment verification error:', error.message);
        return this.send402Response(res, amount || this.config.amount, req.originalUrl);
      }
    };
  }

  private send402Response(res: Response, amount: string, url: string) {
    const amountInSmallestUnit = ethers.parseUnits(amount, 6).toString(); // USDC has 6 decimals

    res.status(402).json({
      x402Version: 2,
      error: 'Payment required to access this resource',
      resource: {
        url: `http://localhost:${process.env.PORT || 3000}${url}`,
        description: `Payment required for ${url}`,
        mimeType: 'application/json'
      },
      accepts: [
        {
          scheme: 'exact',
          network: this.config.chainId, // e.g., "eip155:84532" for Base Sepolia
          amount: amountInSmallestUnit,
          asset: this.config.usdcAddress,
          payTo: this.config.walletAddress,
          maxTimeoutSeconds: 600,
          extra: {
            name: 'USDC',
            version: '2'
          }
        }
      ],
      extensions: {}
    });
  }

  private async verifyPayment(paymentHeader: string, expectedAmount: string): Promise<boolean> {
    try {
      // Decode base64 payment proof
      const decoded = Buffer.from(paymentHeader, 'base64').toString('utf-8');
      const proof: PaymentProof = JSON.parse(decoded);

      // Basic validation
      if (proof.x402Version !== 2) return false;
      if (proof.payTo.toLowerCase() !== this.config.walletAddress.toLowerCase()) return false;
      if (proof.asset.toLowerCase() !== this.config.usdcAddress.toLowerCase()) return false;
      if (proof.network !== this.config.chainId) return false;

      // Verify amount
      const expectedAmountWei = ethers.parseUnits(expectedAmount, 6).toString();
      if (proof.amount !== expectedAmountWei) return false;

      // Verify signature (EIP-712)
      const domain = {
        name: 'x402 Payment',
        version: '2',
        chainId: parseInt(this.config.chainId.split(':')[1]),
        verifyingContract: this.config.usdcAddress
      };

      const types = {
        Payment: [
          { name: 'payer', type: 'address' },
          { name: 'payTo', type: 'address' },
          { name: 'amount', type: 'uint256' },
          { name: 'asset', type: 'address' },
          { name: 'timestamp', type: 'uint256' }
        ]
      };

      const value = {
        payer: proof.payer,
        payTo: proof.payTo,
        amount: proof.amount,
        asset: proof.asset,
        timestamp: proof.timestamp
      };

      const recoveredAddress = ethers.verifyTypedData(domain, types, value, proof.signature);
      
      if (recoveredAddress.toLowerCase() !== proof.payer.toLowerCase()) {
        return false;
      }

      // Check timestamp (not expired - within 10 minutes)
      const now = Math.floor(Date.now() / 1000);
      if (now - proof.timestamp > 600) {
        return false;
      }

      console.log(`✅ Payment verified: ${proof.payer} paid ${expectedAmount} USDC`);
      return true;

    } catch (error: any) {
      console.error('Payment verification failed:', error.message);
      return false;
    }
  }
}
