/**
 * Retry utilities for handling rate limiting and transient failures
 * Following Base.org best practices for RPC interactions
 */

export interface RetryOptions {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  jitterMs: number;
  retryableStatusCodes: number[];
}

const DEFAULT_OPTIONS: RetryOptions = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 30000,
  jitterMs: 1000,
  retryableStatusCodes: [429, 502, 503, 504],
};

/**
 * Sleep for a specified duration
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay with jitter
 */
export function calculateBackoff(
  attempt: number,
  baseDelayMs: number,
  maxDelayMs: number,
  jitterMs: number
): number {
  // Exponential backoff: baseDelay * 2^attempt
  const exponentialDelay = baseDelayMs * Math.pow(2, attempt);

  // Cap at max delay
  const cappedDelay = Math.min(exponentialDelay, maxDelayMs);

  // Add jitter to prevent thundering herd
  const jitter = Math.random() * jitterMs;

  return cappedDelay + jitter;
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: any, retryableStatusCodes: number[]): boolean {
  // Check for HTTP status code
  if (error.status && retryableStatusCodes.includes(error.status)) {
    return true;
  }

  // Check for rate limiting in error message
  const message = error.message?.toLowerCase() || '';
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return true;
  }

  // Check for common RPC errors
  if (message.includes('429') || message.includes('rate') || message.includes('limit')) {
    return true;
  }

  // Check for network/timeout errors
  if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
    return true;
  }

  return false;
}

/**
 * Execute a function with retry logic and exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const { maxRetries, baseDelayMs, maxDelayMs, jitterMs, retryableStatusCodes } = opts;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Check if we should retry
      const isRetryable = isRetryableError(error, retryableStatusCodes);
      const isLastAttempt = attempt === maxRetries;

      if (!isRetryable || isLastAttempt) {
        throw error;
      }

      // Calculate backoff delay
      const delay = calculateBackoff(attempt, baseDelayMs, maxDelayMs, jitterMs);

      console.warn(
        `[Retry] Attempt ${attempt + 1}/${maxRetries} failed, retrying in ${Math.round(delay)}ms:`,
        error.message
      );

      await sleep(delay);
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError || new Error('Max retries exceeded');
}

/**
 * Specialized retry wrapper for RPC calls
 */
export async function withRpcRetry<T>(fn: () => Promise<T>): Promise<T> {
  return withRetry(fn, {
    maxRetries: 3,
    baseDelayMs: 1000,
    maxDelayMs: 30000,
    jitterMs: 1000,
    retryableStatusCodes: [429, 502, 503, 504],
  });
}

/**
 * Extract retry-after header value from error if present
 */
export function getRetryAfter(error: any): number | null {
  const retryAfter = error.response?.headers?.['retry-after'];
  if (retryAfter) {
    const seconds = parseInt(retryAfter, 10);
    if (!isNaN(seconds)) {
      return seconds;
    }
  }
  return null;
}
