import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useLocalization } from '@/contexts/OptimizedLocalizationContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { usePackages, useAddons } from '@/hooks/usePackageData';
import PackageSelectionStep from './order/PackageSelectionStep';
import AddonSelectionStep from './order/AddonSelectionStep';
import ContactLegalStep from './order/ContactLegalStep';
import PaymentProviderSelection from './order/PaymentProviderSelection';
import OrderReviewStep from './order/OrderReviewStep';
import StepIndicator from './order/StepIndicator';
import WizardNavigation from './order/WizardNavigation';
import StepValidationError from './order/StepValidationError';
import OrderPaymentStatusChecker from './order/OrderPaymentStatusChecker';
import { validateStepData } from '@/utils/orderValidation';
import { FormFieldRenderer } from './order/FormFieldRenderer';
import { FileMetadata } from '@/types/order';

interface OrderWizardProps {
  onComplete: (orderData: any) => void;
  giftCard?: any;
  appliedDiscount?: {
    code: string;
    amount: number;
    type: string;
  } | null;
  preselectedPackage?: string | null;
  onOrderDataChange?: (orderData: any) => void;
  paymentResponse?: any;
  onPaymentResponseHandled: () => void;
}

interface StepData {
  package?: string;
  addons?: string[];
  [key: string]: any;
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
  const { toast } = useToast();
  const { t, currency } = useLocalization();
  const { user } = useAuth();
  const { data: packages = [] } = usePackages();
  const { data: addons = [] } = useAddons();

  const [currentStep, setCurrentStep] = useState(1);
  const [stepData, setStepData] = useState<StepData>({});
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize selected package from URL params
  useEffect(() => {
    if (preselectedPackage && packages.find(p => p.value === preselectedPackage)) {
      setStepData(prev => ({ ...prev, package: preselectedPackage }));
    }
  }, [preselectedPackage, packages]);

  // Update order data for parent component
  useEffect(() => {
    if (onOrderDataChange) {
      onOrderDataChange({
        ...stepData,
        selectedPackage: stepData.package,
        selectedAddons: stepData.addons
      });
    }
  }, [stepData, onOrderDataChange]);

  const totalSteps = 4;

  const nextStep = () => {
    const stepValidation = validateStepData(currentStep, stepData, t);
    if (stepValidation) {
      setValidationErrors(stepValidation);
      toast({
        title: t('completeRequiredFields'),
        description: t('completeRequiredFieldsDesc'),
        variant: "destructive"
      });
      return;
    }
    setValidationErrors({});
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const setStepValue = (key: string, value: any) => {
    setStepData({ ...stepData, [key]: value });
  };

  const handleSubmit = async () => {
    const stepValidation = validateStepData(currentStep, stepData, t);
    if (stepValidation) {
      setValidationErrors(stepValidation);
      toast({
        title: t('completeRequiredFields'),
        description: t('completeRequiredFieldsDesc'),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    setValidationErrors({});

    try {
      // Consolidate all form data
      const orderData = {
        ...stepData,
        selectedPackage: stepData.package,
        selectedAddons: stepData.addons,
      };

      // Call the onComplete callback with the consolidated order data
      onComplete(orderData);
    } catch (error: any) {
      console.error("Error during order submission:", error);
      toast({
        title: t('orderError'),
        description: error.message || t('orderErrorMessage'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Payment Status Checker */}
      {paymentResponse && (
        <OrderPaymentStatusChecker
          paymentResponse={paymentResponse}
          onComplete={onPaymentResponseHandled}
        />
      )}

      <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-300 shadow-xl">
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

        <div className="p-4 sm:p-6">
          {/* Step Content */}
          {currentStep === 1 && (
            <PackageSelectionStep
              selectedPackage={stepData.package}
              onPackageSelect={(value: string) => setStepValue('package', value)}
              validationError={validationErrors.package}
              preselectedPackage={preselectedPackage}
            />
          )}

          {currentStep === 2 && stepData.package && (
            <AddonSelectionStep
              selectedPackage={stepData.package}
              selectedAddons={stepData.addons || []}
              onAddonsSelect={(values: string[]) => setStepValue('addons', values)}
              validationError={validationErrors.addons}
            />
          )}

          {currentStep === 3 && (
            <ContactLegalStep
              stepData={stepData}
              setStepData={setStepData}
              validationErrors={validationErrors}
            />
          )}

          {currentStep === 4 && (
            <PaymentProviderSelection
              stepData={stepData}
              setStepData={setStepData}
              validationErrors={validationErrors}
            />
          )}

          {/* Display validation errors */}
          {Object.keys(validationErrors).length > 0 && (
            <StepValidationError validationErrors={validationErrors} />
          )}
        </div>

        <WizardNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={nextStep}
          onPrev={prevStep}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </Card>
    </div>
  );
};

export default OrderWizard;
