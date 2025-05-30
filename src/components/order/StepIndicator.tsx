
import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Package' },
    { number: 2, label: 'Details' },
    { number: 3, label: 'Story' },
    { number: 4, label: 'Preferences' },
    { number: 5, label: 'Contact' }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              step.number < currentStep ? 'bg-green-500 text-white' :
              step.number === currentStep ? 'bg-purple-600 text-white' :
              'bg-gray-300 text-gray-600'
            }`}>
              {step.number < currentStep ? <Check className="w-5 h-5" /> : step.number}
            </div>
            {index < steps.length - 1 && (
              <div className={`h-1 w-16 mx-2 ${
                step.number < currentStep ? 'bg-green-500' :
                step.number === currentStep ? 'bg-purple-200' :
                'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        {steps.map((step) => (
          <span key={step.number}>{step.label}</span>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
