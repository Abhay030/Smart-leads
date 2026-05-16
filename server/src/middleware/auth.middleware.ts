import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

// ─── Auth Middleware ──────────────────────────────────────────────────────────
// Extracts and verifies the Bearer JWT from the Authorization header.
// Attaches the decoded payload to req.user for downstream use.
// jwt.verify errors (JsonWebTokenError, TokenExpiredError) bubble up
// to the global error handler automatically.

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Authorization header missing or malformed',
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Token not provided',
    });
    return;
  }

  // verifyToken throws on invalid/expired — caught by global error handler
  const payload = verifyToken(token);

  req.user = {
    id: payload.userId,
    email: payload.email,
    role: payload.role,
  };

  next();
}
