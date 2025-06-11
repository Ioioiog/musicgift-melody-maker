
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, FileText, CheckCircle, AlertCircle, Search } from "lucide-react";

const SmartBillPaymentManager = () => {
  const [orderId, setOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const { toast } = useToast();

  const handleSearchOrder = async () => {
    if (!orderId.trim()) {
      toast({
        title: "Error",
        description: "Please enter an order ID",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId.trim())
        .single();

      if (error || !order) {
        console.error('Order search error:', error);
        toast({
          title: "Order Not Found",
          description: `No order found with ID: ${orderId.slice(0, 8)}...`,
          variant: "destructive"
        });
        setOrderDetails(null);
        return;
      }

      setOrderDetails(order);
      console.log('Order found:', order);
      toast({
        title: "Order Found",
        description: `Order ${orderId.slice(0, 8)}... - Status: ${order.status}, Payment: ${order.payment_status}`
      });
    } catch (error) {
      console.error('Error searching order:', error);
      toast({
        title: "Search Failed",
        description: error.message || "Failed to search for order",
        variant: "destructive"
      });
      setOrderDetails(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSyncPaymentStatus = async () => {
    if (!orderId.trim()) {
      toast({
        title: "Error",
        description: "Please enter an order ID",
        variant: "destructive"
      });
      return;
    }

    setIsSyncing(true);
    try {
      console.log('Starting sync for order:', orderId.trim());
      
      const { data, error } = await supabase.functions.invoke('smartbill-status-sync', {
        body: { orderId: orderId.trim() }
      });

      console.log('Sync response:', { data, error });

      if (error) {
        console.error('Sync function error:', error);
        throw error;
      }

      if (data?.success) {
        toast({
          title: "Status Synced Successfully",
          description: data.statusChanged ? 
            `Order status updated to: ${data.currentPaymentStatus}` : 
            "Status checked - no changes needed"
        });
        
        // Refresh order details after sync
        if (orderDetails) {
          await handleSearchOrder();
        }
      } else {
        console.error('Sync failed with data:', data);
        throw new Error(data?.error || 'Failed to sync status');
      }
    } catch (error) {
      console.error('Error syncing payment status:', error);
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync payment status",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleConvertToInvoice = async () => {
    if (!orderId.trim()) {
      toast({
        title: "Error",
        description: "Please enter an order ID",
        variant: "destructive"
      });
      return;
    }

    setIsConverting(true);
    try {
      console.log('Starting invoice conversion for order:', orderId.trim());
      
      const { data, error } = await supabase.functions.invoke('convert-to-invoice', {
        body: { 
          orderId: orderId.trim(),
          conversionSource: 'admin_manual'
        }
      });

      console.log('Conversion response:', { data, error });

      if (error) {
        console.error('Conversion function error:', error);
        throw error;
      }

      if (data?.success) {
        toast({
          title: "Invoice Created Successfully",
          description: `Invoice ${data.invoiceId} created for order ${orderId.slice(0, 8)}...`
        });
        
        // Refresh order details after conversion
        if (orderDetails) {
          await handleSearchOrder();
        }
      } else {
        console.error('Conversion failed with data:', data);
        throw new Error(data?.error || 'Failed to convert to invoice');
      }
    } catch (error) {
      console.error('Error converting to invoice:', error);
      toast({
        title: "Conversion Failed",
        description: error.message || "Failed to convert to invoice",
        variant: "destructive"
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleRefreshPaymentStatus = async () => {
    if (!orderId.trim()) {
      toast({
        title: "Error",
        description: "Please enter an order ID",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting payment status refresh for order:', orderId.trim());
      
      const { data, error } = await supabase.functions.invoke('refresh-payment-status', {
        body: { orderId: orderId.trim() }
      });

      console.log('Refresh response:', { data, error });

      if (error) {
        console.error('Refresh function error:', error);
        throw error;
      }

      if (data?.success) {
        toast({
          title: "Payment Status Refreshed",
          description: `Status: ${data.paymentStatus}, Provider: ${data.paymentProvider}`
        });
        
        // Refresh order details after refresh
        if (orderDetails) {
          await handleSearchOrder();
        }
      } else {
        console.error('Refresh failed with data:', data);
        throw new Error(data?.error || 'Failed to refresh status');
      }
    } catch (error) {
      console.error('Error refreshing payment status:', error);
      toast({
        title: "Refresh Failed",
        description: error.message || "Failed to refresh payment status",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncInvoice = async () => {
    if (!orderId.trim()) {
      toast({
        title: "Error",
        description: "Please enter an order ID",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting invoice sync for order:', orderId.trim());
      
      const { data, error } = await supabase.functions.invoke('sync-smartbill-invoice', {
        body: { orderId: orderId.trim() }
      });

      console.log('Invoice sync response:', { data, error });

      if (error) {
        console.error('Invoice sync function error:', error);
        throw error;
      }

      if (data?.success) {
        toast({
          title: "Invoice Synced Successfully",
          description: `Invoice ${data.invoiceId} synced - Payment Status: ${data.paymentStatus}`
        });
        
        // Refresh order details after sync
        if (orderDetails) {
          await handleSearchOrder();
        }
      } else {
        console.error('Invoice sync failed with data:', data);
        throw new Error(data?.error || 'Failed to sync invoice');
      }
    } catch (error) {
      console.error('Error syncing invoice:', error);
      toast({
        title: "Invoice Sync Failed",
        description: error.message || "Failed to sync invoice",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          SmartBill Payment Status Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="orderId">Order ID</Label>
          <div className="flex gap-2">
            <Input
              id="orderId"
              placeholder="Enter order ID (e.g., f05f034e-e6b0-4fde-b390-df5267d667ac)"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleSearchOrder}
              disabled={isSearching}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>

        {orderDetails && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Order Details:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><strong>Status:</strong> {orderDetails.status}</div>
              <div><strong>Payment Status:</strong> {orderDetails.payment_status}</div>
              <div><strong>SmartBill Status:</strong> {orderDetails.smartbill_payment_status || 'N/A'}</div>
              <div><strong>Total Amount:</strong> {orderDetails.total_amount} {orderDetails.currency}</div>
              <div><strong>Proforma ID:</strong> {orderDetails.smartbill_proforma_id || 'N/A'}</div>
              <div><strong>Invoice ID:</strong> {orderDetails.smartbill_invoice_id || 'N/A'}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            onClick={handleSyncPaymentStatus}
            disabled={isSyncing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Status'}
          </Button>

          <Button
            onClick={handleSyncInvoice}
            disabled={isLoading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            {isLoading ? 'Syncing...' : 'Sync Invoice'}
          </Button>

          <Button
            onClick={handleConvertToInvoice}
            disabled={isConverting}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            {isConverting ? 'Converting...' : 'Convert to Invoice'}
          </Button>

          <Button
            onClick={handleRefreshPaymentStatus}
            disabled={isLoading}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {isLoading ? 'Refreshing...' : 'Refresh Status'}
          </Button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Available Actions:</h4>
          <ul className="text-sm space-y-1 text-gray-600">
            <li><Badge variant="outline">Search</Badge> - Find and display order details</li>
            <li><Badge variant="outline">Sync Status</Badge> - Check SmartBill for current payment status and sync with database</li>
            <li><Badge variant="outline">Sync Invoice</Badge> - Find and sync existing invoice from SmartBill</li>
            <li><Badge variant="outline">Convert to Invoice</Badge> - Convert a paid proforma to an invoice in SmartBill</li>
            <li><Badge variant="outline">Refresh Status</Badge> - General payment status refresh for any provider</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartBillPaymentManager;
