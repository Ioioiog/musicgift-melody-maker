
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
 * Exchange rates:
 * - 1 EUR = 5 RON (existing fixed rate)
 * - 1 USD = 0.85 EUR (approximate rate)
 * - 1 USD = 4.25 RON (calculated: 0.85 * 5)
 */
export const EXCHANGE_RATE_EUR_TO_RON = 5;
export const EXCHANGE_RATE_USD_TO_EUR = 0.85;
export const EXCHANGE_RATE_USD_TO_RON = EXCHANGE_RATE_USD_TO_EUR * EXCHANGE_RATE_EUR_TO_RON; // 4.25

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
 * Convert USD to EUR using fixed rate (1 USD = 0.85 EUR)
 */
export const convertUsdToEur = (usdAmount: number): number => {
  return usdAmount * EXCHANGE_RATE_USD_TO_EUR;
};

/**
 * Convert EUR to USD using fixed rate (1 USD = 0.85 EUR)
 */
export const convertEurToUsd = (eurAmount: number): number => {
  return eurAmount / EXCHANGE_RATE_USD_TO_EUR;
};

/**
 * Convert USD to RON using fixed rate (1 USD = 4.25 RON)
 */
export const convertUsdToRon = (usdAmount: number): number => {
  return usdAmount * EXCHANGE_RATE_USD_TO_RON;
};

/**
 * Convert RON to USD using fixed rate (1 USD = 4.25 RON)
 */
export const convertRonToUsd = (ronAmount: number): number => {
  return ronAmount / EXCHANGE_RATE_USD_TO_RON;
};

/**
 * Convert amount between currencies
 */
export const convertCurrency = (
  amount: number, 
  fromCurrency: 'EUR' | 'RON' | 'USD', 
  toCurrency: 'EUR' | 'RON' | 'USD'
): number => {
  // Return original amount if same currency (no conversion needed)
  if (fromCurrency === toCurrency) {
    return amount;
  }
  
  // RON ↔ EUR conversions
  if (fromCurrency === 'RON' && toCurrency === 'EUR') {
    return convertRonToEur(amount);
  }
  if (fromCurrency === 'EUR' && toCurrency === 'RON') {
    return convertEurToRon(amount);
  }
  
  // USD ↔ EUR conversions
  if (fromCurrency === 'USD' && toCurrency === 'EUR') {
    return convertUsdToEur(amount);
  }
  if (fromCurrency === 'EUR' && toCurrency === 'USD') {
    return convertEurToUsd(amount);
  }
  
  // USD ↔ RON conversions
  if (fromCurrency === 'USD' && toCurrency === 'RON') {
    return convertUsdToRon(amount);
  }
  if (fromCurrency === 'RON' && toCurrency === 'USD') {
    return convertRonToUsd(amount);
  }
  
  return amount;
};

/**
 * Convert gift card amount to target currency
 * Gift cards store amounts in base currency units (not cents)
 * For same currency, return the original amount without conversion
 */
export const convertGiftCardAmount = (
  giftAmount: number,
  giftCurrency: 'EUR' | 'RON' | 'USD',
  targetCurrency: 'EUR' | 'RON' | 'USD'
): number => {
  console.log('convertGiftCardAmount called:', { giftAmount, giftCurrency, targetCurrency });
  
  // If same currency, return original amount - no conversion needed
  if (giftCurrency === targetCurrency) {
    console.log('Same currency, returning original amount:', giftAmount);
    return giftAmount;
  }
  
  // Only convert if currencies are different
  const converted = convertCurrency(giftAmount, giftCurrency, targetCurrency);
  console.log('Different currencies, converted amount:', converted);
  return converted;
};
