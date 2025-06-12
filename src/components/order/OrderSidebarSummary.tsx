import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Gift, Package, Plus, ChevronDown, ChevronUp, CheckCircle, Tag } from 'lucide-react';
import { usePackages, useAddons } from '@/hooks/usePackageData';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getPackagePrice, getAddonPrice } from '@/utils/pricing';
import { useIsMobile } from '@/hooks/use-mobile';
import CodeInputSection from './CodeInputSection';

interface OrderSidebarSummaryProps {
  orderData?: {
    selectedPackage?: string;
    selectedAddons?: string[];
  };
  giftCard?: any;
  onGiftCardChange?: (giftCard: any) => void;
  onDiscountChange?: (discount: { code: string; amount: number; type: string } | null) => void;
  isQuoteOnly?: boolean;
}

const OrderSidebarSummary: React.FC<OrderSidebarSummaryProps> = ({
  orderData,
  giftCard,
  onGiftCardChange,
  onDiscountChange,
  isQuoteOnly = false
}) => {
  const { data: packages = [] } = usePackages();
  const { data: addons = [] } = useAddons();
  const { t } = useLanguage();
  const { currency } = useCurrency();
  const isMobile = useIsMobile();

  // Local state for applied codes
  const [appliedGiftCard, setAppliedGiftCard] = useState(giftCard);
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number; type: string } | null>(null);

  // Explicitly set to collapsed by default on mobile
  const [isCollapsed, setIsCollapsed] = useState(true);

  if (!orderData?.selectedPackage) {
    return (
      <div className={isMobile ? "mb-2" : ""}>
        <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-300 shadow-xl">
          <CardHeader className="pb-3 px-3 sm:px-6 py-2 sm:py-4">
            <CardTitle className="flex items-center gap-2 text-white text-sm sm:text-lg">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              {t('orderSummary', 'Rezumatul comenzii')}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="text-center py-4 sm:py-8">
              <Package className="w-8 h-8 sm:w-12 sm:h-12 text-white/40 mx-auto mb-2" />
              <p className="text-white/70 text-xs sm:text-sm">
                {t('selectPackageToSeePrice', 'Alege un pachet pentru a vedea prețul')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const selectedPackageData = packages.find(pkg => pkg.value === orderData.selectedPackage);
  const selectedAddonsData = (orderData.selectedAddons || [])
    .map(addonKey => addons.find(addon => addon.addon_key === addonKey))
    .filter(Boolean);

  if (!selectedPackageData) return null;

  // Check if this is a quote-only package
  const packageIsQuoteOnly = selectedPackageData?.is_quote_only === true || isQuoteOnly;

  const packagePrice = getPackagePrice(selectedPackageData, currency);
  const addonsPrice = selectedAddonsData.reduce((total, addon) => 
    total + (addon ? getAddonPrice(addon, currency) : 0), 0
  );
  const subtotal = packagePrice + addonsPrice;

  // Calculate gift card credit (only for non-quote packages)
  let giftCreditApplied = 0;
  if (!packageIsQuoteOnly && appliedGiftCard) {
    const giftBalance = (appliedGiftCard.gift_amount || 0) / 100; // Convert from cents
    giftCreditApplied = Math.min(giftBalance, subtotal);
  }

  // Apply discount (only for non-quote packages)
  const discountAmount = !packageIsQuoteOnly && appliedDiscount ? appliedDiscount.amount : 0;
  const totalAfterGift = Math.max(0, subtotal - giftCreditApplied);
  const finalDiscount = Math.min(discountAmount, totalAfterGift);
  const finalTotal = Math.max(0, totalAfterGift - finalDiscount);

  const handleGiftCardApplied = (newGiftCard: any) => {
    setAppliedGiftCard(newGiftCard);
    onGiftCardChange?.(newGiftCard);
  };

  const handleGiftCardRemoved = () => {
    setAppliedGiftCard(null);
    onGiftCardChange?.(null);
  };

  const handleDiscountApplied = (discount: { code: string; amount: number; type: string }) => {
    setAppliedDiscount(discount);
    onDiscountChange?.(discount);
  };

  const handleDiscountRemoved = () => {
    setAppliedDiscount(null);
    onDiscountChange?.(null);
  };

  return (
    <div className={isMobile ? "mb-2" : ""}>
      <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-300 shadow-xl py-[16px] my-[32px]">
        <CardHeader className="pb-1 sm:pb-3 px-3 sm:px-6 py-1 sm:py-[15px] my-[1px]">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white text-sm sm:text-lg">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
              {t('orderSummary', 'Rezumatul comenzii')}
            </CardTitle>
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-white hover:bg-white/10 p-1 h-6 w-6"
              >
                {isCollapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
              </Button>
            )}
          </div>
        </CardHeader>
        
        {(!isMobile || !isCollapsed) && (
          <CardContent className="space-y-2 sm:space-y-4 px-3 sm:px-6 pb-2 sm:pb-6 my-[4px] py-0">
            {/* Package Section */}
            <div className="space-y-1 sm:space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white text-xs sm:text-sm truncate">
                    {t(selectedPackageData.label_key)}
                  </h3>
                </div>
                <span className="font-medium text-white text-xs sm:text-sm shrink-0">
                  {currency} {packagePrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Add-ons Section */}
            {selectedAddonsData.length > 0 && (
              <>
                <Separator className="bg-white/20" />
                <div>
                  <h4 className="font-medium mb-1 sm:mb-2 text-white flex items-center gap-2 text-xs sm:text-sm">
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                    {t('addOns', 'Suplimente')}
                  </h4>
                  <div className="space-y-1 sm:space-y-2">
                    {selectedAddonsData.map(addon => addon && (
                      <div key={addon.addon_key} className="flex justify-between items-center text-xs gap-2">
                        <span className="text-white/80 truncate flex-1">
                          {t(addon.label_key)}
                        </span>
                        <span className="text-white shrink-0">
                          {currency} {getAddonPrice(addon, currency).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

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

            {/* Gift Card Credit - Only show for non-quote packages */}
            {!packageIsQuoteOnly && appliedGiftCard && giftCreditApplied > 0 && (
              <div className="flex justify-between items-center text-green-400 text-xs sm:text-sm gap-2">
                <span className="flex items-center gap-1 sm:gap-2 truncate">
                  <Gift className="w-3 h-3 sm:w-4 h-4 shrink-0" />
                  <span className="truncate">{t('giftCardCredit', 'Credit card cadou')}</span>
                </span>
                <span className="shrink-0">-{currency} {giftCreditApplied.toFixed(2)}</span>
              </div>
            )}

            {/* Discount - Only show for non-quote packages */}
            {!packageIsQuoteOnly && appliedDiscount && finalDiscount > 0 && (
              <div className="flex justify-between items-center text-blue-400 text-xs sm:text-sm gap-2">
                <span className="flex items-center gap-1 sm:gap-2 truncate">
                  <Tag className="w-3 h-3 sm:w-4 h-4 shrink-0" />
                  <span className="truncate">{t('discount', 'Reducere')} ({appliedDiscount.code})</span>
                </span>
                <span className="shrink-0">-{currency} {finalDiscount.toFixed(2)}</span>
              </div>
            )}

            {/* Code Input Section - Only show for non-quote packages */}
            {!packageIsQuoteOnly && (
              <CodeInputSection
                onGiftCardApplied={handleGiftCardApplied}
                onDiscountApplied={handleDiscountApplied}
                onGiftCardRemoved={handleGiftCardRemoved}
                onDiscountRemoved={handleDiscountRemoved}
                appliedGiftCard={appliedGiftCard}
                appliedDiscount={appliedDiscount}
                orderTotal={subtotal}
              />
            )}

            <Separator className="bg-white/20" />

            {/* Total */}
            <div className="flex justify-between items-center text-sm sm:text-lg font-bold bg-gradient-to-r from-orange-500/20 to-yellow-500/20 p-2 sm:p-3 rounded-lg border border-orange-400/30">
              <span className="text-white">
                {packageIsQuoteOnly ? t('estimatedPrice', 'Estimated Price') : t('total', 'Total')}
              </span>
              <span className="text-white">{currency} {packageIsQuoteOnly ? subtotal.toFixed(2) : finalTotal.toFixed(2)}</span>
            </div>

            {/* Quote-only messaging */}
            {packageIsQuoteOnly && (
              <div className="bg-blue-50/10 border border-blue-400/30 rounded-lg p-3 text-center">
                <p className="text-blue-300 text-xs">
                  {t('quoteOnlyMessage', 'This is an estimated price. Final pricing will be provided after quote review.')}
                </p>
              </div>
            )}

            {!packageIsQuoteOnly && finalTotal === 0 && (
              <Badge variant="secondary" className="w-full justify-center bg-green-500/20 text-green-300 border-green-400/30 text-xs">
                {giftCreditApplied > 0 && finalDiscount > 0 
                  ? t('fullyPaidWithCredits', 'Plătit complet cu credite')
                  : giftCreditApplied > 0 
                    ? t('fullyPaidWithGiftCard', 'Plătit complet cu cardul cadou')
                    : t('fullyPaidWithDiscount', 'Plătit complet cu reducerea')
                }
              </Badge>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default OrderSidebarSummary;
