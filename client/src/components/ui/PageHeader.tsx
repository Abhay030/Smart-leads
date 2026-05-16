import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
