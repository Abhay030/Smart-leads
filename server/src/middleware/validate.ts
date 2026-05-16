import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

// ─── Validation Result Handler ────────────────────────────────────────────────
// Reads express-validator results from the request and short-circuits
// with a 422 if any rule failed. Used as the final step in a validator array
// before the controller: [...rules, validate, controller]

export function validate(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    next();
    return;
  }

  // Map to a consistent { field, message } shape
  // 'path' is the field name in express-validator v7+
  const formatted = errors.array().map((err) => ({
    field: 'path' in err ? (err as { path: string; msg: string }).path : 'unknown',
    message: (err as { msg: string }).msg,
  }));

  res.status(422).json({
    success: false,
    message: 'Validation failed',
    errors: formatted,
  });
}
