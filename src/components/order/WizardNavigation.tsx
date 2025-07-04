
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CreditCard, Send, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  isSubmitting: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isQuoteOnly?: boolean;
  isContactLegalStep?: boolean;
  skipPayment?: boolean;
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({
  currentStep,
  totalSteps,
  canProceed,
  isSubmitting,
  onPrev,
  onNext,
  onSubmit,
  isQuoteOnly = false,
  isContactLegalStep = false,
  skipPayment = false
}) => {
  const { t } = useLanguage();
  const isLastStep = currentStep === totalSteps - 1;

  // Determine button text and icon based on context
  const getSubmitButtonContent = () => {
    if (isQuoteOnly) {
      return {
        icon: <Send className="w-3 h-3 mr-1" />,
        text: isSubmitting 
          ? t('submittingRequest', 'Submitting request...') 
          : t('submitQuoteRequest', 'Submit Quote Request')
      };
    } else if (skipPayment) {
      return {
        icon: <CheckCircle className="w-3 h-3 mr-1" />,
        text: isSubmitting 
          ? t('processing', 'Processing...') 
          : t('completeOrder', 'Complete Order')
      };
    } else {
      return {
        icon: <CreditCard className="w-3 h-3 mr-1" />,
        text: isSubmitting 
          ? t('processing', 'Processing...') 
          : t('completeOrder', 'Complete Order')
      };
    }
  };

  const submitContent = getSubmitButtonContent();

  return (
    <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/20">
      <Button
        type="button"
        variant="outline"
        onClick={onPrev}
        disabled={currentStep === 0}
        className="h-8 px-3 text-xs bg-white/10 border-white/30 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-3 h-3 mr-1" />
        {t('previous')}
      </Button>

      {isLastStep ? (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={!canProceed || isSubmitting}
          className="h-8 px-4 text-xs bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
              <span>{submitContent.text}</span>
            </div>
          ) : (
            <div className="flex items-center">
              {submitContent.icon}
              <span>{submitContent.text}</span>
            </div>
          )}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="h-8 px-3 text-xs text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-black-500 bg-orange-500 hover:bg-orange-400"
        >
          {t('next')}
          <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      )}
    </div>
  );
};

export default WizardNavigation;
