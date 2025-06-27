
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
  remainingBalance: number;
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
        remainingBalance: 0,
      };
    }

    // Get package price in the current currency
    const packagePrice = getPackagePrice(selectedPackage, currency);
    
    // Use remaining balance if available, otherwise calculate from original amount
    let availableBalance = 0;
    if (giftCard.remaining_balance !== undefined) {
      availableBalance = giftCard.remaining_balance;
    } else {
      // Fallback to original calculation
      let originalAmount = giftCard.gift_amount || giftCard.amount_eur || giftCard.amount_ron || 0;
      
      // Convert gift card value to current currency if needed
      if (giftCard.currency !== currency) {
        originalAmount = convertCurrency(originalAmount, giftCard.currency as 'EUR' | 'RON', currency);
      }
      
      availableBalance = originalAmount;
    }

    // Convert available balance to current currency if needed
    let giftCardValue = availableBalance;
    if (giftCard.currency !== currency) {
      giftCardValue = convertCurrency(availableBalance, giftCard.currency as 'EUR' | 'RON', currency);
    }

    // Calculate additional payment or refund
    const difference = packagePrice - giftCardValue;
    const additionalPaymentRequired = Math.max(0, difference);
    const refundAmount = Math.max(0, -difference);
    const canAfford = difference <= 0;
    const remainingBalance = Math.max(0, giftCardValue - packagePrice);

    return {
      packagePrice,
      giftCardValue,
      additionalPaymentRequired,
      refundAmount,
      canAfford,
      remainingBalance,
    };
  }, [giftCard, selectedPackage, currency]);
};
