// ─── Express Request Extension ────────────────────────────────────────────────
// Augments the Express Request type so that req.user is strongly typed
// across all authenticated route handlers. Populated by authMiddleware.

declare namespace Express {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: 'admin' | 'sales';
    };
  }
}
