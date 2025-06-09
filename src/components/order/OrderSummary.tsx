
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Gift, Package, Plus } from 'lucide-react';
import { usePackages, useAddons } from '@/hooks/usePackageData';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getPackagePrice, getAddonPrice } from '@/utils/pricing';

interface OrderSummaryProps {
  selectedPackage: string;
  selectedAddons: string[];
  giftCard?: any;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ selectedPackage, selectedAddons, giftCard }) => {
  const { data: packages = [] } = usePackages();
  const { data: addons = [] } = useAddons();
  const { t } = useLanguage();
  const { currency } = useCurrency();

  const selectedPackageData = packages.find(pkg => pkg.value === selectedPackage);
  const selectedAddonsData = selectedAddons.map(addonKey => 
    addons.find(addon => addon.addon_key === addonKey)
  ).filter(Boolean);

  if (!selectedPackageData) return null;

  const packagePrice = getPackagePrice(selectedPackageData, currency);
  const addonsPrice = selectedAddonsData.reduce((total, addon) => 
    total + (addon ? getAddonPrice(addon, currency) : 0), 0);
  const subtotal = packagePrice + addonsPrice;
  
  let giftCreditApplied = 0;
  if (giftCard) {
    const giftBalance = (giftCard.gift_amount || 0) / 100; // Convert from cents
    giftCreditApplied = Math.min(giftBalance, subtotal);
  }
  
  const finalTotal = Math.max(0, subtotal - giftCreditApplied);

  return (
    <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-300 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Package className="w-5 h-5" />
          {t('orderSummary')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Package Section */}
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-white">{t(selectedPackageData.label_key)}</h3>
              <p className="text-sm text-white/70">{t(selectedPackageData.description_key)}</p>
            </div>
            <span className="font-medium text-white">{currency} {packagePrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Add-ons Section */}
        {selectedAddonsData.length > 0 && (
          <>
            <Separator className="bg-white/20" />
            <div>
              <h4 className="font-medium mb-2 text-white flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {t('addOns')}
              </h4>
              <div className="space-y-2">
                {selectedAddonsData.map((addon) => (
                  addon && (
                    <div key={addon.addon_key} className="flex justify-between items-center text-sm">
                      <span className="text-white/80">{t(addon.label_key)}</span>
                      <span className="text-white">{currency} {getAddonPrice(addon, currency).toFixed(2)}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          </>
        )}

        <Separator className="bg-white/20" />

        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <span className="font-medium text-white">{t('subtotal')}</span>
          <span className="font-medium text-white">{currency} {subtotal.toFixed(2)}</span>
        </div>

        {/* Gift Card Credit */}
        {giftCard && giftCreditApplied > 0 && (
          <div className="flex justify-between items-center text-green-400">
            <span className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              {t('giftCardCredit')}
            </span>
            <span>-{currency} {giftCreditApplied.toFixed(2)}</span>
          </div>
        )}

        <Separator className="bg-white/20" />

        {/* Total */}
        <div className="flex justify-between items-center text-lg font-bold">
          <span className="text-white">{t('total')}</span>
          <span className="text-white">{currency} {finalTotal.toFixed(2)}</span>
        </div>

        {finalTotal === 0 && (
          <Badge variant="secondary" className="w-full justify-center bg-green-500/20 text-green-300 border-green-400/30">
            {t('fullyPaidWithGiftCard', 'Fully paid with gift card')}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
