import api from './axios';
import type { Lead, PaginatedResponse, LeadStatus, LeadSource } from '../types';

export interface GetLeadsParams {
  status?: LeadStatus | '';
  source?: LeadSource | '';
  search?: string;
  sort?: 'latest' | 'oldest';
  page?: number;
  limit?: number;
}

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

export const leadsApi = {
  getLeads: async (params: GetLeadsParams) => {
    // Clean empty strings so we don't send `status=`
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
    );
    const response = await api.get<PaginatedResponse<Lead>>('/leads', { params: cleanParams });
    return response.data;
  },

  getLeadById: async (id: string) => {
    const response = await api.get<{ success: boolean; data: Lead }>(`/leads/${id}`);
    return response.data;
  },

  createLead: async (data: CreateLeadDto) => {
    const response = await api.post<{ success: boolean; data: Lead }>('/leads', data);
    return response.data;
  },

  updateLead: async (id: string, data: UpdateLeadDto) => {
    const response = await api.put<{ success: boolean; data: Lead }>(`/leads/${id}`, data);
    return response.data;
  },

  deleteLead: async (id: string) => {
    const response = await api.delete<{ success: boolean }>(`/leads/${id}`);
    return response.data;
  },

  exportCSV: async (params: GetLeadsParams) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== '')
    );
    
    // Use blob response type to handle file download
    const response = await api.get('/leads/export', {
      params: cleanParams,
      responseType: 'blob',
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `leads_export_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
