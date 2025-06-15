import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { Button } from '@/components/ui/button';
import { Edit, CheckCircle, Package, Music } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import OrderEditDialog from './OrderEditDialog';
import MusicPromptsDialog from './MusicPromptsDialog';

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
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMusicPromptsDialogOpen, setIsMusicPromptsDialogOpen] = useState(false);
  const [selectedOrderForPrompts, setSelectedOrderForPrompts] = useState<any>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    fetchOrders();
  }, []);

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
          if (order.form_data && typeof order.form_data === 'object') {
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

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'created_at',
      headerName: 'Date',
      width: 150,
      renderCell: (params: GridRenderCellParams) => {
        return format(new Date(params.value), 'yyyy-MM-dd HH:mm:ss');
      },
    },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'total_price', headerName: 'Total Price', width: 120 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      renderCell: (params: GridRenderCellParams<any, any>) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditOrder(params.row)}
            className="text-xs"
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
          {params.row.status === 'completed' && (
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
            onClick={() => handleGeneratePrompts(params.row)}
            className="text-xs"
          >
            <Music className="w-3 h-3 mr-1" />
            Generate Music Content
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="h-full">
      <DataGrid
        rows={orders}
        columns={columns}
        loading={loading}
        getRowId={(row) => row.id}
        slots={{ toolbar: GridToolbar }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10, 20, 50]}
        disableRowSelectionOnClick
      />
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
