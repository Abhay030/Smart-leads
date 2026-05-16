import React from 'react';
import { Search } from 'lucide-react';

interface FilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  source: string;
  onSourceChange: (val: string) => void;
  sort: 'latest' | 'oldest';
  onSortChange: (val: 'latest' | 'oldest') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  source,
  onSourceChange,
  sort,
  onSortChange,
}) => {
  return (
    <div className="mb-6 grid gap-4 grid-cols-1 md:grid-cols-4 lg:grid-cols-5">
      <div className="relative md:col-span-2 lg:col-span-2">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 transition-colors"
        />
      </div>

      <div>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 transition-colors"
        >
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
        </select>
      </div>

      <div>
        <select
          value={source}
          onChange={(e) => onSourceChange(e.target.value)}
          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 transition-colors"
        >
          <option value="">All Sources</option>
          <option value="Website">Website</option>
          <option value="Instagram">Instagram</option>
          <option value="Referral">Referral</option>
        </select>
      </div>

      <div>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as 'latest' | 'oldest')}
          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50 transition-colors"
        >
          <option value="latest">Sort: Latest</option>
          <option value="oldest">Sort: Oldest</option>
        </select>
      </div>
    </div>
  );
};
