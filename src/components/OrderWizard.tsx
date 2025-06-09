
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
import AddonSelectionStep from './order/AddonSelectionStep';
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
  address?: string;
  city?: string;
  acceptMentionObligation?: boolean;
  acceptDistribution?: boolean;
  finalNote?: boolean;
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
  
  const selectedPackage = formData.package as string;
  const { data: allPackageSteps = [], isLoading: isStepsLoading } = usePackageSteps(selectedPackage);
  
  // Only get regular package steps (exclude contact/legal as it's now universal)
  const regularSteps = allPackageSteps
    .filter(step => step.title_key !== 'contactDetailsStep')
    .sort((a, b) => a.step_number - b.step_number);
  
  // Build the complete step flow - Contact & Legal is now ALWAYS present
  const totalRegularSteps = regularSteps.length;
  const addonStepIndex = 1 + totalRegularSteps; // After package selection + regular steps
  const contactLegalStepIndex = addonStepIndex + 1; // Always after addons
  const paymentStepIndex = contactLegalStepIndex + 1; // Always after contact/legal
  const totalSteps = paymentStepIndex + 1;
  
  const selectedPackageData = packages.find(pkg => pkg.value === selectedPackage);

  // Define standard Contact & Legal step fields
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

  useEffect(() => {
    if (preselectedPackage && packages.length > 0) {
      if (preselectedPackage === 'gift') {
        navigate('/gift');
        return;
      }
      
      setFormData(prev => ({ ...prev, package: preselectedPackage }));
      setCurrentStep(1); // Go to first form step
    }
  }, [packages, preselectedPackage, navigate]);

  const handleNext = () => {
    if (currentStep === 0) {
      if (!formData.package) return;
      setCurrentStep(1); // Go to first form step
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
    console.log('🔍 Form Data Validation Starting...');
    
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

    // Validate legal acceptance checkboxes
    const requiredAcceptances = ['acceptMentionObligation', 'acceptDistribution', 'finalNote'];
    const missingAcceptances = requiredAcceptances.filter(field => !formData[field]);
    
    if (missingAcceptances.length > 0) {
      console.error('❌ Missing required acceptances:', missingAcceptances);
      throw new Error('Please accept all required terms and conditions');
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      console.error('❌ Invalid email format:', formData.email);
      throw new Error('Please enter a valid email address');
    }

    if (formData.fullName && formData.fullName.trim().length < 2) {
      console.error('❌ Full name too short:', formData.fullName);
      throw new Error('Please enter a valid full name (at least 2 characters)');
    }

    // Validate invoice type specific fields
    if (formData.invoiceType === 'company') {
      if (!formData.companyName || formData.companyName.trim().length < 2) {
        throw new Error('Company name is required for company invoices');
      }
    }

    if (totalPrice === null || totalPrice === undefined || totalPrice < 0) {
      console.error('❌ Invalid total price:', totalPrice);
      throw new Error('Invalid total price calculated');
    }

    console.log('✅ Form data validation passed');
    return true;
  };

  const prepareOrderData = () => {
    console.log('🏗️ Preparing order data...');
    
    // Clean and structure form data properly
    const cleanFormData = {
      email: (formData.email || '').trim(),
      fullName: (formData.fullName || '').trim(),
      phone: (formData.phone || '').trim(),
      recipientName: (formData.recipientName || '').trim(),
      occasion: (formData.occasion || '').trim(),
      address: (formData.address || '').trim(),
      city: (formData.city || 'Bucuresti').trim(),
      invoiceType: formData.invoiceType || 'individual',
      // Company-specific fields
      companyName: (formData.companyName || '').trim(),
      vatCode: (formData.vatCode || '').trim(),
      registrationNumber: (formData.registrationNumber || '').trim(),
      companyAddress: (formData.companyAddress || '').trim(),
      representativeName: (formData.representativeName || '').trim(),
      // Copy any additional form fields
      ...Object.keys(formData).reduce((acc, key) => {
        if (!['email', 'fullName', 'phone', 'recipientName', 'occasion', 'address', 'city', 'invoiceType', 'companyName', 'vatCode', 'registrationNumber', 'companyAddress', 'representativeName'].includes(key)) {
          acc[key] = formData[key];
        }
        return acc;
      }, {} as Record<string, any>)
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

    // Keep all prices in base monetary units (no multiplication)
    const orderData = {
      form_data: cleanFormData,
      selected_addons: selectedAddons,
      addon_field_values: addonFieldValues,
      total_price: totalPrice, // Keep in base monetary units
      package_value: selectedPackage,
      package_name: package_name,
      package_price: package_price,
      package_delivery_time: package_delivery_time,
      package_includes: package_includes ? JSON.parse(JSON.stringify(package_includes)) : [],
      status: 'pending',
      payment_status: totalPrice > 0 ? 'pending' : 'completed',
      currency: currency,
      payment_provider: selectedPaymentProvider,
      order_created_at: new Date().toISOString(),
      user_agent: navigator.userAgent,
      referrer: document.referrer || 'direct'
    };

    console.log('📦 Order data prepared:', {
      ...orderData,
      form_data: { ...orderData.form_data, email: orderData.form_data.email?.substring(0, 5) + '***' }
    });
    return orderData;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      console.log(`🔄 Starting payment process with provider: ${selectedPaymentProvider}`);
      console.log('📦 Order data being submitted:', {
        package: selectedPackage,
        addons: selectedAddons.length,
        totalPrice,
        paymentProvider: selectedPaymentProvider,
        customerEmail: formData.email?.substring(0, 5) + '***'
      });
      
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

      // Handle SmartBill payment with enhanced error handling and logging
      if (selectedPaymentProvider === 'smartbill') {
        console.log('🔵 Processing payment with SmartBill');
        console.log('🔵 SmartBill order payload:', {
          totalPrice: orderData.total_price,
          currency: orderData.currency,
          packageName: orderData.package_name,
          customerInfo: {
            email: orderData.form_data.email?.substring(0, 5) + '***',
            name: orderData.form_data.fullName?.substring(0, 5) + '***',
            invoiceType: orderData.form_data.invoiceType
          }
        });
        
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
            orderData: orderData, // No price conversion - handled in edge function
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
            orderData: orderData, // No price conversion - handled in edge function
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
      console.error(`💥 ${selectedPaymentProvider?.toUpperCase()} Payment Error:`, error);
      
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('💥 Full error details:', {
        message: errorMessage,
        provider: selectedPaymentProvider,
        package: selectedPackage,
        totalPrice
      });
      
      toast({
        title: t('orderError', 'Payment Error'),
        description: `Payment failed: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Build the steps data for StepIndicator
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
      const stepIndex = index + 1; // currentStep for regular steps starts at 1
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

    // Payment Step
    const paymentStepNumber = contactStepNumber + 1;
    steps.push({
      number: paymentStepNumber,
      label: t('payment', 'Payment'),
      isCompleted: false, // Payment is never completed in this flow
      isCurrent: currentStep === paymentStepIndex
    });

    return steps;
  };

  // Determine which step we're on
  const isAddonStep = currentStep === addonStepIndex;
  const isContactLegalStep = currentStep === contactLegalStepIndex; // Always available now
  const isPaymentStep = currentStep === paymentStepIndex;
  
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
      return formData.fullName && formData.email && 
             formData.acceptMentionObligation && 
             formData.acceptDistribution && 
             formData.finalNote;
    }
    if (isPaymentStep) {
      return !!selectedPaymentProvider;
    }
    return true;
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-300 shadow-xl">
        <CardHeader className="pb-2 pt-6">
          <CardTitle className="text-2xl font-bold text-white">
            {t('orderDetails')}
          </CardTitle>
          <p className="text-white/80">
            {t('completeAllSteps')}
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4">
            <StepIndicator steps={buildStepsData()} />
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
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">
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
                          onChange={(value) => handleInputChange(field.field_name, value)}
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
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">
                      {t('contactDetailsStep', 'Contact Details & Legal Acceptance')}
                    </h3>
                    {contactLegalStepFields
                      .sort((a, b) => a.field_order - b.field_order)
                      .map(field => (
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
                          selectedPackageData={selectedPackageData}
                          formData={formData}
                        />
                      ))}
                  </div>
                ) : isPaymentStep ? (
                  <PaymentProviderSelection
                    selectedProvider={selectedPaymentProvider}
                    onProviderSelect={setSelectedPaymentProvider}
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-white/70">{t('loadingSteps')}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 0 || isSubmitting}
              className="border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('previous')}
            </Button>
            <Button
              onClick={currentStep === totalSteps - 1 ? handleSubmit : handleNext}
              disabled={!canProceed() || (currentStep > 0 && !isAddonStep && !isPaymentStep && !isContactLegalStep && isStepsLoading) || isSubmitting}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
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
