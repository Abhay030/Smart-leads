import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { getDBStatus } from '../config/db';

// ─── GET /api/health ──────────────────────────────────────────────────────────

export const getHealth = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const dbStatus = getDBStatus();

  res.status(200).json({
    success: true,
    message: 'API running',
    data: {
      status: 'healthy',
      uptime: `${Math.floor(process.uptime())}s`,
      db: dbStatus,
      env: process.env['NODE_ENV'],
      timestamp: new Date().toISOString(),
    },
  });
});
