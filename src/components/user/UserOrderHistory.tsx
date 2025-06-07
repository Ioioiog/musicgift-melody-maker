
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, Package, RotateCcw, CreditCard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserOrders } from '@/hooks/useUserOrders';
import { getOrderFormData, getCustomerName, getCustomerEmail } from '@/types/order';
import EnhancedOrderTable from './EnhancedOrderTable';
import OrderDetailsModal from './OrderDetailsModal';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const UserOrderHistory = () => {
  const { t } = useLanguage();
  const { data: orders = [], isLoading, error, refetch } = useUserOrders();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshingPayments, setRefreshingPayments] = useState(false);

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    refetch();
  };

  const refreshPaymentStatuses = async () => {
    if (refreshingPayments) return;
    
    setRefreshingPayments(true);
    
    try {
      console.log('Refreshing payment statuses for user orders');
      
      // Get user's order IDs
      const userOrderIds = orders.map(order => order.id);
      
      const { data, error } = await supabase.functions.invoke('bulk-refresh-payment-status', {
        body: { orderIds: userOrderIds }
      });

      if (error) {
        console.error('Payment status refresh error:', error);
        toast({ 
          title: 'Error refreshing payment status', 
          description: error.message || 'Failed to refresh payment statuses',
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
      
      // Refetch orders to get updated data
      await refetch();
      
      const { changedCount, errorCount } = data;
      
      if (errorCount > 0) {
        toast({ 
          title: 'Payment status refresh completed with some errors',
          description: `${changedCount} orders updated. ${errorCount} errors occurred.`,
          variant: 'destructive'
        });
      } else if (changedCount > 0) {
        toast({ 
          title: 'Payment status updated',
          description: `${changedCount} order${changedCount > 1 ? 's' : ''} had payment status changes`
        });
      } else {
        toast({ 
          title: 'Payment status checked',
          description: 'All payment statuses are up to date'
        });
      }
      
    } catch (error) {
      console.error('Error refreshing payment statuses:', error);
      toast({ 
        title: 'Error refreshing payment status', 
        description: 'Failed to refresh payment statuses',
        variant: 'destructive' 
      });
    } finally {
      setRefreshingPayments(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPaymentFilter('all');
    setDateFilter('all');
  };

  const filteredOrders = orders.filter(order => {
    const formData = getOrderFormData(order.form_data);
    const customerName = getCustomerName(order.form_data);
    const customerEmail = getCustomerEmail(order.form_data);
    
    const matchesSearch = searchTerm === '' || 
      order.package_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.package_value?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.smartbill_invoice_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.payment_status === paymentFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all' && order.created_at) {
      const orderDate = new Date(order.created_at);
      const now = new Date();
      switch (dateFilter) {
        case 'week':
          matchesDate = (now.getTime() - orderDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
          break;
        case 'month':
          matchesDate = (now.getTime() - orderDate.getTime()) <= 30 * 24 * 60 * 60 * 1000;
          break;
        case 'year':
          matchesDate = (now.getTime() - orderDate.getTime()) <= 365 * 24 * 60 * 60 * 1000;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesPayment && matchesDate;
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-red-600">
            {t('orderError')}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              {t('orderHistory')}
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshPaymentStatuses}
                disabled={refreshingPayments}
                title="Refresh payment status for all your orders"
              >
                <CreditCard className={`w-4 h-4 mr-1 ${refreshingPayments ? 'animate-spin' : ''}`} />
                {refreshingPayments ? 'Refreshing...' : 'Refresh Payments'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Enhanced Filters */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search orders, customers, invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder="Payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full lg:w-[160px]">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {(searchTerm || statusFilter !== 'all' || paymentFilter !== 'all' || dateFilter !== 'all') && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <Filter className="w-4 h-4 mr-1" />
                  Clear Filters
                </Button>
                <span className="text-sm text-gray-500">
                  Showing {filteredOrders.length} of {orders.length} orders
                </span>
              </div>
            )}
          </div>

          {/* Enhanced Table */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all' || dateFilter !== 'all'
                  ? 'No orders found matching your filters' 
                  : t('noOrdersYet')
                }
              </p>
              {(searchTerm || statusFilter !== 'all' || paymentFilter !== 'all' || dateFilter !== 'all') && (
                <Button variant="outline" className="mt-2" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <EnhancedOrderTable
              orders={filteredOrders}
              onViewDetails={handleViewDetails}
            />
          )}
        </CardContent>
      </Card>

      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default UserOrderHistory;
