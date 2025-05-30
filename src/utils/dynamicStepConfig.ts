
import { StepData } from '@/hooks/usePackageData';

export const transformStepsForWizard = (steps: StepData[]) => {
  return steps.map(step => ({
    step: step.step_number,
    title: step.title_key,
    fields: step.fields.map(field => ({
      name: field.field_name,
      type: field.field_type,
      placeholder: field.placeholder_key,
      required: field.required,
      options: field.options
    }))
  }));
};

export const getStepsForPackage = (steps: StepData[]) => {
  return transformStepsForWizard(steps);
};
