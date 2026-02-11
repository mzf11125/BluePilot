import { parseIntent } from '../intentParser';

describe('intentParser', () => {
  describe('Trade intents', () => {
    it('should parse swap command', () => {
      const result = parseIntent('swap 0.5 ETH for USDC');
      expect(result.type).toBe('trade');
      expect(result.action).toBe('swap');
      expect(result.params).toEqual({
        amount: '0.5',
        fromToken: 'ETH',
        toToken: 'USDC',
      });
    });

    it('should parse trade command', () => {
      const result = parseIntent('trade 1.5 WETH to DAI');
      expect(result.type).toBe('trade');
      expect(result.params?.amount).toBe('1.5');
    });

    it('should parse buy command', () => {
      const result = parseIntent('buy 100 USDC with ETH');
      expect(result.type).toBe('trade');
      expect(result.params?.fromToken).toBe('USDC');
    });
  });

  describe('Policy intents', () => {
    it('should parse slippage update', () => {
      const result = parseIntent('set max slippage to 3');
      expect(result.type).toBe('policy');
      expect(result.action).toBe('update_slippage');
      expect(result.params?.maxSlippage).toBe(3);
    });

    it('should parse trade size update', () => {
      const result = parseIntent('set max trade size to 2.5');
      expect(result.type).toBe('policy');
      expect(result.action).toBe('update_trade_size');
      expect(result.params?.maxTradeSize).toBe(2.5);
    });

    it('should parse cooldown update', () => {
      const result = parseIntent('set cooldown to 10');
      expect(result.type).toBe('policy');
      expect(result.action).toBe('update_cooldown');
      expect(result.params?.cooldown).toBe(10);
    });
  });

  describe('Query intents', () => {
    it('should parse history query', () => {
      const result = parseIntent('show my recent trades');
      expect(result.type).toBe('query');
      expect(result.action).toBe('show_history');
    });

    it('should parse policy query', () => {
      const result = parseIntent('show my current policy');
      expect(result.type).toBe('query');
      expect(result.action).toBe('show_policy');
    });

    it('should parse balance query', () => {
      const result = parseIntent("what's my balance");
      expect(result.type).toBe('query');
      expect(result.action).toBe('show_balance');
    });

    it('should parse transaction query', () => {
      const result = parseIntent('show transaction 0x1234abcd');
      expect(result.type).toBe('query');
      expect(result.action).toBe('show_transaction');
      expect(result.params?.hash).toBe('0x1234abcd');
    });
  });

  describe('Unknown intents', () => {
    it('should return unknown for unrecognized input', () => {
      const result = parseIntent('hello world');
      expect(result.type).toBe('unknown');
    });
  });
});
