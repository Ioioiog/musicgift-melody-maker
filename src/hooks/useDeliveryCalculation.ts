
import { useMemo } from 'react';
import { usePackages } from './usePackageData';

// Mapping function to convert form package values to actual package values
const mapPackageValue = (formPackageValue: string): string => {
  const packageMapping: Record<string, string> = {
    'pachet-personal': 'personal',
    'pachet-premium': 'premium',
    'pachet-business': 'business',
    'pachet-artist': 'artist',
    'pachet-remix': 'remix',
    'pachet-instrumental': 'instrumental',
    'pachet-gift': 'gift'
  };
  
  return packageMapping[formPackageValue] || formPackageValue;
};

export const useDeliveryCalculation = (orderCreatedAt: string, packageValue?: string) => {
  const { data: packages = [] } = usePackages();

  return useMemo(() => {
    console.log('DeliveryCalculation - Input:', { orderCreatedAt, packageValue, packagesCount: packages.length });
    
    if (!packageValue || !orderCreatedAt) {
      console.log('DeliveryCalculation - Missing required data');
      return { remainingDays: null, isOverdue: false, status: 'unknown', deliveryDate: null };
    }

    // First try to find package by the original value
    let packageData = packages.find(pkg => pkg.value === packageValue);
    
    // If not found, try with mapped value
    if (!packageData) {
      const mappedValue = mapPackageValue(packageValue);
      console.log('DeliveryCalculation - Trying mapped value:', mappedValue);
      packageData = packages.find(pkg => pkg.value === mappedValue);
    }
    
    console.log('DeliveryCalculation - Found package:', packageData);
    
    if (!packageData) {
      console.log('DeliveryCalculation - Package not found for value:', packageValue);
      return { remainingDays: null, isOverdue: false, status: 'unknown', deliveryDate: null };
    }

    // Default delivery times based on package types
    const deliveryTimePatterns = {
      'personal': 7,
      'premium': 14,
      'business': 10,
      'artist': 12,
      'remix': 5,
      'instrumental': 5,
      'gift': 7
    };

    let deliveryDays = deliveryTimePatterns[packageData.value as keyof typeof deliveryTimePatterns] || 7;
    console.log('DeliveryCalculation - Using delivery days:', deliveryDays);

    // Try to extract delivery time from package delivery_time_key if available
    if (packageData.delivery_time_key) {
      const timeMatch = packageData.delivery_time_key.match(/(\d+)/);
      if (timeMatch) {
        deliveryDays = parseInt(timeMatch[1]);
        console.log('DeliveryCalculation - Extracted delivery days from key:', deliveryDays);
      }
    }

    const createdDate = new Date(orderCreatedAt);
    const deliveryDate = new Date(createdDate);
    deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    deliveryDate.setHours(0, 0, 0, 0);
    
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

    const result = {
      remainingDays: Math.abs(remainingDays),
      isOverdue,
      status,
      deliveryDate: deliveryDate.toLocaleDateString()
    };

    console.log('DeliveryCalculation - Final result:', result);
    return result;
  }, [orderCreatedAt, packageValue, packages]);
};
