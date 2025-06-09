
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

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, className }) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  const currentStep = steps.find(step => step.isCurrent);
  const completedStepsCount = steps.filter(step => step.isCompleted).length;
  const progressPercentage = (completedStepsCount / (steps.length - 1)) * 100;

  if (isMobile) {
    return (
      <div className={cn("mb-8", className)}>
        {/* Mobile Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-600 font-medium">
              {t('progress', 'Progress')}
            </span>
            <span className="text-xs text-gray-600 font-medium">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-700 ease-in-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Current Step Display */}
        {currentStep && (
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl flex items-center justify-center relative">
                <span className="text-lg font-bold">{currentStep.number}</span>
                <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-orange-500" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-orange-700 text-base">
                {currentStep.label}
              </h3>
              <p className="text-xs text-gray-500">
                {t('stepXOfY', `Step ${currentStep.number} of ${steps.length}`)}
              </p>
            </div>
          </div>
        )}

        {/* Mini Step Dots */}
        <div className="flex justify-center mt-4 space-x-2">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                step.isCompleted
                  ? 'bg-green-500'
                  : step.isCurrent
                    ? 'bg-orange-500 scale-125'
                    : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Desktop layout (existing design)
  return (
    <div className={cn("mb-12", className)}>
      {/* Progress Bar Background */}
      <div className="relative mb-8">
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 rounded-full" />
        <div 
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-700 ease-in-out" 
          style={{
            width: `${progressPercentage}%`
          }} 
        />
        
        {/* Step Circles */}
        <div className="relative flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-col items-center group">
              <div className={`
                relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                transition-all duration-300 ease-in-out transform
                ${step.isCompleted 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-110' 
                  : step.isCurrent 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl scale-110 ring-4 ring-orange-200' 
                    : 'bg-white border-2 border-gray-300 text-gray-500 hover:border-orange-300'
                }
              `}>
                {step.isCompleted ? (
                  <Check className="w-5 h-5 animate-fade-in" />
                ) : (
                  <span className="transition-all duration-200">{step.number}</span>
                )}
                
                {/* Pulse animation for current step */}
                {step.isCurrent && (
                  <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-orange-500" />
                )}
              </div>
              
              {/* Step Label */}
              <div className={`
                mt-3 text-center transition-all duration-300
                ${step.isCompleted || step.isCurrent ? 'text-orange-700 font-semibold' : 'text-gray-500 font-medium'}
              `}>
                <span className="text-sm lg:text-base whitespace-nowrap">
                  {step.label}
                </span>
                {step.isCurrent && (
                  <div className="w-2 h-2 bg-orange-600 rounded-full mx-auto mt-1 animate-pulse" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
