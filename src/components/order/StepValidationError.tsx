
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface StepValidationErrorProps {
  errors: Record<string, string>;
  onFieldFocus?: (fieldName: string) => void;
}

const StepValidationError: React.FC<StepValidationErrorProps> = ({ errors, onFieldFocus }) => {
  const { t } = useLanguage();
  const errorFields = Object.keys(errors).filter(key => errors[key]);

  if (errorFields.length === 0) return null;

  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-5 h-5 text-red-400" />
        <h3 className="text-red-400 font-medium">
          {t('pleaseFixTheFollowingErrors', 'Please fix the following errors:')}
        </h3>
      </div>
      <ul className="space-y-1">
        {errorFields.map(fieldName => (
          <li key={fieldName} className="text-red-300 text-sm">
            • {errors[fieldName]}
            {onFieldFocus && (
              <button
                type="button"
                onClick={() => onFieldFocus(fieldName)}
                className="ml-2 text-red-200 underline hover:text-red-100"
              >
                {t('goToField', 'Go to field')}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StepValidationError;
