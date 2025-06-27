
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

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
          {filteredAddons.map(addon => (
            <Card key={addon.addon_key} className="bg-white/05 backdrop-blur-sm border border-white/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor={addon.addon_key} className="text-white/80 cursor-pointer">
                    {addon.label_key}
                  </Label>
                  <Checkbox
                    id={addon.addon_key}
                    checked={selectedAddons.includes(addon.addon_key)}
                    onCheckedChange={(checked) => onAddonChange(addon.addon_key, Boolean(checked))}
                    className="border-white/30 focus:ring-orange-500"
                  />
                </div>
                {addon.description && (
                  <p className="text-white/60 text-xs mt-2">{addon.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
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
