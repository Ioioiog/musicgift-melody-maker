
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, FileText, CheckCircle, AlertCircle } from "lucide-react";

const SmartBillPaymentManager = () => {
  const [orderId, setOrderId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

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
      const { data, error } = await supabase.functions.invoke('smartbill-status-sync', {
        body: { orderId: orderId.trim() }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        toast({
          title: "Status Synced Successfully",
          description: data.statusChanged ? 
            `Order status updated to: ${data.currentPaymentStatus}` : 
            "Status checked - no changes needed"
        });
      } else {
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
      const { data, error } = await supabase.functions.invoke('convert-to-invoice', {
        body: { 
          orderId: orderId.trim(),
          conversionSource: 'admin_manual'
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        toast({
          title: "Invoice Created Successfully",
          description: `Invoice ${data.invoiceId} created for order ${orderId.slice(0, 8)}...`
        });
      } else {
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
      const { data, error } = await supabase.functions.invoke('refresh-payment-status', {
        body: { orderId: orderId.trim() }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        toast({
          title: "Payment Status Refreshed",
          description: `Status: ${data.paymentStatus}, Provider: ${data.paymentProvider}`
        });
      } else {
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
          <Input
            id="orderId"
            placeholder="Enter order ID (e.g., f05f034e-e6b0-4fde-b390-df5267d667ac)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            onClick={handleSyncPaymentStatus}
            disabled={isSyncing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Status'}
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
            <li><Badge variant="outline">Sync Status</Badge> - Check SmartBill for current payment status and sync with database</li>
            <li><Badge variant="outline">Convert to Invoice</Badge> - Convert a paid proforma to an invoice in SmartBill</li>
            <li><Badge variant="outline">Refresh Status</Badge> - General payment status refresh for any provider</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartBillPaymentManager;
