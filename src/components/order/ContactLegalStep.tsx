import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle } from 'lucide-react';
interface ContactLegalStepProps {
  formData: Record<string, any>;
  onInputChange: (field: string, value: any) => void;
  errors?: Record<string, string>;
}
const ContactLegalStep: React.FC<ContactLegalStepProps> = ({
  formData,
  onInputChange,
  errors = {}
}) => {
  const {
    t
  } = useLanguage();
  const hasError = (fieldName: string) => Boolean(errors[fieldName]);
  const getErrorClass = (fieldName: string) => hasError(fieldName) ? 'border-red-500 bg-red-500/10' : 'bg-white/10 border-white/30';
  return <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-white">{t('contactDetailsStep', 'Contact Details & Legal')}</h2>
        <p className="text-white/70 text-sm mt-1">
          {t('fillContactAndLegalInfo', 'Fill in your contact details and accept the legal terms')}
        </p>
      </div>
      
      <Separator className="my-2 bg-white/20" />

      {/* Contact Information Section */}
      <Card className="bg-white/10 backdrop-blur-sm border border-white/30">
        <CardContent className="p-4">
          <h3 className="text-md font-semibold text-white mb-4">{t('contactInformation', 'Contact Information')}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName" className="text-white/80 flex items-center gap-1">
                {t('fullName', 'Full Name')} <span className="text-red-400">*</span>
              </Label>
              <Input type="text" id="fullName" className={getErrorClass('fullName')} value={formData.fullName || ''} onChange={e => onInputChange('fullName', e.target.value)} placeholder={t('enterFullName', 'Enter your full name')} />
              {hasError('fullName') && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <Label htmlFor="invoiceType" className="text-white/80 flex items-center gap-1">
                {t('invoiceType', 'Invoice Type')} <span className="text-red-400">*</span>
              </Label>
              <select id="invoiceType" className={`w-full rounded px-3 py-2 text-white/80 focus:outline-none focus:ring-2 focus:ring-orange-500 ${getErrorClass('invoiceType')}`} value={formData.invoiceType || 'individual'} onChange={e => onInputChange('invoiceType', e.target.value)}>
                <option value="individual">{t('individual', 'Individual')}</option>
                <option value="company">{t('company', 'Company')}</option>
              </select>
              {hasError('invoiceType') && <p className="text-red-400 text-sm mt-1">{errors.invoiceType}</p>}
            </div>

            {formData.invoiceType === 'company' ? <>
                <div>
                  <Label htmlFor="companyName" className="text-white/80 flex items-center gap-1">
                    {t('companyName', 'Company Name')} <span className="text-red-400">*</span>
                  </Label>
                  <Input type="text" id="companyName" className={getErrorClass('companyName')} value={formData.companyName || ''} onChange={e => onInputChange('companyName', e.target.value)} placeholder={t('enterCompanyName', 'Enter company name')} />
                  {hasError('companyName') && <p className="text-red-400 text-sm mt-1">{errors.companyName}</p>}
                </div>
                <div>
                  <Label htmlFor="vatCode" className="text-white/80">{t('vatCode', 'VAT Code')}</Label>
                  <Input type="text" id="vatCode" className={getErrorClass('vatCode')} value={formData.vatCode || ''} onChange={e => onInputChange('vatCode', e.target.value)} placeholder={t('enterVatCode', 'Enter VAT code')} />
                  {hasError('vatCode') && <p className="text-red-400 text-sm mt-1">{errors.vatCode}</p>}
                </div>
                <div>
                  <Label htmlFor="registrationNumber" className="text-white/80">{t('registrationNumber', 'Registration Number')}</Label>
                  <Input type="text" id="registrationNumber" className={getErrorClass('registrationNumber')} value={formData.registrationNumber || ''} onChange={e => onInputChange('registrationNumber', e.target.value)} placeholder={t('enterRegistrationNumber', 'Enter registration number')} />
                  {hasError('registrationNumber') && <p className="text-red-400 text-sm mt-1">{errors.registrationNumber}</p>}
                </div>
                <div>
                  <Label htmlFor="companyAddress" className="text-white/80 flex items-center gap-1">
                    {t('companyAddress', 'Company Address')} <span className="text-red-400">*</span>
                  </Label>
                  <Input type="text" id="companyAddress" className={getErrorClass('companyAddress')} value={formData.companyAddress || ''} onChange={e => onInputChange('companyAddress', e.target.value)} placeholder={t('enterCompanyAddress', 'Enter company address')} />
                  {hasError('companyAddress') && <p className="text-red-400 text-sm mt-1">{errors.companyAddress}</p>}
                </div>
                <div>
                  <Label htmlFor="representativeName" className="text-white/80 flex items-center gap-1">
                    {t('representativeName', 'Representative Name')} <span className="text-red-400">*</span>
                  </Label>
                  <Input type="text" id="representativeName" className={getErrorClass('representativeName')} value={formData.representativeName || ''} onChange={e => onInputChange('representativeName', e.target.value)} placeholder={t('enterRepresentativeName', 'Enter representative name')} />
                  {hasError('representativeName') && <p className="text-red-400 text-sm mt-1">{errors.representativeName}</p>}
                </div>
              </> : <>
                <div>
                  <Label htmlFor="address" className="text-white/80 flex items-center gap-1">
                    {t('address', 'Address')} <span className="text-red-400">*</span>
                  </Label>
                  <Input type="text" id="address" className={getErrorClass('address')} value={formData.address || ''} onChange={e => onInputChange('address', e.target.value)} placeholder={t('enterAddress', 'Enter your address')} />
                  {hasError('address') && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
                </div>
                <div>
                  <Label htmlFor="city" className="text-white/80 flex items-center gap-1">
                    {t('city', 'City')} <span className="text-red-400">*</span>
                  </Label>
                  <Input type="text" id="city" className={getErrorClass('city')} value={formData.city || ''} onChange={e => onInputChange('city', e.target.value)} placeholder={t('enterCity', 'Enter your city')} />
                  {hasError('city') && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
                </div>
              </>}
          </div>
        </CardContent>
      </Card>

      {/* Legal Agreements Section - Made More Prominent */}
      <Card className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-400/50">
        <CardContent className="p-4 bg-orange-400">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">{t('legalAgreements', 'Legal Agreements')}</h3>
            <span className="text-red-400 text-sm">*{t('required', 'Required')}</span>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-white/10">
                <Checkbox id="acceptMentionObligation" className="border-white/30 focus:ring-orange-500 mt-1" checked={formData.acceptMentionObligation || false} onCheckedChange={checked => onInputChange('acceptMentionObligation', checked)} />
                <div className="flex-1">
                  <Label htmlFor="acceptMentionObligation" className="text-white/90 cursor-pointer font-medium">
                    {t('acceptMentionObligation', 'I accept the mention obligation')}
                  </Label>
                </div>
              </div>
              {hasError('acceptMentionObligation') && <p className="text-red-400 text-sm ml-6">{errors.acceptMentionObligation}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-white/10">
                <Checkbox id="acceptDistribution" className="border-white/30 focus:ring-orange-500 mt-1" checked={formData.acceptDistribution || false} onCheckedChange={checked => onInputChange('acceptDistribution', checked)} />
                <div className="flex-1">
                  <Label htmlFor="acceptDistribution" className="text-white/90 cursor-pointer font-medium">
                    {t('acceptDistribution', 'I accept distribution')}
                  </Label>
                </div>
              </div>
              {hasError('acceptDistribution') && <p className="text-red-400 text-sm ml-6">{errors.acceptDistribution}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-white/10">
                <Checkbox id="finalNote" className="border-white/30 focus:ring-orange-500 mt-1" checked={formData.finalNote || false} onCheckedChange={checked => onInputChange('finalNote', checked)} />
                <div className="flex-1">
                  <Label htmlFor="finalNote" className="text-white/90 cursor-pointer font-medium">
                    {t('finalNote', 'I agree to final terms')}
                  </Label>
                </div>
              </div>
              {hasError('finalNote') && <p className="text-red-400 text-sm ml-6">{errors.finalNote}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default ContactLegalStep;