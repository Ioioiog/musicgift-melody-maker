
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

  // Enhanced helper function with extensive debugging and error handling
  const getDisplayValue = (item: any, context: string = 'unknown'): string => {
    console.log(`[OrderExpandedDetails] Processing item in ${context}:`, item);
    console.log(`[OrderExpandedDetails] Item type:`, typeof item);
    
    try {
      if (item === null || item === undefined) {
        console.warn(`[OrderExpandedDetails] Null/undefined item in ${context}`);
        return 'N/A';
      }
      
      if (typeof item === 'string') {
        console.log(`[OrderExpandedDetails] String item: "${item}"`);
        return item;
      }
      
      if (typeof item === 'number') {
        console.log(`[OrderExpandedDetails] Number item: ${item}`);
        return String(item);
      }
      
      if (typeof item === 'boolean') {
        console.log(`[OrderExpandedDetails] Boolean item: ${item}`);
        return String(item);
      }
      
      if (typeof item === 'object' && item !== null) {
        console.log(`[OrderExpandedDetails] Object item keys:`, Object.keys(item));
        
        // Handle objects with include_key or similar structure
        if (item.include_key && typeof item.include_key === 'string') {
          console.log(`[OrderExpandedDetails] Found include_key: "${item.include_key}"`);
          return item.include_key;
        }
        
        // Handle other possible object structures
        if (item.label && typeof item.label === 'string') {
          console.log(`[OrderExpandedDetails] Found label: "${item.label}"`);
          return item.label;
        }
        
        if (item.name && typeof item.name === 'string') {
          console.log(`[OrderExpandedDetails] Found name: "${item.name}"`);
          return item.name;
        }
        
        if (item.value && typeof item.value === 'string') {
          console.log(`[OrderExpandedDetails] Found value: "${item.value}"`);
          return item.value;
        }
        
        if (item.title && typeof item.title === 'string') {
          console.log(`[OrderExpandedDetails] Found title: "${item.title}"`);
          return item.title;
        }
        
        // Try to extract any string value from the object
        const stringValues = Object.values(item).filter(val => typeof val === 'string');
        if (stringValues.length > 0) {
          console.log(`[OrderExpandedDetails] Using first string value: "${stringValues[0]}"`);
          return String(stringValues[0]);
        }
        
        // If it's an object but we can't extract a meaningful value, stringify it safely
        console.warn(`[OrderExpandedDetails] Stringifying complex object in ${context}:`, item);
        try {
          return JSON.stringify(item);
        } catch (jsonError) {
          console.error(`[OrderExpandedDetails] JSON.stringify failed:`, jsonError);
          return '[Complex Object]';
        }
      }
      
      // Fallback for any other data type
      console.log(`[OrderExpandedDetails] Fallback conversion for type ${typeof item}:`, item);
      return String(item);
    } catch (error) {
      console.error(`[OrderExpandedDetails] Error in getDisplayValue for ${context}:`, error, 'Item was:', item);
      return `[Error: ${context}]`;
    }
  };

  // Safe array processing with extensive validation
  const processArraySafely = (data: any, context: string): any[] => {
    console.log(`[OrderExpandedDetails] Processing array for ${context}:`, data);
    
    try {
      const arrayData = getArrayFromJson(data);
      console.log(`[OrderExpandedDetails] Array data for ${context}:`, arrayData);
      console.log(`[OrderExpandedDetails] Array length for ${context}:`, arrayData?.length);
      
      if (!Array.isArray(arrayData)) {
        console.warn(`[OrderExpandedDetails] ${context} is not an array:`, arrayData);
        return [];
      }
      
      return arrayData;
    } catch (error) {
      console.error(`[OrderExpandedDetails] Error processing array for ${context}:`, error);
      return [];
    }
  };

  const formData = getOrderFormData(order.form_data);
  const packageIncludes = processArraySafely(order.package_includes, 'packageIncludes');
  const selectedAddons = processArraySafely(order.selected_addons, 'selectedAddons');

  console.log(`[OrderExpandedDetails] Final packageIncludes:`, packageIncludes);
  console.log(`[OrderExpandedDetails] Final selectedAddons:`, selectedAddons);

  // Safe list renderer component
  const SafeListRenderer = ({ items, context }: { items: any[], context: string }) => {
    console.log(`[OrderExpandedDetails] Rendering list for ${context} with ${items.length} items`);
    
    if (!Array.isArray(items) || items.length === 0) {
      return <li className="text-xs text-gray-500">None</li>;
    }

    return (
      <>
        {items.map((item: any, index: number) => {
          console.log(`[OrderExpandedDetails] Rendering item ${index} for ${context}:`, item);
          
          try {
            const displayValue = getDisplayValue(item, `${context}[${index}]`);
            console.log(`[OrderExpandedDetails] Display value for ${context}[${index}]:`, displayValue);
            
            return (
              <li key={`${context}-${index}-${Date.now()}`} className="text-xs">
                {displayValue}
              </li>
            );
          } catch (renderError) {
            console.error(`[OrderExpandedDetails] Error rendering item ${index} in ${context}:`, renderError);
            return (
              <li key={`${context}-error-${index}`} className="text-xs text-red-500">
                [Render Error]
              </li>
            );
          }
        })}
      </>
    );
  };

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
                <SafeListRenderer items={packageIncludes} context="packageIncludes" />
              </ul>
            </div>
          )}
          {selectedAddons.length > 0 && (
            <div className="md:col-span-2">
              <span className="text-gray-500">Selected Add-ons:</span>
              <ul className="mt-1 list-disc list-inside text-gray-900">
                <SafeListRenderer items={selectedAddons} context="selectedAddons" />
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
