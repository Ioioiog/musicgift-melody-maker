
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, CheckCircle, Music, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import OrderEditDialog from './OrderEditDialog';
import MusicPromptsDialog from './MusicPromptsDialog';
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
  const [sortField, setSortField] = useState<keyof Order>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterAndSortOrders();
  }, [orders, searchTerm, statusFilter, sortField, sortDirection]);

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
        // Transform the data to match our Order interface
        const transformedOrders = (data || []).map(order => {
          // Safely extract email from form_data with proper type checking
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
            package_value: order.package_value
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
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort orders
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when filtering
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

  // Pagination
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
      {/* Filters */}
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
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer select-none"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center gap-1">
                  ID {getSortIcon('id')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer select-none"
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center gap-1">
                  Date {getSortIcon('created_at')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer select-none"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center gap-1">
                  Email {getSortIcon('email')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer select-none"
                onClick={() => handleSort('total_price')}
              >
                <div className="flex items-center gap-1">
                  Total Price {getSortIcon('total_price')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer select-none"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-1">
                  Status {getSortIcon('status')}
                </div>
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">
                  {order.id.slice(0, 8)}...
                </TableCell>
                <TableCell>
                  {format(new Date(order.created_at), 'yyyy-MM-dd HH:mm')}
                </TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell>{order.total_price}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditOrder(order)}
                      className="text-xs"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    {order.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGeneratePrompts(order)}
                      className="text-xs"
                    >
                      <Music className="w-3 h-3 mr-1" />
                      Generate Music Content
                    </Button>
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
