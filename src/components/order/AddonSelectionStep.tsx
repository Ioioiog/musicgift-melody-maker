
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { getAddonPrice } from '@/utils/pricing';

interface AddonSelectionStepProps {
  selectedAddons: string[];
  onAddonChange: (addonId: string, checked: boolean) => void;
  availableAddons: any[];
  selectedPackageData: any;
}

const AddonSelectionStep: React.FC<AddonSelectionStepProps> = ({
  selectedAddons,
  onAddonChange,
  availableAddons,
  selectedPackageData
}) => {
  const { t } = useLanguage();
  const { currency } = useCurrency();

  // Helper function to check if addon should be shown based on package's available_addons
  const shouldShowAddon = (addon: any) => {
    if (!addon.is_active) return false;

    // Use the selected package data if available
    if (selectedPackageData) {
      const isAvailable = selectedPackageData.available_addons.includes(addon.addon_key);
      console.log('Addon availability check:', {
        addonKey: addon.addon_key,
        selectedPackage: selectedPackageData.value,
        packageAvailableAddons: selectedPackageData.available_addons,
        isAvailable
      });
      return isAvailable;
    }

    // Fallback: if no package data is provided, don't show any addons
    console.warn('No package data provided for addon filtering');
    return false;
  };

  // Filter addons to only show those available for the selected package
  const filteredAddons = availableAddons.filter(addon => shouldShowAddon(addon));

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-white">{t('selectAddons', 'Select Add-ons')}</h2>
        <p className="text-white/70 text-sm mt-1">
          {t('chooseAdditionalServices', 'Choose additional services to enhance your package')}
        </p>
      </div>
      
      <Separator className="my-2 bg-white/20" />

      {filteredAddons.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAddons.map(addon => {
            const price = getAddonPrice(addon, currency);
            return (
              <Card key={addon.addon_key} className={`bg-white/10 backdrop-blur-sm border transition-all hover:bg-white/15 ${
                selectedAddons.includes(addon.addon_key) 
                  ? 'border-orange-400 bg-orange-500/10' 
                  : 'border-white/30'
              }`}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header with checkbox and price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={addon.addon_key}
                          checked={selectedAddons.includes(addon.addon_key)}
                          onCheckedChange={(checked) => onAddonChange(addon.addon_key, Boolean(checked))}
                          className="border-white/30 focus:ring-orange-500"
                        />
                        <Label htmlFor={addon.addon_key} className="text-white/90 font-medium cursor-pointer">
                          {t(addon.label_key) || addon.addon_key}
                        </Label>
                      </div>
                      <Badge variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-400/30">
                        {currency} {price.toFixed(2)}
                      </Badge>
                    </div>

                    {/* Description */}
                    {addon.description && (
                      <p className="text-white/70 text-sm leading-relaxed">
                        {t(addon.description) || addon.description}
                      </p>
                    )}

                    {/* Additional details if available */}
                    {addon.details && (
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-white/60 text-xs">
                          {t(addon.details) || addon.details}
                        </p>
                      </div>
                    )}

                    {/* Delivery time or other metadata */}
                    {addon.delivery_time && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/50">{t('deliveryTime', 'Delivery Time')}:</span>
                        <span className="text-white/70">{t(addon.delivery_time) || addon.delivery_time}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="bg-white/05 backdrop-blur-sm border border-white/30">
          <CardContent className="p-6 text-center">
            <p className="text-white/80">{t('noAddonsAvailable', 'No add-ons available for this package')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AddonSelectionStep;
