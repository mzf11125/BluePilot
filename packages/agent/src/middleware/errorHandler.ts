import { Request, Response, NextFunction } from 'express';

// Standardized error envelope format for Base.org best practices
export interface BaseError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  retryAfter?: number;
}

// Error codes following Base.org conventions
export enum ErrorCode {
  // Client errors
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PARSE_ERROR = 'PARSE_ERROR',

  // Rate limiting
  RATE_LIMITED = 'RATE_LIMITED',

  // Blockchain errors
  RPC_ERROR = 'RPC_ERROR',
  CONTRACT_ERROR = 'CONTRACT_ERROR',
  SIMULATION_FAILED = 'SIMULATION_FAILED',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  GAS_ESTIMATION_FAILED = 'GAS_ESTIMATION_FAILED',

  // Policy errors
  POLICY_VIOLATION = 'POLICY_VIOLATION',

  // Server errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
}

// HTTP status code mapping
const statusCodeMap: Record<ErrorCode, number> = {
  [ErrorCode.BAD_REQUEST]: 400,
  [ErrorCode.UNAUTHORIZED]: 401,
  [ErrorCode.FORBIDDEN]: 403,
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.VALIDATION_ERROR]: 400,
  [ErrorCode.PARSE_ERROR]: 400,
  [ErrorCode.RATE_LIMITED]: 429,
  [ErrorCode.RPC_ERROR]: 502,
  [ErrorCode.CONTRACT_ERROR]: 502,
  [ErrorCode.SIMULATION_FAILED]: 422,
  [ErrorCode.INSUFFICIENT_BALANCE]: 400,
  [ErrorCode.GAS_ESTIMATION_FAILED]: 502,
  [ErrorCode.POLICY_VIOLATION]: 400,
  [ErrorCode.INTERNAL_ERROR]: 500,
  [ErrorCode.SERVICE_UNAVAILABLE]: 503,
  [ErrorCode.TIMEOUT]: 504,
};

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: Record<string, unknown>,
    public retryAfter?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }

  toJSON(): BaseError {
    const error: BaseError = {
      code: this.code,
      message: this.message,
    };
    if (this.details) error.details = this.details;
    if (this.retryAfter) error.retryAfter = this.retryAfter;
    return error;
  }

  get statusCode(): number {
    return statusCodeMap[this.code] || 500;
  }
}

/**
 * Helper functions to create common errors
 */
export const Errors = {
  badRequest: (message: string, details?: Record<string, unknown>) =>
    new ApiError(ErrorCode.BAD_REQUEST, message, details),

  unauthorized: (message = 'Authentication required') =>
    new ApiError(ErrorCode.UNAUTHORIZED, message),

  forbidden: (message = 'Access denied') =>
    new ApiError(ErrorCode.FORBIDDEN, message),

  notFound: (resource: string) =>
    new ApiError(ErrorCode.NOT_FOUND, `${resource} not found`),

  validationError: (errors: Record<string, string>) =>
    new ApiError(ErrorCode.VALIDATION_ERROR, 'Validation failed', errors),

  rateLimited: (retryAfter: number) =>
    new ApiError(ErrorCode.RATE_LIMITED, 'Too many requests', undefined, retryAfter),

  rpcError: (message: string, details?: Record<string, unknown>) =>
    new ApiError(ErrorCode.RPC_ERROR, message, details),

  contractError: (message: string, details?: Record<string, unknown>) =>
    new ApiError(ErrorCode.CONTRACT_ERROR, message, details),

  simulationFailed: (reason: string) =>
    new ApiError(ErrorCode.SIMULATION_FAILED, `Simulation failed: ${reason}`),

  policyViolation: (violations: string[]) =>
    new ApiError(ErrorCode.POLICY_VIOLATION, 'Policy violation', { violations }),

  internal: (message = 'Internal server error') =>
    new ApiError(ErrorCode.INTERNAL_ERROR, message),

  serviceUnavailable: (service: string) =>
    new ApiError(ErrorCode.SERVICE_UNAVAILABLE, `${service} is temporarily unavailable`),
};

/**
 * Error handler middleware
 */
export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(`[Error] ${req.method} ${req.path}:`, err);

  if (err instanceof ApiError) {
    const response: BaseError = err.toJSON();
    res.status(err.statusCode).json(response);
    return;
  }

  // Handle unknown errors
  const response: BaseError = {
    code: ErrorCode.INTERNAL_ERROR,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  };

  res.status(500).json(response);
}

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
