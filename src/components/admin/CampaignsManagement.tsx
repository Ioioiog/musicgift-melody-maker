
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
import { Switch } from '@/components/ui/switch';
import { useCampaigns, useCreateCampaign, useSendCampaign, useDeleteCampaign, useCampaignMetrics, useBrevoLists, useBrevoTemplates, useResyncCampaign, useSyncCampaignMetrics } from '@/hooks/useCampaigns';
import { Plus, Send, Trash2, BarChart3, Mail, Users, Loader2, Eye, RefreshCw, AlertTriangle, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import CampaignMetricsCard from '@/components/admin/CampaignMetricsCard';

const CampaignsManagement = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [useTemplate, setUseTemplate] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    content: '',
    html_content: '',
    target_list_ids: [] as number[],
    template_variables: {} as any
  });
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const { data: campaigns = [], isLoading, error } = useCampaigns();
  const { data: brevoLists } = useBrevoLists();
  const { data: brevoTemplates } = useBrevoTemplates();
  const { data: selectedCampaignMetrics } = useCampaignMetrics(selectedCampaignId || undefined);
  const createCampaign = useCreateCampaign();
  const sendCampaign = useSendCampaign();
  const deleteCampaign = useDeleteCampaign();
  const resyncCampaign = useResyncCampaign();
  const syncMetrics = useSyncCampaignMetrics();

  const selectedTemplate = brevoTemplates?.templates.find(t => t.id.toString() === selectedTemplateId);

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

    if (useTemplate && !selectedTemplateId) {
      toast({
        title: "Validation error",
        description: "Please select a template",
        variant: "destructive",
      });
      return;
    }

    const campaignData = {
      ...newCampaign,
      ...(useTemplate && selectedTemplateId ? {
        template_id: selectedTemplateId,
        template_variables: newCampaign.template_variables
      } : {})
    };

    createCampaign.mutate(campaignData, {
      onSuccess: () => {
        setNewCampaign({ 
          name: '', 
          subject: '', 
          content: '', 
          html_content: '', 
          target_list_ids: [],
          template_variables: {} 
        });
        setSelectedTemplateId('');
        setUseTemplate(false);
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

  const handleSyncMetrics = (campaignId: string) => {
    syncMetrics.mutate({ campaignId });
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

  const renderMobileCampaignCard = (campaign: any) => (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium truncate pr-2">{campaign.name}</h3>
          <Badge variant={getStatusColor(campaign.status)} className="flex items-center gap-1 shrink-0">
            {getStatusIcon(campaign.status)}
            {campaign.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{campaign.subject}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {campaign.brevo_campaign_id ? (
          <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
            Synced
          </Badge>
        ) : (
          <Badge variant="destructive" className="flex items-center gap-1 text-xs">
            <AlertTriangle className="w-3 h-3" />
            Not Synced
          </Badge>
        )}
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p>Created: {format(new Date(campaign.created_at), 'MMM dd, yyyy')}</p>
        {campaign.sent_at && (
          <p>Sent: {format(new Date(campaign.sent_at), 'MMM dd, yyyy HH:mm')}</p>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        {campaign.status === 'draft' && (
          <Button
            variant="default"
            size="sm"
            onClick={() => handleSendCampaign(campaign.id)}
            disabled={sendCampaign.isPending}
            className="w-full h-10 text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 border border-green-200"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Campaign
          </Button>
        )}
        
        <div className="flex space-x-2">
          {!campaign.brevo_campaign_id && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleResyncCampaign(campaign.id)}
              disabled={resyncCampaign.isPending}
              className="flex-1 h-10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Resync
            </Button>
          )}
          
          {campaign.status === 'sent' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCampaignId(campaign.id)}
              className="flex-1 h-10"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Metrics
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDeleteCampaign(campaign.id)}
            disabled={deleteCampaign.isPending}
            className="flex-1 h-10 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );

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
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center">
              <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Sent Campaigns</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{sentCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center">
              <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Draft Campaigns</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{draftCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex items-center">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Campaigns</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Management Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <span className="text-lg sm:text-xl">Email Campaigns</span>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
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
                      className="h-11"
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
                      className="h-11"
                      required
                    />
                  </div>

                  {/* Template Toggle */}
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="use-template"
                      checked={useTemplate}
                      onCheckedChange={setUseTemplate}
                    />
                    <Label htmlFor="use-template">Use Brevo Template</Label>
                  </div>

                  {useTemplate ? (
                    <div className="space-y-4">
                      {/* Template Selector */}
                      <div>
                        <Label>Select Template</Label>
                        {brevoTemplates ? (
                          <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Choose a template..." />
                            </SelectTrigger>
                            <SelectContent>
                              {brevoTemplates.templates.map((template) => (
                                <SelectItem key={template.id} value={template.id.toString()}>
                                  <div className="flex items-center space-x-2">
                                    <FileText className="w-4 h-4" />
                                    <span>{template.name}</span>
                                    {template.tag && (
                                      <Badge variant="outline" className="text-xs">
                                        {template.tag}
                                      </Badge>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="flex items-center space-x-2 p-3 border rounded-lg">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Loading templates...</span>
                          </div>
                        )}
                      </div>

                      {/* Template Preview */}
                      {selectedTemplate && (
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{selectedTemplate.name}</h4>
                            <Badge variant={selectedTemplate.isActive ? 'default' : 'secondary'}>
                              {selectedTemplate.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Subject: {selectedTemplate.subject || 'No subject set'}
                          </p>
                          <p className="text-xs text-gray-500">
                            Last modified: {format(new Date(selectedTemplate.modifiedAt), 'MMM dd, yyyy')}
                          </p>
                          
                          {/* Template Variables */}
                          {selectedTemplate.variables && selectedTemplate.variables.length > 0 && (
                            <div className="mt-4">
                              <Label className="text-sm font-medium">Template Variables</Label>
                              <div className="mt-2 space-y-2">
                                {selectedTemplate.variables.map((variable) => (
                                  <div key={variable.name}>
                                    <Label className="text-xs">{variable.name}</Label>
                                    <Input
                                      placeholder={variable.example || `Enter ${variable.name}`}
                                      value={newCampaign.template_variables[variable.name] || ''}
                                      onChange={(e) => setNewCampaign({
                                        ...newCampaign,
                                        template_variables: {
                                          ...newCampaign.template_variables,
                                          [variable.name]: e.target.value
                                        }
                                      })}
                                      className="h-9"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="campaign-content">Plain Text Content</Label>
                        <Textarea
                          id="campaign-content"
                          value={newCampaign.content}
                          onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                          placeholder="Enter plain text content"
                          rows={4}
                          className="resize-none"
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
                          className="resize-none"
                        />
                      </div>
                    </div>
                  )}
                  
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
                  
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="h-11">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createCampaign.isPending} className="h-11">
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
            <TabsList className={isMobile ? "grid w-full grid-cols-2" : "grid w-full grid-cols-2 max-w-md"}>
              <TabsTrigger value="campaigns" className="text-sm">Campaigns</TabsTrigger>
              <TabsTrigger value="metrics" className="text-sm">Metrics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="campaigns" className="space-y-4">
              {isMobile ? (
                <div className="space-y-4">
                  {campaigns.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center text-gray-500">
                        No campaigns yet. Create your first campaign to get started.
                      </CardContent>
                    </Card>
                  ) : (
                    campaigns.map((campaign) => (
                      <Card key={campaign.id} className="shadow-sm">
                        <CardContent className="p-4">
                          {renderMobileCampaignCard(campaign)}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
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
                </div>
              )}
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              {selectedCampaignId && selectedCampaignMetrics ? (
                <CampaignMetricsCard
                  metrics={selectedCampaignMetrics}
                  onRefresh={() => handleSyncMetrics(selectedCampaignId)}
                  isRefreshing={syncMetrics.isPending}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a sent campaign to view metrics</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Click the metrics icon next to a sent campaign to load its performance data
                  </p>
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
