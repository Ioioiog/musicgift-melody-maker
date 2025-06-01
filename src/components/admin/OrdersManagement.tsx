import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Eye, Download, Music, Database, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SunoPromptsDialog from './SunoPromptsDialog';
import DeliveryCountdownBadge from './DeliveryCountdownBadge';

interface OrderFormData {
  email?: string;
  fullName?: string;
  recipientName?: string;
  occasion?: string;
  [key: string]: any;
}

const OrdersManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sunoDialogOpen, setSunoDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [openPromptCards, setOpenPromptCards] = useState<Set<string>>(new Set());
  const [openPromptDetails, setOpenPromptDetails] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const { data: orders = [], refetch } = useQuery({
    queryKey: ['admin-orders', selectedStatus],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  // Enhanced query to get saved prompts with full details for all orders
  const { data: savedPromptsDetails = [] } = useQuery({
    queryKey: ['saved-prompts-details'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suno_prompts')
        .select('order_id, title, description, lyrics, technical_tags, prompt, language, created_at, is_optimized')
        .eq('is_optimized', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      toast({ title: 'Order status updated successfully' });
      refetch();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({ title: 'Error updating order status', variant: 'destructive' });
    }
  };

  const exportOrders = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Package ID,Total Price,Status,Created At,Customer Email\n"
      + orders.map(order => {
          const formData = order.form_data as OrderFormData;
          return `${order.id},${order.package_id || 'N/A'},${order.total_price},${order.status},${order.created_at},${formData?.email || 'N/A'}`;
        }).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openSunoDialog = (order: any) => {
    setSelectedOrder(order);
    setSunoDialogOpen(true);
  };

  const hasSavedPrompts = (orderId: string) => {
    return savedPromptsDetails.some(prompt => prompt.order_id === orderId);
  };

  const getSavedPrompt = (orderId: string) => {
    return savedPromptsDetails.find(prompt => prompt.order_id === orderId);
  };

  const togglePromptCard = (orderId: string) => {
    const newOpenCards = new Set(openPromptCards);
    if (newOpenCards.has(orderId)) {
      newOpenCards.delete(orderId);
    } else {
      newOpenCards.add(orderId);
    }
    setOpenPromptCards(newOpenCards);
  };

  const togglePromptDetail = (detailId: string) => {
    const newOpenDetails = new Set(openPromptDetails);
    if (newOpenDetails.has(detailId)) {
      newOpenDetails.delete(detailId);
    } else {
      newOpenDetails.add(detailId);
    }
    setOpenPromptDetails(newOpenDetails);
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied to clipboard',
        description: `${type} has been copied to your clipboard`
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: 'Copy failed',
        description: 'Unable to copy to clipboard',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Orders Management</h2>
        <div className="flex space-x-4">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportOrders}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => {
          const formData = order.form_data as OrderFormData;
          const hasPrompts = hasSavedPrompts(order.id);
          const savedPrompt = getSavedPrompt(order.id);
          const isPromptCardOpen = openPromptCards.has(order.id);
          
          return (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">Order #{order.id.slice(0, 8)}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <Badge className={getPaymentStatusColor(order.payment_status)}>
                        Payment: {order.payment_status}
                      </Badge>
                      <DeliveryCountdownBadge 
                        orderCreatedAt={order.created_at}
                        packageValue={order.package_id}
                        orderStatus={order.status}
                      />
                      {hasPrompts && (
                        <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                          <Database className="w-3 h-3 mr-1" />
                          Saved Prompts
                        </Badge>
                      )}
                      <span className="text-lg font-bold text-purple-600">
                        {order.total_price} RON
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Package ID:</strong> {order.package_id || 'N/A'}</p>
                        <p><strong>Customer:</strong> {formData?.fullName || 'N/A'}</p>
                        <p><strong>Email:</strong> {formData?.email || 'N/A'}</p>
                        <p><strong>Payment ID:</strong> {order.payment_id || 'N/A'}</p>
                      </div>
                      <div>
                        <p><strong>Created:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                        <p><strong>Recipient:</strong> {formData?.recipientName || 'N/A'}</p>
                        <p><strong>Occasion:</strong> {formData?.occasion || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Collapsible Saved Prompts Section */}
                    {hasPrompts && savedPrompt && (
                      <Collapsible 
                        open={isPromptCardOpen} 
                        onOpenChange={() => togglePromptCard(order.id)}
                        className="mt-4"
                      >
                        <CollapsibleTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full justify-between bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                          >
                            <span className="flex items-center">
                              <Database className="w-4 h-4 mr-2" />
                              View Saved Prompts Details
                            </span>
                            {isPromptCardOpen ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-3 space-y-2 p-4 bg-purple-50 rounded-lg border border-purple-200">
                          {/* Title Section */}
                          <Collapsible 
                            open={openPromptDetails.has(`${order.id}-title`)} 
                            onOpenChange={() => togglePromptDetail(`${order.id}-title`)}
                          >
                            <CollapsibleTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="w-full justify-between p-2 text-left font-semibold text-purple-900 hover:bg-purple-100"
                              >
                                <span>Title</span>
                                {openPromptDetails.has(`${order.id}-title`) ? (
                                  <ChevronUp className="w-3 h-3" />
                                ) : (
                                  <ChevronDown className="w-3 h-3" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pl-2 pr-2 pb-2">
                              <div className="flex justify-between items-start bg-white p-2 rounded border">
                                <p className="text-sm text-gray-700 flex-1">{savedPrompt.title}</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(savedPrompt.title, 'Title')}
                                  className="ml-2 h-6 w-6 p-0"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>

                          {/* Description Section */}
                          {savedPrompt.description && (
                            <Collapsible 
                              open={openPromptDetails.has(`${order.id}-description`)} 
                              onOpenChange={() => togglePromptDetail(`${order.id}-description`)}
                            >
                              <CollapsibleTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="w-full justify-between p-2 text-left font-semibold text-purple-900 hover:bg-purple-100"
                                >
                                  <span>Description</span>
                                  {openPromptDetails.has(`${order.id}-description`) ? (
                                    <ChevronUp className="w-3 h-3" />
                                  ) : (
                                    <ChevronDown className="w-3 h-3" />
                                  )}
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent className="pl-2 pr-2 pb-2">
                                <div className="flex justify-between items-start bg-white p-2 rounded border">
                                  <p className="text-sm text-gray-700 flex-1">{savedPrompt.description}</p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(savedPrompt.description, 'Description')}
                                    className="ml-2 h-6 w-6 p-0"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          )}

                          {/* Lyrics Section */}
                          <Collapsible 
                            open={openPromptDetails.has(`${order.id}-lyrics`)} 
                            onOpenChange={() => togglePromptDetail(`${order.id}-lyrics`)}
                          >
                            <CollapsibleTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="w-full justify-between p-2 text-left font-semibold text-purple-900 hover:bg-purple-100"
                              >
                                <span>Lyrics</span>
                                {openPromptDetails.has(`${order.id}-lyrics`) ? (
                                  <ChevronUp className="w-3 h-3" />
                                ) : (
                                  <ChevronDown className="w-3 h-3" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pl-2 pr-2 pb-2">
                              <div className="flex justify-between items-start bg-white p-2 rounded border">
                                <p className="text-sm text-gray-700 flex-1 whitespace-pre-wrap">{savedPrompt.lyrics}</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(savedPrompt.lyrics, 'Lyrics')}
                                  className="ml-2 h-6 w-6 p-0"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>

                          {/* Technical Tags Section */}
                          <Collapsible 
                            open={openPromptDetails.has(`${order.id}-tags`)} 
                            onOpenChange={() => togglePromptDetail(`${order.id}-tags`)}
                          >
                            <CollapsibleTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="w-full justify-between p-2 text-left font-semibold text-purple-900 hover:bg-purple-100"
                              >
                                <span>Technical Tags</span>
                                {openPromptDetails.has(`${order.id}-tags`) ? (
                                  <ChevronUp className="w-3 h-3" />
                                ) : (
                                  <ChevronDown className="w-3 h-3" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pl-2 pr-2 pb-2">
                              <div className="flex justify-between items-start bg-white p-2 rounded border">
                                <p className="text-sm text-gray-700 flex-1">{savedPrompt.technical_tags}</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(savedPrompt.technical_tags, 'Technical Tags')}
                                  className="ml-2 h-6 w-6 p-0"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>

                          {/* Complete Prompt Section */}
                          <Collapsible 
                            open={openPromptDetails.has(`${order.id}-prompt`)} 
                            onOpenChange={() => togglePromptDetail(`${order.id}-prompt`)}
                          >
                            <CollapsibleTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="w-full justify-between p-2 text-left font-semibold text-purple-900 hover:bg-purple-100"
                              >
                                <span>Complete Prompt</span>
                                {openPromptDetails.has(`${order.id}-prompt`) ? (
                                  <ChevronUp className="w-3 h-3" />
                                ) : (
                                  <ChevronDown className="w-3 h-3" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pl-2 pr-2 pb-2">
                              <div className="flex justify-between items-start bg-white p-2 rounded border">
                                <p className="text-sm text-gray-700 flex-1 whitespace-pre-wrap">{savedPrompt.prompt}</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(savedPrompt.prompt, 'Complete Prompt')}
                                  className="ml-2 h-6 w-6 p-0"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>

                          {/* Metadata */}
                          <div className="text-xs text-gray-500 pt-2 border-t border-purple-200">
                            <p>Language: {savedPrompt.language}</p>
                            <p>Created: {new Date(savedPrompt.created_at).toLocaleString()}</p>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Select 
                      value={order.status} 
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openSunoDialog(order)}
                        className={hasPrompts 
                          ? "bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200" 
                          : "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
                        }
                      >
                        <Music className="w-4 h-4 mr-2" />
                        {hasPrompts ? 'View/Edit Prompts' : 'Create Prompts'}
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Order Details #{order.id.slice(0, 8)}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Form Data:</h4>
                              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                                {JSON.stringify(order.form_data, null, 2)}
                              </pre>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Selected Addons:</h4>
                              <pre className="bg-gray-100 p-4 rounded text-sm">
                                {JSON.stringify(order.selected_addons, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {orders.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            No orders found for the selected filter.
          </CardContent>
        </Card>
      )}

      <SunoPromptsDialog
        isOpen={sunoDialogOpen}
        onClose={() => setSunoDialogOpen(false)}
        orderData={selectedOrder}
      />
    </div>
  );
};

export default OrdersManagement;
