
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

interface ContactLegalStepProps {
  formData: Record<string, any>;
  onInputChange: (field: string, value: any) => void;
  selectedAddons: string[];
  onAddonChange: (addonId: string, checked: boolean) => void;
  availableAddons: any[];
  addonFieldValues: Record<string, any>;
  onAddonFieldChange: (addonKey: string, fieldValue: any) => void;
  selectedPackage: string;
  selectedPackageData: any;
}

const ContactLegalStep: React.FC<ContactLegalStepProps> = ({
  formData,
  onInputChange
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-white">{t('contactDetailsStep', 'Contact Details & Legal')}</h2>
        <p className="text-white/70 text-sm mt-1">
          {t('fillContactAndLegalInfo', 'Fill in your contact details and accept the legal terms')}
        </p>
      </div>
      
      <Separator className="my-2 bg-white/20" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName" className="text-white/80">{t('fullName', 'Full Name')}</Label>
          <Input
            type="text"
            id="fullName"
            className="bg-white/10 border-white/30 text-white/80"
            value={formData.fullName || ''}
            onChange={(e) => onInputChange('fullName', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="invoiceType" className="text-white/80">{t('invoiceType', 'Invoice Type')}</Label>
          <select
            id="invoiceType"
            className="w-full bg-white/10 border-white/30 rounded px-3 py-2 text-white/80 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={formData.invoiceType || 'individual'}
            onChange={(e) => onInputChange('invoiceType', e.target.value)}
          >
            <option value="individual">{t('individual', 'Individual')}</option>
            <option value="company">{t('company', 'Company')}</option>
          </select>
        </div>

        {formData.invoiceType === 'company' ? (
          <>
            <div>
              <Label htmlFor="companyName" className="text-white/80">{t('companyName', 'Company Name')}</Label>
              <Input
                type="text"
                id="companyName"
                className="bg-white/10 border-white/30 text-white/80"
                value={formData.companyName || ''}
                onChange={(e) => onInputChange('companyName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="vatCode" className="text-white/80">{t('vatCode', 'VAT Code')}</Label>
              <Input
                type="text"
                id="vatCode"
                className="bg-white/10 border-white/30 text-white/80"
                value={formData.vatCode || ''}
                onChange={(e) => onInputChange('vatCode', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="registrationNumber" className="text-white/80">{t('registrationNumber', 'Registration Number')}</Label>
              <Input
                type="text"
                id="registrationNumber"
                className="bg-white/10 border-white/30 text-white/80"
                value={formData.registrationNumber || ''}
                onChange={(e) => onInputChange('registrationNumber', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="companyAddress" className="text-white/80">{t('companyAddress', 'Company Address')}</Label>
              <Input
                type="text"
                id="companyAddress"
                className="bg-white/10 border-white/30 text-white/80"
                value={formData.companyAddress || ''}
                onChange={(e) => onInputChange('companyAddress', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="representativeName" className="text-white/80">{t('representativeName', 'Representative Name')}</Label>
              <Input
                type="text"
                id="representativeName"
                className="bg-white/10 border-white/30 text-white/80"
                value={formData.representativeName || ''}
                onChange={(e) => onInputChange('representativeName', e.target.value)}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <Label htmlFor="address" className="text-white/80">{t('address', 'Address')}</Label>
              <Input
                type="text"
                id="address"
                className="bg-white/10 border-white/30 text-white/80"
                value={formData.address || ''}
                onChange={(e) => onInputChange('address', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="city" className="text-white/80">{t('city', 'City')}</Label>
              <Input
                type="text"
                id="city"
                className="bg-white/10 border-white/30 text-white/80"
                value={formData.city || ''}
                onChange={(e) => onInputChange('city', e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      <h3 className="text-lg font-semibold text-white mt-6">{t('confirmation', 'Legal Agreements')}</h3>
      <Separator className="my-2 bg-white/20" />

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="acceptMentionObligation"
            className="border-white/30 focus:ring-orange-500"
            checked={formData.acceptMentionObligation || false}
            onCheckedChange={(checked) => onInputChange('acceptMentionObligation', checked)}
          />
          <Label htmlFor="acceptMentionObligation" className="text-white/80 cursor-pointer">
            {t('acceptMentionObligation', 'I accept the mention obligation')}
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="acceptDistribution"
            className="border-white/30 focus:ring-orange-500"
            checked={formData.acceptDistribution || false}
            onCheckedChange={(checked) => onInputChange('acceptDistribution', checked)}
          />
          <Label htmlFor="acceptDistribution" className="text-white/80 cursor-pointer">
            {t('acceptDistribution', 'I accept distribution')}
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="finalNote"
            className="border-white/30 focus:ring-orange-500"
            checked={formData.finalNote || false}
            onCheckedChange={(checked) => onInputChange('finalNote', checked)}
          />
          <Label htmlFor="finalNote" className="text-white/80 cursor-pointer">
            {t('finalNote', 'I agree to final terms')}
          </Label>
        </div>
      </div>
    </div>
  );
};

export default ContactLegalStep;
