import { Request, Response, NextFunction } from 'express';

// ─── Custom Error Class ───────────────────────────────────────────────────────

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    // Maintains proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// ─── Async Handler ────────────────────────────────────────────────────────────
// Wraps async route handlers to forward errors to the global error middleware
// instead of requiring try/catch in every controller.

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export function asyncHandler(fn: AsyncHandler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}

// ─── Global Error Handler ─────────────────────────────────────────────────────
// Must be registered last in Express middleware chain (4-arg signature required).

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error('[ErrorHandler]', {
    name: err.name,
    message: err.message,
    stack: process.env['NODE_ENV'] === 'development' ? err.stack : undefined,
  });

  // Operational errors (thrown via AppError) — safe to expose
  if (err instanceof AppError && err.isOperational) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  // Mongoose: document validation failed
  if (err.name === 'ValidationError') {
    res.status(400).json({ success: false, message: err.message });
    return;
  }

  // Mongoose: invalid ObjectId cast
  if (err.name === 'CastError') {
    res.status(400).json({ success: false, message: 'Invalid resource ID format' });
    return;
  }

  // MongoDB: duplicate key (e.g., email already exists)
  if ('code' in err && (err as NodeJS.ErrnoException).code === 'MONGO_DUPLICATE_KEY') {
    res.status(409).json({ success: false, message: 'Resource already exists' });
    return;
  }

  // JWT: malformed token
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ success: false, message: 'Invalid authentication token' });
    return;
  }

  // JWT: expired token
  if (err.name === 'TokenExpiredError') {
    res.status(401).json({ success: false, message: 'Authentication token expired' });
    return;
  }

  // Unknown/unhandled — never expose internals in production
  res.status(500).json({ success: false, message: 'Internal server error' });
}
