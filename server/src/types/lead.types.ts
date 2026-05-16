// ─── Enums ────────────────────────────────────────────────────────────────────

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export const LEAD_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
export const LEAD_SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];

// ─── Public Shapes ────────────────────────────────────────────────────────────

export interface LeadOwnerPublic {
  id: string;
  name: string;
  email: string;
}

export interface LeadPublic {
  id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  owner: LeadOwnerPublic;
  createdAt: Date;
  updatedAt: Date;
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface CreateLeadDto {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
}

export interface UpdateLeadDto {
  name?: string;
  email?: string;
  status?: LeadStatus;
  source?: LeadSource;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface LeadQueryParams {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: 'latest' | 'oldest';
  page?: string;
  limit?: string;
}

// ─── Paginated Result ─────────────────────────────────────────────────────────

export interface PaginatedLeads {
  leads: LeadPublic[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
