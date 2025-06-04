
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Package, CreditCard, User, Mail, Phone, Clock, Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getOrderFormData, getArrayFromJson } from '@/types/order';

interface OrderExpandedDetailsProps {
  order: any;
}

const OrderExpandedDetails: React.FC<OrderExpandedDetailsProps> = ({ order }) => {
  const { t } = useLanguage();

  const formatPrice = (price: number, currency: string) => {
    return `${currency} ${price.toFixed(2)}`;
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  const formData = getOrderFormData(order.form_data);
  const packageIncludes = getArrayFromJson(order.package_includes);
  const selectedAddons = getArrayFromJson(order.selected_addons);

  return (
    <div className="space-y-4">
      {/* Payment & Invoice Details */}
      <div>
        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          Payment & Invoice Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Payment Status:</span>
            <div className="mt-1">
              <Badge variant={getPaymentStatusColor(order.payment_status)}>
                {order.payment_status}
              </Badge>
            </div>
          </div>
          {order.smartbill_payment_status && (
            <div>
              <span className="text-gray-500">Invoice Status:</span>
              <div className="mt-1">
                <Badge variant={getPaymentStatusColor(order.smartbill_payment_status)}>
                  {order.smartbill_payment_status}
                </Badge>
              </div>
            </div>
          )}
          {order.payment_id && (
            <div>
              <span className="text-gray-500">Payment ID:</span>
              <div className="text-gray-900">{order.payment_id}</div>
            </div>
          )}
          {order.gift_credit_applied > 0 && (
            <div>
              <span className="text-gray-500 flex items-center gap-1">
                <Gift className="w-3 h-3" />
                Gift Credit Applied:
              </span>
              <div className="text-green-600 font-medium">
                -{formatPrice(order.gift_credit_applied, order.currency)}
              </div>
            </div>
          )}
          {order.is_gift_redemption && (
            <div>
              <span className="text-gray-500">Gift Redemption:</span>
              <div className="text-purple-600">Yes</div>
            </div>
          )}
          {order.gift_card_id && (
            <div>
              <span className="text-gray-500">Gift Card ID:</span>
              <div className="text-gray-900 font-mono text-xs">{order.gift_card_id}</div>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Package Details */}
      <div>
        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <Package className="w-4 h-4" />
          Package Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {order.package_delivery_time && (
            <div>
              <span className="text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Delivery Time:
              </span>
              <div className="text-gray-900">{order.package_delivery_time}</div>
            </div>
          )}
          {order.package_price && (
            <div>
              <span className="text-gray-500">Package Price:</span>
              <div className="text-gray-900">
                {formatPrice(order.package_price, order.currency)}
              </div>
            </div>
          )}
          {packageIncludes.length > 0 && (
            <div className="md:col-span-2">
              <span className="text-gray-500">Package Includes:</span>
              <ul className="mt-1 list-disc list-inside text-gray-900">
                {packageIncludes.map((item: string, index: number) => (
                  <li key={index} className="text-xs">{item}</li>
                ))}
              </ul>
            </div>
          )}
          {selectedAddons.length > 0 && (
            <div className="md:col-span-2">
              <span className="text-gray-500">Selected Add-ons:</span>
              <ul className="mt-1 list-disc list-inside text-gray-900">
                {selectedAddons.map((addon: string, index: number) => (
                  <li key={index} className="text-xs">{addon}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Customer Information */}
      {Object.keys(formData).length > 0 && (
        <div>
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <User className="w-4 h-4" />
            Customer Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            {formData.fullName && (
              <div>
                <span className="text-gray-500">Full Name:</span>
                <div className="text-gray-900">{formData.fullName}</div>
              </div>
            )}
            {formData.email && (
              <div>
                <span className="text-gray-500 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  Email:
                </span>
                <div className="text-gray-900">{formData.email}</div>
              </div>
            )}
            {formData.phone && (
              <div>
                <span className="text-gray-500 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Phone:
                </span>
                <div className="text-gray-900">{formData.phone}</div>
              </div>
            )}
            {formData.recipientName && (
              <div>
                <span className="text-gray-500">Recipient:</span>
                <div className="text-gray-900">{formData.recipientName}</div>
              </div>
            )}
          </div>
        </div>
      )}

      <Separator />

      {/* Technical Details */}
      <div>
        <h4 className="font-semibold text-sm mb-2">Technical Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Order ID:</span>
            <div className="text-gray-900 font-mono text-xs">
              {order.id.split('-')[0]}...
            </div>
          </div>
          <div>
            <span className="text-gray-500">Currency:</span>
            <div className="text-gray-900">{order.currency}</div>
          </div>
          {order.updated_at && (
            <div>
              <span className="text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Last Updated:
              </span>
              <div className="text-gray-900">
                {new Date(order.updated_at).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderExpandedDetails;
