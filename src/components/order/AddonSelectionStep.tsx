import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, Plus, Check, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getAddonPrice } from '@/utils/pricing';
import { Addon, Package } from '@/types';
import AudioRecorder from './AudioRecorder';
import { uploadFile, uploadMultipleFiles } from '@/utils/fileUpload';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});

  // Filter addons based on the selected package
  const shouldShowAddon = (addon: Addon) => {
    if (!addon.is_active) return false;
    
    if (selectedPackageData) {
      return selectedPackageData.available_addons.includes(addon.addon_key);
    }
    
    return false;
  };

  const filteredAddons = availableAddons.filter(addon => shouldShowAddon(addon));

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, addonKey: string) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingFiles(prev => ({ ...prev, [addonKey]: true }));
    
    try {
      // Upload all files
      const fileArray = Array.from(files);
      const uploadResults = await uploadMultipleFiles(fileArray, addonKey);
      
      // Store file URLs in addon field values
      onAddonFieldChange(addonKey, uploadResults.map(result => ({
        url: result.url,
        fileName: result.fileName,
        fileType: result.fileType,
        fileSize: result.fileSize,
        path: result.path
      })));
      
      toast({
        title: t('filesUploaded', 'Files uploaded'),
        description: t('filesUploadedSuccessfully', `${fileArray.length} file(s) uploaded successfully`),
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: t('uploadError', 'Upload Error'),
        description: t('uploadErrorMessage', 'There was an error uploading your files. Please try again.'),
        variant: 'destructive'
      });
    } finally {
      setUploadingFiles(prev => ({ ...prev, [addonKey]: false }));
      
      // Reset the file input to allow uploading the same file again
      event.target.value = '';
    }
  };

  const handleAudioRecording = async (audioBlob: Blob, addonKey: string) => {
    setUploadingFiles(prev => ({ ...prev, [addonKey]: true }));
    
    try {
      // Upload audio recording
      const result = await uploadFile(audioBlob, addonKey);
      
      // Store audio URL in addon field values
      onAddonFieldChange(addonKey, {
        url: result.url,
        fileName: result.fileName,
        fileType: result.fileType,
        fileSize: result.fileSize,
        path: result.path
      });
      
      toast({
        title: t('audioSaved', 'Audio Saved'),
        description: t('audioSavedSuccessfully', 'Your audio recording has been saved successfully'),
      });
    } catch (error) {
      console.error('Error uploading audio:', error);
      toast({
        title: t('uploadError', 'Upload Error'),
        description: t('audioUploadErrorMessage', 'There was an error saving your audio recording. Please try again.'),
        variant: 'destructive'
      });
    } finally {
      setUploadingFiles(prev => ({ ...prev, [addonKey]: false }));
    }
  };

  const formatAddonPrice = (addon: Addon) => {
    const price = getAddonPrice(addon, currency);
    if (price === 0) {
      return "FREE";
    }
    return `+${price} ${currency}`;
  };

  // Check if Godparents Melody addon is selected - FIXED KEY
  const isGodparentsAddonSelected = selectedAddons.includes('godparentsMelody');

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
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
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
            <Card key={addon.id} className="bg-white/10 backdrop-blur-sm border border-white/30 hover:border-white/40 transition-colors">
              <CardContent className="p-1.5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-1.5 flex-1">
                    <Toggle
                      pressed={isSelected}
                      onPressedChange={(pressed) => onAddonChange(addon.addon_key, pressed)}
                      size="sm"
                      className={`h-4 w-4 rounded-full p-0 transition-all duration-200 ${
                        isSelected 
                          ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg' 
                          : 'bg-white/20 hover:bg-white/30 border border-white/40 text-white/80'
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-2.5 h-2.5" />
                      ) : (
                        <Plus className="w-2.5 h-2.5" />
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
                                  disabled={uploadingFiles[addon.addon_key]}
                                />
                                <label
                                  htmlFor={`file-${addon.addon_key}`}
                                  className={`cursor-pointer text-xs text-orange-300 hover:text-orange-200 ${uploadingFiles[addon.addon_key] ? 'opacity-50' : ''}`}
                                >
                                  {uploadingFiles[addon.addon_key] ? (
                                    <span className="flex items-center justify-center">
                                      <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                      {t('uploadingFiles')}
                                    </span>
                                  ) : (
                                    t('clickToUploadFiles')
                                  )}
                                </label>
                                <p className="text-xs text-white/60 mt-0.5">
                                  {t('maxFiles')} {addon.trigger_field_config?.maxFiles || 10} {t('files')}, 
                                  {addon.trigger_field_config?.maxTotalSizeMb || 150}MB {t('totalSize')}
                                </p>
                                
                                {/* Display uploaded files */}
                                {addonFieldValues[addon.addon_key] && Array.isArray(addonFieldValues[addon.addon_key]) && addonFieldValues[addon.addon_key].length > 0 && (
                                  <div className="mt-2 border-t border-white/10 pt-1.5">
                                    <p className="text-xs font-medium text-white mb-1">{t('uploadedFiles')}:</p>
                                    <ul className="text-xs text-white/80">
                                      {addonFieldValues[addon.addon_key].map((file: any, index: number) => (
                                        <li key={index} className="flex items-center space-x-1">
                                          <Check className="w-3 h-3 text-green-400" />
                                          <span className="truncate">{file.fileName}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {addon.trigger_field_type === 'audio-recorder' && (
                            <div>
                              <Label className="text-xs font-medium mb-0.5 block text-white">
                                {t('recordAudioMessage')}
                              </Label>
                              <AudioRecorder
                                value={addonFieldValues[addon.addon_key] ? new File([new Blob()], "audio.webm", { type: "audio/webm" }) : null}
                                onChange={(audioBlob) => handleAudioRecording(audioBlob, addon.addon_key)}
                                maxDuration={addon.trigger_field_config?.maxDuration || 30}
                                disabled={uploadingFiles[addon.addon_key]}
                              />
                              
                              {/* Display uploaded audio */}
                              {addonFieldValues[addon.addon_key] && addonFieldValues[addon.addon_key].url && (
                                <div className="mt-2 border-t border-white/10 pt-1.5">
                                  <p className="text-xs font-medium text-white mb-1">{t('savedAudio')}:</p>
                                  <div className="flex items-center space-x-2">
                                    <Check className="w-3 h-3 text-green-400" />
                                    <span className="text-xs text-white/80">{t('audioSavedSuccessfully')}</span>
                                  </div>
                                  <audio controls className="w-full mt-2 h-8" src={addonFieldValues[addon.addon_key].url} />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Social Media Rights Agreement - Show within this addon's card */}
                      {isSelected && addon.addon_key === 'socialMediaRights' && (
                        <div className="mt-1 p-1 bg-white/10 backdrop-blur-sm rounded-md border border-white/20">
                          <div className="flex items-start space-x-2">
                            <Checkbox
                              id="social-media-agreement"
                              checked={addonFieldValues.social_media_agreement || false}
                              onCheckedChange={(checked) => onAddonFieldChange('social_media_agreement', checked)}
                              className="mt-0.5"
                            />
                            <Label 
                              htmlFor="social-media-agreement" 
                              className="text-xs text-white cursor-pointer leading-relaxed"
                            >
                              I accept if I post the song on any social media platform I will tag 'Music Gift by Mango Records'.
                            </Label>
                          </div>
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

      {/* Godparents Details Section - Conditional */}
      {isGodparentsAddonSelected && (
        <Card className="bg-white/10 backdrop-blur-sm border border-orange-400/50 mt-2">
          <CardContent className="p-2">
            <h4 className="text-sm font-semibold text-white mb-2 flex items-center">
              <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
              Godparents Details
            </h4>
            
            <div className="space-y-2">
              {/* Godparents Names - Required */}
              <div>
                <Label className="text-xs font-medium text-white mb-1 block">
                  Godparents Names <span className="text-red-400">*</span>
                </Label>
                <Input
                  value={addonFieldValues.godparents_names || ''}
                  onChange={(e) => onAddonFieldChange('godparents_names', e.target.value)}
                  placeholder="Enter the godparents' full names"
                  className="bg-white/20 border-white/30 text-white placeholder-white/60 text-xs h-8"
                  required
                />
              </div>

              {/* Godparents Names Pronunciation - Optional */}
              <div>
                <Label className="text-xs font-medium text-white mb-1 block">
                  Godparents Names Pronunciation (Optional)
                </Label>
                <AudioRecorder
                  value={addonFieldValues.godparents_pronunciation?.url ? new File([new Blob()], "audio.webm", { type: "audio/webm" }) : null}
                  onChange={(audioBlob) => handleAudioRecording(audioBlob, 'godparents_pronunciation')}
                  maxDuration={30}
                  className="text-xs"
                  disabled={uploadingFiles['godparents_pronunciation']}
                />
                
                {/* Display uploaded audio */}
                {addonFieldValues.godparents_pronunciation && addonFieldValues.godparents_pronunciation.url && (
                  <div className="mt-2 border-t border-white/10 pt-1.5">
                    <p className="text-xs font-medium text-white mb-1">{t('savedAudio')}:</p>
                    <audio controls className="w-full mt-2 h-8" src={addonFieldValues.godparents_pronunciation.url} />
                  </div>
                )}
              </div>

              {/* Godparents Relationship to Couple - Required */}
              <div>
                <Label className="text-xs font-medium text-white mb-1 block">
                  How do you know the godparents? <span className="text-red-400">*</span>
                </Label>
                <Input
                  value={addonFieldValues.godparents_relationship || ''}
                  onChange={(e) => onAddonFieldChange('godparents_relationship', e.target.value)}
                  placeholder="e.g., Best friends since college, Family members, etc."
                  className="bg-white/20 border-white/30 text-white placeholder-white/60 text-xs h-8"
                  required
                />
              </div>

              {/* Godparents Special Qualities - Required */}
              <div>
                <Label className="text-xs font-medium text-white mb-1 block">
                  What makes them special as godparents? <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  value={addonFieldValues.godparents_qualities || ''}
                  onChange={(e) => onAddonFieldChange('godparents_qualities', e.target.value)}
                  placeholder="Describe their special qualities, values, and what makes them perfect for this role..."
                  className="bg-white/20 border-white/30 text-white placeholder-white/60 text-xs min-h-[60px] resize-none"
                  rows={3}
                  required
                />
              </div>

              {/* Godparents Role in Wedding - Optional */}
              <div>
                <Label className="text-xs font-medium text-white mb-1 block">
                  Their specific role in the ceremony (Optional)
                </Label>
                <Textarea
                  value={addonFieldValues.godparents_role || ''}
                  onChange={(e) => onAddonFieldChange('godparents_role', e.target.value)}
                  placeholder="Will they be giving readings, holding rings, special blessings, etc.?"
                  className="bg-white/20 border-white/30 text-white placeholder-white/60 text-xs min-h-[50px] resize-none"
                  rows={2}
                />
              </div>

              {/* Message to Godparents - Required */}
              <div>
                <Label className="text-xs font-medium text-white mb-1 block">
                  What you want to express to them <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  value={addonFieldValues.godparents_message || ''}
                  onChange={(e) => onAddonFieldChange('godparents_message', e.target.value)}
                  placeholder="Your heartfelt message to the godparents - gratitude, hopes, promises..."
                  className="bg-white/20 border-white/30 text-white placeholder-white/60 text-xs min-h-[60px] resize-none"
                  rows={3}
                  required
                />
              </div>

              {/* Godparents Melody Style - Required */}
              <div>
                <Label className="text-xs font-medium text-white mb-1 block">
                  Godparents Melody Style <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  value={addonFieldValues.godparents_melody_style || ''}
                  onChange={(e) => onAddonFieldChange('godparents_melody_style', e.target.value)}
                  placeholder="Same as Main Song, Different Style, Instrumental Only? Do you have a YouTube link to a similar song?"
                  className="bg-white/20 border-white/30 text-white placeholder-white/60 text-xs min-h-[60px] resize-none"
                  rows={3}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedAddons.length === 0 && (
        <div className="text-center">
          <Card className="bg-white/10 backdrop-blur-sm border border-white/20">
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
