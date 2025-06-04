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
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import FormFieldRenderer from './order/FormFieldRenderer';
import StepIndicator from './order/StepIndicator';
import OrderSummary from './order/OrderSummary';
import PackageSelectionStep from './order/PackageSelectionStep';
import PaymentProviderSelection from './order/PaymentProviderSelection';
import { getPackagePrice, getAddonPrice } from '@/utils/pricing';
import { useToast } from '@/hooks/use-toast';

interface OrderFormData {
  email?: string;
  fullName?: string;
  recipientName?: string;
  occasion?: string;
  package?: string;
  invoiceType?: string;
  companyName?: string;
  vatCode?: string;
  registrationNumber?: string;
  companyAddress?: string;
  representativeName?: string;
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
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<string>('smartbill');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();
  const { currency } = useCurrency();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: packages = [] } = usePackages();
  const { data: addons = [] } = useAddons();
  
  // Get package-specific steps only when a package is selected
  const selectedPackage = formData.package as string;
  const { data: packageSteps = [], isLoading: isStepsLoading } = usePackageSteps(selectedPackage);
  
  // Total steps = 1 (package selection) + package-specific steps + 1 (payment provider selection)
  const totalSteps = 1 + (packageSteps?.length || 0) + 1;

  // Find the selected package data
  const selectedPackageData = packages.find(pkg => pkg.value === selectedPackage);

  useEffect(() => {
    if (preselectedPackage && packages.length > 0) {
      // If preselected package is gift, redirect to gift page
      if (preselectedPackage === 'gift') {
        navigate('/gift');
        return;
      }
      
      // If there's a preselected package, set it and skip to step 1
      setFormData(prev => ({ ...prev, package: preselectedPackage }));
      setCurrentStep(1);
    }
  }, [packages, preselectedPackage, navigate]);

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
    // If gift package is selected, redirect to gift page
    if (packageValue === 'gift') {
      navigate('/gift');
      return;
    }
    
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
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      console.log(`🔄 Starting payment process with provider: ${selectedPaymentProvider}`);
      console.log(`💰 Total price: ${totalPrice} ${currency}`);
      
      if (onComplete) {
        await onComplete({
          ...formData,
          addons: selectedAddons,
          addonFieldValues,
          package: selectedPackage,
          paymentProvider: selectedPaymentProvider,
          totalPrice
        });
        return;
      }

      // Validate that we have a payment provider selected
      if (!selectedPaymentProvider) {
        console.error('❌ No payment provider selected');
        throw new Error('Please select a payment method before proceeding');
      }

      console.log(`🎯 Selected payment provider: "${selectedPaymentProvider}"`);

      // Create order with selected payment provider
      const selectedPackageData = packages.find(pkg => pkg.value === selectedPackage);
      const package_name = selectedPackageData?.label_key;
      const package_price = selectedPackageData ? getPackagePrice(selectedPackageData, currency) : 0;
      const package_delivery_time = selectedPackageData?.delivery_time_key;
      const package_includes = selectedPackageData?.includes;

      const orderData = {
        form_data: formData,
        selected_addons: selectedAddons,
        total_price: totalPrice * 100, // Convert to cents for payment processing
        package_value: selectedPackage,
        package_name: package_name,
        package_price: package_price,
        package_delivery_time: package_delivery_time,
        package_includes: package_includes ? JSON.parse(JSON.stringify(package_includes)) : [],
        status: 'pending',
        payment_status: 'pending',
        currency: currency
      };

      console.log(`📦 Order data prepared:`, orderData);

      // Determine edge function based on payment provider with explicit validation
      let edgeFunctionName: string;
      let paymentProviderLabel: string;
      
      if (selectedPaymentProvider === 'stripe') {
        edgeFunctionName = 'stripe-create-payment';
        paymentProviderLabel = 'Stripe';
        console.log('🟣 Using Stripe payment gateway');
      } else if (selectedPaymentProvider === 'revolut') {
        edgeFunctionName = 'revolut-create-payment';
        paymentProviderLabel = 'Revolut';
        console.log('🟠 Using Revolut payment gateway');
      } else if (selectedPaymentProvider === 'smartbill') {
        edgeFunctionName = 'smartbill-create-invoice';
        paymentProviderLabel = 'SmartBill';
        console.log('🔵 Using SmartBill payment gateway');
      } else {
        console.error(`❌ Unsupported payment provider: "${selectedPaymentProvider}"`);
        throw new Error(`Payment method "${selectedPaymentProvider}" is not supported. Please select a valid payment method.`);
      }

      console.log(`🚀 Calling edge function: ${edgeFunctionName} for ${paymentProviderLabel}`);

      // Call the appropriate payment provider edge function
      const { data: paymentResponse, error: paymentError } = await supabase.functions.invoke(edgeFunctionName, {
        body: {
          orderData,
          returnUrl: `${window.location.origin}/payment/success`
        }
      });

      console.log(`📨 ${paymentProviderLabel} edge function response:`, { data: paymentResponse, error: paymentError });

      if (paymentError) {
        console.error(`❌ ${paymentProviderLabel} edge function error:`, paymentError);
        throw new Error(`Failed to initialize payment with ${paymentProviderLabel}: ${paymentError.message}`);
      }

      if (!paymentResponse) {
        console.error(`❌ No response from ${paymentProviderLabel} edge function`);
        throw new Error(`No response received from ${paymentProviderLabel} payment service`);
      }

      console.log(`✅ ${paymentProviderLabel} response received:`, paymentResponse);

      // Validate response structure
      if (!paymentResponse.success) {
        console.error(`❌ ${paymentProviderLabel} operation failed:`, paymentResponse);
        const errorMessage = paymentResponse.error || paymentResponse.message || 'Payment initialization failed';
        throw new Error(`${paymentProviderLabel} payment failed: ${errorMessage}`);
      }

      // Validate payment URL for Stripe and Revolut
      if ((selectedPaymentProvider === 'stripe' || selectedPaymentProvider === 'revolut') && !paymentResponse.paymentUrl) {
        console.error(`❌ Missing payment URL from ${paymentProviderLabel}:`, paymentResponse);
        throw new Error(`${paymentProviderLabel} did not return a payment URL. Please try again or contact support.`);
      }

      // Show success message
      toast({
        title: t('orderSuccess'),
        description: t('orderSuccessMessage', `Your order has been created successfully. ID: ${paymentResponse.orderId?.slice(0, 8)}...`),
        variant: "default"
      });

      // Handle redirection based on provider
      if (paymentResponse.paymentUrl) {
        console.log(`🔄 Redirecting to ${paymentProviderLabel} payment:`, paymentResponse.paymentUrl);
        
        // Validate URL before redirecting
        try {
          new URL(paymentResponse.paymentUrl);
          window.location.href = paymentResponse.paymentUrl;
        } catch (urlError) {
          console.error(`❌ Invalid payment URL from ${paymentProviderLabel}:`, paymentResponse.paymentUrl);
          throw new Error(`Invalid payment URL received from ${paymentProviderLabel}. Please try again or contact support.`);
        }
      } else {
        // If no payment needed (e.g., fully covered by gift card), show success
        console.log('✅ Order completed successfully without payment redirection needed');
        navigate('/payment/success?orderId=' + paymentResponse.orderId);
      }

    } catch (error) {
      console.error('💥 Payment processing error:', error);
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: t('orderError', 'Payment Error'),
        description: `Failed to process payment: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get current step data (for package-specific steps)
  const isPaymentStep = currentStep === totalSteps - 1;
  const currentPackageStepIndex = currentStep - 1;
  const currentStepData = currentStep > 0 && !isPaymentStep ? packageSteps?.[currentPackageStepIndex] : null;

  const canProceed = () => {
    if (currentStep === 0) {
      return !!formData.package;
    }
    if (isPaymentStep) {
      return !!selectedPaymentProvider;
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
                ) : isPaymentStep ? (
                  <PaymentProviderSelection
                    selectedProvider={selectedPaymentProvider}
                    onProviderSelect={setSelectedPaymentProvider}
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
                      formData={formData}
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
              disabled={currentStep === 0 || isSubmitting}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('previous')}
            </Button>
            <Button
              onClick={currentStep === totalSteps - 1 ? handleSubmit : handleNext}
              disabled={!canProceed() || (currentStep > 0 && !isPaymentStep && isStepsLoading) || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {t('processing', 'Processing...')}
                </>
              ) : (
                <>
                  {currentStep === totalSteps - 1 ? t('submitOrder') : t('next')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
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
