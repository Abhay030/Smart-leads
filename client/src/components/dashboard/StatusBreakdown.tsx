import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface StatusData {
  status: string;
  count: number;
  colorClass: string;
}

interface StatusBreakdownProps {
  data: StatusData[];
  total: number;
}

export const StatusBreakdown: React.FC<StatusBreakdownProps> = ({ data, total }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Lead Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((item) => {
            const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
            return (
              <div key={item.status}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{item.status}</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {item.count} <span className="text-xs">({percentage}%)</span>
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.colorClass}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
