import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { TableCell } from "@/components/ui/table";
import { RefreshCw, FileText, CheckCircle, AlertCircle, Search, ExternalLink, Eye, CreditCard } from "lucide-react";

interface ProformaOrder {
  id: string;
  smartbill_proforma_id: string;
  smartbill_invoice_id?: string;
  payment_status: string;
  smartbill_payment_status?: string;
  total_price?: number;
  total_amount?: number;
  currency: string;
  created_at: string;
  form_data?: any;
  user_id?: string;
  status: string;
}

const SmartBillPaymentManager = () => {
  const [proformas, setProformas] = useState<ProformaOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  const fetchProformas = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .not('smartbill_proforma_id', 'is', null)
        .order('created_at', { ascending: false });

      if (searchTerm.trim()) {
        query = query.or(`smartbill_proforma_id.ilike.%${searchTerm}%,smartbill_invoice_id.ilike.%${searchTerm}%,id.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching proformas:', error);
        toast({
          title: "Error",
          description: "Failed to fetch proformas",
          variant: "destructive"
        });
        return;
      }

      setProformas(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch proformas",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProformas();
  }, []);

  const handleSearch = () => {
    fetchProformas();
  };

  const setOrderLoading = (orderId: string, action: string) => {
    setActionLoading(prev => ({ ...prev, [orderId]: action }));
  };

  const clearOrderLoading = (orderId: string) => {
    setActionLoading(prev => {
      const newState = { ...prev };
      delete newState[orderId];
      return newState;
    });
  };

  const normalizePaymentStatus = (status: string): { paymentStatus: string; orderStatus: string } => {
    const normalizedStatus = status?.toLowerCase() || 'unknown';
    
    switch (normalizedStatus) {
      case 'paid':
      case 'completed':
      case 'success':
      case 'successful':
      case 'confirmed':
      case 'approved':
        return { paymentStatus: 'completed', orderStatus: 'confirmed' };
      
      case 'failed':
      case 'error':
      case 'declined':
      case 'rejected':
        return { paymentStatus: 'failed', orderStatus: 'cancelled' };
      
      case 'cancelled':
      case 'canceled':
      case 'voided':
        return { paymentStatus: 'cancelled', orderStatus: 'cancelled' };
      
      case 'pending':
      case 'processing':
      case 'in_progress':
      case 'awaiting':
        return { paymentStatus: 'pending', orderStatus: 'pending' };
      
      case 'refunded':
      case 'reversed':
        return { paymentStatus: 'refunded', orderStatus: 'refunded' };
      
      default:
        return { paymentStatus: 'pending', orderStatus: 'pending' };
    }
  };

  const handleCheckPaymentStatus = async (orderId: string) => {
    setOrderLoading(orderId, 'checking-payment');
    try {
      console.log('Checking payment status for order:', orderId);
      
      const { data, error } = await supabase.functions.invoke('smartbill-status-sync', {
        body: { orderId }
      });

      console.log('Payment check response:', data);

      if (error) {
        console.error('Payment check error:', error);
        throw error;
      }

      if (data?.success) {
        const paymentConfirmed = data.paymentConfirmed;
        const statusChanged = data.statusChanged;
        const documentType = data.documentType;
        
        let message = '';
        let variant: "default" | "destructive" = "default";
        
        if (documentType === 'proforma') {
          message = `⚠️ Proforma detected: ${data.message}`;
          variant = "default";
        } else if (paymentConfirmed) {
          message = `✅ Payment confirmed! Status: ${data.currentPaymentStatus}`;
          variant = "default";
        } else if (data.documentFound) {
          message = `⏳ Payment pending. Status: ${data.currentPaymentStatus}`;
          variant = "default";
        } else {
          message = `⚠️ Document not found in SmartBill (might be too new)`;
          variant = "default";
        }
        
        if (statusChanged) {
          message += ' - Status updated in database';
        }
        
        toast({
          title: "Payment Status Checked",
          description: message,
          variant
        });
        
        await fetchProformas();
      } else {
        const errorMsg = data?.error || 'Failed to check payment status';
        console.error('Payment check failed:', errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      toast({
        title: "Payment Check Failed",
        description: error.message || "Failed to check payment status. Check console for details.",
        variant: "destructive"
      });
    } finally {
      clearOrderLoading(orderId);
    }
  };

  const handleSyncPaymentStatus = async (orderId: string) => {
    setOrderLoading(orderId, 'syncing');
    try {
      console.log('Starting sync for order:', orderId);
      
      const { data, error } = await supabase.functions.invoke('smartbill-status-sync', {
        body: { orderId }
      });

      console.log('Sync response:', data);

      if (error) {
        console.error('Sync error:', error);
        throw error;
      }

      if (data?.success) {
        const statusMessage = data.invoiceCreated 
          ? `Invoice found: ${data.invoiceId}` 
          : data.statusChanged 
            ? `Status updated: ${data.currentPaymentStatus}` 
            : "Status checked - no changes needed";
            
        toast({
          title: "Status Synced Successfully",
          description: statusMessage
        });
        await fetchProformas();
      } else {
        const errorMsg = data?.error || 'Failed to sync status';
        console.error('Sync failed:', errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Error syncing payment status:', error);
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync payment status. Check console for details.",
        variant: "destructive"
      });
    } finally {
      clearOrderLoading(orderId);
    }
  };

  const handleConvertToInvoice = async (orderId: string) => {
    setOrderLoading(orderId, 'converting');
    try {
      const { data, error } = await supabase.functions.invoke('convert-to-invoice', {
        body: { 
          orderId,
          conversionSource: 'admin_manual'
        }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        toast({
          title: "Invoice Created Successfully",
          description: `Invoice ${data.invoiceId} created`
        });
        await fetchProformas();
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
      clearOrderLoading(orderId);
    }
  };

  const handleShowProforma = async (orderId: string, proformaId: string) => {
    try {
      console.log('Fetching proforma PDF for order:', orderId);
      
      // Call the edge function using hardcoded values
      const response = await fetch(`https://ehvzhnzqcbzuirovwjsr.supabase.co/functions/v1/smartbill-view-proforma`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVodnpobnpxY2J6dWlyb3Z3anNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDA1NDAsImV4cCI6MjA2NDE3NjU0MH0.dCDXCQsIY2pmVfGBHnRGqi_dw3yTEfkYrOHKnKDLSqg`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId })
      });

      console.log('PDF response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('PDF fetch error:', response.status, errorText);
        throw new Error(`Failed to fetch PDF: ${response.status} ${errorText}`);
      }

      // Check if the response is actually a PDF
      const contentType = response.headers.get('content-type');
      console.log('Response content type:', contentType);
      
      if (!contentType?.includes('application/pdf')) {
        // If not PDF, try to read as JSON to get error message
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid response format - expected PDF');
      }

      // Convert response to blob
      const pdfBlob = await response.blob();
      console.log('PDF blob size:', pdfBlob.size, 'bytes');
      
      if (pdfBlob.size === 0) {
        throw new Error('Received empty PDF file');
      }
      
      // Create URL and open in new tab
      const url = URL.createObjectURL(pdfBlob);
      const newTab = window.open(url, '_blank');
      
      if (!newTab) {
        // Fallback: trigger download if popup blocked
        const link = document.createElement('a');
        link.href = url;
        link.download = `proforma_${proformaId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "PDF Downloaded",
          description: "PDF was downloaded to your device (popup blocked)"
        });
      } else {
        toast({
          title: "PDF Opened",
          description: "PDF opened in new tab"
        });
      }
      
      // Clean up the URL after a delay
      setTimeout(() => URL.revokeObjectURL(url), 5000);
        
    } catch (error) {
      console.error('Error fetching proforma PDF:', error);
      toast({
        title: "PDF Fetch Failed",
        description: error.message || "Failed to fetch proforma PDF. Check logs for details.",
        variant: "destructive"
      });
    }
  };

  const handleShowInvoice = (invoiceId: string) => {
    if (!invoiceId) {
      toast({
        title: "No Invoice",
        description: "This order doesn't have an invoice yet",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Invoice Information",
      description: `Invoice ID: ${invoiceId}. PDF viewing for invoices will be implemented separately.`,
    });
  };

  const getStatusBadge = (status: string, smartbillStatus?: string) => {
    const getVariant = (status: string) => {
      switch (status?.toLowerCase()) {
        case 'completed':
        case 'paid':
          return 'default';
        case 'pending':
          return 'secondary';
        case 'failed':
        case 'cancelled':
          return 'destructive';
        default:
          return 'outline';
      }
    };

    return (
      <div className="flex flex-col gap-1">
        <Badge variant={getVariant(status)}>
          {status || 'unknown'}
        </Badge>
        {smartbillStatus && smartbillStatus !== status && (
          <Badge variant={getVariant(smartbillStatus)} className="text-xs">
            SB: {smartbillStatus}
          </Badge>
        )}
      </div>
    );
  };

  const getCustomerInfo = (order: ProformaOrder) => {
    const formData = order.form_data || {};
    const email = formData.email || formData.contactEmail || 'N/A';
    const name = formData.firstName && formData.lastName 
      ? `${formData.firstName} ${formData.lastName}`
      : formData.name || 'N/A';
    
    return { email, name };
  };

  const getOrderAmount = (order: ProformaOrder): number => {
    // First try total_price, then total_amount, then from form_data
    if (order.total_price && order.total_price > 0) {
      return order.total_price;
    }
    
    if (order.total_amount && order.total_amount > 0) {
      return order.total_amount;
    }
    
    // Try to get from form_data
    const formData = order.form_data || {};
    if (formData.totalPrice && formData.totalPrice > 0) {
      return formData.totalPrice;
    }
    
    if (formData.total && formData.total > 0) {
      return formData.total;
    }
    
    return 0;
  };

  const getDocumentTypeInfo = (order: ProformaOrder) => {
    const hasInvoice = !!order.smartbill_invoice_id;
    const hasProforma = !!order.smartbill_proforma_id;
    
    if (hasInvoice) {
      return {
        type: 'invoice',
        canCheckPayment: true,
        primaryAction: 'check_payment',
        statusText: 'Invoice (can check payment)',
        statusColor: 'text-green-600'
      };
    } else if (hasProforma) {
      return {
        type: 'proforma',
        canCheckPayment: false,
        primaryAction: 'convert',
        statusText: 'Proforma (payment via Netopia)',
        statusColor: 'text-blue-600'
      };
    } else {
      return {
        type: 'unknown',
        canCheckPayment: false,
        primaryAction: 'none',
        statusText: 'No document',
        statusColor: 'text-gray-400'
      };
    }
  };

  const headers = [
    "Proforma ID",
    "Customer",
    "Amount",
    "Payment Status",
    "Invoice ID",
    "Created",
    "Actions"
  ];

  const renderRow = (order: ProformaOrder, index: number) => {
    const { email, name } = getCustomerInfo(order);
    const isActionLoading = actionLoading[order.id];
    const amount = getOrderAmount(order);
    const docInfo = getDocumentTypeInfo(order);

    return (
      <>
        <TableCell className="font-mono text-sm">
          <div className="flex flex-col">
            <span>{order.smartbill_proforma_id?.slice(0, 12)}...</span>
            <span className={`text-xs ${docInfo.statusColor}`}>
              {docInfo.statusText}
            </span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{name}</span>
            <span className="text-xs text-gray-500">{email}</span>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col">
            <span className={amount === 0 ? "text-red-500 font-medium" : ""}>
              {amount} {order.currency}
            </span>
            {amount === 0 && (
              <span className="text-xs text-red-400">Check data</span>
            )}
          </div>
        </TableCell>
        <TableCell>
          {getStatusBadge(order.payment_status, order.smartbill_payment_status)}
        </TableCell>
        <TableCell className="font-mono text-sm">
          {order.smartbill_invoice_id ? (
            <span className="text-green-600">
              {order.smartbill_invoice_id.slice(0, 12)}...
            </span>
          ) : (
            <span className="text-gray-400">Not created</span>
          )}
        </TableCell>
        <TableCell className="text-sm">
          {new Date(order.created_at).toLocaleDateString()}
        </TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-1">
            <Button
              size="sm"
              variant={docInfo.canCheckPayment ? "default" : "outline"}
              onClick={() => handleCheckPaymentStatus(order.id)}
              disabled={!!isActionLoading}
              className="h-8 px-2"
              title={docInfo.canCheckPayment ? 
                "Check invoice payment status" : 
                "Proforma: payment detected via Netopia webhook"
              }
            >
              <CreditCard className={`w-3 h-3 ${isActionLoading === 'checking-payment' ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleSyncPaymentStatus(order.id)}
              disabled={!!isActionLoading}
              className="h-8 px-2"
              title="Check if proforma has been converted to invoice in SmartBill"
            >
              <RefreshCw className={`w-3 h-3 ${isActionLoading === 'syncing' ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleConvertToInvoice(order.id)}
              disabled={!!isActionLoading || !!order.smartbill_invoice_id}
              className="h-8 px-2"
              title="Convert proforma to invoice"
            >
              <FileText className="w-3 h-3" />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleShowProforma(order.id, order.smartbill_proforma_id)}
              className="h-8 px-2"
              title="View proforma PDF"
            >
              <Eye className="w-3 h-3" />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleShowInvoice(order.smartbill_invoice_id)}
              disabled={!order.smartbill_invoice_id}
              className="h-8 px-2"
              title="View invoice"
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </TableCell>
      </>
    );
  };

  const renderMobileCard = (order: ProformaOrder, index: number) => {
    const { email, name } = getCustomerInfo(order);
    const isActionLoading = actionLoading[order.id];
    const amount = getOrderAmount(order);
    const docInfo = getDocumentTypeInfo(order);

    return (
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
          {getStatusBadge(order.payment_status, order.smartbill_payment_status)}
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium">Proforma:</span>
            <p className="font-mono">{order.smartbill_proforma_id?.slice(0, 12)}...</p>
          </div>
          <div>
            <span className="font-medium">Amount:</span>
            <p className={amount === 0 ? "text-red-500" : ""}>
              {amount} {order.currency}
              {amount === 0 && <span className="text-xs text-red-400 block">Check data</span>}
            </p>
          </div>
          <div>
            <span className="font-medium">Invoice:</span>
            <p className="font-mono">
              {order.smartbill_invoice_id ? 
                <span className="text-green-600">{order.smartbill_invoice_id.slice(0, 12)}...</span> : 
                <span className="text-gray-400">Not created</span>
              }
            </p>
          </div>
          <div>
            <span className="font-medium">Created:</span>
            <p>{new Date(order.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <Button
            size="sm"
            variant={docInfo.canCheckPayment ? "default" : "outline"}
            onClick={() => handleCheckPaymentStatus(order.id)}
            disabled={!!isActionLoading}
            className="flex items-center gap-1"
          >
            <CreditCard className={`w-3 h-3 ${isActionLoading === 'checking-payment' ? 'animate-spin' : ''}`} />
            Check Payment
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSyncPaymentStatus(order.id)}
            disabled={!!isActionLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${isActionLoading === 'syncing' ? 'animate-spin' : ''}`} />
            Sync
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleConvertToInvoice(order.id)}
            disabled={!!isActionLoading || !!order.smartbill_invoice_id}
            className="flex items-center gap-1"
          >
            <FileText className="w-3 h-3" />
            Convert
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleShowProforma(order.id, order.smartbill_proforma_id)}
            className="flex items-center gap-1"
          >
            <Eye className="w-3 h-3" />
            PDF
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleShowInvoice(order.smartbill_invoice_id)}
            disabled={!order.smartbill_invoice_id}
            className="flex items-center gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            Invoice
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          SmartBill Proforma Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="search">Search Proformas</Label>
            <Input
              id="search"
              placeholder="Search by proforma ID, invoice ID, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={handleSearch} disabled={isLoading}>
              <Search className="w-4 h-4" />
              Search
            </Button>
            <Button onClick={fetchProformas} disabled={isLoading} variant="outline">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <ResponsiveTable
            headers={headers}
            data={proformas}
            renderRow={renderRow}
            renderMobileCard={renderMobileCard}
          />
        )}

        {!isLoading && proformas.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No proformas found. {searchTerm && "Try adjusting your search criteria."}
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Payment Detection Guide:</h4>
          <ul className="text-sm space-y-2 text-gray-600">
            <li><Badge variant="outline" className="mr-2">🔵</Badge> <strong>Proformas:</strong> Payment detected automatically via Netopia webhooks when customer pays</li>
            <li><Badge variant="outline" className="mr-2">🟢</Badge> <strong>Invoices:</strong> Payment status can be checked manually using SmartBill API</li>
            <li><Badge variant="outline" className="mr-2">📄</Badge> <strong>Convert:</strong> Convert paid proforma to invoice for formal documentation</li>
            <li><Badge variant="outline" className="mr-2">👁</Badge> <strong>PDF:</strong> View proforma/invoice documents</li>
          </ul>
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
            <strong>Netopia Integration:</strong> When customers pay SmartBill proformas via Netopia, 
            payments are automatically detected and order status is updated in real-time via webhook notifications.
            No manual checking needed for proforma payments.
          </div>
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
            <strong>Note:</strong> SmartBill API only supports payment status checking for invoices, not proformas. 
            Proforma payments are detected via Netopia webhook integration.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartBillPaymentManager;
