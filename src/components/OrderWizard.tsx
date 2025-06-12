import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { usePackages, useAddons, usePackageSteps } from '@/hooks/usePackageData';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getPackagePrice, getAddonPrice } from '@/utils/pricing';
import { useOrderWizardState } from '@/hooks/useOrderWizardState';
import { validateFormData, prepareOrderData } from '@/utils/orderValidation';
import FormFieldRenderer from './order/FormFieldRenderer';
import StepIndicator from './order/StepIndicator';
import PackageSelectionStep from './order/PackageSelectionStep';
import AddonSelectionStep from './order/AddonSelectionStep';
import PaymentProviderSelection from './order/PaymentProviderSelection';
import ContactLegalStep from './order/ContactLegalStep';
import WizardNavigation from './order/WizardNavigation';

interface OrderWizardProps {
  giftCard?: any;
  onComplete?: (orderData: any) => Promise<void>;
  preselectedPackage?: string;
  onOrderDataChange?: (orderData: any) => void;
}

const OrderWizard: React.FC<OrderWizardProps> = ({
  giftCard,
  onComplete,
  preselectedPackage,
  onOrderDataChange
}) => {
  const {
    currentStep,
    setCurrentStep,
    formData,
    selectedAddons,
    addonFieldValues,
    selectedPaymentProvider,
    setSelectedPaymentProvider,
    isSubmitting,
    setIsSubmitting,
    handleInputChange,
    handlePackageSelect,
    handleAddonChange,
    handleAddonFieldChange
  } = useOrderWizardState({
    preselectedPackage
  });
  const { t } = useLanguage();
  const { currency } = useCurrency();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: packages = [] } = usePackages();
  const { data: addons = [] } = useAddons();
  const selectedPackage = formData.package as string;
  const { data: allPackageSteps = [], isLoading: isStepsLoading } = usePackageSteps(selectedPackage);

  // Notify parent component of order data changes
  useEffect(() => {
    if (onOrderDataChange) {
      onOrderDataChange({
        selectedPackage,
        selectedAddons,
        formData,
        addonFieldValues
      });
    }
  }, [selectedPackage, selectedAddons, formData, addonFieldValues, onOrderDataChange]);

  // Auto-scroll to top when step changes to show step indicator
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentStep]);

  // Only get regular package steps (exclude contact/legal as it's now universal)
  const regularSteps = allPackageSteps.filter(step => step.title_key !== 'contactDetailsStep').sort((a, b) => a.step_number - b.step_number);

  const selectedPackageData = packages.find(pkg => pkg.value === selectedPackage);
  
  // Check if this is a quote-only package
  const isQuoteOnly = selectedPackageData?.is_quote_only === true;

  // Build the complete step flow - Contact & Legal is now ALWAYS present
  const totalRegularSteps = regularSteps.length;
  const addonStepIndex = 1 + totalRegularSteps; // After package selection + regular steps
  const contactLegalStepIndex = addonStepIndex + 1; // Always after addons
  const paymentStepIndex = isQuoteOnly ? -1 : contactLegalStepIndex + 1; // Skip payment for quotes
  const totalSteps = isQuoteOnly ? contactLegalStepIndex + 1 : paymentStepIndex + 1;

  console.log('🔍 Quote Request Debug:', {
    selectedPackage,
    isQuoteOnly,
    currentStep,
    totalSteps,
    contactLegalStepIndex
  });

  const buildStepsData = () => {
    const steps = [];

    // Step 1: Package Selection
    steps.push({
      number: 1,
      label: t('choosePackage'),
      isCompleted: currentStep > 0,
      isCurrent: currentStep === 0
    });

    // Steps 2-N: Regular Package Steps
    regularSteps.forEach((step, index) => {
      const stepNumber = index + 2;
      const stepIndex = index + 1;
      steps.push({
        number: stepNumber,
        label: t(step.title_key) || step.title_key,
        isCompleted: currentStep > stepIndex,
        isCurrent: currentStep === stepIndex
      });
    });

    // Addons Step
    const addonStepNumber = regularSteps.length + 2;
    steps.push({
      number: addonStepNumber,
      label: t('selectAddons', 'Select Add-ons'),
      isCompleted: currentStep > addonStepIndex,
      isCurrent: currentStep === addonStepIndex
    });

    // Contact & Legal Step - ALWAYS present
    const contactStepNumber = addonStepNumber + 1;
    steps.push({
      number: contactStepNumber,
      label: t('contactDetailsStep', 'Contact & Legal'),
      isCompleted: currentStep > contactLegalStepIndex,
      isCurrent: currentStep === contactLegalStepIndex
    });

    // Only add Payment Step for non-quote packages
    if (!isQuoteOnly) {
      const paymentStepNumber = contactStepNumber + 1;
      steps.push({
        number: paymentStepNumber,
        label: t('payment', 'Payment'),
        isCompleted: false,
        isCurrent: currentStep === paymentStepIndex
      });
    }
    
    return steps;
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (!formData.package) return;
      setCurrentStep(1); // Go to first form step
    } else if (currentStep < totalSteps - 1) {
      // Skip payment step for quote-only packages
      if (isQuoteOnly && currentStep === contactLegalStepIndex) {
        console.log('⚠️ Should not proceed past contact/legal for quotes');
        return; // Don't proceed past contact/legal for quotes
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
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
      // For quote-only packages, create quote request instead of payment
      if (isQuoteOnly) {
        console.log("🔄 Creating quote request for quote-only package");
        
        // Validate required fields
        if (!formData.fullName || !formData.email) {
          throw new Error('Please fill in all required contact information');
        }
        
        // Create quote request in the dedicated table
        const quoteData = {
          customer_name: formData.fullName,
          customer_email: formData.email,
          customer_phone: formData.phone || null,
          package_name: selectedPackageData?.label_key || selectedPackage,
          package_value: selectedPackage,
          selected_addons: selectedAddons,
          addon_field_values: addonFieldValues,
          form_data: formData,
          estimated_price: totalPrice,
          currency: currency,
          status: 'pending',
          user_id: null // Will be set by RLS if user is authenticated
        };

        console.log('📝 Creating quote request with data:', {
          customer_name: quoteData.customer_name,
          customer_email: quoteData.customer_email,
          package_name: quoteData.package_name,
          estimated_price: quoteData.estimated_price,
          currency: quoteData.currency,
          addons_count: selectedAddons.length
        });

        const { data: quoteRequest, error } = await supabase
          .from('quote_requests')
          .insert(quoteData)
          .select()
          .single();
          
        if (error) {
          console.error('❌ Quote request creation error:', error);
          throw new Error(`Failed to create quote request: ${error.message}`);
        }
        
        console.log('✅ Quote request created successfully:', quoteRequest.id);
        
        toast({
          title: t('quoteRequestSubmitted', 'Quote Request Submitted'),
          description: t('quoteRequestMessage', 'Your quote request has been submitted successfully. We will contact you soon with a personalized quote.'),
          variant: "default"
        });
        
        // Navigate to success page with quote type - DO NOT call onComplete for quotes
        navigate(`/payment/success?quoteId=${quoteRequest.id}&type=quote`);
        return;
      }

      // Continue with existing payment logic for non-quote packages ONLY
      console.log(`🔄 Starting payment process with provider: ${selectedPaymentProvider}`);
      console.log('📦 Order data being submitted:', {
        package: selectedPackage,
        addons: selectedAddons.length,
        totalPrice,
        paymentProvider: selectedPaymentProvider,
        customerEmail: formData.email?.substring(0, 5) + '***'
      });
      
      validateFormData(formData, selectedPackage, totalPrice);
      
      // Only call onComplete for non-quote packages
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
      
      if (!selectedPaymentProvider) {
        throw new Error('Please select a payment method before proceeding');
      }
      
      const orderData = prepareOrderData(formData, selectedAddons, addonFieldValues, selectedPackage, selectedPaymentProvider, totalPrice, packages, currency);

      // Handle SmartBill payment with enhanced error handling and logging
      if (selectedPaymentProvider === 'smartbill') {
        console.log('🔵 Processing payment with SmartBill');
        const { data: paymentResponse, error: paymentError } = await supabase.functions.invoke('smartbill-create-invoice', {
          body: { orderData }
        });
        console.log('🔵 SmartBill Edge Function Response:', {
          success: paymentResponse?.success,
          orderId: paymentResponse?.orderId,
          errorCode: paymentResponse?.errorCode,
          hasPaymentUrl: !!paymentResponse?.paymentUrl,
          message: paymentResponse?.message
        });
        if (paymentError) {
          console.error('❌ SmartBill Edge Function Error:', paymentError);
          throw new Error(`SmartBill payment failed: ${paymentError.message}`);
        }
        if (!paymentResponse?.success) {
          console.error('❌ SmartBill Payment Response Error:', paymentResponse);
          const errorCode = paymentResponse?.errorCode || 'paymentFailed';
          const errorMessage = paymentResponse?.message || paymentResponse?.error || 'SmartBill payment initialization failed';
          console.log('🔗 Redirecting to error page with details:', {
            orderId: paymentResponse?.orderId,
            errorCode,
            errorMessage: errorMessage.substring(0, 100) + '...'
          });

          // Navigate to error page with specific error details
          navigate(`/payment/error?orderId=${paymentResponse?.orderId || 'unknown'}&errorCode=${errorCode}&errorMessage=${encodeURIComponent(errorMessage)}`);
          return;
        }
        if (paymentResponse.paymentUrl) {
          console.log('✅ SmartBill payment URL generated successfully');
          console.log('🔗 Redirecting to SmartBill payment page');
          window.location.href = paymentResponse.paymentUrl;
        } else {
          console.log('✅ Order completed - no payment required');
          navigate('/payment/success?orderId=' + paymentResponse.orderId);
        }
      } else if (selectedPaymentProvider === 'stripe') {
        console.log('🟣 Processing payment with Stripe');
        const { data: paymentResponse, error: paymentError } = await supabase.functions.invoke('stripe-create-payment', {
          body: {
            orderData: orderData,
            returnUrl: `${window.location.origin}/payment/success`
          }
        });
        console.log('🟣 Stripe response:', paymentResponse);
        if (paymentError || !paymentResponse?.success) {
          const errorMessage = paymentError?.message || paymentResponse?.error || 'Stripe payment failed';
          throw new Error(errorMessage);
        }
        if (paymentResponse.paymentUrl) {
          window.location.href = paymentResponse.paymentUrl;
        } else {
          throw new Error('No payment URL received from Stripe');
        }
      } else if (selectedPaymentProvider === 'revolut') {
        console.log('🟠 Processing payment with Revolut');
        const { data: paymentResponse, error: paymentError } = await supabase.functions.invoke('revolut-create-payment', {
          body: {
            orderData: orderData,
            returnUrl: `${window.location.origin}/payment/success`
          }
        });
        console.log('🟠 Revolut response:', paymentResponse);
        if (paymentError || !paymentResponse?.success) {
          const errorMessage = paymentError?.message || paymentResponse?.error || 'Revolut payment failed';
          throw new Error(errorMessage);
        }
        if (paymentResponse.paymentUrl) {
          window.location.href = paymentResponse.paymentUrl;
        } else {
          navigate('/payment/success?orderId=' + paymentResponse.orderId);
        }
      } else {
        throw new Error(`Unsupported payment provider: ${selectedPaymentProvider}`);
      }
    } catch (error) {
      console.error(`💥 ${isQuoteOnly ? 'QUOTE REQUEST' : selectedPaymentProvider?.toUpperCase()} Error:`, error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('💥 Full error details:', {
        message: errorMessage,
        provider: selectedPaymentProvider,
        package: selectedPackage,
        totalPrice,
        isQuoteOnly
      });
      toast({
        title: t(isQuoteOnly ? 'quoteRequestError' : 'orderError', isQuoteOnly ? 'Quote Request Error' : 'Payment Error'),
        description: `${isQuoteOnly ? 'Quote request' : 'Payment'} failed: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine which step we're on
  const isAddonStep = currentStep === addonStepIndex;
  const isContactLegalStep = currentStep === contactLegalStepIndex;
  const isPaymentStep = !isQuoteOnly && currentStep === paymentStepIndex;
  const currentPackageStepIndex = currentStep - 1;
  const currentStepData = currentStep > 0 && currentStep <= totalRegularSteps ? regularSteps?.[currentPackageStepIndex] : null;

  const canProceed = () => {
    if (currentStep === 0) {
      return !!formData.package;
    }
    if (isAddonStep) {
      return true;
    }
    if (isContactLegalStep) {
      // Check required fields for contact/legal step
      return formData.fullName && formData.email && formData.acceptMentionObligation && formData.acceptDistribution && formData.finalNote;
    }
    if (isPaymentStep) {
      return !!selectedPaymentProvider;
    }
    return true;
  };

  return (
    <div className="w-full">
      <Card className="bg-transparent border-transparent shadow-none backdrop-blur-0">
        <CardHeader className="pb-0 pt-1 px-2 sm:px-3 py-0">
          <div className="mb-0">
            <StepIndicator steps={buildStepsData()} className="py-0 my-0 px-0" />
          </div>
        </CardHeader>
        <CardContent className="p-1.5 space-y-1">
          <AnimatePresence initial={false} mode="wait">
            <motion.div 
              key={currentStep} 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 20 }} 
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-1">
                {currentStep === 0 ? (
                  <PackageSelectionStep 
                    selectedPackage={formData.package} 
                    onPackageSelect={handlePackageSelect} 
                  />
                ) : currentStepData ? (
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">
                      {t(currentStepData.title_key) || currentStepData.title_key}
                    </h3>
                    {currentStepData.fields
                      .filter(field => field.field_type !== 'checkbox-group')
                      .sort((a, b) => a.field_order - b.field_order)
                      .map(field => (
                        <FormFieldRenderer 
                          key={field.id} 
                          field={field} 
                          value={formData[field.field_name]} 
                          onChange={value => handleInputChange(field.field_name, value)} 
                          selectedAddons={selectedAddons} 
                          onAddonChange={handleAddonChange} 
                          availableAddons={addons} 
                          addonFieldValues={addonFieldValues} 
                          onAddonFieldChange={handleAddonFieldChange} 
                          selectedPackage={selectedPackage} 
                          selectedPackageData={selectedPackageData} 
                          formData={formData} 
                        />
                      ))}
                  </div>
                ) : isAddonStep ? (
                  <AddonSelectionStep 
                    selectedPackageData={selectedPackageData} 
                    selectedAddons={selectedAddons} 
                    onAddonChange={handleAddonChange} 
                    availableAddons={addons} 
                    addonFieldValues={addonFieldValues} 
                    onAddonFieldChange={handleAddonFieldChange} 
                  />
                ) : isContactLegalStep ? (
                  <ContactLegalStep 
                    formData={formData} 
                    onInputChange={handleInputChange} 
                    selectedAddons={selectedAddons} 
                    onAddonChange={handleAddonChange} 
                    availableAddons={addons} 
                    addonFieldValues={addonFieldValues} 
                    onAddonFieldChange={handleAddonFieldChange} 
                    selectedPackage={selectedPackage} 
                    selectedPackageData={selectedPackageData} 
                  />
                ) : isPaymentStep ? (
                  <PaymentProviderSelection 
                    selectedProvider={selectedPaymentProvider} 
                    onProviderSelect={setSelectedPaymentProvider} 
                  />
                ) : (
                  <div className="text-center py-3">
                    <p className="text-white/70 text-sm">{t('loadingSteps')}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <WizardNavigation 
            currentStep={currentStep} 
            totalSteps={totalSteps} 
            canProceed={canProceed()} 
            isSubmitting={isSubmitting} 
            onPrev={handlePrev} 
            onNext={handleNext} 
            onSubmit={handleSubmit}
            isQuoteOnly={isQuoteOnly}
            isContactLegalStep={isContactLegalStep}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderWizard;
