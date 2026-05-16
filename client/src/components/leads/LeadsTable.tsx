import React from 'react';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';

import type { Lead } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '../ui/Table';

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuth();

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'New':
        return 'info';
      case 'Contacted':
        return 'warning';
      case 'Qualified':
        return 'success';
      case 'Lost':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getSourceBadgeVariant = (source: string) => {
    switch (source) {
      case 'Website':
        return 'default';
      case 'Instagram':
        return 'warning';
      case 'Referral':
        return 'success';
      default:
        return 'default';
    }
  };

  // 10 skeleton rows
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lead</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Added By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex flex-col space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div>
                  <div className="h-3 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div>
                </div>
              </TableCell>
              <TableCell><div className="h-5 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800"></div></TableCell>
              <TableCell><div className="h-5 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800"></div></TableCell>
              <TableCell><div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div></TableCell>
              <TableCell><div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div></TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Lead</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Added By</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="w-[100px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => {
          const canEdit = user?.role === 'admin' || user?.id === lead.owner.id;
          const canDelete = user?.role === 'admin';

          return (
            <TableRow key={lead.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {lead.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {lead.email}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(lead.status)}>
                  {lead.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getSourceBadgeVariant(lead.source)}>
                  {lead.source}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {lead.owner.name}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  {canEdit && (
                    <button
                      onClick={() => onEdit(lead)}
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-brand-600 dark:hover:bg-gray-800 dark:hover:text-brand-400 transition-colors"
                      title="Edit Lead"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => onDelete(lead)}
                      className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
                      title="Delete Lead"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
