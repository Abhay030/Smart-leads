import React from 'react';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-800 dark:bg-gray-900/50',
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      {description && <p className="mb-4 max-w-sm text-sm text-gray-500 dark:text-gray-400">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
