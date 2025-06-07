import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Eye, Download, Music, Database, ChevronDown, ChevronUp, Copy, RefreshCw, FileText, Receipt, CreditCard } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { ResponsiveTable } from '@/components/ui/responsive-table';
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
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('all');
  const [sunoDialogOpen, setSunoDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [openPromptCards, setOpenPromptCards] = useState<Set<string>>(new Set());
  const [openPromptDetails, setOpenPromptDetails] = useState<Set<string>>(new Set());
  const [refreshingOrders, setRefreshingOrders] = useState<Set<string>>(new Set());
  const [bulkRefreshing, setBulkRefreshing] = useState(false);
  const [creatingProforma, setCreatingProforma] = useState<Set<string>>(new Set());
  const [convertingToInvoice, setConvertingToInvoice] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  const { data: orders = [], refetch, isLoading } = useQuery({
    queryKey: ['admin-orders', selectedStatus, selectedPaymentStatus],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply order status filter
      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus);
      }

      // Apply payment status filter
      if (selectedPaymentStatus !== 'all') {
        if (selectedPaymentStatus === 'paid') {
          // Show both completed payments and SmartBill paid status
          query = query.or('payment_status.eq.completed,smartbill_payment_status.eq.paid');
        } else if (selectedPaymentStatus === 'pending') {
          query = query.or('payment_status.eq.pending,smartbill_payment_status.eq.pending');
        } else if (selectedPaymentStatus === 'failed') {
          query = query.or('payment_status.eq.failed,smartbill_payment_status.eq.failed');
        } else {
          // For specific payment statuses
          query = query.or(`payment_status.eq.${selectedPaymentStatus},smartbill_payment_status.eq.${selectedPaymentStatus}`);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

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

  // Calculate payment statistics
  const paymentStats = {
    total: orders.length,
    paid: orders.filter(order => 
      order.payment_status === 'completed' || order.smartbill_payment_status === 'paid'
    ).length,
    pending: orders.filter(order => 
      order.payment_status === 'pending' || order.smartbill_payment_status === 'pending'
    ).length,
    failed: orders.filter(order => 
      order.payment_status === 'failed' || order.smartbill_payment_status === 'failed'
    ).length
  };

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

  const refreshPaymentStatus = async (orderId: string) => {
    if (refreshingOrders.has(orderId)) return;
    
    setRefreshingOrders(prev => new Set(prev).add(orderId));
    
    try {
      console.log(`Refreshing payment status for order: ${orderId}`);
      
      const { data, error } = await supabase.functions.invoke('refresh-payment-status', {
        body: { orderId }
      });

      if (error) {
        console.error('Payment status refresh error:', error);
        toast({ 
          title: 'Error refreshing payment status', 
          description: error.message || 'Failed to refresh payment status',
          variant: 'destructive' 
        });
        return;
      }

      if (data?.error) {
        console.error('Payment status refresh error:', data.error);
        toast({ 
          title: 'Payment status refresh error', 
          description: data.error,
          variant: 'destructive' 
        });
        return;
      }

      console.log('Payment status refresh result:', data);
      
      await refetch();
      
      toast({ 
        title: data?.statusChanged ? 'Payment status updated' : 'Payment status checked',
        description: data?.message || 'Payment status refreshed successfully'
      });
      
    } catch (error) {
      console.error('Error refreshing payment status:', error);
      toast({ 
        title: 'Error refreshing payment status', 
        description: 'Failed to refresh payment status',
        variant: 'destructive' 
      });
    } finally {
      setRefreshingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const bulkRefreshPaymentStatus = async () => {
    if (bulkRefreshing) return;
    
    setBulkRefreshing(true);
    
    try {
      console.log('Starting bulk payment status refresh');
      
      const { data, error } = await supabase.functions.invoke('bulk-refresh-payment-status');

      if (error) {
        console.error('Bulk payment status refresh error:', error);
        toast({ 
          title: 'Bulk refresh failed', 
          description: error.message || 'Failed to refresh payment statuses',
          variant: 'destructive' 
        });
        return;
      }

      if (data?.error) {
        console.error('Bulk payment status refresh error:', data.error);
        toast({ 
          title: 'Bulk refresh error', 
          description: data.error,
          variant: 'destructive' 
        });
        return;
      }

      console.log('Bulk payment status refresh result:', data);
      
      await refetch();
      
      const { totalOrders, successCount, changedCount, errorCount } = data;
      
      if (errorCount > 0) {
        toast({ 
          title: `Bulk refresh completed with errors`,
          description: `${successCount}/${totalOrders} orders processed. ${changedCount} status changes. ${errorCount} errors.`,
          variant: 'destructive'
        });
      } else {
        toast({ 
          title: 'Bulk refresh completed',
          description: `${successCount} orders processed successfully. ${changedCount} status changes.`
        });
      }
      
    } catch (error) {
      console.error('Error during bulk payment status refresh:', error);
      toast({ 
        title: 'Bulk refresh failed', 
        description: 'Failed to refresh payment statuses',
        variant: 'destructive' 
      });
    } finally {
      setBulkRefreshing(false);
    }
  };

  const convertToInvoice = async (orderId: string) => {
    if (convertingToInvoice.has(orderId)) return;
    
    setConvertingToInvoice(prev => new Set(prev).add(orderId));
    
    try {
      console.log(`Converting order to invoice: ${orderId}`);
      
      const { data, error } = await supabase.functions.invoke('convert-to-invoice', {
        body: { orderId, conversionSource: 'manual' }
      });

      if (error) {
        console.error('Invoice conversion error:', error);
        toast({ 
          title: 'Error converting to invoice', 
          description: error.message || 'Failed to convert to invoice',
          variant: 'destructive' 
        });
        return;
      }

      if (data?.error) {
        console.error('Invoice conversion error:', data.error);
        toast({ 
          title: 'Invoice conversion error', 
          description: data.error,
          variant: 'destructive' 
        });
        return;
      }

      console.log('Invoice conversion result:', data);
      
      await refetch();
      
      toast({ 
        title: 'Invoice created successfully',
        description: `Invoice ${data.invoiceId} has been created`
      });
      
    } catch (error) {
      console.error('Error converting to invoice:', error);
      toast({ 
        title: 'Error converting to invoice', 
        description: 'Failed to convert to invoice',
        variant: 'destructive' 
      });
    } finally {
      setConvertingToInvoice(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const createProforma = async (orderId: string) => {
    if (creatingProforma.has(orderId)) return;
    
    setCreatingProforma(prev => new Set(prev).add(orderId));
    
    try {
      console.log(`Creating SmartBill proforma for order: ${orderId}`);
      
      // Find the order data
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      const { data, error } = await supabase.functions.invoke('smartbill-create-proforma', {
        body: { orderData: order }
      });

      if (error) {
        console.error('SmartBill proforma creation error:', error);
        toast({ 
          title: 'Error creating proforma', 
          description: error.message || 'Failed to create SmartBill proforma',
          variant: 'destructive' 
        });
        return;
      }

      if (data?.error) {
        console.error('SmartBill proforma creation error:', data.error);
        toast({ 
          title: 'SmartBill proforma error', 
          description: data.error,
          variant: 'destructive' 
        });
        return;
      }

      console.log('SmartBill proforma creation result:', data);
      
      // Refetch orders to get updated data
      await refetch();
      
      if (data?.duplicate) {
        toast({ 
          title: 'Proforma already exists',
          description: `Proforma ${data.proformaId} already exists for this order`
        });
      } else {
        toast({ 
          title: 'Proforma created successfully',
          description: `SmartBill proforma ${data.proformaId} has been created`
        });
      }
      
    } catch (error) {
      console.error('Error creating proforma:', error);
      toast({ 
        title: 'Error creating proforma', 
        description: 'Failed to create SmartBill proforma',
        variant: 'destructive' 
      });
    } finally {
      setCreatingProforma(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const refreshOrderStatus = async (orderId: string) => {
    if (refreshingOrders.has(orderId)) return; // Prevent multiple simultaneous requests
    
    setRefreshingOrders(prev => new Set(prev).add(orderId));
    
    try {
      console.log(`Refreshing order status for: ${orderId}`);
      
      const { data, error } = await supabase.functions.invoke('smartbill-status-sync', {
        body: { orderId }
      });

      if (error) {
        console.error('SmartBill sync error:', error);
        toast({ 
          title: 'Error refreshing status', 
          description: error.message || 'Failed to sync with SmartBill',
          variant: 'destructive' 
        });
        return;
      }

      if (data?.error) {
        console.error('SmartBill sync error:', data.error);
        toast({ 
          title: 'SmartBill sync error', 
          description: data.error,
          variant: 'destructive' 
        });
        return;
      }

      console.log('SmartBill sync result:', data);
      
      // Refetch orders to get updated data
      await refetch();
      
      toast({ 
        title: data?.statusChanged ? 'Status updated' : 'Status checked',
        description: data?.message || 'Payment status synced with SmartBill'
      });
      
    } catch (error) {
      console.error('Error refreshing order status:', error);
      toast({ 
        title: 'Error refreshing order status', 
        description: 'Failed to connect to SmartBill',
        variant: 'destructive' 
      });
    } finally {
      setRefreshingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const bulkRefreshOrderStatus = async () => {
    if (bulkRefreshing) return;
    
    setBulkRefreshing(true);
    
    try {
      console.log('Starting bulk refresh of order statuses');
      
      const { data, error } = await supabase.functions.invoke('smartbill-bulk-status-sync');

      if (error) {
        console.error('Bulk SmartBill sync error:', error);
        toast({ 
          title: 'Bulk refresh failed', 
          description: error.message || 'Failed to sync with SmartBill',
          variant: 'destructive' 
        });
        return;
      }

      if (data?.error) {
        console.error('Bulk SmartBill sync error:', data.error);
        toast({ 
          title: 'Bulk SmartBill sync error', 
          description: data.error,
          variant: 'destructive' 
        });
        return;
      }

      console.log('Bulk SmartBill sync result:', data);
      
      // Refetch orders to get updated data
      await refetch();
      
      const { totalOrders, successCount, changedCount, errorCount } = data;
      
      if (errorCount > 0) {
        toast({ 
          title: `Bulk refresh completed with errors`,
          description: `${successCount}/${totalOrders} orders synced successfully. ${changedCount} status changes. ${errorCount} errors.`,
          variant: 'destructive'
        });
      } else {
        toast({ 
          title: 'Bulk refresh completed',
          description: `${successCount} orders synced successfully. ${changedCount} status changes.`
        });
      }
      
    } catch (error) {
      console.error('Error during bulk refresh:', error);
      toast({ 
        title: 'Bulk refresh failed', 
        description: 'Failed to connect to SmartBill for bulk sync',
        variant: 'destructive' 
      });
    } finally {
      setBulkRefreshing(false);
    }
  };

  const exportOrders = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Package Value,Package Name,Total Price,Status,Payment Status,SmartBill Status,Created At,Customer Email\n"
      + orders.map(order => {
          const formData = order.form_data as OrderFormData;
          return `${order.id},${order.package_value || 'N/A'},${order.package_name || 'N/A'},${order.total_price},${order.status},${order.payment_status || 'N/A'},${order.smartbill_payment_status || 'N/A'},${order.created_at},${formData?.email || 'N/A'}`;
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
      case 'completed': 
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOverallPaymentStatus = (order: any) => {
    // Determine the most relevant payment status
    if (order.payment_status === 'completed' || order.smartbill_payment_status === 'paid') {
      return { status: 'paid', label: 'Paid' };
    }
    if (order.payment_status === 'failed' || order.smartbill_payment_status === 'failed') {
      return { status: 'failed', label: 'Failed' };
    }
    if (order.payment_status === 'pending' || order.smartbill_payment_status === 'pending') {
      return { status: 'pending', label: 'Pending' };
    }
    return { status: order.payment_status || 'unknown', label: order.payment_status || 'Unknown' };
  };

  const formatCurrency = (amount: number | string, currency: string = 'RON', order: any = null) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    // Check if this is a Stripe payment (has stripe_session_id)
    const isStripePayment = order?.stripe_session_id;
    
    if (isStripePayment) {
      // Stripe always stores amounts in cents, so always divide by 100
      const displayAmount = numAmount / 100;
      return `${displayAmount.toFixed(2)} ${currency}`;
    }
    
    if (currency === 'EUR') {
      // For non-Stripe EUR payments, display amount as-is
      return `${numAmount.toFixed(2)} EUR`;
    } else {
      // For RON or other currencies, display as-is
      return `${numAmount} ${currency}`;
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

  const translatePackageIncludes = (includes: any[]) => {
    if (!includes || !Array.isArray(includes)) return [];
    
    return includes.map((include: any) => {
      const includeKey = include.include_key || include;
      return t(includeKey, includeKey);
    });
  };

  const renderMobileOrderCard = (order: any, index: number) => {
    const formData = order.form_data as OrderFormData;
    const hasPrompts = hasSavedPrompts(order.id);
    const savedPrompt = getSavedPrompt(order.id);
    const isPromptCardOpen = openPromptCards.has(order.id);
    const packageValue = order.package_value || (formData as any)?.package || (formData as any)?.packageType;
    const overallPaymentStatus = getOverallPaymentStatus(order);
    const isRefreshing = refreshingOrders.has(order.id);
    const isCreatingProforma = creatingProforma.has(order.id);
    const isConvertingToInvoice = convertingToInvoice.has(order.id);
    const hasProforma = order.smartbill_proforma_id || order.smartbill_invoice_id;
    const isPaid = order.payment_status === 'completed' || order.smartbill_payment_status === 'paid';
    const canConvertToInvoice = isPaid && !order.smartbill_invoice_id;

    return (
      <div className="space-y-4">
        {/* Header Section */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">#{order.id.slice(0, 8)}</h3>
            <span className="text-lg font-bold text-purple-600">
              {formatCurrency(order.total_price, order.currency, order)}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge className={getStatusColor(order.status)}>
              {t(order.status, order.status)}
            </Badge>
            <Badge className={getPaymentStatusColor(overallPaymentStatus.status)}>
              {overallPaymentStatus.label}
            </Badge>
            {order.payment_provider && (
              <Badge variant="outline" className="capitalize">
                {order.payment_provider}
              </Badge>
            )}
            <DeliveryCountdownBadge 
              orderCreatedAt={order.created_at}
              packageValue={packageValue}
              orderStatus={order.status}
            />
            {hasPrompts && (
              <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                <Database className="w-3 h-3 mr-1" />
                {t('savedPrompts', 'Saved Prompts')}
              </Badge>
            )}
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="space-y-1">
            <p><strong>{t('customer', 'Customer')}:</strong> {formData?.fullName || 'N/A'}</p>
            <p><strong>{t('email', 'Email')}:</strong> {formData?.email || 'N/A'}</p>
            <p><strong>{t('package', 'Package')}:</strong> {order.package_value || 'N/A'}</p>
            {order.smartbill_invoice_id && (
              <p><strong>SmartBill Invoice:</strong> {order.smartbill_invoice_id}</p>
            )}
            {order.smartbill_proforma_id && (
              <p><strong>SmartBill Proforma:</strong> {order.smartbill_proforma_id}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          <div className="flex gap-2">
            <Select 
              value={order.status} 
              onValueChange={(value) => updateOrderStatus(order.id, value)}
            >
              <SelectTrigger className="flex-1 h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">{t('pending', 'Pending')}</SelectItem>
                <SelectItem value="in_progress">{t('inProgress', 'In Progress')}</SelectItem>
                <SelectItem value="completed">{t('completed', 'Completed')}</SelectItem>
                <SelectItem value="cancelled">{t('cancelled', 'Cancelled')}</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshPaymentStatus(order.id)}
              disabled={isRefreshing}
              className="h-11 px-3"
              title="Refresh payment status"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>

            {!hasProforma && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => createProforma(order.id)}
                disabled={isCreatingProforma}
                className="h-11 px-3"
                title="Create SmartBill Proforma"
              >
                <FileText className={`w-4 h-4 ${isCreatingProforma ? 'animate-spin' : ''}`} />
              </Button>
            )}

            {canConvertToInvoice && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => convertToInvoice(order.id)}
                disabled={isConvertingToInvoice}
                className="h-11 px-3"
                title="Convert to Invoice"
              >
                <Receipt className={`w-4 h-4 ${isConvertingToInvoice ? 'animate-spin' : ''}`} />
              </Button>
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openSunoDialog(order)}
              className={`w-full h-11 justify-start ${hasPrompts 
                ? "bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200" 
                : "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
              }`}
            >
              <Music className="w-4 h-4 mr-2" />
              {hasPrompts ? t('viewEditPrompts', 'View/Edit Prompts') : t('createPrompts', 'Create Prompts')}
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full h-11 justify-start">
                  <Eye className="w-4 h-4 mr-2" />
                  {t('viewDetails', 'View Details')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t('orderDetails', 'Order Details')} #{order.id.slice(0, 8)}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">{t('packageInformation', 'Package Information')}:</h4>
                    <div className="bg-gray-100 p-4 rounded text-sm">
                      <p><strong>{t('packageValue', 'Package Value')}:</strong> {order.package_value}</p>
                      <p><strong>{t('packageName', 'Package Name')}:</strong> {order.package_name ? t(order.package_name, order.package_name) : 'N/A'}</p>
                      <p><strong>{t('packagePrice', 'Package Price')}:</strong> {order.package_price} RON</p>
                      <p><strong>{t('deliveryTime', 'Delivery Time')}:</strong> {order.package_delivery_time ? t(order.package_delivery_time, order.package_delivery_time) : 'N/A'}</p>
                      {order.package_includes && Array.isArray(order.package_includes) && order.package_includes.length > 0 && (
                        <div>
                          <p><strong>{t('includes', 'Includes')}:</strong></p>
                          <ul className="list-disc list-inside ml-4">
                            {translatePackageIncludes(order.package_includes).map((translatedInclude: string, index: number) => (
                              <li key={index}>{translatedInclude}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">{t('formData', 'Form Data')}:</h4>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                      {JSON.stringify(order.form_data, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">{t('selectedAddons', 'Selected Addons')}:</h4>
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
    );
  };

  const renderDesktopRow = (order: any, index: number) => {
    const formData = order.form_data as OrderFormData;
    const hasPrompts = hasSavedPrompts(order.id);
    const packageValue = order.package_value || (formData as any)?.package || (formData as any)?.packageType;
    const overallPaymentStatus = getOverallPaymentStatus(order);
    const isRefreshing = refreshingOrders.has(order.id);
    const isCreatingProforma = creatingProforma.has(order.id);
    const isConvertingToInvoice = convertingToInvoice.has(order.id);
    const hasProforma = order.smartbill_proforma_id || order.smartbill_invoice_id;
    const isPaid = order.payment_status === 'completed' || order.smartbill_payment_status === 'paid';
    const canConvertToInvoice = isPaid && !order.smartbill_invoice_id;

    return (
      <>
        <td className="px-6 py-4">
          <div className="text-sm font-medium text-gray-900">#{order.id.slice(0, 8)}</div>
          <div className="text-sm text-gray-500">{formData?.email || 'N/A'}</div>
          {order.smartbill_invoice_id && (
            <div className="text-xs text-blue-600">Invoice: {order.smartbill_invoice_id}</div>
          )}
          {order.smartbill_proforma_id && !order.smartbill_invoice_id && (
            <div className="text-xs text-green-600">Proforma: {order.smartbill_proforma_id}</div>
          )}
          {order.payment_provider && (
            <div className="text-xs text-purple-600 capitalize">{order.payment_provider}</div>
          )}
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-900">{formData?.fullName || 'N/A'}</div>
          <div className="text-sm text-gray-500">{order.package_value || 'N/A'}</div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm font-medium text-gray-900">
            {formatCurrency(order.total_price, order.currency, order)}
          </div>
          <div className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</div>
        </td>
        <td className="px-6 py-4">
          <div className="flex flex-wrap gap-1">
            <Badge className={getStatusColor(order.status)}>
              {t(order.status, order.status)}
            </Badge>
            <Badge className={getPaymentStatusColor(overallPaymentStatus.status)}>
              {overallPaymentStatus.label}
            </Badge>
            <DeliveryCountdownBadge 
              orderCreatedAt={order.created_at}
              packageValue={packageValue}
              orderStatus={order.status}
            />
            {hasPrompts && (
              <Badge className="bg-purple-100 text-purple-800">
                <Database className="w-3 h-3 mr-1" />
                Prompts
              </Badge>
            )}
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex space-x-2">
            <Select 
              value={order.status} 
              onValueChange={(value) => updateOrderStatus(order.id, value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">{t('pending', 'Pending')}</SelectItem>
                <SelectItem value="in_progress">{t('inProgress', 'In Progress')}</SelectItem>
                <SelectItem value="completed">{t('completed', 'Completed')}</SelectItem>
                <SelectItem value="cancelled">{t('cancelled', 'Cancelled')}</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshPaymentStatus(order.id)}
              disabled={isRefreshing}
              title="Refresh payment status across all providers"
            >
              <CreditCard className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            
            {!hasProforma && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => createProforma(order.id)}
                disabled={isCreatingProforma}
                title="Create SmartBill Proforma"
              >
                <FileText className={`w-4 h-4 ${isCreatingProforma ? 'animate-spin' : ''}`} />
              </Button>
            )}

            {canConvertToInvoice && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => convertToInvoice(order.id)}
                disabled={isConvertingToInvoice}
                title="Convert to Invoice"
                className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
              >
                <Receipt className={`w-4 h-4 ${isConvertingToInvoice ? 'animate-spin' : ''}`} />
              </Button>
            )}
            
            {order.smartbill_payment_url && order.smartbill_payment_status === 'pending' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(order.smartbill_payment_url, '_blank')}
                title="View SmartBill Payment"
              >
                💳
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => openSunoDialog(order)}
              className={hasPrompts ? "bg-purple-50 border-purple-200" : ""}
            >
              <Music className="w-4 h-4" />
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{t('orderDetails', 'Order Details')} #{order.id.slice(0, 8)}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {(order.smartbill_invoice_id || order.smartbill_proforma_id) && (
                    <div>
                      <h4 className="font-semibold mb-2">SmartBill Information:</h4>
                      <div className="bg-blue-50 p-4 rounded text-sm">
                        {order.smartbill_proforma_id && (
                          <>
                            <p><strong>Proforma ID:</strong> {order.smartbill_proforma_id}</p>
                            <p><strong>Proforma Status:</strong> {order.smartbill_proforma_status || 'created'}</p>
                          </>
                        )}
                        {order.smartbill_invoice_id && (
                          <>
                            <p><strong>Invoice ID:</strong> {order.smartbill_invoice_id}</p>
                            <p><strong>Payment Status:</strong> {order.smartbill_payment_status || 'pending'}</p>
                          </>
                        )}
                        {order.smartbill_payment_url && (
                          <p><strong>Payment URL:</strong> 
                            <a href={order.smartbill_payment_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                              View Payment
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold mb-2">{t('packageInformation', 'Package Information')}:</h4>
                    <div className="bg-gray-100 p-4 rounded text-sm">
                      <p><strong>{t('packageValue', 'Package Value')}:</strong> {order.package_value}</p>
                      <p><strong>{t('packageName', 'Package Name')}:</strong> {order.package_name ? t(order.package_name, order.package_name) : 'N/A'}</p>
                      <p><strong>{t('packagePrice', 'Package Price')}:</strong> {order.package_price} RON</p>
                      <p><strong>{t('deliveryTime', 'Delivery Time')}:</strong> {order.package_delivery_time ? t(order.package_delivery_time, order.package_delivery_time) : 'N/A'}</p>
                      {order.package_includes && Array.isArray(order.package_includes) && order.package_includes.length > 0 && (
                        <div>
                          <p><strong>{t('includes', 'Includes')}:</strong></p>
                          <ul className="list-disc list-inside ml-4">
                            {translatePackageIncludes(order.package_includes).map((translatedInclude: string, index: number) => (
                              <li key={index}>{translatedInclude}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">{t('formData', 'Form Data')}:</h4>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                      {JSON.stringify(order.form_data, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">{t('selectedAddons', 'Selected Addons')}:</h4>
                    <pre className="bg-gray-100 p-4 rounded text-sm">
                      {JSON.stringify(order.selected_addons, null, 2)}
                    </pre>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </td>
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* Payment Statistics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{paymentStats.total}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{paymentStats.paid}</div>
              <div className="text-sm text-gray-600">Paid Orders</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{paymentStats.pending}</div>
              <div className="text-sm text-gray-600">Pending Payments</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{paymentStats.failed}</div>
              <div className="text-sm text-gray-600">Failed Payments</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle className="text-xl sm:text-2xl">{t('ordersManagement', 'Orders Management')}</CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={bulkRefreshPaymentStatus} 
                variant="outline" 
                size="sm" 
                disabled={bulkRefreshing}
                className="relative"
              >
                <CreditCard className={`w-4 h-4 mr-2 ${bulkRefreshing ? 'animate-spin' : ''}`} />
                {bulkRefreshing ? 'Bulk Refreshing...' : 'Bulk Refresh Payments'}
              </Button>
              <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={exportOrders} variant="outline" size="sm" className="w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                {t('exportCSV', 'Export CSV')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder={t('filterByStatus', 'Filter by status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allStatuses', 'All Statuses')}</SelectItem>
                <SelectItem value="pending">{t('pending', 'Pending')}</SelectItem>
                <SelectItem value="in_progress">{t('inProgress', 'In Progress')}</SelectItem>
                <SelectItem value="completed">{t('completed', 'Completed')}</SelectItem>
                <SelectItem value="cancelled">{t('cancelled', 'Cancelled')}</SelectItem>
                <SelectItem value="paid">{t('paid', 'Paid')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Payment Pending</SelectItem>
                <SelectItem value="failed">Payment Failed</SelectItem>
                <SelectItem value="cancelled">Payment Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ResponsiveTable
            headers={[
              t('orderInfo', 'Order Info'),
              t('customer', 'Customer'),
              t('amount', 'Amount'),
              t('status', 'Status'),
              t('actions', 'Actions')
            ]}
            data={orders}
            renderRow={renderDesktopRow}
            renderMobileCard={renderMobileOrderCard}
            className="mt-4"
          />
        </CardContent>
      </Card>

      <SunoPromptsDialog
        isOpen={sunoDialogOpen}
        onClose={() => {
          setSunoDialogOpen(false);
          refetch();
        }}
        orderData={selectedOrder}
      />
    </div>
  );
};

export default OrdersManagement;
