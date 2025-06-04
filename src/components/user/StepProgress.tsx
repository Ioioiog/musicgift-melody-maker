
import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePackageSteps } from '@/hooks/usePackageData';

interface StepProgressProps {
  packageValue: string;
  formData: any;
  className?: string;
}

const StepProgress: React.FC<StepProgressProps> = ({ packageValue, formData, className = '' }) => {
  const { t } = useLanguage();
  const { data: steps = [] } = usePackageSteps(packageValue);

  console.log('[StepProgress] Package value:', packageValue);
  console.log('[StepProgress] Form data:', formData);
  console.log('[StepProgress] Steps data:', steps);

  if (!steps.length) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        No steps available for this package
      </div>
    );
  }

  const getFieldValue = (fieldName: string): string => {
    if (!formData || typeof formData !== 'object') {
      return 'N/A';
    }

    const value = formData[fieldName];
    if (value === null || value === undefined) {
      return 'N/A';
    }

    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'None selected';
    }

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    return String(value);
  };

  const hasFieldValue = (fieldName: string): boolean => {
    if (!formData || typeof formData !== 'object') {
      return false;
    }

    const value = formData[fieldName];
    if (value === null || value === undefined || value === '') {
      return false;
    }

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return true;
  };

  const isStepCompleted = (step: any): boolean => {
    if (!step.fields || step.fields.length === 0) {
      return true;
    }

    const requiredFields = step.fields.filter((field: any) => field.required);
    if (requiredFields.length === 0) {
      return step.fields.some((field: any) => hasFieldValue(field.field_name));
    }

    return requiredFields.every((field: any) => hasFieldValue(field.field_name));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {steps.map((step, index) => {
        const completed = isStepCompleted(step);
        const fieldsWithValues = step.fields?.filter((field: any) => hasFieldValue(field.field_name)) || [];

        return (
          <div key={step.id} className="border rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              {completed ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300" />
              )}
              <div>
                <h4 className="font-medium text-sm">
                  Step {step.step_number}: {t(step.title_key) || step.title_key}
                </h4>
                <p className="text-xs text-gray-500">
                  {completed ? 'Completed' : 'Not completed'}
                </p>
              </div>
            </div>

            {fieldsWithValues.length > 0 && (
              <div className="ml-8 space-y-2">
                {fieldsWithValues.map((field: any) => (
                  <div key={field.id} className="text-sm">
                    <span className="text-gray-600">
                      {t(field.placeholder_key || field.field_name) || field.field_name}:
                    </span>
                    <span className="ml-2 text-gray-900">
                      {getFieldValue(field.field_name)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {fieldsWithValues.length === 0 && completed && (
              <div className="ml-8 text-xs text-gray-500">
                Step completed but no specific data recorded
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepProgress;
