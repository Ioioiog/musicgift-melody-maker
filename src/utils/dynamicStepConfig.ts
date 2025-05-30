
import { StepData } from '@/hooks/usePackageData';

export const transformStepsForWizard = (steps: StepData[]) => {
  return steps.map(step => ({
    step: step.step_number,
    title: step.title_key,
    fields: step.fields.map(field => ({
      id: field.id,
      field_name: field.field_name,
      field_type: field.field_type,
      placeholder_key: field.placeholder_key,
      required: field.required,
      options: field.options ? field.options.map(option => {
        if (typeof option === 'string') {
          return { value: option, label_key: option };
        }
        return option;
      }) : undefined
    }))
  }));
};

export const getStepsForPackage = (steps: StepData[]) => {
  return transformStepsForWizard(steps);
};
