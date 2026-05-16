import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';

import type { Lead } from '../../types';
import type { CreateLeadDto } from '../../api/leads.api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']),
  source: z.enum(['Website', 'Instagram', 'Referral']),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead | null;
  onSubmit: (data: CreateLeadDto) => Promise<void>;
}

export const LeadFormModal: React.FC<LeadFormModalProps> = ({
  isOpen,
  onClose,
  lead,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      email: '',
      status: 'New',
      source: 'Website',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (lead) {
        reset({
          name: lead.name,
          email: lead.email,
          status: lead.status,
          source: lead.source,
        });
      } else {
        reset({
          name: '',
          email: '',
          status: 'New',
          source: 'Website',
        });
      }
    }
  }, [isOpen, lead, reset]);

  if (!isOpen) return null;

  const submitHandler = async (data: LeadFormValues) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {lead ? 'Edit Lead' : 'Add New Lead'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="p-6 space-y-4">
          <Input
            label="Name"
            placeholder="John Doe"
            error={errors.name?.message}
            {...register('name')}
          />
          
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 transition-colors"
              {...register('status')}
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
            </select>
            {errors.status?.message && <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Source
            </label>
            <select
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 transition-colors"
              {...register('source')}
            >
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Referral">Referral</option>
            </select>
            {errors.source?.message && <p className="mt-1 text-sm text-red-500">{errors.source.message}</p>}
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {lead ? 'Save Changes' : 'Create Lead'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
