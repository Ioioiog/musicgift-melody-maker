import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Search, Download, RefreshCw, Users, Mail, MousePointer, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface CampaignRecipientActivityProps {
  campaignId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface RecipientActivity {
  id: string;
  campaign_id: string;
  email: string;
  action_type: string;
  action_timestamp: string;
  ip_address?: string;
  user_agent?: string;
  link_url?: string;
  bounce_reason?: string;
  created_at: string;
}

const CampaignRecipientActivity = ({ campaignId, isOpen, onOpenChange }: CampaignRecipientActivityProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('delivered');

  const { data: activities = [], isLoading, refetch } = useQuery({
    queryKey: ['campaign-recipient-activity', campaignId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaign_recipient_activity')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('action_timestamp', { ascending: false });

      if (error) throw error;
      return data as RecipientActivity[];
    },
    enabled: isOpen && !!campaignId,
  });

  const syncRecipientsMutation = useMutation({
    mutationFn: async (actionType?: string) => {
      const { data, error } = await supabase.functions.invoke('brevo-campaign-recipients', {
        body: { campaignId, actionType }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      refetch();
      toast({
        title: "Recipient data synced",
        description: `${data?.count || 0} activities synced successfully.`,
      });
    },
    onError: (error: any) => {
      console.error('Recipient sync error:', error);
      toast({
        title: "Recipient sync failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  // Auto-sync when dialog opens if no data exists
  React.useEffect(() => {
    if (isOpen && campaignId && activities.length === 0 && !isLoading) {
      console.log('No recipient activity found, auto-syncing...');
      syncRecipientsMutation.mutate();
    }
  }, [isOpen, campaignId, activities.length, isLoading]);

  const syncRecipientData = async (actionType?: string) => {
    syncRecipientsMutation.mutate(actionType);
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || activity.action_type === activeTab;
    return matchesSearch && matchesTab;
  });

  const getActivityCounts = () => {
    const counts = {
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      unsubscribed: 0,
      complained: 0,
      all: activities.length
    };

    activities.forEach(activity => {
      if (counts.hasOwnProperty(activity.action_type)) {
        counts[activity.action_type as keyof typeof counts]++;
      }
    });

    return counts;
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Email', 'Action', 'Timestamp', 'IP Address', 'User Agent', 'Link URL', 'Bounce Reason'].join(','),
      ...filteredActivities.map(activity => [
        activity.email,
        activity.action_type,
        format(new Date(activity.action_timestamp), 'yyyy-MM-dd HH:mm:ss'),
        activity.ip_address || '',
        activity.user_agent || '',
        activity.link_url || '',
        activity.bounce_reason || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign_${campaignId}_${activeTab}_activity.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const activityCounts = getActivityCounts();

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'delivered':
        return <Mail className="w-4 h-4 text-blue-500" />;
      case 'opened':
        return <Users className="w-4 h-4 text-green-500" />;
      case 'clicked':
        return <MousePointer className="w-4 h-4 text-purple-500" />;
      case 'bounced':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Mail className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Campaign Recipient Activity</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => syncRecipientData()}
                disabled={isLoading || syncRecipientsMutation.isPending}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${(isLoading || syncRecipientsMutation.isPending) ? 'animate-spin' : ''}`} />
                Sync Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                disabled={filteredActivities.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by email address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="delivered" className="text-xs">
                Delivered ({activityCounts.delivered})
              </TabsTrigger>
              <TabsTrigger value="opened" className="text-xs">
                Opened ({activityCounts.opened})
              </TabsTrigger>
              <TabsTrigger value="clicked" className="text-xs">
                Clicked ({activityCounts.clicked})
              </TabsTrigger>
              <TabsTrigger value="bounced" className="text-xs">
                Bounced ({activityCounts.bounced})
              </TabsTrigger>
              <TabsTrigger value="unsubscribed" className="text-xs">
                Unsubscribed ({activityCounts.unsubscribed})
              </TabsTrigger>
              <TabsTrigger value="all" className="text-xs">
                All ({activityCounts.all})
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Additional Info</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(isLoading || syncRecipientsMutation.isPending) ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                          {syncRecipientsMutation.isPending ? 'Syncing recipient data...' : 'Loading recipient activity...'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredActivities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        {activities.length === 0 
                          ? "No recipient activity found. Click 'Sync Data' to fetch from Brevo."
                          : "No recipient activity found for this filter."
                        }
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center gap-1 w-fit">
                            {getActionIcon(activity.action_type)}
                            {activity.action_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(activity.action_timestamp), 'MMM dd, yyyy HH:mm')}
                        </TableCell>
                        <TableCell>
                          {activity.ip_address || '-'}
                        </TableCell>
                        <TableCell>
                          {activity.link_url && (
                            <div className="text-sm text-blue-600 truncate max-w-48" title={activity.link_url}>
                              {activity.link_url}
                            </div>
                          )}
                          {activity.bounce_reason && (
                            <div className="text-sm text-red-600">
                              {activity.bounce_reason}
                            </div>
                          )}
                          {activity.user_agent && (
                            <div className="text-xs text-gray-500 truncate max-w-48" title={activity.user_agent}>
                              {activity.user_agent}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignRecipientActivity;
