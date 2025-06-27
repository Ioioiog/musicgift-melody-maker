import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatCurrency } from '@/utils/pricing';
import { Gift, Check, AlertCircle } from 'lucide-react';
interface GiftCardRedemptionSummaryProps {
  giftCard: any;
  selectedPackage: Package;
  pricing: {
    packagePrice: number;
    giftCardValue: number;
    additionalPaymentRequired: number;
    refundAmount: number;
    canAfford: boolean;
  };
}
const GiftCardRedemptionSummary: React.FC<GiftCardRedemptionSummaryProps> = ({
  giftCard,
  selectedPackage,
  pricing
}) => {
  const {
    t
  } = useLanguage();
  const {
    currency
  } = useCurrency();
  return <Card className="bg-gradient-to-br from-green-50/10 to-green-100/10 border-green-200/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-500">
          <Gift className="w-5 h-5" />
          Redemption Summary
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-slate-200">Gift Card Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between bg-slate-50">
                <span className="text-slate-400">Code:</span>
                <span className="text-slate-200 font-mono">{giftCard.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Value:</span>
                <span className="text-slate-200">
                  {formatCurrency(pricing.giftCardValue, currency)}
                </span>
              </div>
              {giftCard.message_text && <div className="space-y-1">
                  <span className="text-slate-400">Message:</span>
                  <p className="text-slate-300 text-xs bg-slate-800/50 p-2 rounded">
                    "{giftCard.message_text}"
                  </p>
                </div>}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-slate-200">Selected Package</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Package:</span>
                <span className="text-slate-200">{t(selectedPackage.label_key)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Price:</span>
                <span className="text-slate-200">
                  {formatCurrency(pricing.packagePrice, currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Delivery:</span>
                <span className="text-slate-200">{t(selectedPackage.delivery_time_key)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-600 pt-4">
          <h4 className="font-medium text-slate-200 mb-3">Payment Breakdown</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Package Price:</span>
              <span className="text-slate-200">
                {formatCurrency(pricing.packagePrice, currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-400">Gift Card Credit:</span>
              <span className="text-green-400">
                -{formatCurrency(pricing.giftCardValue, currency)}
              </span>
            </div>
            <div className="border-t border-slate-600 pt-2 mt-2">
              {pricing.additionalPaymentRequired > 0 ? <div className="flex justify-between font-medium">
                  <span className="text-orange-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Additional Payment Required:
                  </span>
                  <span className="text-orange-400">
                    {formatCurrency(pricing.additionalPaymentRequired, currency)}
                  </span>
                </div> : <>
                  <div className="flex justify-between font-medium text-green-400">
                    <span className="flex items-center">
                      <Check className="w-4 h-4 mr-1" />
                      Fully Covered
                    </span>
                    <span>{formatCurrency(0, currency)}</span>
                  </div>
                  {pricing.refundAmount > 0 && <div className="flex justify-between text-green-300 text-sm mt-1">
                      <span>Refund Amount:</span>
                      <span>{formatCurrency(pricing.refundAmount, currency)}</span>
                    </div>}
                </>}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Badge variant={pricing.canAfford ? "default" : "secondary"} className={`${pricing.canAfford ? 'bg-green-500' : 'bg-orange-500'} text-white`}>
            {pricing.canAfford ? "Ready to Proceed" : "Additional Payment Required"}
          </Badge>
        </div>
      </CardContent>
    </Card>;
};
export default GiftCardRedemptionSummary;