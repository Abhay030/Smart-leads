export type UserRole = 'admin' | 'sales';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface LeadOwner {
  id: string;
  name: string;
  email: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  owner: LeadOwner;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  success: true;
  message: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
