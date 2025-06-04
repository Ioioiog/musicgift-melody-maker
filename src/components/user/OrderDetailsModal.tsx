
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Package, CreditCard, User, Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface OrderDetailsModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, isOpen, onClose }) => {
  const { t } = useLanguage();

  if (!order) return null;

  const formatPrice = (price: number, currency: string) => {
    return `${currency} ${(price / 100).toFixed(2)}`;
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details</span>
            <div className="flex gap-2">
              <Badge variant={getStatusColor(order.status)}>
                {order.status}
              </Badge>
              <Badge variant={getPaymentStatusColor(order.payment_status)}>
                {order.payment_status}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">{t('orderInfo')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {order.package_name || order.package_value || 'N/A'}
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

              {order.package_delivery_time && (
                <div>
                  <p className="text-sm font-medium">{t('deliveryTime')}</p>
                  <p className="text-sm text-gray-600">{order.package_delivery_time}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Customer Info */}
          {order.form_data && (
            <div>
              <h3 className="text-lg font-semibold mb-3">{t('customerInfo')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {order.form_data.fullName && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{t('fullName')}</p>
                      <p className="text-sm text-gray-600">{order.form_data.fullName}</p>
                    </div>
                  </div>
                )}

                {order.form_data.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{t('email')}</p>
                      <p className="text-sm text-gray-600">{order.form_data.email}</p>
                    </div>
                  </div>
                )}

                {order.form_data.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{t('phone')}</p>
                      <p className="text-sm text-gray-600">{order.form_data.phone}</p>
                    </div>
                  </div>
                )}

                {order.form_data.recipientName && (
                  <div>
                    <p className="text-sm font-medium">{t('recipientName')}</p>
                    <p className="text-sm text-gray-600">{order.form_data.recipientName}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Package Includes */}
          {order.package_includes && order.package_includes.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">{t('packageIncludes')}</h3>
                <ul className="list-disc list-inside space-y-1">
                  {order.package_includes.map((item: string, index: number) => (
                    <li key={index} className="text-sm text-gray-600">{item}</li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Selected Addons */}
          {order.selected_addons && order.selected_addons.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">{t('selectedAddons')}</h3>
                <ul className="list-disc list-inside space-y-1">
                  {order.selected_addons.map((addon: string, index: number) => (
                    <li key={index} className="text-sm text-gray-600">{addon}</li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
