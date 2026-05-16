import React, { useState, useEffect } from 'react';
import { Users, UserPlus, CheckCircle, XCircle } from 'lucide-react';

import { PageHeader } from '../../components/ui/PageHeader';
import { FullPageSpinner } from '../../components/ui/Spinner';
import { ErrorState } from '../../components/ui/ErrorState';

import { StatsCard } from '../../components/dashboard/StatsCard';
import { StatusBreakdown } from '../../components/dashboard/StatusBreakdown';
import { SourceAnalytics } from '../../components/dashboard/SourceAnalytics';
import { RecentLeads } from '../../components/dashboard/RecentLeads';
import { QuickActions } from '../../components/dashboard/QuickActions';

import { leadsApi } from '../../api/leads.api';
import type { Lead } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dashboard Data
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    lost: 0,
  });
  
  const [sourceData, setSourceData] = useState([
    { source: 'Website', count: 0 },
    { source: 'Instagram', count: 0 },
    { source: 'Referral', count: 0 },
  ]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // We perform parallel lightweight requests to aggregate stats
      // since there is no dedicated /stats endpoint.
      const [
        allRes,
        newRes,
        contactedRes,
        qualifiedRes,
        lostRes,
        webRes,
        instaRes,
        refRes
      ] = await Promise.all([
        leadsApi.getLeads({ limit: 5 }), // Gets total + recent 5
        leadsApi.getLeads({ limit: 1, status: 'New' }),
        leadsApi.getLeads({ limit: 1, status: 'Contacted' }),
        leadsApi.getLeads({ limit: 1, status: 'Qualified' }),
        leadsApi.getLeads({ limit: 1, status: 'Lost' }),
        leadsApi.getLeads({ limit: 1, source: 'Website' }),
        leadsApi.getLeads({ limit: 1, source: 'Instagram' }),
        leadsApi.getLeads({ limit: 1, source: 'Referral' }),
      ]);

      setRecentLeads(allRes.data);
      
      setStats({
        total: allRes.pagination.total,
        new: newRes.pagination.total,
        contacted: contactedRes.pagination.total,
        qualified: qualifiedRes.pagination.total,
        lost: lostRes.pagination.total,
      });

      setSourceData([
        { source: 'Website', count: webRes.pagination.total },
        { source: 'Instagram', count: instaRes.pagination.total },
        { source: 'Referral', count: refRes.pagination.total },
      ]);

    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) return <FullPageSpinner />;
  
  if (error) return <ErrorState onRetry={fetchDashboardData} />;

  const statusData = [
    { status: 'New', count: stats.new, colorClass: 'bg-blue-500' },
    { status: 'Contacted', count: stats.contacted, colorClass: 'bg-yellow-500' },
    { status: 'Qualified', count: stats.qualified, colorClass: 'bg-green-500' },
    { status: 'Lost', count: stats.lost, colorClass: 'bg-red-500' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'User'}`}
        description="Here is what's happening with your leads today."
      />

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Leads"
          value={stats.total}
          icon={<Users className="h-5 w-5" />}
        />
        <StatsCard
          title="New Leads"
          value={stats.new}
          icon={<UserPlus className="h-5 w-5" />}
        />
        <StatsCard
          title="Qualified"
          value={stats.qualified}
          icon={<CheckCircle className="h-5 w-5" />}
        />
        <StatsCard
          title="Lost"
          value={stats.lost}
          icon={<XCircle className="h-5 w-5" />}
        />
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StatusBreakdown data={statusData} total={stats.total} />
        <SourceAnalytics data={sourceData} total={stats.total} />
      </div>

      {/* Recent Activity Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentLeads leads={recentLeads} />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
    </div>
  );
};
