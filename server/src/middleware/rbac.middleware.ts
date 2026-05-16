import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types/user.types';

// ─── RBAC Middleware Factory ───────────────────────────────────────────────────
// Returns a middleware that restricts access to the specified roles.
// Must be used AFTER authMiddleware (requires req.user to be populated).
//
// Usage:
//   router.delete('/:id', authMiddleware, requireRole('admin'), deleteController)
//   router.post('/', authMiddleware, requireRole('admin', 'sales'), createController)

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Guard: authMiddleware should always run first
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    if (!roles.includes(req.user.role as UserRole)) {
      res.status(403).json({
        success: false,
        message: `Access denied — requires role: ${roles.join(' or ')}`,
      });
      return;
    }

    next();
  };
}
