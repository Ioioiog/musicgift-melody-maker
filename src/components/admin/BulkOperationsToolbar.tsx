
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BulkOperationsToolbarProps {
  selectedOrders: string[];
  allOrders: any[];
  onSelectAll: (checked: boolean) => void;
  onRefreshComplete: () => void;
  providerFilter: string;
  statusFilter: string;
  onProviderFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
}

const BulkOperationsToolbar = ({
  selectedOrders,
  allOrders,
  onSelectAll,
  onRefreshComplete,
  providerFilter,
  statusFilter,
  onProviderFilterChange,
  onStatusFilterChange
}: BulkOperationsToolbarProps) => {
  const [bulkLoading, setBulkLoading] = useState(false);
  const { toast } = useToast();

  const handleBulkRefresh = async () => {
    setBulkLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('bulk-refresh-payment-status', {
        body: { orderIds: selectedOrders }
      });

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to refresh payment statuses',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: `${data?.changedCount || 0} orders updated`,
        });
        onRefreshComplete();
      }
    } catch (error) {
      console.error('Bulk refresh error:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh payment statuses',
        variant: 'destructive',
      });
    } finally {
      setBulkLoading(false);
    }
  };

  const exportSelectedOrders = () => {
    const selectedOrderData = allOrders.filter(order => selectedOrders.includes(order.id));
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Email,Total Price,Status,Payment Provider,Payment Status,Created At\n" +
      selectedOrderData.map(order => 
        `${order.id},${order.email},${order.total_price},${order.status},${order.payment_provider || 'N/A'},${order.payment_status},${order.created_at}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isAllSelected = selectedOrders.length === allOrders.length && allOrders.length > 0;
  const isIndeterminate = selectedOrders.length > 0 && selectedOrders.length < allOrders.length;

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 border rounded-lg">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={isAllSelected}
            indeterminate={isIndeterminate}
            onCheckedChange={onSelectAll}
          />
          <span className="text-sm font-medium">
            {selectedOrders.length} of {allOrders.length} selected
          </span>
        </div>

        <div className="flex gap-2">
          <Select value={providerFilter} onValueChange={onProviderFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Providers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              <SelectItem value="stripe">Stripe</SelectItem>
              <SelectItem value="smartbill">Netopia/SmartBill</SelectItem>
              <SelectItem value="revolut">Revolut</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBulkRefresh}
          disabled={selectedOrders.length === 0 || bulkLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${bulkLoading ? 'animate-spin' : ''}`} />
          {bulkLoading ? 'Refreshing...' : 'Bulk Refresh'}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={exportSelectedOrders}
          disabled={selectedOrders.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};

export default BulkOperationsToolbar;
