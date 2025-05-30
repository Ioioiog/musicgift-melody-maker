
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface FieldValidation {
  id: string;
  field_id: string;
  validation_type: 'required' | 'min_length' | 'max_length' | 'pattern' | 'email' | 'url';
  validation_value?: string;
  error_message_key?: string;
  is_active: boolean;
}

export const useFieldValidation = (packageValue: string) => {
  return useQuery({
    queryKey: ['field-validation', packageValue],
    queryFn: async () => {
      if (!packageValue) return [];

      const { data: packageInfo, error: packageError } = await supabase
        .from('package_info')
        .select('id')
        .eq('value', packageValue)
        .single();

      if (packageError) throw packageError;

      const { data: steps, error: stepsError } = await supabase
        .from('steps')
        .select(`
          id,
          fields:step_fields(
            id,
            field_name,
            validation:field_validation(*)
          )
        `)
        .eq('package_id', packageInfo.id)
        .eq('is_active', true);

      if (stepsError) throw stepsError;

      // Flatten validations from all fields
      const validations: (FieldValidation & { target_field: string })[] = [];
      steps.forEach(step => {
        step.fields.forEach((field: any) => {
          field.validation.forEach((val: any) => {
            validations.push({
              ...val,
              target_field: field.field_name
            });
          });
        });
      });

      return validations;
    },
    enabled: !!packageValue
  });
};

export const validateField = (
  fieldName: string,
  value: any,
  validations: (FieldValidation & { target_field: string })[]
): { isValid: boolean; errors: string[] } => {
  const fieldValidations = validations.filter(val => 
    val.target_field === fieldName && val.is_active
  );

  const errors: string[] = [];

  fieldValidations.forEach(validation => {
    switch (validation.validation_type) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          errors.push(validation.error_message_key || 'fieldRequired');
        }
        break;
      case 'min_length':
        if (value && String(value).length < parseInt(validation.validation_value || '0')) {
          errors.push(validation.error_message_key || 'fieldTooShort');
        }
        break;
      case 'max_length':
        if (value && String(value).length > parseInt(validation.validation_value || '999')) {
          errors.push(validation.error_message_key || 'fieldTooLong');
        }
        break;
      case 'pattern':
        if (value && validation.validation_value) {
          const regex = new RegExp(validation.validation_value);
          if (!regex.test(String(value))) {
            errors.push(validation.error_message_key || 'fieldInvalidFormat');
          }
        }
        break;
      case 'email':
        if (value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(String(value))) {
            errors.push(validation.error_message_key || 'fieldInvalidEmail');
          }
        }
        break;
      case 'url':
        if (value) {
          try {
            new URL(String(value));
          } catch {
            errors.push(validation.error_message_key || 'fieldInvalidUrl');
          }
        }
        break;
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};
