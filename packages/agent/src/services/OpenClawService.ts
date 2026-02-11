import axios from 'axios';
import { TradeIntent } from '../types';

export class OpenClawService {
  private gatewayToken: string;
  private baseUrl = 'https://api.openclaw.ai/v1';

  constructor(gatewayToken: string) {
    this.gatewayToken = gatewayToken;
  }

  async parseTradeIntent(userMessage: string, context?: string): Promise<TradeIntent | null> {
    try {
      const prompt = `${context ? context + '\n\n' : ''}Parse this trading command and extract:
- tokenIn (address or symbol, use "0x0000000000000000000000000000000000000000" for ETH)
- tokenOut (address or symbol, use "0x0000000000000000000000000000000000000000" for ETH)
- amountIn (in wei for ETH, or token decimals)

User command: "${userMessage}"

Respond ONLY with JSON in this exact format:
{"tokenIn": "address", "tokenOut": "address", "amountIn": "amount"}`;

      const response = await axios.post(
        `${this.baseUrl}/chat`,
        {
          model: 'gemini-pro',
          messages: [{ role: 'user', content: prompt }]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.gatewayToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      const content = response.data.choices?.[0]?.message?.content || response.data.response;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          tokenIn: parsed.tokenIn,
          tokenOut: parsed.tokenOut,
          amountIn: parsed.amountIn
        };
      }

      return null;
    } catch (error: any) {
      console.error('OpenClaw Gateway error:', error.response?.data || error.message);
      return null;
    }
  }
}
