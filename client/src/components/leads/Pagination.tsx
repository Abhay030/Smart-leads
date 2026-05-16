import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  isLoading,
}) => {
  if (totalItems === 0) return null;

  return (
    <div className="flex items-center justify-between mt-4 py-3 border-t border-gray-200 dark:border-gray-800">
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Showing <span className="font-medium text-gray-900 dark:text-gray-100">{totalItems > 0 ? (currentPage - 1) * 10 + 1 : 0}</span> to{' '}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {Math.min(currentPage * 10, totalItems)}
            </span>{' '}
            of <span className="font-medium text-gray-900 dark:text-gray-100">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="rounded-l-md rounded-r-none border-r-0"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="inline-flex items-center border border-gray-300 dark:border-gray-700 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentPage} / {totalPages || 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isLoading}
              className="rounded-l-none rounded-r-md border-l-0"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </nav>
        </div>
      </div>
      
      {/* Mobile view */}
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
        >
          Previous
        </Button>
        <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentPage} / {totalPages || 1}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
