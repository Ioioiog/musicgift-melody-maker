
import { useMemo } from 'react';
import { Package } from '@/types';
import { getPackagePrice } from '@/utils/pricing';
import { convertCurrency } from '@/utils/currencyUtils';

interface GiftCardPricingCalculation {
  packagePrice: number;
  giftCardValue: number;
  additionalPaymentRequired: number;
  refundAmount: number;
  canAfford: boolean;
}

export const useGiftCardPricing = (
  giftCard: any | null,
  selectedPackage: Package | null,
  currency: 'EUR' | 'RON'
): GiftCardPricingCalculation => {
  return useMemo(() => {
    if (!giftCard || !selectedPackage) {
      return {
        packagePrice: 0,
        giftCardValue: 0,
        additionalPaymentRequired: 0,
        refundAmount: 0,
        canAfford: false,
      };
    }

    // Get package price in the current currency
    const packagePrice = getPackagePrice(selectedPackage, currency);
    
    // Get gift card value, converting if necessary
    let giftCardValue = giftCard.gift_amount || giftCard.amount_eur || giftCard.amount_ron || 0;
    
    // Convert gift card value to current currency if needed
    if (giftCard.currency !== currency) {
      giftCardValue = convertCurrency(giftCardValue, giftCard.currency as 'EUR' | 'RON', currency);
    }

    // Calculate additional payment or refund
    const difference = packagePrice - giftCardValue;
    const additionalPaymentRequired = Math.max(0, difference);
    const refundAmount = Math.max(0, -difference);
    const canAfford = difference <= 0;

    return {
      packagePrice,
      giftCardValue,
      additionalPaymentRequired,
      refundAmount,
      canAfford,
    };
  }, [giftCard, selectedPackage, currency]);
};
