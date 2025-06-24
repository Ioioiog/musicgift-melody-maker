import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNewsletterSubscribers, useDeleteSubscriber } from '@/hooks/useNewsletter';
import { useBrevoSync, useSyncLogs, useSyncConflicts } from '@/hooks/useBrevoSync';
import { Download, Trash2, Search, Users, UserPlus, Mail, Loader2, RefreshCw, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const NewsletterManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  
  const { data: subscribers = [], isLoading, error } = useNewsletterSubscribers();
  const { data: syncLogs = [] } = useSyncLogs();
  const { data: syncConflicts = [] } = useSyncConflicts();
  const deleteSubscriber = useDeleteSubscriber();
  const brevoSync = useBrevoSync();

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (subscriber.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && subscriber.is_active) ||
                         (filterStatus === 'inactive' && !subscriber.is_active);
    
    return matchesSearch && matchesFilter;
  });

  const activeSubscribers = subscribers.filter(s => s.is_active).length;
  const totalSubscribers = subscribers.length;
  const syncedSubscribers = subscribers.filter(s => s.brevo_contact_id).length;
  const lastSync = syncLogs.find(log => log.status === 'completed')?.completed_at;

  const exportSubscribers = () => {
    const csvContent = [
      ['Email', 'Name', 'Status', 'Source', 'Brevo ID', 'Last Sync', 'Subscribed At'],
      ...filteredSubscribers.map(sub => [
        sub.email,
        sub.name || '',
        sub.is_active ? 'Active' : 'Inactive',
        sub.source,
        sub.brevo_contact_id || '',
        sub.last_brevo_sync ? format(new Date(sub.last_brevo_sync), 'yyyy-MM-dd HH:mm:ss') : '',
        format(new Date(sub.subscribed_at), 'yyyy-MM-dd HH:mm:ss')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export completed",
      description: `Exported ${filteredSubscribers.length} subscribers`,
    });
  };

  const handleDelete = async (id: string, email: string) => {
    if (window.confirm(`Are you sure you want to permanently delete ${email}?`)) {
      deleteSubscriber.mutate(id);
    }
  };

  const handleSync = (direction: 'brevo_to_local' | 'local_to_brevo' | 'bidirectional' = 'bidirectional') => {
    brevoSync.mutate({ direction, operationType: 'manual_sync' });
  };

  const getSyncStatusIcon = (subscriber: any) => {
    if (!subscriber.brevo_contact_id) {
      return (
        <div title="Not synced to Brevo">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
        </div>
      );
    }
    if (subscriber.sync_status === 'sync_failed') {
      return (
        <div title="Sync failed">
          <AlertTriangle className="w-4 h-4 text-red-600" />
        </div>
      );
    }
    if (subscriber.sync_status === 'pending_sync') {
      return (
        <div title="Sync pending">
          <Clock className="w-4 h-4 text-blue-600" />
        </div>
      );
    }
    return (
      <div title="Synced">
        <CheckCircle className="w-4 h-4 text-green-600" />
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading newsletter subscribers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p>Error loading subscribers: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">{activeSubscribers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <UserPlus className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">{totalSubscribers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <RefreshCw className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Synced to Brevo</p>
                <p className="text-2xl font-bold text-gray-900">{syncedSubscribers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sync Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalSubscribers > 0 ? Math.round((syncedSubscribers / totalSubscribers) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Status */}
      {syncConflicts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <p className="text-yellow-800">
                {syncConflicts.length} sync conflict{syncConflicts.length !== 1 ? 's' : ''} need attention
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Management Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Newsletter Subscribers</span>
            <div className="flex gap-2">
              <Button 
                onClick={() => handleSync('brevo_to_local')} 
                variant="outline" 
                size="sm"
                disabled={brevoSync.isPending}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${brevoSync.isPending ? 'animate-spin' : ''}`} />
                Sync from Brevo
              </Button>
              <Button 
                onClick={() => handleSync('local_to_brevo')} 
                variant="outline" 
                size="sm"
                disabled={brevoSync.isPending}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${brevoSync.isPending ? 'animate-spin' : ''}`} />
                Sync to Brevo
              </Button>
              <Button 
                onClick={() => handleSync('bidirectional')} 
                variant="default" 
                size="sm"
                disabled={brevoSync.isPending}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${brevoSync.isPending ? 'animate-spin' : ''}`} />
                Full Sync
              </Button>
              <Button onClick={exportSubscribers} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardTitle>
          {lastSync && (
            <p className="text-sm text-gray-500">
              Last successful sync: {format(new Date(lastSync), 'MMM dd, yyyy HH:mm:ss')}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <Tabs value="subscribers" className="space-y-4">
            <TabsList>
              <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
              <TabsTrigger value="sync-logs">Sync History</TabsTrigger>
              {syncConflicts.length > 0 && (
                <TabsTrigger value="conflicts">
                  Conflicts ({syncConflicts.length})
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="subscribers" className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by email or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('all')}
                  >
                    All ({totalSubscribers})
                  </Button>
                  <Button
                    variant={filterStatus === 'active' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('active')}
                  >
                    Active ({activeSubscribers})
                  </Button>
                  <Button
                    variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('inactive')}
                  >
                    Inactive ({totalSubscribers - activeSubscribers})
                  </Button>
                </div>
              </div>

              {/* Subscribers Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sync</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Last Sync</TableHead>
                      <TableHead>Subscribed</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscribers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          {searchTerm || filterStatus !== 'all' 
                            ? 'No subscribers match your filters' 
                            : 'No newsletter subscribers yet'
                          }
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSubscribers.map((subscriber) => (
                        <TableRow key={subscriber.id}>
                          <TableCell>
                            {getSyncStatusIcon(subscriber)}
                          </TableCell>
                          <TableCell className="font-medium">{subscriber.email}</TableCell>
                          <TableCell>{subscriber.name || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={subscriber.is_active ? 'default' : 'secondary'}>
                              {subscriber.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>{subscriber.source}</TableCell>
                          <TableCell>
                            {subscriber.last_brevo_sync 
                              ? format(new Date(subscriber.last_brevo_sync), 'MMM dd, HH:mm')
                              : '-'
                            }
                          </TableCell>
                          <TableCell>
                            {format(new Date(subscriber.subscribed_at), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(subscriber.id, subscriber.email)}
                              disabled={deleteSubscriber.isPending}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {filteredSubscribers.length > 0 && (
                <div className="text-sm text-gray-500 text-center">
                  Showing {filteredSubscribers.length} of {totalSubscribers} subscribers
                </div>
              )}
            </TabsContent>

            <TabsContent value="sync-logs" className="space-y-4">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Operation</TableHead>
                      <TableHead>Direction</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Records</TableHead>
                      <TableHead>Started</TableHead>
                      <TableHead>Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {syncLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No sync operations yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      syncLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">
                            {log.operation_type.replace('_', ' ')}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {log.direction.replace('_', ' → ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                log.status === 'completed' ? 'default' :
                                log.status === 'failed' ? 'destructive' :
                                log.status === 'partial' ? 'secondary' : 'outline'
                              }
                            >
                              {log.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {log.records_succeeded}/{log.records_processed}
                            {log.records_failed > 0 && (
                              <span className="text-red-600"> ({log.records_failed} failed)</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {format(new Date(log.started_at), 'MMM dd, HH:mm:ss')}
                          </TableCell>
                          <TableCell>
                            {log.completed_at ? (
                              `${Math.round((new Date(log.completed_at).getTime() - new Date(log.started_at).getTime()) / 1000)}s`
                            ) : (
                              log.status === 'running' ? 'Running...' : '-'
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {syncConflicts.length > 0 && (
              <TabsContent value="conflicts" className="space-y-4">
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Conflict Type</TableHead>
                        <TableHead>Local Data</TableHead>
                        <TableHead>Brevo Data</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {syncConflicts.map((conflict) => (
                        <TableRow key={conflict.id}>
                          <TableCell className="font-medium">{conflict.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {conflict.conflict_type.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-gray-100 p-1 rounded">
                              {JSON.stringify(conflict.local_data).substring(0, 50)}...
                            </code>
                          </TableCell>
                          <TableCell>
                            <code className="text-xs bg-gray-100 p-1 rounded">
                              {JSON.stringify(conflict.brevo_data).substring(0, 50)}...
                            </code>
                          </TableCell>
                          <TableCell>
                            {format(new Date(conflict.created_at), 'MMM dd, HH:mm')}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline">
                                Use Local
                              </Button>
                              <Button size="sm" variant="outline">
                                Use Brevo
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsletterManagement;
