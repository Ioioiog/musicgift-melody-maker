
import type { Step, Field } from '@/types';

export const transformStepsForWizard = (steps: any[]): Step[] => {
  return steps.map((step, index) => ({
    id: step.id || (index + 1).toString(),
    step_number: step.step_number || index + 1,
    title_key: step.title_key || step.title,
    fields: step.step_fields?.map((field: any): Field => ({
      id: field.id || field.field_name,
      field_name: field.field_name,
      field_type: field.field_type,
      label_key: field.label_key, // Include label_key for translations
      placeholder_key: field.placeholder_key,
      required: field.is_required || field.required || false,
      field_order: field.field_order || 0,
      options: field.field_options ? (
        typeof field.field_options === 'string' 
          ? JSON.parse(field.field_options) 
          : field.field_options
      ) : undefined
    })) || []
  }));
};
