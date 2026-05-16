import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  title = 'Something went wrong', 
  message = 'An error occurred while loading this content. Please try again.', 
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-gray-600 dark:text-gray-400">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
