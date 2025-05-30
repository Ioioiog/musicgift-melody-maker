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
              <SelectTrigger className="h-14 bg-white border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-all duration-200 shadow-sm hover:shadow-md">
                <SelectValue placeholder={field.placeholder} className="text-gray-700" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 shadow-xl rounded-xl z-50">
                {packages.map((pkg) => (
                  <SelectItem 
                    key={pkg.value} 
                    value={pkg.value}
                    className="hover:bg-purple-50 focus:bg-purple-50 cursor-pointer py-3 px-4 transition-colors duration-150"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {pkg.value === 'personal' ? '🎁' : 
                         pkg.value === 'business' ? '💼' : 
                         pkg.value === 'premium' ? '🌟' : 
                         pkg.value === 'artist' ? '🎤' : 
                         pkg.value === 'instrumental' ? '🎶' : 
                         pkg.value === 'remix' ? '🔁' : '🎁'}
                      </span>
                      <span className="font-medium text-gray-800">{pkg.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        if (field.name === 'language') {
          return (
            <Select onValueChange={(value) => updateFormData(field.name, value)} value={formData[field.name]}>
              <SelectTrigger className="h-14 bg-white border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-all duration-200 shadow-sm hover:shadow-md">
                <SelectValue placeholder={field.placeholder} className="text-gray-700" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 shadow-xl rounded-xl z-50">
                {languages.map((lang) => (
                  <SelectItem 
                    key={lang.value} 
                    value={lang.value}
                    className="hover:bg-purple-50 focus:bg-purple-50 cursor-pointer py-3 px-4 transition-colors duration-150"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium text-gray-800">{lang.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        if (field.name === 'occasion') {
          return (
            <Select onValueChange={(value) => updateFormData(field.name, value)} value={formData[field.name]}>
              <SelectTrigger className="h-14 bg-white border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-all duration-200 shadow-sm hover:shadow-md">
                <SelectValue placeholder={field.placeholder} className="text-gray-700" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 shadow-xl rounded-xl z-50">
                {field.options?.map((option: string) => (
                  <SelectItem 
                    key={option} 
                    value={option.toLowerCase()}
                    className="hover:bg-purple-50 focus:bg-purple-50 cursor-pointer py-3 px-4 transition-colors duration-150"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">
                        {option === 'Birthday' ? '🎂' :
                         option === 'Anniversary' ? '💕' :
                         option === 'Wedding' ? '💒' :
                         option === 'Graduation' ? '🎓' :
                         option === 'Valentine\'s Day' ? '💝' :
                         option === 'Christmas' ? '🎄' :
                         option === 'Other' ? '🎉' : '🎁'}
                      </span>
                      <span className="font-medium text-gray-800">{option}</span>
                    </div>
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
