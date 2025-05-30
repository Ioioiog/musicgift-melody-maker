
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { packages, addons } from '@/data/packages';

interface OrderSummaryProps {
  selectedPackage: string;
  selectedAddons: string[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ selectedPackage, selectedAddons }) => {
  const getSelectedPackageDetails = () => {
    return packages.find(pkg => pkg.value === selectedPackage);
  };

  const calculateTotal = () => {
    const selectedPackageDetails = getSelectedPackageDetails();
    const basePrice = selectedPackageDetails?.price || 0;
    const addonsPrice = selectedAddons.reduce((total, addonId) => {
      const addon = addons[addonId as keyof typeof addons];
      return total + (addon?.price || 0);
    }, 0);
    return basePrice + addonsPrice;
  };

  const selectedPackageDetails = getSelectedPackageDetails();

  if (!selectedPackageDetails) {
    return null;
  }

  return (
    <Card className="border-purple-200">
      <CardContent className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Package:</span>
            <span className="font-medium">{selectedPackageDetails.label}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Base Price:</span>
            <span className="font-medium">{selectedPackageDetails.details.price}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery Time:</span>
            <span className="font-medium">{selectedPackageDetails.details.deliveryTime}</span>
          </div>
          
          <div className="pt-2 border-t">
            <div className="text-sm text-gray-600 mb-2">Package includes:</div>
            <ul className="text-xs text-gray-500 space-y-1">
              {selectedPackageDetails.details.includes.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </div>

          {selectedAddons.length > 0 && (
            <div className="pt-2 border-t">
              <div className="text-sm text-gray-600 mb-2">Add-ons:</div>
              {selectedAddons.map(addonId => {
                const addon = addons[addonId as keyof typeof addons];
                return addon ? (
                  <div key={addonId} className="flex justify-between text-sm">
                    <span>{addon.label}</span>
                    <span>+{addon.price} RON</span>
                  </div>
                ) : null;
              })}
            </div>
          )}
          <div className="flex justify-between pt-3 border-t font-semibold text-lg">
            <span>Total:</span>
            <span>{calculateTotal()} RON</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
