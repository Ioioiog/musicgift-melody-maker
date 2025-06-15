
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronUp, ChevronDown } from 'lucide-react';
import OrderEditDialog from './OrderEditDialog';
import MusicPromptsDialog from './MusicPromptsDialog';
import PaymentStatusBadge from './PaymentStatusBadge';
import PaymentProviderIcon from './PaymentProviderIcon';
import OrderActionMenu from './OrderActionMenu';
import BulkOperationsToolbar from './BulkOperationsToolbar';
import { useOrderActions } from '@/hooks/useOrderActions';
import { formatCurrency } from '@/utils/currencyUtils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Order {
  id: string;
  created_at: string;
  email: string;
  total_price: number;
  status: string;
  form_data: any;
  payment_status?: string;
  payment_provider?: string;
  currency?: string;
  package_name?: string;
  package_value?: string;
  stripe_session_id?: string;
  stripe_payment_intent_id?: string;
  smartbill_proforma_id?: string;
  smartbill_proforma_status?: string;
  smartbill_payment_status?: string;
  smartbill_invoice_id?: string;
  revolut_order_id?: string;
  revolut_payment_id?: string;
  last_status_check_at?: string;
}

const OrdersManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMusicPromptsDialogOpen, setIsMusicPromptsDialogOpen] = useState(false);
  const [selectedOrderForPrompts, setSelectedOrderForPrompts] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [sortField, setSortField] = useState<keyof Order>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const { toast } = useToast();
  const { t } = useLanguage();
  const orderActions = useOrderActions();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterAndSortOrders();
  }, [orders, searchTerm, statusFilter, providerFilter, sortField, sortDirection]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch orders',
          variant: 'destructive',
        });
      } else {
        const transformedOrders = (data || []).map(order => {
          let email = 'N/A';
          if (order.form_data && typeof order.form_data === 'object' && order.form_data !== null) {
            const formData = order.form_data as Record<string, any>;
            email = formData.email || formData.customerEmail || 'N/A';
          }

          return {
            id: order.id,
            created_at: order.created_at,
            email,
            total_price: order.total_price || 0,
            status: order.status || 'pending',
            form_data: order.form_data,
            payment_status: order.payment_status,
            payment_provider: order.payment_provider,
            currency: order.currency,
            package_name: order.package_name,
            package_value: order.package_value,
            stripe_session_id: order.stripe_session_id,
            stripe_payment_intent_id: order.stripe_payment_intent_id,
            smartbill_proforma_id: order.smartbill_proforma_id,
            smartbill_proforma_status: order.smartbill_proforma_status,
            smartbill_payment_status: order.smartbill_payment_status,
            smartbill_invoice_id: order.smartbill_invoice_id,
            revolut_order_id: order.revolut_order_id,
            revolut_payment_id: order.revolut_payment_id,
            last_status_check_at: order.last_status_check_at
          };
        });
        setOrders(transformedOrders);
      }
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortOrders = () => {
    let filtered = orders.filter(order => {
      const matchesSearch = 
        order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.package_name && order.package_name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || order.payment_status === statusFilter;
      const matchesProvider = providerFilter === 'all' || order.payment_provider === providerFilter;
      
      return matchesSearch && matchesStatus && matchesProvider;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders(prev => [...prev, orderId]);
    } else {
      setSelectedOrders(prev => prev.filter(id => id !== orderId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(currentOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSort = (field: keyof Order) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof Order) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateOrder = async (updatedOrder: Order) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          status: updatedOrder.status,
          payment_status: updatedOrder.payment_status,
          total_price: updatedOrder.total_price,
          form_data: updatedOrder.form_data
        })
        .eq('id', updatedOrder.id);

      if (error) {
        console.error('Error updating order:', error);
        toast({
          title: 'Error',
          description: 'Failed to update order',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Order updated successfully',
        });
        fetchOrders(); // Refresh orders
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order',
        variant: 'destructive',
      });
    } finally {
      handleCloseEditDialog();
    }
  };

  const handleGeneratePrompts = (order: any) => {
    setSelectedOrderForPrompts(order);
    setIsMusicPromptsDialogOpen(true);
  };

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Enhanced Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search by email, ID, or package..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:max-w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Operations Toolbar */}
      <BulkOperationsToolbar
        selectedOrders={selectedOrders}
        allOrders={currentOrders}
        onSelectAll={handleSelectAll}
        onRefreshComplete={fetchOrders}
        providerFilter={providerFilter}
        statusFilter={statusFilter}
        onProviderFilterChange={setProviderFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Enhanced Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedOrders.length === currentOrders.length && currentOrders.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Proforma</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Total Price</TableHead>
              <TableHead>Last Check</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedOrders.includes(order.id)}
                    onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {order.id.slice(0, 8)}...
                </TableCell>
                <TableCell>
                  {format(new Date(order.created_at), 'yyyy-MM-dd HH:mm')}
                </TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell>
                  <PaymentProviderIcon provider={order.payment_provider || 'unknown'} />
                </TableCell>
                <TableCell>
                  <PaymentStatusBadge status={order.payment_status || 'pending'} type="payment" />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <PaymentStatusBadge 
                      status={order.smartbill_proforma_status || 'not_requested'} 
                      type="proforma" 
                    />
                    {order.smartbill_proforma_id && (
                      <div className="text-xs text-gray-500 font-mono">
                        {order.smartbill_proforma_id}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <PaymentStatusBadge 
                      status={order.smartbill_invoice_id ? 'generated' : 'not_requested'} 
                      type="invoice" 
                    />
                    {order.smartbill_invoice_id && (
                      <div className="text-xs text-gray-500 font-mono">
                        {order.smartbill_invoice_id}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(order.total_price, order.currency, order.payment_provider)}</TableCell>
                <TableCell>
                  {order.last_status_check_at ? (
                    <div className="text-xs text-gray-500">
                      {format(new Date(order.last_status_check_at), 'MM/dd HH:mm')}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Never</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditOrder(order)}
                      className="text-xs"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGeneratePrompts(order)}
                      className="text-xs"
                    >
                      Music Content
                    </Button>
                    <OrderActionMenu 
                      order={order} 
                      onRefresh={fetchOrders}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} orders
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <OrderEditDialog
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        order={selectedOrder}
        onUpdate={handleUpdateOrder}
      />
      <MusicPromptsDialog
        isOpen={isMusicPromptsDialogOpen}
        onClose={() => setIsMusicPromptsDialogOpen(false)}
        orderData={selectedOrderForPrompts}
      />
    </div>
  );
};

export default OrdersManagement;
