import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePackages, useAddons, usePackageSteps } from '@/hooks/usePackageData';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { supabase } from '@/integrations/supabase/client';
import FormFieldRenderer from './order/FormFieldRenderer';
import StepIndicator from './order/StepIndicator';
import OrderSummary from './order/OrderSummary';
import { getPackagePrice } from '@/utils/pricing';

interface OrderFormData {
  email?: string;
  fullName?: string;
  recipientName?: string;
  occasion?: string;
  [key: string]: any;
}

interface OrderWizardProps {
  giftCard?: any;
  onComplete?: (orderData: any) => Promise<void>;
  preselectedPackage?: string;
}

const OrderWizard: React.FC<OrderWizardProps> = ({ giftCard, onComplete, preselectedPackage }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OrderFormData>({});
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [addonFieldValues, setAddonFieldValues] = useState<Record<string, any>>({});
  const { t } = useLanguage();
  const { currency } = useCurrency();
  const { data: packages = [] } = usePackages();
  const { data: addons = [] } = useAddons();
  const { data: steps = [], isLoading: isStepsLoading } = usePackageSteps(formData.package as string);
  const totalSteps = steps?.length || 0;

  // Derive selected package from form data
  const selectedPackage = formData.package as string;

  // Find the selected package data
  const selectedPackageData = packages.find(pkg => pkg.value === selectedPackage);

  useEffect(() => {
    if (packages.length > 0 && !formData.package) {
      // Set default package if none selected, or use preselected
      const packageToSet = preselectedPackage || packages[0].value;
      setFormData(prev => ({ ...prev, package: packageToSet }));
    }
  }, [packages, formData.package, preselectedPackage]);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddonChange = (addonId: string, checked: boolean) => {
    setSelectedAddons(prev => {
      if (checked) {
        return [...prev, addonId];
      } else {
        return prev.filter(id => id !== addonId);
      }
    });
  };

  const handleAddonFieldChange = (addonKey: string, fieldValue: any) => {
    setAddonFieldValues(prev => ({ ...prev, [addonKey]: fieldValue }));
  };

  const calculateTotalPrice = () => {
    const packagePrice = selectedPackageData ? getPackagePrice(selectedPackageData, currency) : 0;
    const addonsPrice = selectedAddons.reduce((total, addonKey) => {
      const addon = addons.find(addon => addon.addon_key === addonKey);
      return total + (addon?.price || 0);
    }, 0);
    return packagePrice + addonsPrice;
  };

  const totalPrice = calculateTotalPrice();

  const handleSubmit = async () => {
    if (onComplete) {
      await onComplete({
        ...formData,
        addons: selectedAddons,
        addonFieldValues,
        package: selectedPackage,
        totalPrice
      });
    } else {
      // Default submission logic
      const selectedPackageData = packages.find(pkg => pkg.value === selectedPackage);
      const package_name = selectedPackageData?.label_key;
      const package_price = selectedPackageData ? getPackagePrice(selectedPackageData, currency) : 0;
      const package_delivery_time = selectedPackageData?.delivery_time_key;
      const package_includes = selectedPackageData?.includes;

      const orderData = {
        form_data: formData,
        selected_addons: selectedAddons,
        total_price: totalPrice,
        package_value: selectedPackage,
        package_name: package_name,
        package_price: package_price,
        package_delivery_time: package_delivery_time,
        package_includes: package_includes ? JSON.parse(JSON.stringify(package_includes)) : [],
        status: 'pending',
        payment_status: 'pending'
      };

      try {
        const { data, error } = await supabase
          .from('orders')
          .insert(orderData);

        if (error) {
          console.error('Error inserting order:', error);
          // Handle error (e.g., show an error message)
        } else {
          console.log('Order inserted successfully:', data);
          // Handle success (e.g., redirect to a success page)
        }
      } catch (error) {
        console.error('An unexpected error occurred:', error);
        // Handle unexpected error
      }
    }
  };

  const currentStepData = steps?.[currentStep];

  return (
    <div className="container mx-auto py-8">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-2 pt-6">
          <CardTitle className="text-2xl font-bold">
            {t('orderDetails', 'Detalii Comandă')}
          </CardTitle>
          <p className="text-gray-500">
            {t('completeAllSteps', 'Completează toți pașii pentru a finaliza comanda.')}
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4">
            <StepIndicator currentStep={currentStep + 1} totalSteps={totalSteps} />
          </div>

          <AnimatePresence initial={false} mode="wait">
            {currentStepData && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-4">
                  {currentStepData.fields.map(field => (
                    <FormFieldRenderer
                      key={field.id}
                      field={field}
                      value={formData[field.field_name]}
                      onChange={(value) => handleInputChange(field.field_name, value)}
                      selectedAddons={selectedAddons}
                      onAddonChange={handleAddonChange}
                      availableAddons={addons}
                      addonFieldValues={addonFieldValues}
                      onAddonFieldChange={handleAddonFieldChange}
                      selectedPackage={selectedPackage}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between mt-6">
            <Button
              variant="secondary"
              onClick={handlePrev}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('previous', 'Înapoi')}
            </Button>
            <Button
              onClick={currentStep === totalSteps - 1 ? handleSubmit : handleNext}
              disabled={isStepsLoading}
            >
              {currentStep === totalSteps - 1 ? t('submitOrder', 'Trimite Comanda') : t('next', 'Înainte')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <div className="mt-8">
        <OrderSummary
          selectedPackage={selectedPackage}
          selectedAddons={selectedAddons}
          giftCard={giftCard}
        />
      </div>
    </div>
  );
};

export default OrderWizard;
