import React from 'react';
import { Plus, Download, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { leadsApi } from '../../api/leads.api';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const handleExport = async () => {
    try {
      await leadsApi.exportCSV({});
    } catch (err) {
      console.error('Export failed', err);
      alert('Failed to export leads');
    }
  };

  return (
    <Card className="h-full bg-brand-50/50 dark:bg-brand-900/10 border-brand-100 dark:border-brand-900/30">
      <CardHeader>
        <CardTitle className="text-brand-900 dark:text-brand-100">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button 
            className="w-full justify-start shadow-sm" 
            onClick={() => navigate('/leads')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Lead
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start bg-white dark:bg-gray-900" 
            onClick={handleExport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export All CSV
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start bg-white/50 dark:bg-gray-900/50" 
            onClick={() => navigate('/leads')}
          >
            <Users className="mr-2 h-4 w-4" />
            View Lead Directory
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
