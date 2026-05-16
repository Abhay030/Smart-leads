import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Download } from 'lucide-react';

import type { Lead } from '../../types';
import type { CreateLeadDto, UpdateLeadDto } from '../../api/leads.api';
import { leadsApi } from '../../api/leads.api';
import { useDebounce } from '../../hooks/useDebounce';

import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';

import { LeadsTable } from '../../components/leads/LeadsTable';
import { FilterBar } from '../../components/leads/FilterBar';
import { Pagination } from '../../components/leads/Pagination';
import { LeadFormModal } from '../../components/leads/LeadFormModal';
import { DeleteDialog } from '../../components/leads/DeleteDialog';

export const Leads: React.FC = () => {
  // Data State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter State
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [status, setStatus] = useState<string>('');
  const [source, setSource] = useState<string>('');
  const [sort, setSort] = useState<'latest' | 'oldest'>('latest');
  const [page, setPage] = useState(1);

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  const fetchLeads = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await leadsApi.getLeads({
        search: debouncedSearch,
        status: status as any,
        source: source as any,
        sort,
        page,
        limit: 10,
      });
      setLeads(res.data);
      setTotal(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch (err) {
      setError('Failed to load leads');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, status, source, sort, page]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, source, sort]);

  // Fetch data
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleExport = async () => {
    try {
      await leadsApi.exportCSV({
        search: debouncedSearch,
        status: status as any,
        source: source as any,
        sort,
      });
    } catch (err) {
      console.error('Export failed', err);
      alert('Failed to export leads');
    }
  };

  const handleFormSubmit = async (data: CreateLeadDto | UpdateLeadDto) => {
    if (leadToEdit) {
      await leadsApi.updateLead(leadToEdit.id, data as UpdateLeadDto);
    } else {
      await leadsApi.createLead(data as CreateLeadDto);
      setPage(1); // Go to first page to see new lead (assuming 'latest' sort)
    }
    fetchLeads();
  };

  const handleDeleteConfirm = async () => {
    if (leadToDelete) {
      await leadsApi.deleteLead(leadToDelete.id);
      fetchLeads();
    }
  };

  const openEditModal = (lead: Lead) => {
    setLeadToEdit(lead);
    setIsFormModalOpen(true);
  };

  const openCreateModal = () => {
    setLeadToEdit(null);
    setIsFormModalOpen(true);
  };

  const openDeleteDialog = (lead: Lead) => {
    setLeadToDelete(lead);
    setIsDeleteDialogOpen(true);
  };

  if (error && !leads.length) {
    return <ErrorState onRetry={fetchLeads} />;
  }

  return (
    <div>
      <PageHeader
        title="Leads Management"
        description="View and manage your pipeline."
        action={
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={openCreateModal}>
              <Plus className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          </div>
        }
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        source={source}
        onSourceChange={setSource}
        sort={sort}
        onSortChange={setSort}
      />

      {!isLoading && leads.length === 0 ? (
        <EmptyState
          title="No leads found"
          description={
            search || status || source
              ? 'Try adjusting your filters to find what you are looking for.'
              : 'Get started by creating your first lead.'
          }
          action={
            (!search && !status && !source) && (
              <Button onClick={openCreateModal}>
                <Plus className="mr-2 h-4 w-4" />
                Add Lead
              </Button>
            )
          }
        />
      ) : (
        <>
          <LeadsTable
            leads={leads}
            isLoading={isLoading}
            onEdit={openEditModal}
            onDelete={openDeleteDialog}
          />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={total}
            onPageChange={setPage}
            isLoading={isLoading}
          />
        </>
      )}

      {/* Modals */}
      <LeadFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        lead={leadToEdit}
        onSubmit={handleFormSubmit}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Lead"
        description={`Are you sure you want to delete ${leadToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
};
