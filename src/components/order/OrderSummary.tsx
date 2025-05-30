
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { packages } from '@/data/packages';
import { addons } from '@/data/packages';
import { useLanguage } from '@/contexts/LanguageContext';

interface OrderSummaryProps {
  selectedPackage: string;
  selectedAddons: string[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ selectedPackage, selectedAddons }) => {
  const { t } = useLanguage();
  const [isIncludesOpen, setIsIncludesOpen] = useState(false);
  
  const packageDetails = packages.find(pkg => pkg.value === selectedPackage);
  
  if (!selectedPackage || !packageDetails) {
    return null;
  }

  const calculateTotal = () => {
    let total = packageDetails.price;
    selectedAddons.forEach(addonId => {
      const addon = addons[addonId as keyof typeof addons];
      if (addon) {
        total += addon.price;
      }
    });
    return total;
  };

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="text-lg">{t('orderSummary')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Package Summary */}
        <div className="border-b pb-4">
          <h4 className="font-semibold mb-2">{t(packageDetails.labelKey)}</h4>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">{t('package')}</span>
            <span className="font-semibold">{packageDetails.price} RON</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{t('delivery')}</span>
            <span className="text-sm">{t(packageDetails.details.deliveryTimeKey)}</span>
          </div>
        </div>

        {/* Package Includes - Collapsible */}
        <Collapsible open={isIncludesOpen} onOpenChange={setIsIncludesOpen}>
          <div className="border-b pb-4">
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
              <h5 className="font-medium text-sm">{t('whatsIncluded')}:</h5>
              <ChevronDown className={`h-4 w-4 transition-transform ${isIncludesOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <ul className="space-y-1">
                {packageDetails.details.includesKeys.map((includeKey, index) => (
                  <li key={index} className="text-xs text-gray-600 flex items-start">
                    <span className="w-1 h-1 bg-purple-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                    <span>{t(includeKey)}</span>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Selected Addons */}
        {selectedAddons.length > 0 && (
          <div className="border-b pb-4">
            <h5 className="font-medium mb-2 text-sm">{t('selectedAddons')}:</h5>
            <div className="space-y-2">
              {selectedAddons.map(addonId => {
                const addon = addons[addonId as keyof typeof addons];
                return addon ? (
                  <div key={addonId} className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">{t(addon.labelKey)}</span>
                    <span className="text-xs font-semibold">+{addon.price} RON</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Total */}
        <div className="pt-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold">{t('total')}:</span>
            <span className="font-bold text-lg text-purple-600">{calculateTotal()} RON</span>
          </div>
        </div>

        {/* Quality Badge */}
        <div className="pt-2">
          <Badge variant="secondary" className="w-full justify-center">
            {t('professionalQualityGuaranteed')}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
