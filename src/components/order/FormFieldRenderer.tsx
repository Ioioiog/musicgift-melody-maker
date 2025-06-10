import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Toggle } from '@/components/ui/toggle';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Upload, AlertCircle, Plus, Check } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getAddonPrice } from '@/utils/pricing';
import { Addon, Package } from '@/types';
import AudioRecorder from './AudioRecorder';
import { getVatValidationError } from '@/utils/vatValidation';

interface FieldOption {
  value: string;
  label_key: string;
}
interface Field {
  id: string;
  field_name: string;
  field_type: string;
  label_key?: string;
  placeholder_key?: string;
  required: boolean;
  field_order: number;
  options?: FieldOption[];
}
interface FormFieldRendererProps {
  field: Field;
  value: any;
  onChange: (value: any) => void;
  selectedAddons: string[];
  onAddonChange: (addonId: string, checked: boolean) => void;
  availableAddons: Addon[];
  addonFieldValues: any;
  onAddonFieldChange: (addonKey: string, fieldValue: any) => void;
  selectedPackage?: string;
  selectedPackageData?: Package;
  formData?: any;
}
const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
  field,
  value,
  onChange,
  selectedAddons,
  onAddonChange,
  availableAddons,
  addonFieldValues,
  onAddonFieldChange,
  selectedPackage = '',
  selectedPackageData,
  formData = {}
}) => {
  const {
    t
  } = useLanguage();
  const {
    currency
  } = useCurrency();
  const [date, setDate] = useState<Date>();
  const [vatError, setVatError] = useState<string | null>(null);

  // Helper function to check if addon should be shown based on package's available_addons
  const shouldShowAddon = (addon: Addon) => {
    if (!addon.is_active) return false;

    // Use the passed package data if available
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
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, addonKey: string) => {
    const files = event.target.files;
    if (files) {
      onAddonFieldChange(addonKey, Array.from(files));
    }
  };
  const handleAudioRecording = (audioBlob: Blob, addonKey: string) => {
    onAddonFieldChange(addonKey, audioBlob);
  };
  const handleVatCodeChange = (vatCode: string) => {
    onChange(vatCode);

    // Only validate if the field is VAT code and there's a value
    if (field.field_name === 'vatCode' && vatCode) {
      const error = getVatValidationError(vatCode);
      setVatError(error);
    } else {
      setVatError(null);
    }
  };

  // Check if current field is a company field and if invoice type is company
  const isCompanyField = ['companyName', 'vatCode', 'registrationNumber', 'companyAddress', 'representativeName'].includes(field.field_name);
  const isCompanyInvoice = formData?.invoiceType === 'company';

  // Don't render company fields if invoice type is not company
  if (isCompanyField && !isCompanyInvoice) {
    return null;
  }
  const renderField = () => {
    switch (field.field_type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
        const isVatField = field.field_name === 'vatCode';
        return (
          <div className="space-y-1">
            <Input
              type={field.field_type}
              value={value || ''}
              onChange={(e) => isVatField ? handleVatCodeChange(e.target.value) : onChange(e.target.value)}
              placeholder={field.placeholder_key ? t(field.placeholder_key) : ''}
              required={field.required}
              className={cn(
                "h-8 text-sm border-2 border-white/30 bg-white/10 focus:border-orange-500 focus:ring-orange-500 focus:bg-white/20 transition-all duration-200 text-white placeholder:text-white/60",
                isVatField && vatError && "border-red-500 focus:border-red-500"
              )}
            />
            {isVatField && vatError && (
              <div className="flex items-center space-x-2 text-red-300 text-xs bg-red-500/20 p-1.5 rounded-md border border-red-400/30">
                <AlertCircle className="w-3 h-3" />
                <span>{t(vatError === 'Cod TVA prea scurt' ? 'vatCodeTooShort' : 'vatCodeInvalidFormat')}</span>
              </div>
            )}
          </div>
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder_key ? t(field.placeholder_key) : ''}
            required={field.required}
            className="min-h-[60px] text-sm border-2 border-white/30 bg-white/10 focus:border-orange-500 focus:ring-orange-500 focus:bg-white/20 transition-all duration-200 text-white placeholder:text-white/60"
          />
        );

      case 'audio':
        return (
          <div className="space-y-1">
            <div className="bg-white/10 border-2 border-white/30 rounded-lg p-2">
              <AudioRecorder
                value={value || null}
                onChange={(audioFile) => onChange(audioFile)}
                maxDuration={45}
              />
            </div>
            {field.placeholder_key && (
              <p className="text-xs text-white/70 bg-white/10 p-1.5 rounded-md">
                {t(field.placeholder_key)}
              </p>
            )}
          </div>
        );

      case 'select':
        if (!field.options || !Array.isArray(field.options)) {
          console.warn('Select field missing valid options:', field);
          return (
            <div className="flex items-center space-x-2 text-amber-300 bg-amber-500/20 p-2 rounded-md border border-amber-400/30">
              <AlertCircle className="w-3 h-3" />
              <span className="text-xs">{t('fieldConfigurationError')}</span>
            </div>
          );
        }
        return (
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger className="h-8 text-sm border-2 border-white/30 bg-white/10 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200 text-white">
              <SelectValue placeholder={field.placeholder_key ? t(field.placeholder_key) : t('selectOption')} />
            </SelectTrigger>
            <SelectContent className="bg-white/90 backdrop-blur-md border-2 border-white/40">
              {field.options.map((option, index) => {
                const optionValue = typeof option === 'string' ? option : option.value;
                const optionLabel = typeof option === 'string' ? option : option.label_key;
                return (
                  <SelectItem key={`${optionValue}-${index}`} value={optionValue} className="text-sm">
                    {t(optionLabel) || optionLabel}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-start space-x-2 bg-transparent rounded-lg p-1 hover:bg-white/5 transition-all duration-200 py-0">
            <Toggle
              pressed={value || false}
              onPressedChange={onChange}
              size="sm"
              className={`h-4 w-4 rounded-full p-0 transition-all duration-200 ${
                value 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg' 
                  : 'bg-white/20 hover:bg-white/30 border border-white/40 text-white/60'
              }`}
            >
              {value ? <Check className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
            </Toggle>
            <Label className="text-xs leading-relaxed cursor-pointer text-white/90">
              {field.placeholder_key ? t(field.placeholder_key) : ''}
            </Label>
          </div>
        );

      case 'checkbox-group':
        const filteredAddons = availableAddons.filter(addon => shouldShowAddon(addon));
        if (filteredAddons.length === 0) {
          return (
            <div className="text-xs text-white/60 italic bg-white/10 p-3 rounded-lg text-center border border-white/20">
              {t('noAddonsAvailable')}
            </div>
          );
        }
        return (
          <div className="space-y-2">
            {filteredAddons.map((addon) => (
              <Card key={addon.id} className="border-2 border-white/30 hover:border-white/40 transition-all duration-200 shadow-sm hover:shadow-md bg-white/10 backdrop-blur-sm">
                <CardContent className="p-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2 flex-1">
                      <Checkbox
                        checked={selectedAddons.includes(addon.addon_key)}
                        onCheckedChange={(checked) => onAddonChange(addon.addon_key, checked as boolean)}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-1.5 mb-1">
                          <Label className="font-bold text-sm cursor-pointer text-white">
                            {t(addon.label_key)}
                          </Label>
                          <Badge variant="secondary" className="bg-orange-500/80 text-white font-semibold px-1.5 py-0.5 text-xs">
                            +{getAddonPrice(addon, currency)} {currency}
                          </Badge>
                        </div>
                        {addon.description_key && (
                          <p className="text-xs text-white/80 mb-2 leading-relaxed">
                            {t(addon.description_key)}
                          </p>
                        )}
                        
                        {/* Render addon-specific fields when selected */}
                        {selectedAddons.includes(addon.addon_key) && addon.trigger_field_type && (
                          <div className="mt-2 p-2 bg-white/10 rounded-lg border border-white/20">
                            {addon.trigger_field_type === 'file' && (
                              <div>
                                <Label className="text-xs font-semibold mb-1 block text-white">
                                  {t('uploadFiles')}
                                </Label>
                                <div className="border-2 border-dashed border-white/40 rounded-lg p-2 text-center bg-white/5 hover:border-white/50 transition-colors">
                                  <Upload className="w-6 h-6 text-white/60 mx-auto mb-1" />
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
                                    className="cursor-pointer text-xs text-orange-300 hover:text-orange-200 font-semibold"
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
                                <Label className="text-xs font-semibold mb-1 block text-white">
                                  {t('recordAudioMessage')}
                                </Label>
                                <div className="bg-white/10 border-2 border-white/30 rounded-lg p-2">
                                  <AudioRecorder
                                    value={addonFieldValues[addon.addon_key] || null}
                                    onChange={(audioFile) => onAddonFieldChange(addon.addon_key, audioFile)}
                                    maxDuration={addon.trigger_field_config?.maxDuration || 30}
                                  />
                                </div>
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
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-4 justify-start text-left font-normal border-2 border-white/30 bg-white/10 hover:border-white/40 text-xs text-white",
                  !date && "text-white/60"
                )}
              >
                <CalendarIcon className="mr-2 h-3 w-3" />
                {date ? format(date, "PPP") : <span>{field.placeholder_key ? t(field.placeholder_key) : t('pickDate')}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  setDate(selectedDate);
                  onChange(selectedDate);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      default:
        console.warn('Unknown field type:', field.field_type);
        return (
          <div className="flex items-center space-x-2 text-amber-300 bg-amber-500/20 p-2 rounded-md border border-amber-400/30">
            <AlertCircle className="w-3 h-3" />
            <span className="text-xs">{t('unknownFieldType').replace('{fieldType}', field.field_type)}</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-1">
      <Label className="text-xs font-bold text-white block my-[6px] py-0">
        {field.label_key ? t(field.label_key) : field.field_name === 'package' ? t('selectYourPackage') : field.field_name}
        {field.required && <span className="text-orange-400 ml-1 text-sm">*</span>}
      </Label>
      {renderField()}
    </div>
  );
};

export default FormFieldRenderer;
