import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { sendSuccess, sendCreated, sendPaginated } from '../utils/apiResponse';
import { generateLeadsCSV } from '../utils/csv-export';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getLeadsForExport,
} from '../services/lead.service';
import { CreateLeadDto, UpdateLeadDto, LeadQueryParams } from '../types/lead.types';

// ─── GET /api/leads ───────────────────────────────────────────────────────────

export const listLeads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const params: LeadQueryParams = {
    status: req.query['status'] as LeadQueryParams['status'],
    source: req.query['source'] as LeadQueryParams['source'],
    search: req.query['search'] as string | undefined,
    sort: req.query['sort'] as LeadQueryParams['sort'],
    page: req.query['page'] as string | undefined,
    limit: req.query['limit'] as string | undefined,
  };

  const result = await getLeads(params);
  sendPaginated(res, result.leads, result.page, result.limit, result.total);
});

// ─── GET /api/leads/export ────────────────────────────────────────────────────

export const exportLeads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const params: LeadQueryParams = {
    status: req.query['status'] as LeadQueryParams['status'],
    source: req.query['source'] as LeadQueryParams['source'],
    search: req.query['search'] as string | undefined,
    sort: req.query['sort'] as LeadQueryParams['sort'],
  };

  const leads = await getLeadsForExport(params);
  const csv = generateLeadsCSV(leads);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="leads-${Date.now()}.csv"`);
  res.status(200).send(csv);
});

// ─── GET /api/leads/:id ───────────────────────────────────────────────────────

export const getLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const lead = await getLeadById(req.params['id'] ?? '');
  sendSuccess(res, lead, 'Lead retrieved');
});

// ─── POST /api/leads ──────────────────────────────────────────────────────────

export const createLeadController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as CreateLeadDto;
    const lead = await createLead(dto, req.user!.id);
    sendCreated(res, lead, 'Lead created');
  },
);

// ─── PUT /api/leads/:id ───────────────────────────────────────────────────────

export const updateLeadController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as UpdateLeadDto;
    const lead = await updateLead(req.params['id'] ?? '', dto);
    sendSuccess(res, lead, 'Lead updated');
  },
);

// ─── DELETE /api/leads/:id ────────────────────────────────────────────────────

export const deleteLeadController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (req.user?.email === 'demo@servicehive.com') {
      throw new AppError('Destructive actions are disabled in the Demo Workspace.', 403);
    }
    await deleteLead(req.params['id'] ?? '');
    sendSuccess(res, null, 'Lead deleted');
  },
);
