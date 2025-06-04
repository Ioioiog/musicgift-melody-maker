import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download, ChevronDown, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { getCustomerName, getCustomerEmail, getArrayFromJson } from '@/types/order';
import OrderExpandedDetails from './OrderExpandedDetails';

interface EnhancedOrderTableProps {
  orders: any[];
  onViewDetails: (order: any) => void;
}

const EnhancedOrderTable: React.FC<EnhancedOrderTableProps> = ({ orders, onViewDetails }) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const toggleRowExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedRows(newExpanded);
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedOrders = React.useMemo(() => {
    if (!sortConfig) return orders;
    
    return [...orders].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [orders, sortConfig]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'processing': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return `${currency} ${price.toFixed(2)}`;
  };

  const getAddonsCount = (addons: any) => {
    const addonsArray = getArrayFromJson(addons);
    return addonsArray.length;
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        {sortedOrders.map((order) => (
          <Card key={order.id} className="shadow-sm">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{order.package_name || 'Order'}</h3>
                    <p className="text-sm text-gray-600">
                      {getCustomerName(order.form_data)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getStatusColor(order.status)} className="text-xs">
                      {order.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Amount:</span>
                    <span className="ml-1 font-medium">
                      {order.total_price ? formatPrice(order.total_price, order.currency) : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Date:</span>
                    <span className="ml-1">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  {order.smartbill_invoice_id && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Invoice:</span>
                      <span className="ml-1">{order.smartbill_invoice_id}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRowExpansion(order.id)}
                  >
                    {expandedRows.has(order.id) ? (
                      <>
                        <ChevronDown className="w-4 h-4 mr-1" />
                        Less
                      </>
                    ) : (
                      <>
                        <ChevronRight className="w-4 h-4 mr-1" />
                        More
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(order)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                </div>

                {expandedRows.has(order.id) && (
                  <OrderExpandedDetails order={order} />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('package_name')}
              >
                Package
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('created_at')}
              >
                Order Date
              </TableHead>
              <TableHead>Customer</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('total_price')}
              >
                Amount
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Add-ons</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOrders.map((order) => [
              <TableRow key={order.id} className="hover:bg-gray-50">
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRowExpansion(order.id)}
                    className="p-1"
                  >
                    {expandedRows.has(order.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.package_name || 'Order'}</div>
                    <div className="text-sm text-gray-500">{order.package_value}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div>{order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}</div>
                    <div className="text-sm text-gray-500">
                      {order.created_at ? new Date(order.created_at).toLocaleTimeString() : ''}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{getCustomerName(order.form_data)}</div>
                    <div className="text-sm text-gray-500">{getCustomerEmail(order.form_data)}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {order.total_price ? formatPrice(order.total_price, order.currency) : 'N/A'}
                    </div>
                    {order.gift_credit_applied > 0 && (
                      <div className="text-sm text-green-600">
                        Gift: -{formatPrice(order.gift_credit_applied, order.currency)}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getPaymentStatusColor(order.payment_status)}>
                    {order.payment_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {order.smartbill_invoice_id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{order.smartbill_invoice_id}</span>
                      {order.smartbill_payment_url && (
                        <Button variant="ghost" size="sm" className="p-1">
                          <Download className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {getAddonsCount(order.selected_addons)} add-ons
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(order)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    {t('viewDetails')}
                  </Button>
                </TableCell>
              </TableRow>,
              ...(expandedRows.has(order.id) ? [
                <TableRow key={`${order.id}-expanded`}>
                  <TableCell colSpan={10} className="p-0">
                    <div className="p-4 bg-gray-50 border-t">
                      <OrderExpandedDetails order={order} />
                    </div>
                  </TableCell>
                </TableRow>
              ] : [])
            ]).flat()}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EnhancedOrderTable;
