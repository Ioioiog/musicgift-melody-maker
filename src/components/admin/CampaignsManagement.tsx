
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useCampaigns, useCreateCampaign, useSendCampaign, useDeleteCampaign, useCampaignMetrics, useBrevoLists, useResyncCampaign } from '@/hooks/useCampaigns';
import { Plus, Send, Trash2, BarChart3, Mail, Users, Loader2, Eye, RefreshCw, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const CampaignsManagement = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    html_content: '',
    target_list_ids: [] as number[]
  });
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  const { data: campaigns = [], isLoading, error } = useCampaigns();
  const { data: brevoLists } = useBrevoLists();
  const { data: selectedCampaignMetrics } = useCampaignMetrics(selectedCampaignId || undefined);
  const createCampaign = useCreateCampaign();
  const sendCampaign = useSendCampaign();
  const deleteCampaign = useDeleteCampaign();
  const resyncCampaign = useResyncCampaign();

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCampaign.name || !newCampaign.subject) {
      toast({
        title: "Validation error",
        description: "Name and subject are required",
        variant: "destructive",
      });
      return;
    }

    createCampaign.mutate(newCampaign, {
      onSuccess: () => {
        setNewCampaign({ 
          name: '', 
          subject: '', 
          content: '', 
          html_content: '', 
          target_list_ids: [] 
        });
        setIsCreateDialogOpen(false);
      }
    });
  };

  const handleSendCampaign = (campaignId: string) => {
    if (window.confirm('Are you sure you want to send this campaign? This action cannot be undone.')) {
      sendCampaign.mutate({ campaignId });
    }
  };

  const handleDeleteCampaign = (campaignId: string) => {
    if (window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      deleteCampaign.mutate(campaignId);
    }
  };

  const handleResyncCampaign = (campaignId: string) => {
    if (window.confirm('This will create a new campaign in Brevo. Continue?')) {
      resyncCampaign.mutate({ campaignId });
    }
  };

  const handleListToggle = (listId: number, checked: boolean) => {
    setNewCampaign(prev => ({
      ...prev,
      target_list_ids: checked 
        ? [...prev.target_list_ids, listId]
        : prev.target_list_ids.filter(id => id !== listId)
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'secondary';
      case 'scheduled':
        return 'default';
      case 'sent':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <Mail className="w-4 h-4" />;
      case 'scheduled':
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p>Error loading campaigns: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sentCampaigns = campaigns.filter(c => c.status === 'sent').length;
  const draftCampaigns = campaigns.filter(c => c.status === 'draft').length;
  const totalCampaigns = campaigns.length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sent Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{sentCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Draft Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{draftCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{totalCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Management Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Email Campaigns</span>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Campaign</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateCampaign} className="space-y-4">
                  <div>
                    <Label htmlFor="campaign-name">Campaign Name</Label>
                    <Input
                      id="campaign-name"
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                      placeholder="Enter campaign name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="campaign-subject">Subject Line</Label>
                    <Input
                      id="campaign-subject"
                      value={newCampaign.subject}
                      onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                      placeholder="Enter email subject"
                      required
                    />
                  </div>
                  
                  {/* Target Lists Selection */}
                  {brevoLists && brevoLists.lists.length > 0 && (
                    <div>
                      <Label>Target Lists (leave empty for auto-detection)</Label>
                      <div className="mt-2 space-y-2 max-h-32 overflow-y-auto border rounded p-2">
                        {brevoLists.lists.map((list) => (
                          <div key={list.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`list-${list.id}`}
                              checked={newCampaign.target_list_ids.includes(list.id)}
                              onCheckedChange={(checked) => handleListToggle(list.id, checked as boolean)}
                            />
                            <Label htmlFor={`list-${list.id}`} className="text-sm">
                              {list.name} ({list.totalSubscribers} subscribers)
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="campaign-content">Plain Text Content</Label>
                    <Textarea
                      id="campaign-content"
                      value={newCampaign.content}
                      onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                      placeholder="Enter plain text content"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="campaign-html">HTML Content</Label>
                    <Textarea
                      id="campaign-html"
                      value={newCampaign.html_content}
                      onChange={(e) => setNewCampaign({ ...newCampaign, html_content: e.target.value })}
                      placeholder="Enter HTML content"
                      rows={6}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createCampaign.isPending}>
                      {createCampaign.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Campaign'
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="campaigns" className="space-y-4">
            <TabsList>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="campaigns" className="space-y-4">
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Brevo Sync</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Sent</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No campaigns yet. Create your first campaign to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      campaigns.map((campaign) => (
                        <TableRow key={campaign.id}>
                          <TableCell className="font-medium">{campaign.name}</TableCell>
                          <TableCell>{campaign.subject}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(campaign.status)} className="flex items-center gap-1 w-fit">
                              {getStatusIcon(campaign.status)}
                              {campaign.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {campaign.brevo_campaign_id ? (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                Synced
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                                <AlertTriangle className="w-3 h-3" />
                                Not Synced
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {format(new Date(campaign.created_at), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell>
                            {campaign.sent_at ? format(new Date(campaign.sent_at), 'MMM dd, yyyy HH:mm') : '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {campaign.status === 'draft' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSendCampaign(campaign.id)}
                                  disabled={sendCampaign.isPending}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <Send className="w-4 h-4" />
                                </Button>
                              )}
                              {!campaign.brevo_campaign_id && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleResyncCampaign(campaign.id)}
                                  disabled={resyncCampaign.isPending}
                                  className="text-orange-600 hover:text-orange-700"
                                  title="Resync with Brevo"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </Button>
                              )}
                              {campaign.status === 'sent' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedCampaignId(campaign.id)}
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  <BarChart3 className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteCampaign(campaign.id)}
                                disabled={deleteCampaign.isPending}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              {selectedCampaignId && selectedCampaignMetrics ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{selectedCampaignMetrics.delivered}</p>
                        <p className="text-sm text-gray-600">Delivered</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{selectedCampaignMetrics.opens}</p>
                        <p className="text-sm text-gray-600">Opens</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{selectedCampaignMetrics.clicks}</p>
                        <p className="text-sm text-gray-600">Clicks</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">{selectedCampaignMetrics.bounces}</p>
                        <p className="text-sm text-gray-600">Bounces</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a sent campaign to view metrics</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignsManagement;
