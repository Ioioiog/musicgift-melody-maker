
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, Package, CreditCard, User, Mail, Phone, Download, FileText, Settings, Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface OrderDetailsModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, isOpen, onClose }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  if (!order) return null;

  const formatPrice = (price: number, currency: string) => {
    return `${currency} ${price.toFixed(2)}`;
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
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="invoice" className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              Invoice
            </TabsTrigger>
            <TabsTrigger value="customer" className="flex items-center gap-1">
              <User className="w-3 h-3" />
              Customer
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-1">
              <CreditCard className="w-3 h-3" />
              Payment
            </TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center gap-1">
              <Settings className="w-3 h-3" />
              Technical
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
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
          </TabsContent>

          <TabsContent value="invoice" className="space-y-6 mt-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Invoice Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {order.smartbill_invoice_id && (
                  <div>
                    <p className="text-sm font-medium">Invoice Number</p>
                    <p className="text-sm text-gray-600">{order.smartbill_invoice_id}</p>
                  </div>
                )}
                
                {order.smartbill_payment_status && (
                  <div>
                    <p className="text-sm font-medium">Invoice Status</p>
                    <Badge variant={getPaymentStatusColor(order.smartbill_payment_status)}>
                      {order.smartbill_payment_status}
                    </Badge>
                  </div>
                )}

                {order.smartbill_payment_url && (
                  <div className="md:col-span-2">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download Invoice
                    </Button>
                  </div>
                )}
              </div>

              {order.smartbill_invoice_data && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Invoice Details</h4>
                    <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">
                      {JSON.stringify(order.smartbill_invoice_data, null, 2)}
                    </pre>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="customer" className="space-y-6 mt-6">
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

                  {/* Additional form fields */}
                  {Object.entries(order.form_data).map(([key, value]) => {
                    if (!['fullName', 'email', 'phone', 'recipientName'].includes(key) && value) {
                      return (
                        <div key={key}>
                          <p className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                          <p className="text-sm text-gray-600">{String(value)}</p>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="payment" className="space-y-6 mt-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Payment Status</p>
                  <Badge variant={getPaymentStatusColor(order.payment_status)}>
                    {order.payment_status}
                  </Badge>
                </div>

                {order.payment_id && (
                  <div>
                    <p className="text-sm font-medium">Payment ID</p>
                    <p className="text-sm text-gray-600 font-mono">{order.payment_id}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium">Total Amount</p>
                  <p className="text-sm text-gray-600">
                    {order.total_price ? formatPrice(order.total_price, order.currency) : 'N/A'}
                  </p>
                </div>

                {order.package_price && (
                  <div>
                    <p className="text-sm font-medium">Package Price</p>
                    <p className="text-sm text-gray-600">
                      {formatPrice(order.package_price, order.currency)}
                    </p>
                  </div>
                )}

                {order.gift_credit_applied > 0 && (
                  <div className="flex items-center gap-2">
                    <Gift className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Gift Credit Applied</p>
                      <p className="text-sm text-green-600">
                        -{formatPrice(order.gift_credit_applied, order.currency)}
                      </p>
                    </div>
                  </div>
                )}

                {order.is_gift_redemption && (
                  <div>
                    <p className="text-sm font-medium">Gift Redemption</p>
                    <Badge variant="outline" className="text-purple-600">Yes</Badge>
                  </div>
                )}

                {order.gift_card_id && (
                  <div>
                    <p className="text-sm font-medium">Gift Card ID</p>
                    <p className="text-sm text-gray-600 font-mono">{order.gift_card_id}</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="technical" className="space-y-6 mt-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Technical Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Order ID</p>
                  <p className="text-sm text-gray-600 font-mono">{order.id}</p>
                </div>

                <div>
                  <p className="text-sm font-medium">Currency</p>
                  <p className="text-sm text-gray-600">{order.currency}</p>
                </div>

                <div>
                  <p className="text-sm font-medium">Created At</p>
                  <p className="text-sm text-gray-600">
                    {order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}
                  </p>
                </div>

                {order.updated_at && (
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.updated_at).toLocaleString()}
                    </p>
                  </div>
                )}

                {order.user_id && (
                  <div>
                    <p className="text-sm font-medium">User ID</p>
                    <p className="text-sm text-gray-600 font-mono">{order.user_id}</p>
                  </div>
                )}

                {order.package_id && (
                  <div>
                    <p className="text-sm font-medium">Package ID</p>
                    <p className="text-sm text-gray-600 font-mono">{order.package_id}</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
