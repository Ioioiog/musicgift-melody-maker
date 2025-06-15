
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, RefreshCw, FileText, Receipt, CreditCard, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OrderActionMenuProps {
  order: any;
  onRefresh: () => void;
}

const OrderActionMenu = ({ order, onRefresh }: OrderActionMenuProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAction = async (action: string, actionFn: () => Promise<void>) => {
    setLoading(action);
    try {
      await actionFn();
      onRefresh();
    } catch (error) {
      console.error(`Error in ${action}:`, error);
    } finally {
      setLoading(null);
    }
  };

  const refreshPaymentStatus = async () => {
    const { data, error } = await supabase.functions.invoke('refresh-payment-status', {
      body: { orderId: order.id }
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to refresh payment status',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: data?.message || 'Payment status refreshed',
      });
    }
  };

  const createProforma = async () => {
    const { data, error } = await supabase.functions.invoke('smartbill-create-proforma', {
      body: { orderData: order }
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to create proforma',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Proforma created successfully',
      });
    }
  };

  const viewProformaPDF = async () => {
    try {
      // Use direct fetch to the edge function to get binary PDF data
      const response = await fetch(`https://ehvzhnzqcbzuirovwjsr.supabase.co/functions/v1/smartbill-get-proforma-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`,
        },
        body: JSON.stringify({ orderId: order.id })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch PDF');
      }

      // Get the PDF as a blob
      const pdfBlob = await response.blob();
      
      // Create a blob URL and open it
      const pdfUrl = URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' }));
      window.open(pdfUrl, '_blank');
      
      // Clean up the blob URL after a short delay
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 1000);

    } catch (error) {
      console.error('Error viewing proforma PDF:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to view proforma PDF',
        variant: 'destructive',
      });
    }
  };

  const convertToInvoice = async () => {
    const { data, error } = await supabase.functions.invoke('convert-to-invoice', {
      body: { orderId: order.id }
    });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to convert to invoice',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Successfully converted to invoice',
      });
    }
  };

  const viewStripeSession = () => {
    if (order.stripe_session_id) {
      window.open(`https://dashboard.stripe.com/test/payments/${order.stripe_session_id}`, '_blank');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem 
          onClick={() => handleAction('refresh', refreshPaymentStatus)}
          disabled={loading === 'refresh'}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {loading === 'refresh' ? 'Refreshing...' : 'Refresh Payment Status'}
        </DropdownMenuItem>

        {order.payment_provider === 'smartbill' && (
          <>
            <DropdownMenuItem 
              onClick={() => handleAction('proforma', createProforma)}
              disabled={loading === 'proforma'}
            >
              <FileText className="mr-2 h-4 w-4" />
              {loading === 'proforma' ? 'Creating...' : 'Create Proforma'}
            </DropdownMenuItem>

            {order.smartbill_proforma_id && (
              <DropdownMenuItem 
                onClick={() => handleAction('pdf', viewProformaPDF)}
                disabled={loading === 'pdf'}
              >
                <FileText className="mr-2 h-4 w-4" />
                {loading === 'pdf' ? 'Loading...' : 'View Proforma PDF'}
              </DropdownMenuItem>
            )}

            {order.payment_status === 'completed' && (
              <DropdownMenuItem 
                onClick={() => handleAction('invoice', convertToInvoice)}
                disabled={loading === 'invoice'}
              >
                <Receipt className="mr-2 h-4 w-4" />
                {loading === 'invoice' ? 'Converting...' : 'Convert to Invoice'}
              </DropdownMenuItem>
            )}

            {order.netopia_order_id && (
              <DropdownMenuItem onClick={() => toast({ title: 'Info', description: `Netopia Order: ${order.netopia_order_id}` })}>
                <Globe className="mr-2 h-4 w-4" />
                View Netopia Order
              </DropdownMenuItem>
            )}
          </>
        )}

        {order.payment_provider === 'stripe' && order.stripe_session_id && (
          <DropdownMenuItem onClick={viewStripeSession}>
            <CreditCard className="mr-2 h-4 w-4" />
            View Stripe Session
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrderActionMenu;
