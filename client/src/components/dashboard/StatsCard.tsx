import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { cn } from '../../utils/cn';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, className }) => {
  return (
    <Card className={cn('hover:shadow-md transition-shadow duration-200', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-baseline">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{value}</h2>
          {trend && (
            <span
              className={cn(
                'ml-2 text-sm font-medium',
                trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              )}
            >
              {trend.isPositive ? '+' : ''}{trend.value}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
