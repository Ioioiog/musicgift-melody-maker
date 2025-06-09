
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import FormFieldRenderer from './FormFieldRenderer';

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
  onInputChange,
  selectedAddons,
  onAddonChange,
  availableAddons,
  addonFieldValues,
  onAddonFieldChange,
  selectedPackage,
  selectedPackageData
}) => {
  const { t } = useLanguage();

  const contactLegalStepFields = [
    {
      id: 'fullName',
      field_name: 'fullName',
      field_type: 'text',
      label_key: 'fullName',
      placeholder_key: 'fullName',
      required: true,
      field_order: 1
    },
    {
      id: 'email',
      field_name: 'email',
      field_type: 'email',
      label_key: 'email',
      placeholder_key: 'email',
      required: true,
      field_order: 2
    },
    {
      id: 'phone',
      field_name: 'phone',
      field_type: 'tel',
      label_key: 'phone',
      placeholder_key: 'phone',
      required: false,
      field_order: 3
    },
    {
      id: 'address',
      field_name: 'address',
      field_type: 'text',
      label_key: 'address',
      placeholder_key: 'address',
      required: false,
      field_order: 4
    },
    {
      id: 'city',
      field_name: 'city',
      field_type: 'text',
      label_key: 'city',
      placeholder_key: 'city',
      required: false,
      field_order: 5
    },
    {
      id: 'invoiceType',
      field_name: 'invoiceType',
      field_type: 'select',
      label_key: 'invoiceType',
      placeholder_key: 'invoiceType',
      required: true,
      field_order: 6,
      options: [
        { value: 'individual', label_key: 'individual' },
        { value: 'company', label_key: 'company' }
      ]
    },
    {
      id: 'companyName',
      field_name: 'companyName',
      field_type: 'text',
      label_key: 'companyName',
      placeholder_key: 'companyName',
      required: false,
      field_order: 7
    },
    {
      id: 'vatCode',
      field_name: 'vatCode',
      field_type: 'text',
      label_key: 'vatCode',
      placeholder_key: 'vatCode',
      required: false,
      field_order: 8
    },
    {
      id: 'registrationNumber',
      field_name: 'registrationNumber',
      field_type: 'text',
      label_key: 'registrationNumber',
      placeholder_key: 'registrationNumber',
      required: false,
      field_order: 9
    },
    {
      id: 'companyAddress',
      field_name: 'companyAddress',
      field_type: 'text',
      label_key: 'companyAddress',
      placeholder_key: 'companyAddress',
      required: false,
      field_order: 10
    },
    {
      id: 'representativeName',
      field_name: 'representativeName',
      field_type: 'text',
      label_key: 'representativeName',
      placeholder_key: 'representativeName',
      required: false,
      field_order: 11
    },
    {
      id: 'acceptMentionObligation',
      field_name: 'acceptMentionObligation',
      field_type: 'checkbox',
      label_key: 'acceptMentionObligation',
      placeholder_key: 'acceptMentionObligation',
      required: true,
      field_order: 12
    },
    {
      id: 'acceptDistribution',
      field_name: 'acceptDistribution',
      field_type: 'checkbox',
      label_key: 'acceptDistribution',
      placeholder_key: 'acceptDistribution',
      required: true,
      field_order: 13
    },
    {
      id: 'finalNote',
      field_name: 'finalNote',
      field_type: 'checkbox',
      label_key: 'finalNote',
      placeholder_key: 'finalNote',
      required: true,
      field_order: 14
    }
  ];

  return (
    <div className="space-y-1">
      <div className="text-center">
        <h3 className="text-base font-semibold text-white mb-1">
          {t('contactDetailsStep', 'Contact Details & Legal Acceptance')}
        </h3>
        <p className="text-white/70 text-sm">
          {t('fillContactAndLegalInfo', 'Fill in your contact details and accept the legal terms')}
        </p>
      </div>

      {contactLegalStepFields
        .sort((a, b) => a.field_order - b.field_order)
        .map(field => (
          <Card 
            key={field.id} 
            className="bg-transparent border border-white/30 hover:border-white/50 transition-colors"
          >
            <CardContent className="p-1.5">
              <FormFieldRenderer
                field={field}
                value={formData[field.field_name]}
                onChange={value => onInputChange(field.field_name, value)}
                selectedAddons={selectedAddons}
                onAddonChange={onAddonChange}
                availableAddons={availableAddons}
                addonFieldValues={addonFieldValues}
                onAddonFieldChange={onAddonFieldChange}
                selectedPackage={selectedPackage}
                selectedPackageData={selectedPackageData}
                formData={formData}
              />
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default ContactLegalStep;
