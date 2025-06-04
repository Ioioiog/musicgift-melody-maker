
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Calendar, Package, CreditCard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface OrderHistoryCardProps {
  order: any;
  onViewDetails: (order: any) => void;
}

const OrderHistoryCard: React.FC<OrderHistoryCardProps> = ({ order, onViewDetails }) => {
  const { t } = useLanguage();

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
    return `${currency} ${(price / 100).toFixed(2)}`;
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {order.package_name || 'Order'}
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant={getStatusColor(order.status)}>
              {order.status}
            </Badge>
            <Badge variant={getPaymentStatusColor(order.payment_status)}>
              {order.payment_status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">{t('orderDate')}</p>
              <p className="text-sm text-gray-600">
                {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">{t('package')}</p>
              <p className="text-sm text-gray-600">
                {order.package_value || 'N/A'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-medium">{t('total')}</p>
              <p className="text-sm text-gray-600">
                {order.total_price ? formatPrice(order.total_price, order.currency) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(order)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {t('viewDetails')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderHistoryCard;
