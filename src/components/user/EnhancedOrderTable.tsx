
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, ChevronDown, ChevronRight, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { getCustomerName, getCustomerEmail, getArrayFromJson } from '@/types/order';
import { formatCurrency } from '@/utils/currencyUtils';
import { useDeliveryCalculation } from '@/hooks/useDeliveryCalculation';
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

  const getAddonsCount = (addons: any) => {
    const addonsArray = getArrayFromJson(addons);
    return addonsArray.length;
  };

  const handleDownloadSong = (order: any) => {
    // TODO: Implement song download functionality
    console.log('Download song for order:', order.id);
    // For now, we'll just open the order details
    onViewDetails(order);
  };

  const DeliveryCountdown = ({ order }: { order: any }) => {
    const { remainingDays, isOverdue, status } = useDeliveryCalculation(order.created_at, order.package_value);

    if (remainingDays === null) {
      return <span className="text-gray-400">-</span>;
    }

    let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "secondary";
    let textColor = "text-gray-600";
    let icon = <Clock className="w-3 h-3" />;

    if (isOverdue) {
      badgeVariant = "destructive";
      textColor = "text-red-600";
    } else if (status === 'urgent') {
      badgeVariant = "destructive";
      textColor = "text-red-600";
    } else if (status === 'warning') {
      badgeVariant = "outline";
      textColor = "text-orange-600";
    } else {
      badgeVariant = "secondary";
      textColor = "text-blue-600";
    }

    return (
      <div className="flex items-center gap-1">
        {icon}
        <span className={`text-sm font-medium ${textColor}`}>
          {isOverdue 
            ? `${remainingDays} ${t('daysOverdue')}`
            : `${remainingDays} ${t('daysLeft')}`
          }
        </span>
      </div>
    );
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
                    <h3 className="font-semibold">{order.package_name || t('order')}</h3>
                    <p className="text-sm text-gray-600">
                      {getCustomerName(order.form_data)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getStatusColor(order.status)} className="text-xs">
                      {t(order.status)}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">{t('amount')}:</span>
                    <span className="ml-1 font-medium">
                      {order.total_price ? formatCurrency(order.total_price, order.currency, order.payment_provider) : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">{t('date')}:</span>
                    <span className="ml-1">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">{t('delivery')}:</span>
                    <span className="ml-1">
                      <DeliveryCountdown order={order} />
                    </span>
                  </div>
                  {order.smartbill_invoice_id && (
                    <div className="col-span-2">
                      <span className="text-gray-500">{t('invoice')}:</span>
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
                        {t('less')}
                      </>
                    ) : (
                      <>
                        <ChevronRight className="w-4 h-4 mr-1" />
                        {t('more')}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadSong(order)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    {t('downloadSong')}
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
                {t('package')}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('created_at')}
              >
                {t('orderDate')}
              </TableHead>
              <TableHead>{t('customer')}</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('total_price')}
              >
                {t('amount')}
              </TableHead>
              <TableHead>{t('status')}</TableHead>
              <TableHead>{t('payment')}</TableHead>
              <TableHead>{t('invoice')}</TableHead>
              <TableHead>{t('addons')}</TableHead>
              <TableHead>{t('delivery')}</TableHead>
              <TableHead className="text-right">{t('actions')}</TableHead>
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
                    <div className="font-medium">{order.package_name || t('order')}</div>
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
                      {order.total_price ? formatCurrency(order.total_price, order.currency, order.payment_provider) : 'N/A'}
                    </div>
                    {order.gift_credit_applied > 0 && (
                      <div className="text-sm text-green-600">
                        {t('gift')}: -{formatCurrency(order.gift_credit_applied, order.currency, order.payment_provider)}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(order.status)}>
                    {t(order.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getPaymentStatusColor(order.payment_status)}>
                    {t(order.payment_status)}
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
                    {getAddonsCount(order.selected_addons)} {t('addonsCount')}
                  </span>
                </TableCell>
                <TableCell>
                  <DeliveryCountdown order={order} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadSong(order)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    {t('downloadSong')}
                  </Button>
                </TableCell>
              </TableRow>,
              ...(expandedRows.has(order.id) ? [
                <TableRow key={`${order.id}-expanded`}>
                  <TableCell colSpan={11} className="p-0">
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
