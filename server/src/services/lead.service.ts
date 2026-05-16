import { FilterQuery, SortOrder, Types } from 'mongoose';
import { Lead, ILeadDocument } from '../models/Lead';
import { AppError } from '../middleware/errorHandler';
import {
  CreateLeadDto,
  UpdateLeadDto,
  LeadQueryParams,
  LeadPublic,
  LeadOwnerPublic,
  PaginatedLeads,
  LEAD_STATUSES,
  LEAD_SOURCES,
} from '../types/lead.types';

// ─── Populated Owner Type Guard ───────────────────────────────────────────────

interface PopulatedUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

function isPopulatedUser(value: unknown): value is PopulatedUser {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'email' in value
  );
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

function toPublicLead(lead: ILeadDocument): LeadPublic {
  const ownerRaw: unknown = lead.owner;

  let owner: LeadOwnerPublic;
  if (isPopulatedUser(ownerRaw)) {
    owner = { id: ownerRaw._id.toString(), name: ownerRaw.name, email: ownerRaw.email };
  } else {
    owner = { id: String(ownerRaw), name: '', email: '' };
  }

  return {
    id: (lead as ILeadDocument & { _id: Types.ObjectId })._id.toString(),
    name: lead.name,
    email: lead.email,
    status: lead.status,
    source: lead.source,
    owner,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  };
}

// ─── Query Builders ───────────────────────────────────────────────────────────

function buildFilter(params: LeadQueryParams): FilterQuery<ILeadDocument> {
  const filter: FilterQuery<ILeadDocument> = {};

  // Only apply if value is a valid enum member (silently ignore bad query params)
  if (params.status && LEAD_STATUSES.includes(params.status)) {
    filter['status'] = params.status;
  }
  if (params.source && LEAD_SOURCES.includes(params.source)) {
    filter['source'] = params.source;
  }
  if (params.search?.trim()) {
    const regex = new RegExp(params.search.trim(), 'i');
    filter['$or'] = [{ name: regex }, { email: regex }];
  }

  return filter;
}

function buildSort(sort?: string): Record<string, SortOrder> {
  return sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };
}

function parsePagination(page?: string, limit?: string): { page: number; limit: number; skip: number } {
  const p = Math.max(1, parseInt(page ?? '1', 10) || 1);
  const l = Math.min(100, Math.max(1, parseInt(limit ?? '10', 10) || 10));
  return { page: p, limit: l, skip: (p - 1) * l };
}

// ─── Service Functions ────────────────────────────────────────────────────────

export async function getLeads(params: LeadQueryParams): Promise<PaginatedLeads> {
  const filter = buildFilter(params);
  const sort = buildSort(params.sort);
  const { page, limit, skip } = parsePagination(params.page, params.limit);

  // Parallel: fetch page + total count
  const [leads, total] = await Promise.all([
    Lead.find(filter).sort(sort).skip(skip).limit(limit).populate('owner', 'name email'),
    Lead.countDocuments(filter),
  ]);

  return {
    leads: leads.map(toPublicLead),
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getLeadById(id: string): Promise<LeadPublic> {
  const lead = await Lead.findById(id).populate('owner', 'name email');
  if (!lead) throw new AppError('Lead not found', 404);
  return toPublicLead(lead);
}

export async function createLead(dto: CreateLeadDto, ownerId: string): Promise<LeadPublic> {
  const lead = await Lead.create({ ...dto, owner: ownerId });
  const populated = await lead.populate('owner', 'name email');
  return toPublicLead(populated);
}

export async function updateLead(id: string, dto: UpdateLeadDto): Promise<LeadPublic> {
  // Ownership already verified by checkLeadOwnership middleware
  const updated = await Lead.findByIdAndUpdate(id, dto, {
    new: true,
    runValidators: true,
  }).populate('owner', 'name email');

  if (!updated) throw new AppError('Lead not found', 404);
  return toPublicLead(updated);
}

export async function deleteLead(id: string): Promise<void> {
  // Role already verified by requireRole('admin') at route level
  const deleted = await Lead.findByIdAndDelete(id);
  if (!deleted) throw new AppError('Lead not found', 404);
}

export async function getLeadsForExport(params: LeadQueryParams): Promise<LeadPublic[]> {
  const filter = buildFilter(params);
  const sort = buildSort(params.sort);
  const leads = await Lead.find(filter).sort(sort).populate('owner', 'name email');
  return leads.map(toPublicLead);
}
