import React from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import type { Lead } from '../../types';

interface RecentLeadsProps {
  leads: Lead[];
}

export const RecentLeads: React.FC<RecentLeadsProps> = ({ leads }) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'New': return 'info';
      case 'Contacted': return 'warning';
      case 'Qualified': return 'success';
      case 'Lost': return 'danger';
      default: return 'default';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Leads</CardTitle>
        <Link 
          to="/leads" 
          className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 flex items-center"
        >
          View all
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {leads.length === 0 ? (
          <div className="flex h-40 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            No recent leads
          </div>
        ) : (
          <div className="space-y-4">
            {leads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-800">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{lead.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{lead.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:block">
                    <Badge variant={getStatusBadgeVariant(lead.status)}>{lead.status}</Badge>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-24 text-right">
                    {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
