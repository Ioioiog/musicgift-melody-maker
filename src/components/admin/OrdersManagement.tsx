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
import { useTranslation } from '@/hooks/useTranslations';
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
  const [sunoDialogOpen, setSunoDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [openPromptCards, setOpenPromptCards] = useState<Set<string>>(new Set());
  const [openPromptDetails, setOpenPromptDetails] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

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
      + "ID,Package Value,Package Name,Total Price,Status,Created At,Customer Email\n"
      + orders.map(order => {
          const formData = order.form_data as OrderFormData;
          return `${order.id},${order.package_value || 'N/A'},${order.package_name || 'N/A'},${order.total_price},${order.status},${order.created_at},${formData?.email || 'N/A'}`;
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

    return (
      <div className="space-y-4">
        {/* Header Section */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">#{order.id.slice(0, 8)}</h3>
            <span className="text-lg font-bold text-purple-600">{order.total_price} RON</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge className={getStatusColor(order.status)}>
              {t(order.status, order.status)}
            </Badge>
            <Badge className={getPaymentStatusColor(order.payment_status)}>
              {t('payment', 'Payment')}: {t(order.payment_status, order.payment_status)}
            </Badge>
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
          </div>
          <div className="space-y-1">
            <p><strong>{t('created', 'Created')}:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
            <p><strong>{t('recipient', 'Recipient')}:</strong> {formData?.recipientName || 'N/A'}</p>
            <p><strong>{t('occasion', 'Occasion')}:</strong> {formData?.occasion || 'N/A'}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          <Select 
            value={order.status} 
            onValueChange={(value) => updateOrderStatus(order.id, value)}
          >
            <SelectTrigger className="w-full h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">{t('pending', 'Pending')}</SelectItem>
              <SelectItem value="in_progress">{t('inProgress', 'In Progress')}</SelectItem>
              <SelectItem value="completed">{t('completed', 'Completed')}</SelectItem>
              <SelectItem value="cancelled">{t('cancelled', 'Cancelled')}</SelectItem>
            </SelectContent>
          </Select>

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

    return (
      <>
        <td className="px-6 py-4">
          <div className="text-sm font-medium text-gray-900">#{order.id.slice(0, 8)}</div>
          <div className="text-sm text-gray-500">{formData?.email || 'N/A'}</div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-900">{formData?.fullName || 'N/A'}</div>
          <div className="text-sm text-gray-500">{order.package_value || 'N/A'}</div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm font-medium text-gray-900">{order.total_price} RON</div>
          <div className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</div>
        </td>
        <td className="px-6 py-4">
          <div className="flex flex-wrap gap-1">
            <Badge className={getStatusColor(order.status)}>
              {t(order.status, order.status)}
            </Badge>
            <Badge className={getPaymentStatusColor(order.payment_status)}>
              {t(order.payment_status, order.payment_status)}
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
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle className="text-xl sm:text-2xl">{t('ordersManagement', 'Orders Management')}</CardTitle>
            <Button onClick={exportOrders} variant="outline" size="sm" className="w-full sm:w-auto">
              <Download className="w-4 h-4 mr-2" />
              {t('exportCSV', 'Export CSV')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
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
