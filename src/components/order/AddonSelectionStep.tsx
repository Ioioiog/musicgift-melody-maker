
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getAddonPrice } from '@/utils/pricing';
import { Addon, Package } from '@/types';
import AudioRecorder from './AudioRecorder';

interface AddonSelectionStepProps {
  selectedPackageData?: Package;
  selectedAddons: string[];
  onAddonChange: (addonId: string, checked: boolean) => void;
  availableAddons: Addon[];
  addonFieldValues: any;
  onAddonFieldChange: (addonKey: string, fieldValue: any) => void;
}

const AddonSelectionStep: React.FC<AddonSelectionStepProps> = ({
  selectedPackageData,
  selectedAddons,
  onAddonChange,
  availableAddons,
  addonFieldValues,
  onAddonFieldChange
}) => {
  const { t } = useLanguage();
  const { currency } = useCurrency();

  // Filter addons based on the selected package
  const shouldShowAddon = (addon: Addon) => {
    if (!addon.is_active) return false;
    
    if (selectedPackageData) {
      return selectedPackageData.available_addons.includes(addon.addon_key);
    }
    
    return false;
  };

  const filteredAddons = availableAddons.filter(addon => shouldShowAddon(addon));

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, addonKey: string) => {
    const files = event.target.files;
    if (files) {
      onAddonFieldChange(addonKey, Array.from(files));
    }
  };

  const handleAudioRecording = (audioBlob: Blob, addonKey: string) => {
    onAddonFieldChange(addonKey, audioBlob);
  };

  const formatAddonPrice = (addon: Addon) => {
    const price = getAddonPrice(addon, currency);
    if (price === 0) {
      return "FREE";
    }
    return `+${price} ${currency}`;
  };

  if (filteredAddons.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">
            {t('selectAddons', 'Select Add-ons')}
          </h3>
          <p className="text-white/70">
            {t('noAddonsAvailable', 'No add-ons are available for this package.')}
          </p>
        </div>
        <div className="text-center">
          <p className="text-white/60 text-sm">
            {t('proceedToNextStep', 'You can proceed to the next step.')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">
          {t('selectAddons', 'Select Add-ons')}
        </h3>
        <p className="text-white/70">
          {t('enhanceYourPackage', 'Enhance your package with these optional add-ons')}
        </p>
      </div>

      <div className="space-y-4">
        {filteredAddons.map((addon) => (
          <Card key={addon.id} className="border-2 hover:border-purple-200 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <Checkbox
                    checked={selectedAddons.includes(addon.addon_key)}
                    onCheckedChange={(checked) => onAddonChange(addon.addon_key, checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Label className="font-semibold text-base cursor-pointer">
                        {t(addon.label_key)}
                      </Label>
                      <Badge variant="secondary" className={`${getAddonPrice(addon, currency) === 0 ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                        {formatAddonPrice(addon)}
                      </Badge>
                    </div>
                    {addon.description_key && (
                      <p className="text-sm text-gray-600 mb-3">
                        {t(addon.description_key)}
                      </p>
                    )}
                    
                    {/* Render addon-specific fields when selected */}
                    {selectedAddons.includes(addon.addon_key) && addon.trigger_field_type && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-md">
                        {addon.trigger_field_type === 'file' && (
                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              {t('uploadFiles')}
                            </Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <Input
                                type="file"
                                multiple
                                accept={addon.trigger_field_config?.allowedTypes?.join(',')}
                                onChange={(e) => handleFileUpload(e, addon.addon_key)}
                                className="hidden"
                                id={`file-${addon.addon_key}`}
                              />
                              <label
                                htmlFor={`file-${addon.addon_key}`}
                                className="cursor-pointer text-sm text-purple-600 hover:text-purple-700"
                              >
                                {t('clickToUploadFiles')}
                              </label>
                              <p className="text-xs text-gray-500 mt-1">
                                {t('maxFiles')} {addon.trigger_field_config?.maxFiles || 10} {t('files')}, 
                                {addon.trigger_field_config?.maxTotalSizeMb || 150}MB {t('totalSize')}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {addon.trigger_field_type === 'audio-recorder' && (
                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              {t('recordAudioMessage')}
                            </Label>
                            <AudioRecorder
                              value={addonFieldValues[addon.addon_key] || null}
                              onChange={(audioFile) => onAddonFieldChange(addon.addon_key, audioFile)}
                              maxDuration={addon.trigger_field_config?.maxDuration || 30}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedAddons.length === 0 && (
        <div className="text-center bg-white/10 backdrop-blur-md rounded-lg p-4">
          <p className="text-white/80 text-sm">
            {t('noAddonsSelected', 'No add-ons selected. You can proceed without any add-ons or select some above.')}
          </p>
        </div>
      )}
    </div>
  );
};

export default AddonSelectionStep;
