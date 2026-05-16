import { Request, Response, NextFunction } from 'express';
import { Lead } from '../models/Lead';
import { AppError, asyncHandler } from './errorHandler';

// ─── Ownership Middleware ──────────────────────────────────────────────────────
// Verifies that req.user is the owner of the lead OR has admin role.
// Must run after authMiddleware (requires req.user).
// Short-circuits with 403 if unauthorized, 404 if lead not found.

export const checkLeadOwnership = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const lead = await Lead.findById(req.params['id']);

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    const isOwner = lead.owner.toString() === req.user!.id;
    const isAdmin = req.user!.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new AppError('You are not authorized to modify this lead', 403);
    }

    next();
  },
);
