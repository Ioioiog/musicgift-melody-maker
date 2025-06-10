import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Gift, Package, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { usePackages, useAddons } from '@/hooks/usePackageData';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getPackagePrice, getAddonPrice } from '@/utils/pricing';
import { useIsMobile } from '@/hooks/use-mobile';
interface OrderSidebarSummaryProps {
  orderData?: {
    selectedPackage?: string;
    selectedAddons?: string[];
  };
  giftCard?: any;
}
const OrderSidebarSummary: React.FC<OrderSidebarSummaryProps> = ({
  orderData,
  giftCard
}) => {
  const {
    data: packages = []
  } = usePackages();
  const {
    data: addons = []
  } = useAddons();
  const {
    t
  } = useLanguage();
  const {
    currency
  } = useCurrency();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  if (!orderData?.selectedPackage) {
    return <div className={isMobile ? "mb-4" : "lg:sticky lg:top-4"}>
        <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-300 shadow-xl">
          <CardHeader className="pb-3 px-3 sm:px-6 py-3 sm:py-4">
            <CardTitle className="flex items-center gap-2 text-white text-base sm:text-lg">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              {t('orderSummary', 'Rezumatul comenzii')}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="text-center py-6 sm:py-8">
              <Package className="w-10 h-10 sm:w-12 sm:h-12 text-white/40 mx-auto mb-3" />
              <p className="text-white/70 text-xs sm:text-sm">
                {t('selectPackageToSeePrice', 'Alege un pachet pentru a vedea prețul')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>;
  }
  const selectedPackageData = packages.find(pkg => pkg.value === orderData.selectedPackage);
  const selectedAddonsData = (orderData.selectedAddons || []).map(addonKey => addons.find(addon => addon.addon_key === addonKey)).filter(Boolean);
  if (!selectedPackageData) return null;
  const packagePrice = getPackagePrice(selectedPackageData, currency);
  const addonsPrice = selectedAddonsData.reduce((total, addon) => total + (addon ? getAddonPrice(addon, currency) : 0), 0);
  const subtotal = packagePrice + addonsPrice;
  let giftCreditApplied = 0;
  if (giftCard) {
    const giftBalance = (giftCard.gift_amount || 0) / 100; // Convert from cents
    giftCreditApplied = Math.min(giftBalance, subtotal);
  }
  const finalTotal = Math.max(0, subtotal - giftCreditApplied);
  return <div className={isMobile ? "mb-4" : "lg:sticky lg:top-4"}>
      <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-300 shadow-xl">
        <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 py-2 sm:py-[15px] my-[1px]">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white text-base sm:text-lg">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              {t('orderSummary', 'Rezumatul comenzii')}
            </CardTitle>
            {isMobile && <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="text-white hover:bg-white/10 p-1 h-8 w-8">
                {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </Button>}
          </div>
        </CardHeader>
        
        {!isCollapsed && <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6 pb-3 sm:pb-6">
            {/* Package Section */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white text-xs sm:text-sm truncate">
                    {t(selectedPackageData.label_key)}
                  </h3>
                  <p className="text-xs text-white/70 mt-1 line-clamp-2">
                    {t(selectedPackageData.description_key)}
                  </p>
                </div>
                <span className="font-medium text-white text-xs sm:text-sm shrink-0">
                  {currency} {packagePrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Add-ons Section */}
            {selectedAddonsData.length > 0 && <>
                <Separator className="bg-white/20" />
                <div>
                  <h4 className="font-medium mb-2 text-white flex items-center gap-2 text-xs sm:text-sm">
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    {t('addOns', 'Suplimente')}
                  </h4>
                  <div className="space-y-1 sm:space-y-2">
                    {selectedAddonsData.map(addon => addon && <div key={addon.addon_key} className="flex justify-between items-center text-xs gap-2">
                          <span className="text-white/80 truncate flex-1">
                            {t(addon.label_key)}
                          </span>
                          <span className="text-white shrink-0">
                            {currency} {getAddonPrice(addon, currency).toFixed(2)}
                          </span>
                        </div>)}
                  </div>
                </div>
              </>}

            <Separator className="bg-white/20" />

            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className="font-medium text-white text-xs sm:text-sm">
                {t('subtotal', 'Subtotal')}
              </span>
              <span className="font-medium text-white text-xs sm:text-sm">
                {currency} {subtotal.toFixed(2)}
              </span>
            </div>

            {/* Gift Card Credit */}
            {giftCard && giftCreditApplied > 0 && <div className="flex justify-between items-center text-green-400 text-xs sm:text-sm gap-2">
                <span className="flex items-center gap-1 sm:gap-2 truncate">
                  <Gift className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                  <span className="truncate">{t('giftCardCredit', 'Credit card cadou')}</span>
                </span>
                <span className="shrink-0">-{currency} {giftCreditApplied.toFixed(2)}</span>
              </div>}

            <Separator className="bg-white/20" />

            {/* Total */}
            <div className="flex justify-between items-center text-base sm:text-lg font-bold bg-gradient-to-r from-orange-500/20 to-yellow-500/20 p-2 sm:p-3 rounded-lg border border-orange-400/30">
              <span className="text-white">{t('total', 'Total')}</span>
              <span className="text-white">{currency} {finalTotal.toFixed(2)}</span>
            </div>

            {finalTotal === 0 && <Badge variant="secondary" className="w-full justify-center bg-green-500/20 text-green-300 border-green-400/30 text-xs">
                {t('fullyPaidWithGiftCard', 'Plătit complet cu cardul cadou')}
              </Badge>}

            {/* Package Features Preview - Condensed for mobile */}
            {selectedPackageData.includes && <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10">
                <h5 className="text-white text-xs font-medium mb-2">
                  {t('packageIncludes', 'Pachetul include:')}
                </h5>
                <ul className="space-y-1">
                  {selectedPackageData.includes.slice(0, isMobile ? 2 : 3).map((includeItem, index) => <li key={index} className="text-white/70 text-xs flex items-center gap-2">
                      <div className="w-1 h-1 bg-white/70 rounded-full shrink-0"></div>
                      <span className="truncate">
                        {typeof includeItem === 'string' ? includeItem : t(includeItem.include_key)}
                      </span>
                    </li>)}
                  {selectedPackageData.includes.length > (isMobile ? 2 : 3) && <li className="text-white/50 text-xs">
                      +{selectedPackageData.includes.length - (isMobile ? 2 : 3)} {t('moreFeatures', 'mai multe caracteristici')}
                    </li>}
                </ul>
              </div>}
          </CardContent>}
      </Card>
    </div>;
};
export default OrderSidebarSummary;