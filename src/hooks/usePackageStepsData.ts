
import { packageSteps } from '@/data/packages';

export interface PackageStepField {
  id: string;
  field_name: string;
  field_type: string;
  placeholder_key: string;
  required: boolean;
  field_order: number;
  options?: Array<{
    value: string;
    label_key: string;
  }>;
}

export interface PackageStep {
  step_number: number;
  title_key: string;
  fields: PackageStepField[];
}

export const usePackageStepsData = (packageValue: string): PackageStep[] => {
  // Return the steps for the specified package, or empty array if not found
  return packageSteps[packageValue as keyof typeof packageSteps] || [];
};
