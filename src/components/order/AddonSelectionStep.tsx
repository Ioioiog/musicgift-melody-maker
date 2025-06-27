
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { getAddonPrice } from '@/utils/pricing';
import { ImageUpload } from '@/components/ui/image-upload';
import AudioRecorder from './AudioRecorder';

interface AddonSelectionStepProps {
  selectedAddons: string[];
  onAddonChange: (addonId: string, checked: boolean) => void;
  availableAddons: any[];
  selectedPackageData: any;
  addonFieldValues: Record<string, any>;
  onAddonFieldChange: (addonKey: string, fieldValue: any) => void;
}

const AddonSelectionStep: React.FC<AddonSelectionStepProps> = ({
  selectedAddons,
  onAddonChange,
  availableAddons,
  selectedPackageData,
  addonFieldValues,
  onAddonFieldChange
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

  // Helper function to render dynamic addon fields
  const renderAddonField = (addon: any) => {
    if (!selectedAddons.includes(addon.addon_key)) return null;
    if (!addon.trigger_field_type) return null;

    const fieldValue = addonFieldValues[addon.addon_key];
    const config = addon.trigger_field_config || {};

    switch (addon.trigger_field_type) {
      case 'file':
        // For custom video addon - supports both images and videos
        return (
          <div className="mt-4 pt-4 border-t border-white/20">
            <Label className="text-white/90 text-sm mb-2 block">
              {t('uploadCustomContent', 'Upload your custom content')}
            </Label>
            <ImageUpload
              value={fieldValue || ''}
              onChange={(url) => onAddonFieldChange(addon.addon_key, url)}
              label={t('selectFile', 'Select file')}
              bucketName="order-attachments"
              maxSizeBytes={config.max_size || 50 * 1024 * 1024} // 50MB default
              acceptedTypes={config.accepted_types || [
                'image/jpeg', 'image/png', 'image/webp', 'image/gif',
                'video/mp4', 'video/webm', 'video/quicktime'
              ]}
            />
            {config.description && (
              <p className="text-white/60 text-xs mt-2">
                {t(config.description) || config.description}
              </p>
            )}
          </div>
        );

      case 'audio-recorder':
        // For audio message addon
        return (
          <div className="mt-4 pt-4 border-t border-white/20">
            <Label className="text-white/90 text-sm mb-2 block">
              {t('recordAudioMessage', 'Record your audio message')}
            </Label>
            <AudioRecorder
              value={fieldValue || null}
              onChange={(audioBlob) => onAddonFieldChange(addon.addon_key, audioBlob)}
              maxDuration={config.max_duration || 45} // 45 seconds default
              className="bg-white/5 border-white/20"
            />
            {config.description && (
              <p className="text-white/60 text-xs mt-2">
                {t(config.description) || config.description}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

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
            const isSelected = selectedAddons.includes(addon.addon_key);
            
            return (
              <Card key={addon.addon_key} className={`bg-white/10 backdrop-blur-sm border transition-all hover:bg-white/15 ${
                isSelected 
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
                          checked={isSelected}
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

                    {/* Description - Fixed to use description_key */}
                    {addon.description_key && (
                      <p className="text-white/70 text-sm leading-relaxed">
                        {t(addon.description_key) || addon.description_key}
                      </p>
                    )}

                    {/* Trigger field info for upload/record addons */}
                    {addon.trigger_field_type === 'file' && (
                      <div className="text-white/60 text-xs">
                        <span className="inline-block bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                          {t('requiresFileUpload', 'Requires file upload')}
                        </span>
                      </div>
                    )}

                    {addon.trigger_field_type === 'audio-recorder' && (
                      <div className="text-white/60 text-xs">
                        <span className="inline-block bg-green-500/20 text-green-300 px-2 py-1 rounded">
                          {t('requiresAudioRecording', 'Requires audio recording')}
                        </span>
                      </div>
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

                    {/* Dynamic addon fields for upload/record */}
                    {renderAddonField(addon)}
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
