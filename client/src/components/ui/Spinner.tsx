import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  return (
    <div className="flex items-center justify-center">
      <Loader2
        className={cn('animate-spin text-brand-600 dark:text-brand-500', sizes[size], className)}
      />
    </div>
  );
}

export function FullPageSpinner() {
  return (
    <div className="flex min-h-[400px] w-full flex-1 items-center justify-center">
      <Spinner size="xl" />
    </div>
  );
}
