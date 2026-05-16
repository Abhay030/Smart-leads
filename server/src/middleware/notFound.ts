import { Request, Response } from 'express';

// ─── 404 Handler ──────────────────────────────────────────────────────────────
// Registered after all valid routes. Catches any unmatched request.

export function notFound(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
}
