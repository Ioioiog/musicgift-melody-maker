
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  isSubmitting: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({
  currentStep,
  totalSteps,
  canProceed,
  isSubmitting,
  onPrev,
  onNext,
  onSubmit
}) => {
  const { t } = useLanguage();
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex justify-between mt-6">
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={currentStep === 0 || isSubmitting}
        className="border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t('previous')}
      </Button>
      <Button
        onClick={isLastStep ? onSubmit : onNext}
        disabled={!canProceed || isSubmitting}
        className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            {t('processing', 'Processing...')}
          </>
        ) : (
          <>
            {isLastStep ? t('submitOrder') : t('next')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  );
};

export default WizardNavigation;
