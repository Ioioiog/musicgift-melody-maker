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
import AudioRecorder from './AudioRecorder';

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

interface Addon {
  id: string;
  addon_key: string;
  label_key: string;
  description_key?: string;
  price: number;
  is_active: boolean;
  trigger_field_type?: string;
  trigger_field_config: any;
  trigger_condition: string;
  trigger_condition_value?: string;
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
  selectedPackage = ''
}) => {
  const { t } = useLanguage();
  const [date, setDate] = useState<Date>();

  // Helper function to check if addon should be shown based on trigger condition
  const shouldShowAddon = (addon: Addon, selectedPackage: string) => {
    if (!addon.is_active) return false;
    
    if (addon.trigger_condition === 'always') return true;
    
    if (addon.trigger_condition === 'package_equals') {
      return addon.trigger_condition_value === selectedPackage;
    }
    
    if (addon.trigger_condition === 'package_in') {
      const allowedPackages = addon.trigger_condition_value?.split(',') || [];
      return allowedPackages.includes(selectedPackage);
    }
    
    return false;
  };

  // Updated getSelectedPackage function
  const getSelectedPackage = () => {
    // Use the selectedPackage prop first, then fall back to field value
    if (selectedPackage) return selectedPackage;
    return field.field_name === 'package' ? value : '';
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

  const renderField = () => {
    switch (field.field_type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'url':
        return (
          <Input
            type={field.field_type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder_key ? t(field.placeholder_key) : ''}
            required={field.required}
            className="w-full"
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder_key ? t(field.placeholder_key) : ''}
            required={field.required}
            className="min-h-[100px] w-full"
          />
        );

      case 'audio':
        return (
          <div className="space-y-2">
            <AudioRecorder
              value={value || null}
              onChange={(audioFile) => onChange(audioFile)}
              maxDuration={45}
            />
            {field.placeholder_key && (
              <p className="text-sm text-gray-600">
                {t(field.placeholder_key)}
              </p>
            )}
          </div>
        );

      case 'select':
        // Validate that options exist and are properly formatted
        if (!field.options || !Array.isArray(field.options)) {
          console.warn('Select field missing valid options:', field);
          return (
            <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-md">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{t('fieldConfigurationError')}</span>
            </div>
          );
        }

        return (
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={field.placeholder_key ? t(field.placeholder_key) : t('selectOption')} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((option, index) => {
                // Ensure option has proper structure
                const optionValue = typeof option === 'string' ? option : option.value;
                const optionLabel = typeof option === 'string' ? option : option.label_key;
                
                return (
                  <SelectItem key={`${optionValue}-${index}`} value={optionValue}>
                    {t(optionLabel) || optionLabel}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={value || false}
              onCheckedChange={onChange}
              required={field.required}
            />
            <Label className="text-sm">
              {field.placeholder_key ? t(field.placeholder_key) : ''}
            </Label>
          </div>
        );

      case 'checkbox-group':
        const selectedPackage = getSelectedPackage();
        const filteredAddons = availableAddons.filter(addon => shouldShowAddon(addon, selectedPackage));
        
        console.log('Rendering addon checkbox group:', {
          selectedPackage,
          availableAddons,
          filteredAddons
        });
        
        if (filteredAddons.length === 0) {
          return (
            <div className="text-sm text-gray-500 italic">
              {t('noAddonsAvailable')}
            </div>
          );
        }
        
        return (
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
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            +{addon.price} RON
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
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>{field.placeholder_key ? t(field.placeholder_key) : t('pickDate')}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
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
          <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-md">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{t('unknownFieldType').replace('{fieldType}', field.field_type)}</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">
        {field.label_key ? t(field.label_key) : field.field_name === 'package' ? t('selectYourPackage') : field.field_name}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {renderField()}
    </div>
  );
};

export default FormFieldRenderer;
