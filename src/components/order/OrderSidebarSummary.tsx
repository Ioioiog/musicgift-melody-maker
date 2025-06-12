
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getPackagePrice, getAddonPrice, formatPrice } from '@/utils/pricing';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePackages, useAddons } from '@/hooks/usePackageData';

interface OrderSidebarSummaryProps {
  orderData?: {
    selectedPackage?: string;
    selectedAddons?: string[];
    formData?: any;
    addonFieldValues?: Record<string, any>;
    appliedGiftCard?: any;
    appliedDiscount?: { code: string; amount: number; type: string };
  };
  giftCard?: any;
  onGiftCardChange?: (giftCard: any) => void;
  onDiscountChange?: (discount: any) => void;
}

const OrderSidebarSummary: React.FC<OrderSidebarSummaryProps> = ({
  orderData,
  giftCard,
  onGiftCardChange,
  onDiscountChange
}) => {
  const { currency } = useCurrency();
  const { t } = useLanguage();
  const { data: packages = [] } = usePackages();
  const { data: addons = [] } = useAddons();

  if (!orderData?.selectedPackage) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border border-white/30 sticky top-4">
        <CardHeader>
          <CardTitle className="text-white">{t('orderSummary')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/70 text-sm">{t('selectYourPackage')}</p>
        </CardContent>
      </Card>
    );
  }

  const selectedPackageData = packages.find(pkg => pkg.value === orderData.selectedPackage);
  const isQuoteOnly = selectedPackageData?.is_quote_only || false;
  
  if (!selectedPackageData) {
    return null;
  }

  const packagePrice = getPackagePrice(selectedPackageData, currency);
  const selectedAddonsList = orderData.selectedAddons || [];
  
  const addonsPrice = selectedAddonsList.reduce((total, addonKey) => {
    const addon = addons.find(a => a.addon_key === addonKey);
    return total + (addon ? getAddonPrice(addon, currency) : 0);
  }, 0);

  const subtotal = packagePrice + addonsPrice;
  
  // Calculate gift card discount
  let giftCardDiscount = 0;
  const appliedGiftCard = orderData.appliedGiftCard || giftCard;
  if (appliedGiftCard && !isQuoteOnly) {
    const giftBalance = (appliedGiftCard.gift_amount || 0) / 100; // Convert from cents
    giftCardDiscount = Math.min(giftBalance, subtotal);
  }

  // Calculate discount code discount
  let discountAmount = 0;
  if (orderData.appliedDiscount && !isQuoteOnly) {
    discountAmount = orderData.appliedDiscount.amount;
  }

  const total = Math.max(0, subtotal - giftCardDiscount - discountAmount);

  return (
    <Card className="bg-white/10 backdrop-blur-sm border border-white/30 sticky top-4">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          {t(isQuoteOnly ? 'quoteSummary' : 'orderSummary')}
          {isQuoteOnly && (
            <Badge variant="outline" className="bg-orange-500/20 text-orange-300 border-orange-400/30">
              {t('quoteOnly')}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Package */}
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-medium text-white">
                {t(selectedPackageData.label_key) || selectedPackageData.label_key}
              </h4>
              <p className="text-sm text-white/70">
                {t(selectedPackageData.tagline_key) || selectedPackageData.tagline_key}
              </p>
            </div>
            <div className="text-right">
              <span className="font-semibold text-white">
                {formatPrice(packagePrice, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Add-ons */}
        {selectedAddonsList.length > 0 && (
          <>
            <Separator className="bg-white/20" />
            <div className="space-y-2">
              <h4 className="font-medium text-white">{t('addons')}</h4>
              {selectedAddonsList.map(addonKey => {
                const addon = addons.find(a => a.addon_key === addonKey);
                if (!addon) return null;
                
                const addonPrice = getAddonPrice(addon, currency);
                return (
                  <div key={addonKey} className="flex justify-between items-center text-sm">
                    <span className="text-white/80">
                      {t(addon.label_key) || addon.label_key}
                    </span>
                    <span className="text-white">
                      {formatPrice(addonPrice, currency)}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Totals */}
        <Separator className="bg-white/20" />
        <div className="space-y-2">
          <div className="flex justify-between text-white/80">
            <span>{t('subtotal')}</span>
            <span>{formatPrice(subtotal, currency)}</span>
          </div>
          
          {!isQuoteOnly && appliedGiftCard && giftCardDiscount > 0 && (
            <div className="flex justify-between text-green-400">
              <span>{t('giftCardDiscount')}</span>
              <span>-{formatPrice(giftCardDiscount, currency)}</span>
            </div>
          )}

          {!isQuoteOnly && orderData.appliedDiscount && discountAmount > 0 && (
            <div className="flex justify-between text-blue-400">
              <span>{t('discountCode')} ({orderData.appliedDiscount.code})</span>
              <span>-{formatPrice(discountAmount, currency)}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center text-lg font-bold text-white border-t border-white/20 pt-2">
            <span>{t(isQuoteOnly ? 'estimatedPrice' : 'total')}</span>
            <span>
              {isQuoteOnly ? (
                <div className="text-right">
                  <div>{formatPrice(total, currency)}</div>
                  <div className="text-xs text-orange-300 font-normal">
                    {t('finalPriceOnQuote')}
                  </div>
                </div>
              ) : (
                formatPrice(total, currency)
              )}
            </span>
          </div>

          {!isQuoteOnly && (appliedGiftCard || orderData.appliedDiscount) && total === 0 && (
            <div className="text-center text-green-400 text-sm font-medium">
              {t('fullyCoveredByDiscounts')}
            </div>
          )}
        </div>

        {/* Quote Only Info */}
        {isQuoteOnly && (
          <div className="bg-orange-500/10 border border-orange-400/30 rounded-lg p-3">
            <p className="text-orange-300 text-sm">
              {t('quoteOnlyDescription')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderSidebarSummary;
