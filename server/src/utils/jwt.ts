import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { JwtPayload } from '../types/user.types';

// ─── Sign ─────────────────────────────────────────────────────────────────────

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '7d',
    algorithm: 'HS256',
  });
}

// ─── Verify ───────────────────────────────────────────────────────────────────

export function verifyToken(token: string): JwtPayload {
  // jwt.verify throws JsonWebTokenError or TokenExpiredError on failure
  // — both are caught by the global error handler in errorHandler.ts
  const decoded = jwt.verify(token, env.JWT_SECRET);
  return decoded as JwtPayload;
}
