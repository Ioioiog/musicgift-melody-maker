
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
