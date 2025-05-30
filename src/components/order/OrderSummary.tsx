
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { usePackages, useAddons } from '@/hooks/usePackageData';
import { useTranslation } from '@/hooks/useTranslations';

interface OrderSummaryProps {
  selectedPackage: string;
  selectedAddons: string[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ selectedPackage, selectedAddons }) => {
  const { t } = useTranslation();
  const [isIncludesOpen, setIsIncludesOpen] = useState(false);
  const [isAddonsOpen, setIsAddonsOpen] = useState(true);
  
  const { data: packages = [] } = usePackages();
  const { data: addons = [] } = useAddons();
  
  const packageDetails = packages.find(pkg => pkg.value === selectedPackage);
  
  if (!selectedPackage || !packageDetails) {
    return (
      <Card className="sticky top-8">
        <CardHeader>
          <CardTitle className="text-lg">{t('orderSummary', 'Order Summary')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">{t('selectPackageToSeeDetails', 'Select a package to see details')}</p>
        </CardContent>
      </Card>
    );
  }

  const calculateTotal = () => {
    let total = packageDetails.price;
    selectedAddons.forEach(addonKey => {
      const addon = addons.find(a => a.addon_key === addonKey);
      if (addon) {
        total += addon.price;
      }
    });
    return total;
  };

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="text-lg">{t('orderSummary', 'Order Summary')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Package Summary */}
        <div className="border-b pb-4">
          <h4 className="font-semibold mb-2">{t(packageDetails.label_key)}</h4>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">{t('package', 'Package')}</span>
            <span className="font-semibold">{packageDetails.price} RON</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{t('delivery', 'Delivery')}</span>
            <span className="text-sm">{packageDetails.delivery_time_key ? t(packageDetails.delivery_time_key) : '3-5 days'}</span>
          </div>
        </div>

        {/* Package Includes - Collapsible */}
        <Collapsible open={isIncludesOpen} onOpenChange={setIsIncludesOpen}>
          <div className="border-b pb-4">
            <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
              <h5 className="font-medium text-sm">{t('whatsIncluded', "What's Included")}:</h5>
              <ChevronDown className={`h-4 w-4 transition-transform ${isIncludesOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <ul className="space-y-1">
                {packageDetails.includes && packageDetails.includes.map((include, index) => (
                  <li key={index} className="text-xs text-gray-600 flex items-start">
                    <span className="w-1 h-1 bg-purple-500 rounded-full mr-2 mt-2 flex-shrink-0"></span>
                    <span>{t(include.include_key)}</span>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Selected Addons */}
        {selectedAddons.length > 0 && (
          <Collapsible open={isAddonsOpen} onOpenChange={setIsAddonsOpen}>
            <div className="border-b pb-4">
              <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                <h5 className="font-medium mb-2 text-sm">{t('selectedAddons', 'Selected Add-ons')} ({selectedAddons.length}):</h5>
                <ChevronDown className={`h-4 w-4 transition-transform ${isAddonsOpen ? 'rotate-180' : ''}`} />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <div className="space-y-3">
                  {selectedAddons.map(addonKey => {
                    const addon = addons.find(a => a.addon_key === addonKey);
                    return addon ? (
                      <div key={addonKey} className="space-y-1">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-800">{t(addon.label_key, addon.label_key)}</span>
                            {addon.description_key && (
                              <p className="text-xs text-gray-500 mt-1">{t(addon.description_key, addon.description_key)}</p>
                            )}
                            {addon.trigger_field_type && (
                              <Badge variant="outline" className="text-xs mt-1">
                                {addon.trigger_field_type === 'audio-recorder' ? '🎤 Audio' : 
                                 addon.trigger_field_type === 'file' ? '📁 File' : 
                                 addon.trigger_field_type}
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm font-semibold text-purple-600">+{addon.price} RON</span>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        )}

        {/* Total */}
        <div className="pt-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold">{t('total', 'Total')}:</span>
            <span className="font-bold text-lg text-purple-600">{calculateTotal()} RON</span>
          </div>
        </div>

        {/* Quality Badge */}
        <div className="pt-2">
          <Badge variant="secondary" className="w-full justify-center">
            {t('professionalQualityGuaranteed', 'Professional Quality Guaranteed')}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
