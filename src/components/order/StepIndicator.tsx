
import React from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const { t } = useLanguage();
  
  const steps = [
    { number: 1, label: t('stepPackage') },
    { number: 2, label: t('stepDetails') },
    { number: 3, label: t('stepStory') },
    { number: 4, label: t('stepPreferences') },
    { number: 5, label: t('stepContact') }
  ].slice(0, totalSteps);

  return (
    <div className="mb-12">
      {/* Progress Bar Background */}
      <div className="relative mb-8">
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 rounded-full" />
        <div 
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-700 ease-in-out"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
        
        {/* Step Circles */}
        <div className="relative flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-col items-center group">
              <div className={`
                relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                transition-all duration-300 ease-in-out transform
                ${step.number < currentStep 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-110' :
                  step.number === currentStep 
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-xl scale-110 ring-4 ring-purple-200' :
                    'bg-white border-2 border-gray-300 text-gray-500 hover:border-purple-300'
                }
              `}>
                {step.number < currentStep ? (
                  <Check className="w-5 h-5 animate-fade-in" />
                ) : (
                  <span className="transition-all duration-200">{step.number}</span>
                )}
                
                {/* Pulse animation for current step */}
                {step.number === currentStep && (
                  <div className="absolute inset-0 rounded-full bg-purple-600 animate-ping opacity-20" />
                )}
              </div>
              
              {/* Step Label */}
              <div className={`
                mt-3 text-center transition-all duration-300
                ${step.number <= currentStep 
                  ? 'text-purple-700 font-semibold' 
                  : 'text-gray-500 font-medium'
                }
              `}>
                <span className="text-sm lg:text-base whitespace-nowrap">
                  {step.label}
                </span>
                {step.number === currentStep && (
                  <div className="w-2 h-2 bg-purple-600 rounded-full mx-auto mt-1 animate-pulse" />
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
