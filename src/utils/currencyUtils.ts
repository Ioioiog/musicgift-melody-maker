
/**
 * Formats monetary amounts based on payment provider
 * Stripe stores amounts in cents (integers), while SmartBill stores in decimal format
 */
export const formatCurrency = (
  amount: number, 
  currency: string, 
  paymentProvider?: string
): string => {
  if (!amount && amount !== 0) return '0.00';
  
  let displayAmount = amount;
  
  // Convert from cents to currency for Stripe payments
  if (paymentProvider === 'stripe') {
    displayAmount = amount / 100;
  }
  
  // Ensure we always show 2 decimal places
  const formattedAmount = displayAmount.toFixed(2);
  
  // Format based on currency
  if (currency === 'EUR') {
    return `${formattedAmount} €`;
  } else if (currency === 'RON') {
    return `${formattedAmount} RON`;
  } else if (currency === 'USD') {
    return `$${formattedAmount}`;
  }
  
  // Default format
  return `${formattedAmount} ${currency?.toUpperCase() || 'EUR'}`;
};

/**
 * Formats amount without currency symbol
 */
export const formatAmount = (
  amount: number, 
  paymentProvider?: string
): string => {
  if (!amount && amount !== 0) return '0.00';
  
  let displayAmount = amount;
  
  // Convert from cents to currency for Stripe payments
  if (paymentProvider === 'stripe') {
    displayAmount = amount / 100;
  }
  
  return displayAmount.toFixed(2);
};

/**
 * Converts amount for SmartBill based on payment provider
 * Stripe amounts are in cents and need to be converted back to base currency
 * Other providers store amounts in base currency
 */
export const convertAmountForSmartBill = (
  amount: number,
  paymentProvider?: string
): number => {
  if (paymentProvider === 'stripe' || paymentProvider === 'revolut') {
    // Convert from cents to base currency
    return amount / 100;
  }
  
  // Return as-is for other providers (already in base currency)
  return amount;
};

/**
 * Fixed exchange rate: 1 EUR = 5 RON (corrected from previous incorrect rate)
 */
export const EXCHANGE_RATE_EUR_TO_RON = 5;

/**
 * Convert RON to EUR using fixed rate (1 EUR = 5 RON)
 */
export const convertRonToEur = (ronAmount: number): number => {
  return ronAmount / EXCHANGE_RATE_EUR_TO_RON;
};

/**
 * Convert EUR to RON using fixed rate (1 EUR = 5 RON)
 */
export const convertEurToRon = (eurAmount: number): number => {
  return eurAmount * EXCHANGE_RATE_EUR_TO_RON;
};

/**
 * Convert amount between currencies
 */
export const convertCurrency = (
  amount: number, 
  fromCurrency: 'EUR' | 'RON', 
  toCurrency: 'EUR' | 'RON'
): number => {
  if (fromCurrency === toCurrency) {
    return amount;
  }
  
  if (fromCurrency === 'RON' && toCurrency === 'EUR') {
    return convertRonToEur(amount);
  }
  
  if (fromCurrency === 'EUR' && toCurrency === 'RON') {
    return convertEurToRon(amount);
  }
  
  return amount;
};

/**
 * Convert gift card amount to target currency
 * Gift cards store amounts in base currency units (not cents)
 */
export const convertGiftCardAmount = (
  giftAmount: number,
  giftCurrency: 'EUR' | 'RON',
  targetCurrency: 'EUR' | 'RON'
): number => {
  return convertCurrency(giftAmount, giftCurrency, targetCurrency);
};
