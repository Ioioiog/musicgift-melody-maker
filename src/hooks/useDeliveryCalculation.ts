
import { useMemo } from 'react';
import { usePackages } from './usePackageData';

export const useDeliveryCalculation = (orderCreatedAt: string, packageValue?: string) => {
  const { data: packages = [] } = usePackages();

  return useMemo(() => {
    if (!packageValue || !orderCreatedAt) {
      return { remainingDays: null, isOverdue: false, status: 'unknown' };
    }

    const packageData = packages.find(pkg => pkg.value === packageValue);
    if (!packageData) {
      return { remainingDays: null, isOverdue: false, status: 'unknown' };
    }

    // Parse delivery time from package - extract number from delivery time key
    let deliveryDays = 7; // default fallback
    
    // Common patterns for delivery times in packages
    const deliveryTimePatterns = {
      'personal': 7,
      'premium': 14,
      'business': 10,
      'artist': 12,
      'remix': 5,
      'instrumental': 5,
      'gift': 7
    };

    // Use predefined patterns or try to extract from delivery_time_key
    if (deliveryTimePatterns[packageValue as keyof typeof deliveryTimePatterns]) {
      deliveryDays = deliveryTimePatterns[packageValue as keyof typeof deliveryTimePatterns];
    }

    const createdDate = new Date(orderCreatedAt);
    const deliveryDate = new Date(createdDate);
    deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
    
    const today = new Date();
    const timeDiff = deliveryDate.getTime() - today.getTime();
    const remainingDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    const isOverdue = remainingDays < 0;
    
    let status: 'urgent' | 'warning' | 'normal' | 'overdue' = 'normal';
    if (isOverdue) {
      status = 'overdue';
    } else if (remainingDays <= 1) {
      status = 'urgent';
    } else if (remainingDays <= 3) {
      status = 'warning';
    }

    return {
      remainingDays: Math.abs(remainingDays),
      isOverdue,
      status,
      deliveryDate: deliveryDate.toLocaleDateString()
    };
  }, [orderCreatedAt, packageValue, packages]);
};
