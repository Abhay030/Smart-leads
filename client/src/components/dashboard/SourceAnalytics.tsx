import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface SourceData {
  source: string;
  count: number;
}

interface SourceAnalyticsProps {
  data: SourceData[];
  total: number;
}

export const SourceAnalytics: React.FC<SourceAnalyticsProps> = ({ data, total }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Acquisition Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-4 w-full overflow-hidden rounded-full">
          {data.map((item) => {
            const percentage = total > 0 ? (item.count / total) * 100 : 0;
            if (percentage === 0) return null;
            
            // Assign specific colors to specific sources
            const bgClass = 
              item.source === 'Website' ? 'bg-brand-500' :
              item.source === 'Instagram' ? 'bg-pink-500' :
              item.source === 'Referral' ? 'bg-purple-500' : 'bg-gray-500';

            return (
              <div
                key={item.source}
                style={{ width: `${percentage}%` }}
                className={`${bgClass} transition-all duration-500`}
                title={`${item.source}: ${item.count} (${Math.round(percentage)}%)`}
              />
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {data.map((item) => {
            const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
            const bgClass = 
              item.source === 'Website' ? 'bg-brand-500' :
              item.source === 'Instagram' ? 'bg-pink-500' :
              item.source === 'Referral' ? 'bg-purple-500' : 'bg-gray-500';

            return (
              <div key={item.source} className="flex items-center space-x-2">
                <div className={`h-3 w-3 shrink-0 rounded-full ${bgClass}`} />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.source}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.count} ({percentage}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
