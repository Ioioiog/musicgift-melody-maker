
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
  phone?: string;
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
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<string>('stripe');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();
  const { currency } = useCurrency();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: packages = [] } = usePackages();
  const { data: addons = [] } = useAddons();
  
  const selectedPackage = formData.package as string;
  const { data: packageSteps = [], isLoading: isStepsLoading } = usePackageSteps(selectedPackage);
  
  const totalSteps = 1 + (packageSteps?.length || 0) + 1;
  const selectedPackageData = packages.find(pkg => pkg.value === selectedPackage);

  useEffect(() => {
    if (preselectedPackage && packages.length > 0) {
      if (preselectedPackage === 'gift') {
        navigate('/gift');
        return;
      }
      
      setFormData(prev => ({ ...prev, package: preselectedPackage }));
      setCurrentStep(1);
    }
  }, [packages, preselectedPackage, navigate]);

  const handleNext = () => {
    if (currentStep === 0) {
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
    if (packageValue === 'gift') {
      navigate('/gift');
      return;
    }
    
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

  const validateFormData = () => {
    console.log('🔍 Enhanced Form Data Validation Starting...');
    
    if (!formData || typeof formData !== 'object') {
      console.error('❌ Form data is not a valid object:', formData);
      throw new Error('Form data is missing or invalid');
    }

    if (!selectedPackage || selectedPackage === '') {
      console.error('❌ No package selected');
      throw new Error('Please select a package before proceeding');
    }

    const requiredFields = ['email', 'fullName'];
    const missingFields = requiredFields.filter(field => {
      const value = formData[field];
      const isEmpty = !value || value === '' || (typeof value === 'string' && value.trim() === '');
      if (isEmpty) {
        console.error(`❌ Missing or empty field: ${field} = "${value}"`);
      }
      return isEmpty;
    });
    
    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      console.error('❌ Invalid email format:', formData.email);
      throw new Error('Please enter a valid email address');
    }

    if (formData.fullName && formData.fullName.trim().length < 2) {
      console.error('❌ Full name too short:', formData.fullName);
      throw new Error('Please enter a valid full name (at least 2 characters)');
    }

    if (totalPrice === null || totalPrice === undefined || totalPrice < 0) {
      console.error('❌ Invalid total price:', totalPrice);
      throw new Error('Invalid total price calculated');
    }

    console.log('✅ Enhanced form data validation passed');
    return true;
  };

  const prepareOrderData = () => {
    console.log('🏗️ Preparing enhanced order data...');
    
    const structuredFormData = {
      email: (formData.email || '').trim(),
      fullName: (formData.fullName || '').trim(),
      phone: (formData.phone || '').trim(),
      recipientName: (formData.recipientName || '').trim(),
      occasion: (formData.occasion || '').trim(),
      invoiceType: formData.invoiceType || '',
      companyName: (formData.companyName || '').trim(),
      vatCode: (formData.vatCode || '').trim(),
      registrationNumber: (formData.registrationNumber || '').trim(),
      companyAddress: (formData.companyAddress || '').trim(),
      representativeName: (formData.representativeName || '').trim(),
      ...formData
    };

    const selectedPackageData = packages.find(pkg => pkg.value === selectedPackage);
    
    if (!selectedPackageData) {
      console.error('❌ Selected package data not found:', selectedPackage);
      throw new Error('Selected package not found');
    }

    const package_name = selectedPackageData?.label_key;
    const package_price = selectedPackageData ? getPackagePrice(selectedPackageData, currency) : 0;
    const package_delivery_time = selectedPackageData?.delivery_time_key;
    const package_includes = selectedPackageData?.includes;

    const orderData = {
      form_data: structuredFormData,
      selected_addons: selectedAddons,
      addon_field_values: addonFieldValues,
      total_price: totalPrice * 100,
      package_value: selectedPackage,
      package_name: package_name,
      package_price: package_price,
      package_delivery_time: package_delivery_time,
      package_includes: package_includes ? JSON.parse(JSON.stringify(package_includes)) : [],
      status: 'pending',
      payment_status: 'pending',
      currency: currency,
      payment_provider: selectedPaymentProvider,
      order_created_at: new Date().toISOString(),
      user_agent: navigator.userAgent,
      referrer: document.referrer || 'direct'
    };

    console.log('📦 Enhanced order data prepared:', JSON.stringify(orderData, null, 2));
    return orderData;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      console.log(`🔄 Starting payment process with provider: ${selectedPaymentProvider}`);
      
      validateFormData();
      
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

      const orderData = prepareOrderData();

      // For Stripe, always use redirect mode
      if (selectedPaymentProvider === 'stripe') {
        console.log('🟣 Using Stripe payment gateway in redirect mode');
        
        const { data: paymentResponse, error: paymentError } = await supabase.functions.invoke('stripe-create-payment', {
          body: {
            orderData,
            returnUrl: `${window.location.origin}/payment/success`
          }
        });

        if (paymentError || !paymentResponse?.success) {
          throw new Error(paymentResponse?.error || 'Failed to initialize Stripe payment');
        }

        // Redirect to Stripe Checkout
        if (paymentResponse.paymentUrl) {
          window.location.href = paymentResponse.paymentUrl;
        } else {
          throw new Error('No payment URL received from Stripe');
        }
      } else {
        // Handle other payment providers
        let edgeFunctionName = selectedPaymentProvider === 'revolut' 
          ? 'revolut-create-payment' 
          : 'smartbill-create-invoice';

        const { data: paymentResponse, error: paymentError } = await supabase.functions.invoke(edgeFunctionName, {
          body: {
            orderData,
            returnUrl: `${window.location.origin}/payment/success`
          }
        });

        if (paymentError || !paymentResponse?.success) {
          throw new Error(paymentResponse?.error || `Failed to initialize ${selectedPaymentProvider} payment`);
        }

        if (paymentResponse.paymentUrl) {
          window.location.href = paymentResponse.paymentUrl;
        } else {
          navigate('/payment/success?orderId=' + paymentResponse.orderId);
        }
      }

    } catch (error) {
      console.error('💥 Payment processing error:', error);
      
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
    return true;
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
