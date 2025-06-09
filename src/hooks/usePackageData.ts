
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { packages, addOns, type PackageData } from '@/data/packages';

export interface StepData {
  id: string;
  step_number: number;
  title_key: string;
  fields: Array<{
    id: string;
    field_name: string;
    field_type: string;
    placeholder_key?: string;
    required: boolean;
    field_order: number;
    options?: Array<{ value: string; label_key: string; }>;
  }>;
}

export const usePackages = () => {
  const { t } = useLanguage();
  
  return useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      console.log('Using consolidated packages data...');
      
      // Sort includes by include_order for each package (if available)
      const transformedPackages = packages.map(pkg => ({
        ...pkg,
        includes: pkg.includes || []
      }));
      
      console.log('Transformed packages:', transformedPackages);
      return transformedPackages as PackageData[];
    }
  });
};

export const usePackageSteps = (packageValue: string) => {
  return useQuery({
    queryKey: ['package-steps', packageValue],
    queryFn: async () => {
      if (!packageValue) {
        console.log('No package value provided, returning empty array');
        return [];
      }

      console.log('Getting steps for package from consolidated data:', packageValue);

      try {
        // Find the package in consolidated data
        const packageData = packages.find(pkg => pkg.value === packageValue);

        if (!packageData) {
          console.error('Package not found in consolidated data:', packageValue);
          throw new Error(`Package not found: ${packageValue}`);
        }

        console.log('Found package data:', packageData);

        if (!packageData.steps || packageData.steps.length === 0) {
          console.warn('No steps found for package:', packageValue);
          return [];
        }

        // Transform the steps to match the StepData interface
        const transformedSteps: StepData[] = packageData.steps.map((step, index) => ({
          id: step.id,
          step_number: index + 1,
          title_key: step.title_key,
          fields: step.fields.map((field, fieldIndex) => ({
            id: field.id,
            field_name: field.id,
            field_type: field.type,
            placeholder_key: field.placeholder_key,
            required: field.required,
            field_order: fieldIndex + 1,
            options: field.options
          }))
        }));

        console.log('Steps ready for component:', transformedSteps);
        return transformedSteps;

      } catch (error) {
        console.error('Error in usePackageSteps:', error);
        throw error;
      }
    },
    enabled: !!packageValue,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};

export const useAddons = () => {
  return useQuery({
    queryKey: ['addons'],
    queryFn: async () => {
      console.log('Using consolidated addons data...');
      
      // The addons are already in the correct format, just return them
      console.log('Addons ready for components:', addOns);
      return addOns;
    }
  });
};

export type { PackageData };
