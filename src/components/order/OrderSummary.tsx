
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, CheckCircle, Gift } from 'lucide-react';
import { usePackages, useAddons } from '@/hooks/usePackageData';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getPackagePrice } from '@/utils/pricing';

interface OrderSummaryProps {
  selectedPackage: string;
  selectedAddons: string[];
  giftCard?: any;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ selectedPackage, selectedAddons, giftCard }) => {
  const { t } = useLanguage();
  const { currency } = useCurrency();
  const { data: packages = [] } = usePackages();
  const { data: addons = [] } = useAddons();

  const selectedPackageData = packages.find(pkg => pkg.value === selectedPackage);
  const selectedAddonsData = selectedAddons.map(addonKey => 
    addons.find(addon => addon.addon_key === addonKey)
  ).filter(Boolean);

  const packagePrice = selectedPackageData ? getPackagePrice(selectedPackageData, currency) : 0;
  const addonsPrice = selectedAddonsData.reduce((total, addon) => total + (addon?.price || 0), 0);
  const subtotal = packagePrice + addonsPrice;
  
  // Calculate gift card discount
  const giftBalance = giftCard ? (giftCard.gift_amount || 0) / 100 : 0; // Convert from cents
  const giftDiscount = Math.min(giftBalance, subtotal);
  const finalTotal = Math.max(0, subtotal - giftDiscount);

  if (!selectedPackageData) return null;

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          {t('orderSummary')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Package Details */}
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">
                {t(selectedPackageData.label_key)}
              </h4>
              {selectedPackageData.delivery_time_key && (
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  {t(selectedPackageData.delivery_time_key)}
                </div>
              )}
            </div>
            <span className="font-medium text-gray-900">
              {packagePrice} {currency}
            </span>
          </div>
        </div>

        {/* Selected Addons */}
        {selectedAddonsData.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">
                {t('addons')}
              </h4>
              {selectedAddonsData.map((addon) => (
                <div key={addon?.addon_key} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">{t(addon?.label_key || '')}</span>
                  <span className="font-medium">+{addon?.price} {currency}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <Separator />

        {/* Pricing Summary */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{t('subtotal')}</span>
            <span className="font-medium">{subtotal} {currency}</span>
          </div>
          
          {/* Gift Card Discount */}
          {giftCard && giftDiscount > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <div className="flex items-center gap-1">
                <Gift className="w-4 h-4" />
                <span>{t('giftCardDiscount')}</span>
              </div>
              <span className="font-medium">-{giftDiscount.toFixed(2)} {currency}</span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex justify-between items-center text-lg font-bold">
            <span className="text-gray-900">{t('total')}</span>
            <div className="text-right">
              <span className="text-purple-600">{finalTotal.toFixed(2)} {currency}</span>
              {finalTotal === 0 && (
                <div className="text-xs text-green-600 font-normal">
                  {t('fullyCoveredByGiftCard')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gift Card Info */}
        {giftCard && (
          <>
            <Separator />
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800">{t('giftCardApplied')}</span>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <div>{t('giftCardFrom')} {giftCard.sender_name}</div>
                <div>{t('giftCardBalance')} {giftBalance.toFixed(2)} {currency}</div>
                {giftBalance > subtotal && (
                  <div className="text-xs">
                    {t('giftCardRemaining')} {(giftBalance - subtotal).toFixed(2)} {currency}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Quality Badge */}
        <div className="pt-2">
          <Badge variant="secondary" className="w-full justify-center py-2 bg-purple-50 text-purple-700 border-purple-200">
            {t('professionalQuality')}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
