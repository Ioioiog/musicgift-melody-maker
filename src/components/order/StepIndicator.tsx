import React from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
interface StepInfo {
  number: number;
  label: string;
  isCompleted: boolean;
  isCurrent: boolean;
}
interface StepIndicatorProps {
  steps: StepInfo[];
  className?: string;
}
const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  className
}) => {
  const {
    t
  } = useLanguage();
  const isMobile = useIsMobile();
  const currentStep = steps.find(step => step.isCurrent);
  const completedStepsCount = steps.filter(step => step.isCompleted).length;
  const progressPercentage = completedStepsCount / (steps.length - 1) * 100;
  if (isMobile) {
    return <div className={cn("mb-4", className)}>
        {/* Mobile Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-1.5 rounded-full transition-all duration-700 ease-in-out" style={{
          width: `${progressPercentage}%`
        }} />
        </div>

        {/* Current Step Display */}
        {currentStep && <div className="text-center">
            <div className="space-y-1">
              <div className="text-sm font-medium text-white/90">
                {t('step')} {currentStep.number} {t('of')} {steps.length}
              </div>
              <div className="text-xs text-white/70">
                {currentStep.label}
              </div>
            </div>
          </div>}

        {/* Mini Step Dots */}
        <div className="flex justify-center mt-2 space-x-1.5">
          {steps.map((step, index) => <div key={step.number} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${step.isCompleted ? 'bg-green-500' : step.isCurrent ? 'bg-orange-500 scale-125' : 'bg-gray-300'}`} />)}
        </div>
      </div>;
  }

  // Desktop layout (existing design with reduced spacing)
  return <div className={cn("mb-8", className)}>
      {/* Progress Bar Background */}
      <div className="relative mb-6">
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 rounded-full" />
        <div className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-700 ease-in-out" style={{
        width: `${progressPercentage}%`
      }} />
        
        {/* Step Circles */}
        <div className="relative flex items-center justify-between">
          {steps.map((step, index) => <div key={step.number} className="flex flex-col items-center group">
              <div className={`
                relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                transition-all duration-300 ease-in-out transform
                ${step.isCompleted ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-110' : step.isCurrent ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl scale-110 ring-4 ring-orange-200' : 'bg-white border-2 border-gray-300 text-gray-500 hover:border-orange-300'}
              `}>
                {step.isCompleted ? <Check className="w-5 h-5 animate-fade-in" /> : <span className="transition-all duration-200">{step.number}</span>}
                
                {/* Pulse animation for current step */}
                {step.isCurrent && <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-orange-500" />}
              </div>
              
              {/* Step Label */}
              <div className={`
                mt-2 text-center transition-all duration-300
                ${step.isCompleted || step.isCurrent ? 'text-orange-700 font-semibold' : 'text-gray-500 font-medium'}
              `}>
                
                {step.isCurrent && <div className="w-2 h-2 bg-orange-600 rounded-full mx-auto mt-1 animate-pulse" />}
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};
export default StepIndicator;