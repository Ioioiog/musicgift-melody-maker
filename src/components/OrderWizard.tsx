import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useOrderWizardState } from "@/hooks/useOrderWizardState";
import { usePackages, useAddons } from "@/hooks/usePackageData";
import { useNavigate } from 'react-router-dom';
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import FormFieldRenderer from './order/FormFieldRenderer';
import PackageSelectionStep from './order/PackageSelectionStep';
import AddonSelectionStep from './order/AddonSelectionStep';
import ContactLegalStep from './order/ContactLegalStep';
import StepValidationError from './order/StepValidationError';
import StepIndicator from './order/StepIndicator';
import { getPackagePrice, getAddonPrice } from '@/utils/pricing';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useOrderPayment } from '@/hooks/useOrderPayment';
import OrderPaymentStatusChecker from './order/OrderPaymentStatusChecker';
import OrderReviewStep from './order/OrderReviewStep';

interface OrderWizardProps {
  onComplete: (orderData: any) => void;
  giftCard?: any;
  appliedDiscount?: any;
  preselectedPackage?: string;
  onOrderDataChange?: (orderData: any) => void;
  paymentResponse?: any;
  onPaymentResponseHandled?: () => void;
}

const OrderWizard: React.FC<OrderWizardProps> = ({
  onComplete,
  giftCard,
  appliedDiscount,
  preselectedPackage,
  onOrderDataChange,
  paymentResponse,
  onPaymentResponseHandled
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currency } = useCurrency();
  const { data: packages = [] } = usePackages();
  const { data: addons = [] } = useAddons();
  const formRef = useRef<HTMLDivElement>(null);

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
  } = useOrderWizardState({ preselectedPackage });
  const { openPaymentWindow, isPaymentProcessing, paymentProvider } = useOrderPayment();

  // State for form errors and order confirmation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // Auto-scroll to first error
  const scrollToFirstError = useCallback(() => {
    if (Object.keys(errors).length > 0 && formRef.current) {
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = formRef.current.querySelector(`#${firstErrorField}`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (errorElement as HTMLElement).focus();
      } else {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [errors]);

  // Handle payment response when received
  useEffect(() => {
    if (paymentResponse?.paymentUrl && paymentResponse?.provider && paymentResponse?.orderId) {
      console.log('🔗 Opening payment URL in new tab:', paymentResponse.paymentUrl);
      
      try {
        openPaymentWindow(
          paymentResponse.paymentUrl, 
          paymentResponse.provider, 
          paymentResponse.orderId
        );
        
        // Clear the payment response after handling
        if (onPaymentResponseHandled) {
          onPaymentResponseHandled();
        }
      } catch (error) {
        console.error('❌ Error opening payment window:', error);
      }
    }
  }, [paymentResponse, openPaymentWindow, onPaymentResponseHandled]);

  useEffect(() => {
    if (onOrderDataChange) {
      // Map the custom state to the expected format for OrderSidebarSummary
      onOrderDataChange({
        selectedPackage: formData.package, // Map package to selectedPackage
        selectedAddons: selectedAddons,
        addonFieldValues: addonFieldValues,
        paymentProvider: selectedPaymentProvider
      });
    }
  }, [formData.package, selectedAddons, addonFieldValues, selectedPaymentProvider, onOrderDataChange]);

  // Scroll to first error when errors change
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setTimeout(scrollToFirstError, 100);
    }
  }, [errors, scrollToFirstError]);

  const selectedPackage = packages.find(pkg => pkg.value === formData.package);
  const steps = selectedPackage?.steps || [];

  // Create step indicators for progress display
  const createStepIndicators = () => {
    const stepIndicators = [];
    
    // Package selection
    stepIndicators.push({
      number: 1,
      label: t('selectPackage', 'Select Package'),
      isCompleted: currentStep > 0,
      isCurrent: currentStep === 0
    });

    // Form steps
    for (let i = 1; i <= steps.length; i++) {
      stepIndicators.push({
        number: i + 1,
        label: `${t('step', 'Step')} ${i}`,
        isCompleted: currentStep > i,
        isCurrent: currentStep === i
      });
    }

    // Addons step
    stepIndicators.push({
      number: steps.length + 2,
      label: t('selectAddons', 'Select Add-ons'),
      isCompleted: currentStep > steps.length + 1,
      isCurrent: currentStep === steps.length + 1
    });

    // Contact & Legal step
    stepIndicators.push({
      number: steps.length + 3,
      label: t('contactDetails', 'Contact & Legal'),
      isCompleted: currentStep > steps.length + 2,
      isCurrent: currentStep === steps.length + 2
    });

    // Review step
    stepIndicators.push({
      number: steps.length + 4,
      label: t('reviewOrder', 'Review Order'),
      isCompleted: currentStep > steps.length + 3,
      isCurrent: currentStep === steps.length + 3
    });

    // Payment step
    stepIndicators.push({
      number: steps.length + 5,
      label: t('payment', 'Payment'),
      isCompleted: false,
      isCurrent: currentStep === steps.length + 4
    });

    return stepIndicators;
  };

  // Validation function
  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};

    // Step 0: Package selection
    if (currentStep === 0) {
      if (!formData.package) {
        toast({
          title: t('selectPackageFirst'),
          description: t('pleaseSelectPackage', 'Please select a package to continue'),
          variant: "destructive"
        });
        return false;
      }
      return true;
    }

    // Steps 1 to steps.length: Form steps
    if (currentStep > 0 && currentStep <= steps.length) {
      const currentStepData = steps[currentStep - 1];
      if (currentStepData && currentStepData.fields) {
        currentStepData.fields.forEach((field: any) => {
          const value = formData[field.field_name];
          
          if (field.required && (!value || value.toString().trim() === '')) {
            newErrors[field.field_name] = t('fieldRequired', 'This field is required');
          } else if (value) {
            // Validate email
            if (field.field_type === 'email') {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(value)) {
                newErrors[field.field_name] = t('invalidEmail', 'Please enter a valid email address');
              }
            }
            
            // Validate URL
            if (field.field_type === 'url') {
              try {
                new URL(value);
              } catch {
                newErrors[field.field_name] = t('invalidUrl', 'Please enter a valid URL');
              }
            }
          }
        });
      }
    }

    // Addons step (steps.length + 1)
    if (currentStep === steps.length + 1) {
      // No validation needed for addons step - it's optional
      return true;
    }

    // Contact details & legal step (steps.length + 2)
    if (currentStep === steps.length + 2) {
      // Email is required
      if (!formData.email?.trim()) {
        newErrors['email'] = t('fieldRequired', 'This field is required');
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          newErrors['email'] = t('invalidEmail', 'Please enter a valid email address');
        }
      }

      // Full name is required for invoice
      if (!formData.fullName?.trim()) {
        newErrors['fullName'] = t('fieldRequired', 'This field is required');
      }
      
      if (!formData.invoiceType) {
        newErrors['invoiceType'] = t('fieldRequired', 'This field is required');
      }
      
      if (formData.invoiceType === 'company') {
        if (!formData.companyName?.trim()) {
          newErrors['companyName'] = t('fieldRequired', 'This field is required');
        }
        if (!formData.companyAddress?.trim()) {
          newErrors['companyAddress'] = t('fieldRequired', 'This field is required');
        }
        if (!formData.representativeName?.trim()) {
          newErrors['representativeName'] = t('fieldRequired', 'This field is required');
        }
      } else {
        if (!formData.address?.trim()) {
          newErrors['address'] = t('fieldRequired', 'This field is required');
        }
        if (!formData.city?.trim()) {
          newErrors['city'] = t('fieldRequired', 'This field is required');
        }
      }

      // Check legal checkboxes
      if (!formData.acceptMentionObligation) {
        newErrors['acceptMentionObligation'] = t('fieldRequired', 'This field is required');
      }
      if (!formData.acceptDistribution) {
        newErrors['acceptDistribution'] = t('fieldRequired', 'This field is required');
      }
      if (!formData.finalNote) {
        newErrors['finalNote'] = t('fieldRequired', 'This field is required');
      }
    }

    // Review order step (steps.length + 3)
    if (currentStep === steps.length + 3) {
      if (!orderConfirmed) {
        newErrors['orderConfirmation'] = t('fieldRequired', 'Please confirm your order details are correct');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted, current step:', currentStep);
    
    if (!validateCurrentStep()) {
      return;
    }

    // Handle package selection step (step 0)
    if (currentStep === 0) {
      setCurrentStep(1);
      return;
    }

    // Handle form steps (steps 1 to steps.length)
    if (currentStep > 0 && currentStep < steps.length) {
      console.log('Moving to next step:', currentStep + 1);
      setCurrentStep(currentStep + 1);
      return;
    }

    // Handle moving from last form step to addons step
    if (currentStep === steps.length) {
      console.log('Moving to addons step');
      setCurrentStep(currentStep + 1);
      return;
    }

    // Handle moving from addons step to contact details step
    if (currentStep === steps.length + 1) {
      console.log('Moving to contact details step');
      setCurrentStep(currentStep + 1);
      return;
    }

    // Handle moving from contact details to review order step
    if (currentStep === steps.length + 2) {
      console.log('Moving to review order step');
      setCurrentStep(currentStep + 1);
      return;
    }

    // Handle moving from review order to payment method step
    if (currentStep === steps.length + 3) {
      console.log('Moving to payment method step');
      setCurrentStep(currentStep + 1);
      return;
    }

    // Handle final submission (payment method step)
    if (currentStep === steps.length + 4) {
      console.log('Final submission');
      setIsSubmitting(true);
      try {
        const orderData = {
          ...formData,
          addons: selectedAddons,
          addonFieldValues: addonFieldValues,
          paymentProvider: selectedPaymentProvider
        };
        await onComplete(orderData);
      } catch (error: any) {
        toast({
          title: t('orderError'),
          description: error.message || t('orderErrorMessage'),
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevious = () => {
    console.log('Previous button clicked, current step:', currentStep);
    
    // Prevent going back if order is confirmed
    if (orderConfirmed && currentStep > steps.length + 3) {
      toast({
        title: t('orderLocked', 'Order Locked'),
        description: t('cannotGoBackAfterConfirmation', 'You cannot go back after confirming your order'),
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      console.log('Moving to previous step:', newStep);
      setCurrentStep(newStep);
      setErrors({}); // Clear errors when going back
    }
  };

  const handlePaymentProviderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPaymentProvider(event.target.value);
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    console.log('Field change:', fieldName, value);
    handleInputChange(fieldName, value);
    
    // Clear error for this field when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  const handleFieldFocus = (fieldName: string) => {
    const element = document.getElementById(fieldName);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.focus();
    }
  };

  const totalPrice = selectedPackage ? getPackagePrice(selectedPackage, currency) : 0;
  const addonsPrice = selectedAddons.reduce((total, addonKey) => {
    const addon = addons.find(a => a.addon_key === addonKey);
    return total + (addon ? getAddonPrice(addon, currency) : 0);
  }, 0);
  const totalOrderPrice = totalPrice + addonsPrice;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-white/30">
      {/* Step Progress Indicator */}
      <StepIndicator steps={createStepIndicators()} className="mb-6" />

      {/* Show payment status checker when payment is processing */}
      {isPaymentProcessing && (
        <div className="mb-6">
          <OrderPaymentStatusChecker
            orderId={paymentResponse?.orderId}
            provider={paymentProvider}
            onClose={() => {
              // Handle close if needed
            }}
          />
        </div>
      )}
      
      <div ref={formRef}>
        {/* Validation Errors Display */}
        <StepValidationError errors={errors} onFieldFocus={handleFieldFocus} />
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {currentStep === 0 ? (
            // Package Selection Step
            <PackageSelectionStep
              selectedPackage={formData.package}
              onPackageSelect={handlePackageSelect}
            />
          ) : currentStep <= steps.length ? (
            // Form Steps
            <>
              <h2 className="text-lg font-semibold text-white">{t('stepPackage', 'Step')} {currentStep} {t('of', 'of')} {steps.length}</h2>
              <Separator className="my-2 bg-white/20" />

              {steps[currentStep - 1] && steps[currentStep - 1].fields.map((field: any) => (
                <FormFieldRenderer
                  key={field.field_name}
                  field={field}
                  value={formData[field.field_name]}
                  onChange={(value) => handleFieldChange(field.field_name, value)}
                  selectedAddons={selectedAddons}
                  onAddonChange={handleAddonChange}
                  availableAddons={addons}
                  addonFieldValues={addonFieldValues}
                  onAddonFieldChange={handleAddonFieldChange}
                  selectedPackage={formData.package}
                  selectedPackageData={selectedPackage}
                  formData={formData}
                  error={errors[field.field_name]}
                />
              ))}
            </>
          ) : currentStep === steps.length + 1 ? (
            // Addons Selection Step - Updated with required props
            <AddonSelectionStep
              selectedAddons={selectedAddons}
              onAddonChange={handleAddonChange}
              availableAddons={addons}
              selectedPackageData={selectedPackage}
              addonFieldValues={addonFieldValues}
              onAddonFieldChange={handleAddonFieldChange}
            />
          ) : currentStep === steps.length + 2 ? (
            // Contact Details & Legal Step
            <ContactLegalStep
              formData={formData}
              onInputChange={handleFieldChange}
              errors={errors}
            />
          ) : currentStep === steps.length + 3 ? (
            // Review Order Step
            <OrderReviewStep
              formData={formData}
              selectedPackage={formData.package}
              selectedPackageData={selectedPackage}
              selectedAddons={selectedAddons}
              availableAddons={addons}
              giftCard={giftCard}
              appliedDiscount={appliedDiscount}
              onConfirmationChange={setOrderConfirmed}
            />
          ) : (
            // Payment Method Step
            <>
              <h2 className="text-lg font-semibold text-white">{t('choosePaymentMethod', 'Choose Payment Method')}</h2>
              <Separator className="my-2 bg-white/20" />

              <div className="space-y-4">
                {/* Netopia Payment Option */}
                <Card className={`transition-all cursor-pointer ${selectedPaymentProvider === 'smartbill' ? 'border-orange-400 bg-orange-500/10' : 'border-white/20 bg-white/5'}`}>
                  <CardContent className="p-4">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        value="smartbill"
                        checked={selectedPaymentProvider === 'smartbill'}
                        onChange={handlePaymentProviderChange}
                        className="mt-1 focus:ring-orange-500"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-white text-lg">Netopia</div>
                        <p className="text-white/70 text-sm mt-1">
                          {t('netopiaDescription', 'Secure Romanian payment processing with support for all major banks and cards')}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded">
                            {t('bankCards', 'Bank Cards')}
                          </span>
                          <span className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded">
                            {t('bankTransfer', 'Bank Transfer')}
                          </span>
                          <span className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded">
                            {t('localBanks', 'Local Banks')}
                          </span>
                        </div>
                      </div>
                    </label>
                  </CardContent>
                </Card>

                {/* Stripe Payment Option */}
                <Card className={`transition-all cursor-pointer ${selectedPaymentProvider === 'stripe' ? 'border-orange-400 bg-orange-500/10' : 'border-white/20 bg-white/5'}`}>
                  <CardContent className="p-4">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        value="stripe"
                        checked={selectedPaymentProvider === 'stripe'}
                        onChange={handlePaymentProviderChange}
                        className="mt-1 focus:ring-orange-500"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-white text-lg">Stripe</div>
                        <p className="text-white/70 text-sm mt-1">
                          {t('stripeDescription', 'International secure payment processing trusted by millions worldwide')}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded">
                            {t('creditCards', 'Credit/Debit Cards')}
                          </span>
                          <span className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded">
                            {t('applePay', 'Apple Pay')}
                          </span>
                          <span className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded">
                            {t('googlePay', 'Google Pay')}
                          </span>
                        </div>
                      </div>
                    </label>
                  </CardContent>
                </Card>

                {/* Revolut Payment Option */}
                <Card className={`transition-all cursor-pointer ${selectedPaymentProvider === 'revolut' ? 'border-orange-400 bg-orange-500/10' : 'border-white/20 bg-white/5'}`}>
                  <CardContent className="p-4">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        value="revolut"
                        checked={selectedPaymentProvider === 'revolut'}
                        onChange={handlePaymentProviderChange}
                        className="mt-1 focus:ring-orange-500"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-white text-lg">Revolut</div>
                        <p className="text-white/70 text-sm mt-1">
                          {t('revolutDescription', 'Modern digital banking with instant transfers and low fees')}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded">
                            {t('instantTransfers', 'Instant Transfers')}
                          </span>
                          <span className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded">
                            {t('lowFees', 'Low Fees')}
                          </span>
                          <span className="text-xs bg-white/10 text-white/80 px-2 py-1 rounded">
                            {t('digitalWallet', 'Digital Wallet')}
                          </span>
                        </div>
                      </div>
                    </label>
                  </CardContent>
                </Card>

                {/* Gift Card Option (if applicable) */}
                {giftCard && totalOrderPrice === 0 && (
                  <Card className={`transition-all cursor-pointer ${selectedPaymentProvider === 'gift_card' ? 'border-orange-400 bg-orange-500/10' : 'border-white/20 bg-white/5'}`}>
                    <CardContent className="p-4">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          value="gift_card"
                          checked={selectedPaymentProvider === 'gift_card'}
                          onChange={handlePaymentProviderChange}
                          className="mt-1 focus:ring-orange-500"
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-white text-lg">{t('giftCard', 'Gift Card')}</div>
                          <p className="text-white/70 text-sm mt-1">
                            {t('fullyCoveredByGiftCard', 'Your order is fully covered by your gift card balance')}
                          </p>
                        </div>
                      </label>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}

          <div className={`flex mt-6 ${currentStep > 0 ? 'justify-between' : 'justify-end'}`}>
            {currentStep > 0 && (
              <Button 
                type="button"
                variant="outline" 
                onClick={handlePrevious} 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                disabled={isSubmitting || (orderConfirmed && currentStep > steps.length + 3)}
              >
                {t('previous', 'Previous')}
              </Button>
            )}
            <Button
              type="submit"
              className={cn(
                "bg-orange-500 hover:bg-orange-600 text-white",
                isSubmitting && "animate-pulse"
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? t('submitting', 'Submitting...') : 
               currentStep === 0 ? t('continue', 'Continue') :
               currentStep <= steps.length ? t('continue', 'Continue') :
               currentStep === steps.length + 1 ? t('continue', 'Continue') :
               currentStep === steps.length + 2 ? t('continue', 'Continue') :
               currentStep === steps.length + 3 ? t('continue', 'Continue') :
               t('completeOrder', 'Complete order')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderWizard;
