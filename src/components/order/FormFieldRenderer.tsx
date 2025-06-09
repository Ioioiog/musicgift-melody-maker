import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Upload, AlertCircle } from 'lucide-react';
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
          <div className="space-y-3">
            <Input
              type={field.field_type}
              value={value || ''}
              onChange={e => isVatField ? handleVatCodeChange(e.target.value) : onChange(e.target.value)}
              placeholder={field.placeholder_key ? t(field.placeholder_key) : ''}
              required={field.required}
              className={cn(
                "h-12 text-base border-2 border-gray-300 bg-white focus:border-orange-500 focus:ring-orange-500 focus:bg-orange-50 transition-all duration-200",
                isVatField && vatError && "border-red-500 focus:border-red-500"
              )}
            />
            {isVatField && vatError && (
              <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-md">
                <AlertCircle className="w-4 h-4" />
                <span>{t(vatError === 'Cod TVA prea scurt' ? 'vatCodeTooShort' : 'vatCodeInvalidFormat')}</span>
              </div>
            )}
          </div>
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={field.placeholder_key ? t(field.placeholder_key) : ''}
            required={field.required}
            className="min-h-[120px] text-base border-2 border-gray-300 bg-white focus:border-orange-500 focus:ring-orange-500 focus:bg-orange-50 transition-all duration-200"
          />
        );

      case 'audio':
        return (
          <div className="space-y-3">
            <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
              <AudioRecorder
                value={value || null}
                onChange={audioFile => onChange(audioFile)}
                maxDuration={45}
              />
            </div>
            {field.placeholder_key && (
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                {t(field.placeholder_key)}
              </p>
            )}
          </div>
        );

      case 'select':
        if (!field.options || !Array.isArray(field.options)) {
          console.warn('Select field missing valid options:', field);
          return (
            <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-4 rounded-md border border-amber-200">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{t('fieldConfigurationError')}</span>
            </div>
          );
        }
        return (
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger className="h-12 text-base border-2 border-gray-300 bg-white focus:border-orange-500 focus:ring-orange-500 transition-all duration-200">
              <SelectValue placeholder={field.placeholder_key ? t(field.placeholder_key) : t('selectOption')} />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-gray-300">
              {field.options.map((option, index) => {
                const optionValue = typeof option === 'string' ? option : option.value;
                const optionLabel = typeof option === 'string' ? option : option.label_key;
                return (
                  <SelectItem key={`${optionValue}-${index}`} value={optionValue} className="text-base">
                    {t(optionLabel) || optionLabel}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-start space-x-3 bg-white border-2 border-gray-300 rounded-lg p-4 hover:border-orange-300 transition-all duration-200">
            <Checkbox
              checked={value || false}
              onCheckedChange={onChange}
              required={field.required}
              className="mt-1"
            />
            <Label className="text-base leading-relaxed cursor-pointer">
              {field.placeholder_key ? t(field.placeholder_key) : ''}
            </Label>
          </div>
        );

      case 'checkbox-group':
        const filteredAddons = availableAddons.filter(addon => shouldShowAddon(addon));
        
        if (filteredAddons.length === 0) {
          return (
            <div className="text-base text-gray-500 italic bg-gray-50 p-6 rounded-lg text-center">
              {t('noAddonsAvailable')}
            </div>
          );
        }

        return (
          <div className="space-y-6">
            {filteredAddons.map(addon => (
              <Card key={addon.id} className="border-2 border-gray-300 hover:border-orange-300 transition-all duration-200 shadow-sm hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Checkbox
                        checked={selectedAddons.includes(addon.addon_key)}
                        onCheckedChange={checked => onAddonChange(addon.addon_key, checked as boolean)}
                        className="mt-2"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Label className="font-bold text-lg cursor-pointer text-gray-800">
                            {t(addon.label_key)}
                          </Label>
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700 font-semibold px-3 py-1">
                            +{getAddonPrice(addon, currency)} {currency}
                          </Badge>
                        </div>
                        {addon.description_key && (
                          <p className="text-base text-gray-700 mb-4 leading-relaxed">
                            {t(addon.description_key)}
                          </p>
                        )}
                        
                        {/* Render addon-specific fields when selected */}
                        {selectedAddons.includes(addon.addon_key) && addon.trigger_field_type && (
                          <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                            {addon.trigger_field_type === 'file' && (
                              <div>
                                <Label className="text-base font-semibold mb-3 block text-gray-800">
                                  {t('uploadFiles')}
                                </Label>
                                <div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center bg-white hover:border-orange-400 transition-colors">
                                  <Upload className="w-10 h-10 text-orange-400 mx-auto mb-3" />
                                  <Input
                                    type="file"
                                    multiple
                                    accept={addon.trigger_field_config?.allowedTypes?.join(',')}
                                    onChange={e => handleFileUpload(e, addon.addon_key)}
                                    className="hidden"
                                    id={`file-${addon.addon_key}`}
                                  />
                                  <label
                                    htmlFor={`file-${addon.addon_key}`}
                                    className="cursor-pointer text-base text-orange-600 hover:text-orange-700 font-semibold"
                                  >
                                    {t('clickToUploadFiles')}
                                  </label>
                                  <p className="text-sm text-gray-600 mt-2">
                                    {t('maxFiles')} {addon.trigger_field_config?.maxFiles || 10} {t('files')}, 
                                    {addon.trigger_field_config?.maxTotalSizeMb || 150}MB {t('totalSize')}
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            {addon.trigger_field_type === 'audio-recorder' && (
                              <div>
                                <Label className="text-base font-semibold mb-3 block text-gray-800">
                                  {t('recordAudioMessage')}
                                </Label>
                                <div className="bg-white border-2 border-orange-200 rounded-lg p-4">
                                  <AudioRecorder
                                    value={addonFieldValues[addon.addon_key] || null}
                                    onChange={audioFile => onAddonFieldChange(addon.addon_key, audioFile)}
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
                  "w-full h-12 justify-start text-left font-normal border-2 border-gray-300 bg-white hover:border-orange-300 text-base",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-3 h-5 w-5" />
                {date ? format(date, "PPP") : (
                  <span>{field.placeholder_key ? t(field.placeholder_key) : t('pickDate')}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={selectedDate => {
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
          <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-4 rounded-md border border-amber-200">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{t('unknownFieldType').replace('{fieldType}', field.field_type)}</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-bold text-gray-800 block">
        {field.label_key ? t(field.label_key) : field.field_name === 'package' ? t('selectYourPackage') : field.field_name}
        {field.required && <span className="text-orange-500 ml-2 text-lg">*</span>}
      </Label>
      {renderField()}
    </div>
  );
};

export default FormFieldRenderer;
