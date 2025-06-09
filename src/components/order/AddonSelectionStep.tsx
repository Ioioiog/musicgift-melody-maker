import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import { Upload, Plus, Check } from 'lucide-react';
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
      <div className="space-y-1.5">
        <div className="text-center">
          <h3 className="text-xs font-semibold text-white mb-0.5">
            {t('selectAddons', 'Select Add-ons')}
          </h3>
          <p className="text-white/70 text-xs">
            {t('noAddonsAvailable', 'No add-ons are available for this package.')}
          </p>
        </div>
        <div className="text-center">
          <Card className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-white/20">
            <CardContent className="p-1.5">
              <p className="text-white/80 text-xs">
                {t('proceedToNextStep', 'You can proceed to the next step.')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="text-center">
        <h3 className="text-xs font-semibold text-white mb-0.5">
          {t('selectAddons', 'Select Add-ons')}
        </h3>
        <p className="text-white/70 text-xs">
          {t('enhanceYourPackage', 'Enhance your package with these optional add-ons')}
        </p>
      </div>

      <div className="space-y-1">
        {filteredAddons.map((addon) => {
          const isSelected = selectedAddons.includes(addon.addon_key);
          
          return (
            <Card key={addon.id} className="bg-gradient-to-br from-orange-500/20 to-purple-600/20 backdrop-blur-sm border border-orange-400/30 hover:border-orange-300/50 transition-colors">
              <CardContent className="p-1.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-1.5 flex-1">
                    <Toggle
                      pressed={isSelected}
                      onPressedChange={(pressed) => onAddonChange(addon.addon_key, pressed)}
                      size="sm"
                      className={`h-5 w-5 rounded-full p-0 transition-all duration-200 ${
                        isSelected 
                          ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg' 
                          : 'bg-white/20 hover:bg-white/30 border border-white/40 text-white/80'
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Plus className="w-3 h-3" />
                      )}
                    </Toggle>
                    <div className="flex-1">
                      <div className="flex items-center space-x-1 mb-0.5">
                        <Label className="font-semibold text-xs cursor-pointer text-white">
                          {t(addon.label_key)}
                        </Label>
                        <Badge variant="secondary" className={`${getAddonPrice(addon, currency) === 0 ? 'bg-green-500/80 text-white' : 'bg-purple-500/80 text-white'} text-xs px-1 py-0`}>
                          {formatAddonPrice(addon)}
                        </Badge>
                      </div>
                      {addon.description_key && (
                        <p className="text-xs text-white/80 mb-1">
                          {t(addon.description_key)}
                        </p>
                      )}
                      
                      {/* Render addon-specific fields when selected */}
                      {isSelected && addon.trigger_field_type && (
                        <div className="mt-1 p-1 bg-white/10 backdrop-blur-sm rounded-md border border-white/20">
                          {addon.trigger_field_type === 'file' && (
                            <div>
                              <Label className="text-xs font-medium mb-0.5 block text-white">
                                {t('uploadFiles')}
                              </Label>
                              <div className="border-2 border-dashed border-white/40 rounded-md p-1.5 text-center bg-white/5">
                                <Upload className="w-3 h-3 text-white/60 mx-auto mb-0.5" />
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
                                  className="cursor-pointer text-xs text-orange-300 hover:text-orange-200"
                                >
                                  {t('clickToUploadFiles')}
                                </label>
                                <p className="text-xs text-white/60 mt-0.5">
                                  {t('maxFiles')} {addon.trigger_field_config?.maxFiles || 10} {t('files')}, 
                                  {addon.trigger_field_config?.maxTotalSizeMb || 150}MB {t('totalSize')}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {addon.trigger_field_type === 'audio-recorder' && (
                            <div>
                              <Label className="text-xs font-medium mb-0.5 block text-white">
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
          );
        })}
      </div>

      {selectedAddons.length === 0 && (
        <div className="text-center">
          <Card className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-white/20">
            <CardContent className="p-1.5">
              <p className="text-white/80 text-xs">
                {t('noAddonsSelected', 'No add-ons selected. You can proceed without any add-ons or select some above.')}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AddonSelectionStep;
