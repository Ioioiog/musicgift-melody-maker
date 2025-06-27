
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Package, CreditCard, Tag, User, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getPackagePrice, getAddonPrice } from '@/utils/pricing';
import DetailedFormReview from './DetailedFormReview';

interface OrderReviewStepProps {
  formData: Record<string, any>;
  selectedPackage: string;
  selectedPackageData: any;
  selectedAddons: string[];
  availableAddons: any[];
  giftCard?: any;
  appliedDiscount?: {
    code: string;
    amount: number;
    type: string;
  };
}

const OrderReviewStep: React.FC<OrderReviewStepProps> = ({
  formData,
  selectedPackage,
  selectedPackageData,
  selectedAddons,
  availableAddons,
  giftCard,
  appliedDiscount
}) => {
  const { t } = useLanguage();
  const { currency } = useCurrency();

  // Calculate prices
  const packagePrice = selectedPackageData ? getPackagePrice(selectedPackageData, currency) : 0;
  const addonsPrice = selectedAddons.reduce((total, addonKey) => {
    const addon = availableAddons.find(a => a.addon_key === addonKey);
    return total + (addon ? getAddonPrice(addon, currency) : 0);
  }, 0);
  const subtotal = packagePrice + addonsPrice;

  // Calculate gift card application
  let giftCreditApplied = 0;
  let finalTotal = subtotal;
  if (giftCard) {
    const giftBalance = (giftCard.gift_amount || 0) / 100;
    giftCreditApplied = Math.min(giftBalance, subtotal);
    finalTotal = Math.max(0, subtotal - giftCreditApplied);
  }

  // Apply discount
  let discountApplied = 0;
  if (appliedDiscount) {
    discountApplied = Math.min(appliedDiscount.amount, finalTotal);
    finalTotal = Math.max(0, finalTotal - discountApplied);
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">
          {t('reviewOrder', 'Review Your Order')}
        </h3>
        <p className="text-white/70 text-sm">
          {t('pleaseReviewOrderDetails', 'Please review all the details before proceeding to payment')}
        </p>
      </div>

      {/* Package Details */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white text-base">
            <Package className="w-4 h-4" />
            {t('selectedPackage', 'Selected Package')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white font-medium">
                {t(selectedPackageData?.label_key) || selectedPackage}
              </p>
              <p className="text-white/60 text-sm">
                {t(selectedPackageData?.delivery_time_key)}
              </p>
            </div>
            <Badge variant="secondary" className="bg-orange-500/20 text-orange-300">
              {currency} {packagePrice.toFixed(2)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Add-ons */}
      {selectedAddons.length > 0 && (
        <Card className="bg-white/10 border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-white text-base">
              <Tag className="w-4 h-4" />
              {t('selectedAddons', 'Selected Add-ons')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {selectedAddons.map((addonKey) => {
              const addon = availableAddons.find(a => a.addon_key === addonKey);
              if (!addon) return null;
              return (
                <div key={addonKey} className="flex justify-between items-center">
                  <p className="text-white/90 text-sm">
                    {t(addon.label_key) || addon.addon_key}
                  </p>
                  <Badge variant="outline" className="text-white/70 border-white/30">
                    {currency} {getAddonPrice(addon, currency).toFixed(2)}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Price Breakdown */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white text-base">
            <CreditCard className="w-4 h-4" />
            {t('priceBreakdown', 'Price Breakdown')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <div className="flex justify-between text-white/90">
            <span>{t('subtotal', 'Subtotal')}</span>
            <span>{currency} {subtotal.toFixed(2)}</span>
          </div>
          
          {giftCard && giftCreditApplied > 0 && (
            <div className="flex justify-between text-green-400">
              <span>{t('giftCardCredit', 'Gift Card Credit')}</span>
              <span>-{currency} {giftCreditApplied.toFixed(2)}</span>
            </div>
          )}
          
          {appliedDiscount && discountApplied > 0 && (
            <div className="flex justify-between text-blue-400">
              <span>{t('discount', 'Discount')} ({appliedDiscount.code})</span>
              <span>-{currency} {discountApplied.toFixed(2)}</span>
            </div>
          )}
          
          <Separator className="bg-white/20" />
          <div className="flex justify-between text-white font-semibold text-lg">
            <span>{t('total', 'Total')}</span>
            <span>{currency} {finalTotal.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white text-base">
            <User className="w-4 h-4" />
            {t('customerInformation', 'Customer Information')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <div className="flex items-center gap-2 text-white/90">
            <User className="w-3 h-3" />
            <span className="text-sm">{formData.fullName}</span>
          </div>
          <div className="flex items-center gap-2 text-white/90">
            <Mail className="w-3 h-3" />
            <span className="text-sm">{formData.email}</span>
          </div>
          {formData.phone && (
            <div className="flex items-center gap-2 text-white/90">
              <Phone className="w-3 h-3" />
              <span className="text-sm">{formData.phone}</span>
            </div>
          )}
          {(formData.address || formData.city) && (
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-3 h-3" />
              <span className="text-sm">
                {[formData.address, formData.city].filter(Boolean).join(', ')}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Form Information */}
      <DetailedFormReview formData={formData} />

      {/* Legal Confirmations */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white text-base">
            <CheckCircle className="w-4 h-4" />
            {t('legalConfirmations', 'Legal Confirmations')}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-3 h-3" />
            <span className="text-sm">{t('acceptMentionObligation', 'Mention obligation accepted')}</span>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-3 h-3" />
            <span className="text-sm">{t('acceptDistribution', 'Distribution terms accepted')}</span>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="w-3 h-3" />
            <span className="text-sm">{t('finalNote', 'Final terms accepted')}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderReviewStep;
