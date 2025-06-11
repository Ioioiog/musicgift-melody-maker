
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
import { RefreshCw, FileText, CheckCircle, AlertCircle, Search, ExternalLink, Eye } from "lucide-react";

interface ProformaOrder {
  id: string;
  smartbill_proforma_id: string;
  smartbill_invoice_id?: string;
  payment_status: string;
  smartbill_payment_status?: string;
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

  const handleSyncPaymentStatus = async (orderId: string) => {
    setOrderLoading(orderId, 'syncing');
    try {
      const { data, error } = await supabase.functions.invoke('smartbill-status-sync', {
        body: { orderId }
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        toast({
          title: "Status Synced Successfully",
          description: data.statusChanged ? 
            `Status updated: ${data.currentPaymentStatus}` : 
            "Status checked - no changes needed"
        });
        await fetchProformas();
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

  const handleShowProforma = (proformaId: string) => {
    // Open SmartBill proforma in new tab (if URL structure is known)
    // For now, show the proforma ID
    toast({
      title: "Proforma Information",
      description: `Proforma ID: ${proformaId}`,
    });
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
      description: `Invoice ID: ${invoiceId}`,
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
    const amount = order.total_amount || 0;

    return (
      <>
        <TableCell className="font-mono text-sm">
          {order.smartbill_proforma_id?.slice(0, 12)}...
        </TableCell>
        <TableCell>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{name}</span>
            <span className="text-xs text-gray-500">{email}</span>
          </div>
        </TableCell>
        <TableCell>
          {amount} {order.currency}
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
              variant="outline"
              onClick={() => handleSyncPaymentStatus(order.id)}
              disabled={!!isActionLoading}
              className="h-8 px-2"
            >
              <RefreshCw className={`w-3 h-3 ${isActionLoading === 'syncing' ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleConvertToInvoice(order.id)}
              disabled={!!isActionLoading || !!order.smartbill_invoice_id}
              className="h-8 px-2"
            >
              <FileText className="w-3 h-3" />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleShowProforma(order.smartbill_proforma_id)}
              className="h-8 px-2"
            >
              <Eye className="w-3 h-3" />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleShowInvoice(order.smartbill_invoice_id)}
              disabled={!order.smartbill_invoice_id}
              className="h-8 px-2"
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
    const amount = order.total_amount || 0;

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
            <p>{amount} {order.currency}</p>
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
            onClick={() => handleShowProforma(order.smartbill_proforma_id)}
            className="flex items-center gap-1"
          >
            <Eye className="w-3 h-3" />
            Proforma
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
          <h4 className="font-medium mb-2">Action Buttons Guide:</h4>
          <ul className="text-sm space-y-1 text-gray-600">
            <li><Badge variant="outline" className="mr-2">🔄</Badge> Sync - Check payment status in SmartBill</li>
            <li><Badge variant="outline" className="mr-2">📄</Badge> Convert - Convert proforma to invoice (when paid)</li>
            <li><Badge variant="outline" className="mr-2">👁</Badge> Proforma - View proforma details</li>
            <li><Badge variant="outline" className="mr-2">🔗</Badge> Invoice - View invoice (when available)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartBillPaymentManager;
