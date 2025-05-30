
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { packages, languages, addons } from '@/data/packages';

interface FormFieldRendererProps {
  field: any;
  formData: any;
  selectedAddons: string[];
  updateFormData: (field: string, value: any) => void;
  handleAddonChange: (addonId: string, checked: boolean) => void;
}

const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
  field,
  formData,
  selectedAddons,
  updateFormData,
  handleAddonChange
}) => {
  const renderField = () => {
    switch (field.type) {
      case 'select':
        if (field.name === 'package') {
          return (
            <Select onValueChange={(value) => updateFormData(field.name, value)} value={formData[field.name]}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {packages.map((pkg) => (
                  <SelectItem key={pkg.value} value={pkg.value}>
                    {pkg.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        if (field.name === 'language') {
          return (
            <Select onValueChange={(value) => updateFormData(field.name, value)} value={formData[field.name]}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        if (field.name === 'occasion') {
          return (
            <Select onValueChange={(value) => updateFormData(field.name, value)} value={formData[field.name]}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option: string) => (
                  <SelectItem key={option} value={option.toLowerCase()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        break;

      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={(e) => updateFormData(field.name, e.target.value)}
            className="min-h-[120px] resize-none"
          />
        );

      case 'checkbox-group':
        return (
          <div className="space-y-4">
            {field.options?.map((addonId: string) => {
              const addon = addons[addonId as keyof typeof addons];
              return addon ? (
                <div key={addonId} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id={addonId}
                    checked={selectedAddons.includes(addonId)}
                    onCheckedChange={(checked) => handleAddonChange(addonId, checked as boolean)}
                  />
                  <Label htmlFor={addonId} className="flex-1 cursor-pointer">
                    <span className="font-medium">{addon.label}</span>
                    <span className="text-gray-600 ml-2">+{addon.price} RON</span>
                  </Label>
                </div>
              ) : null;
            })}
          </div>
        );

      case 'checkbox':
        return (
          <div className="flex items-start space-x-3">
            <Checkbox
              id={field.name}
              checked={formData[field.name]}
              onCheckedChange={(checked) => updateFormData(field.name, checked)}
              className="mt-1"
            />
            <Label htmlFor={field.name} className="text-sm leading-relaxed cursor-pointer">
              {field.placeholder}
            </Label>
          </div>
        );

      default:
        return (
          <Input
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={(e) => updateFormData(field.name, e.target.value)}
            className="h-12"
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">
        {field.placeholder} {field.required && <span className="text-red-500">*</span>}
      </Label>
      {renderField()}
    </div>
  );
};

export default FormFieldRenderer;
