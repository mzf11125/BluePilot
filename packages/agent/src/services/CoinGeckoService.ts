import axios from 'axios';

export class CoinGeckoService {
  private apiKey: string;
  private baseUrl = 'https://api.coingecko.com/api/v3';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getTokenPrice(tokenAddress: string): Promise<number | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/simple/token_price/base`, {
        params: {
          contract_addresses: tokenAddress,
          vs_currencies: 'usd',
          x_cg_demo_api_key: this.apiKey
        }
      });

      const price = response.data[tokenAddress.toLowerCase()]?.usd;
      return price || null;
    } catch (error: any) {
      console.error('CoinGecko API error:', error.response?.data || error.message);
      return null;
    }
  }

  async getMultipleTokenPrices(tokenAddresses: string[]): Promise<Record<string, number>> {
    try {
      const response = await axios.get(`${this.baseUrl}/simple/token_price/base`, {
        params: {
          contract_addresses: tokenAddresses.join(','),
          vs_currencies: 'usd',
          x_cg_demo_api_key: this.apiKey
        }
      });

      const prices: Record<string, number> = {};
      for (const addr of tokenAddresses) {
        const price = response.data[addr.toLowerCase()]?.usd;
        if (price) prices[addr.toLowerCase()] = price;
      }
      return prices;
    } catch (error: any) {
      console.error('CoinGecko API error:', error.response?.data || error.message);
      return {};
    }
  }

  formatUSD(amount: string, decimals: number, price: number): string {
    const value = (Number(amount) / Math.pow(10, decimals)) * price;
    return `$${value.toFixed(2)}`;
  }
}
