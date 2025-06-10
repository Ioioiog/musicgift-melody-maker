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
    return <div className={cn("mb-2", className)}>
        {/* Mobile Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-1 mb-1">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-1 rounded-full transition-all duration-700 ease-in-out" style={{
          width: `${progressPercentage}%`
        }} />
        </div>

        {/* Current Step Display */}
        {currentStep && <div className="text-center">
            <div className="space-y-0.5">
              <div className="text-xs font-medium text-white/90">
                {t('step')} {currentStep.number} {t('of')} {steps.length}
              </div>
              
            </div>
          </div>}

        {/* Mini Step Dots */}
        <div className="flex justify-center mt-1.5 space-x-1">
          {steps.map((step, index) => <div key={step.number} className={`w-1 h-1 rounded-full transition-all duration-300 ${step.isCompleted ? 'bg-green-500' : step.isCurrent ? 'bg-orange-500 scale-125' : 'bg-gray-300'}`} />)}
        </div>
      </div>;
  }

  // Desktop layout (existing design with reduced spacing)
  return <div className={cn("mb-4", className)}>
      {/* Progress Bar Background */}
      <div className="relative mb-3">
        <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 rounded-full" />
        <div className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-700 ease-in-out" style={{
        width: `${progressPercentage}%`
      }} />
        
        {/* Step Circles */}
        <div className="relative flex items-center justify-between">
          {steps.map((step, index) => <div key={step.number} className="flex flex-col items-center group">
              <div className={`
                relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                transition-all duration-300 ease-in-out transform
                ${step.isCompleted ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105' : step.isCurrent ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl scale-105 ring-2 ring-orange-200' : 'bg-white border-2 border-gray-300 text-gray-500 hover:border-orange-300'}
              `}>
                {step.isCompleted ? <Check className="w-4 h-4 animate-fade-in" /> : <span className="transition-all duration-200">{step.number}</span>}
                
                {/* Pulse animation for current step */}
                {step.isCurrent && <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-orange-500" />}
              </div>
              
              {/* Step Label */}
              <div className={`
                mt-1 text-center transition-all duration-300 text-xs
                ${step.isCompleted || step.isCurrent ? 'text-orange-700 font-semibold' : 'text-gray-500 font-medium'}
              `}>
                
                {step.isCurrent && <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mx-auto mt-0.5 animate-pulse" />}
              </div>
            </div>)}
        </div>
      </div>
    </div>;
};
export default StepIndicator;