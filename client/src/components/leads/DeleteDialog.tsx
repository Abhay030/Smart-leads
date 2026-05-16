import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
          
          <div className="flex w-full space-x-3">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="danger" className="flex-1" onClick={handleConfirm} isLoading={isDeleting}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
