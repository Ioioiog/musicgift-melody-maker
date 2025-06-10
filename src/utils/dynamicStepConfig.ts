
import type { Step, StepField } from '@/types';

export const transformStepsForWizard = (steps: any[]): Step[] => {
  return steps.map((step, index) => ({
    id: index + 1,
    title: step.title,
    description: step.description,
    fields: step.step_fields.map((field: any): StepField => ({
      name: field.field_name,
      label_key: field.label_key, // Add this line to include label_key for translations
      type: field.field_type,
      required: field.is_required,
      placeholder: field.placeholder,
      options: field.field_options ? JSON.parse(field.field_options) : undefined,
      validation: field.validation_rules ? JSON.parse(field.validation_rules) : undefined,
      conditional_logic: field.conditional_logic ? JSON.parse(field.conditional_logic) : undefined,
      section: field.section,
      order: field.field_order
    }))
  }));
};
