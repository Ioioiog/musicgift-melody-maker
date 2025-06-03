
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
import PackageSelectionStep from './order/PackageSelectionStep';
import { getPackagePrice, getAddonPrice } from '@/utils/pricing';

interface OrderFormData {
  email?: string;
  fullName?: string;
  recipientName?: string;
  occasion?: string;
  package?: string;
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
  
  // Get package-specific steps only when a package is selected
  const selectedPackage = formData.package as string;
  const { data: packageSteps = [], isLoading: isStepsLoading } = usePackageSteps(selectedPackage);
  
  // Total steps = 1 (package selection) + package-specific steps
  const totalSteps = 1 + (packageSteps?.length || 0);

  // Find the selected package data
  const selectedPackageData = packages.find(pkg => pkg.value === selectedPackage);

  useEffect(() => {
    if (preselectedPackage && packages.length > 0) {
      // If there's a preselected package, set it and skip to step 1
      setFormData(prev => ({ ...prev, package: preselectedPackage }));
      setCurrentStep(1);
    }
  }, [packages, preselectedPackage]);

  const handleNext = () => {
    if (currentStep === 0) {
      // Moving from package selection to first package step
      if (!formData.package) return;
      setCurrentStep(1);
    } else if (currentStep < totalSteps - 1) {
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

  const handlePackageSelect = (packageValue: string) => {
    // Clear package-specific data when changing package
    const newFormData = { package: packageValue };
    setFormData(newFormData);
    setSelectedAddons([]);
    setAddonFieldValues({});
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
      return total + (addon ? getAddonPrice(addon, currency) : 0);
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
      // Create order with SmartBill integration
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
        payment_status: 'pending',
        currency: currency
      };

      try {
        // Call SmartBill integration edge function
        const { data: smartBillResponse, error: smartBillError } = await supabase.functions.invoke('smartbill-create-invoice', {
          body: orderData
        });

        if (smartBillError) {
          console.error('SmartBill error:', smartBillError);
          throw new Error('Failed to create invoice with SmartBill');
        }

        console.log('SmartBill response:', smartBillResponse);

        // If SmartBill returns a payment URL, redirect user
        if (smartBillResponse?.paymentUrl) {
          window.location.href = smartBillResponse.paymentUrl;
        } else {
          // If no payment needed (e.g., fully covered by gift card), show success
          console.log('Order completed successfully without payment needed');
        }

      } catch (error) {
        console.error('Error processing order:', error);
        // Fallback to basic order creation for now
        const { data, error: dbError } = await supabase
          .from('orders')
          .insert(orderData);

        if (dbError) {
          console.error('Error inserting order:', dbError);
        } else {
          console.log('Order inserted successfully as fallback:', data);
        }
      }
    }
  };

  // Get current step data (for package-specific steps)
  const currentPackageStepIndex = currentStep - 1;
  const currentStepData = currentStep > 0 ? packageSteps?.[currentPackageStepIndex] : null;

  const canProceed = () => {
    if (currentStep === 0) {
      return !!formData.package;
    }
    return true; // Add validation logic for other steps if needed
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-2 pt-6">
          <CardTitle className="text-2xl font-bold">
            {t('orderDetails')}
          </CardTitle>
          <p className="text-gray-500">
            {t('completeAllSteps')}
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4">
            <StepIndicator currentStep={currentStep + 1} totalSteps={totalSteps} />
          </div>

          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                {currentStep === 0 ? (
                  <PackageSelectionStep
                    selectedPackage={formData.package}
                    onPackageSelect={handlePackageSelect}
                  />
                ) : currentStepData ? (
                  currentStepData.fields.map(field => (
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
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">{t('loadingSteps')}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-6">
            <Button
              variant="secondary"
              onClick={handlePrev}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('previous')}
            </Button>
            <Button
              onClick={currentStep === totalSteps - 1 ? handleSubmit : handleNext}
              disabled={!canProceed() || (currentStep > 0 && isStepsLoading)}
            >
              {currentStep === totalSteps - 1 ? t('submitOrder') : t('next')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary - only show when package is selected */}
      {selectedPackage && (
        <div className="mt-8">
          <OrderSummary
            selectedPackage={selectedPackage}
            selectedAddons={selectedAddons}
            giftCard={giftCard}
          />
        </div>
      )}
    </div>
  );
};

export default OrderWizard;
