import { Router } from 'express';
import {
  listLeads,
  exportLeads,
  getLead,
  createLeadController,
  updateLeadController,
  deleteLeadController,
} from '../controllers/lead.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { checkLeadOwnership } from '../middleware/ownership.middleware';
import { createLeadValidator, updateLeadValidator } from '../validators/lead.validator';
import { validate } from '../middleware/validate';

const router = Router();

// All leads routes require authentication
router.use(authMiddleware);

// ─── IMPORTANT: /export MUST be registered before /:id ───────────────────────
// Otherwise Express treats "export" as the :id parameter value.

// GET /api/leads/export
router.get('/export', exportLeads);

// GET /api/leads
router.get('/', listLeads);

// GET /api/leads/:id
router.get('/:id', getLead);

// POST /api/leads  (any authenticated user)
router.post('/', createLeadValidator, validate, createLeadController);

// PUT /api/leads/:id  (owner or admin)
router.put('/:id', checkLeadOwnership, updateLeadValidator, validate, updateLeadController);

// DELETE /api/leads/:id  (admin only)
router.delete('/:id', requireRole('admin'), deleteLeadController);

export default router;
