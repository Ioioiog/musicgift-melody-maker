
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { packages, addons, type PackageData } from '@/data/packages';

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
      
      // Sort includes by include_order for each package
      const transformedPackages = packages.map(pkg => ({
        ...pkg,
        includes: pkg.includes?.sort((a: any, b: any) => a.include_order - b.include_order) || []
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

        // Transform the data to match the expected interface
        const transformedSteps = packageData.steps.map(step => {
          const transformedFields = (step.fields || [])
            .sort((a: any, b: any) => a.field_order - b.field_order)
            .map((field: any) => ({
              ...field,
              id: `${step.step_number}-${field.field_name}`,
              // Safe transformation of options - only process if options exists and is an array
              options: field.options && Array.isArray(field.options) ? field.options.map((option: any) => {
                // If it's already a FieldOption object, return as is
                if (typeof option === 'object' && option.value && option.label_key) {
                  return option;
                }
                // If it's a string, transform to FieldOption
                if (typeof option === 'string') {
                  return { value: option, label_key: option };
                }
                // Fallback for any other format
                return { value: String(option), label_key: String(option) };
              }) : undefined
            }));

          return {
            ...step,
            id: `step-${step.step_number}`,
            fields: transformedFields
          };
        });

        console.log('Transformed steps ready for component:', transformedSteps);
        return transformedSteps as StepData[];

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
      
      // Transform addons object to array format expected by components
      const addonsArray = Object.entries(addons).map(([key, addon]) => ({
        id: key,
        addon_key: key,
        label_key: addon.label_key,
        description_key: addon.description_key,
        price: addon.price,
        is_active: true,
        trigger_field_type: addon.trigger_field_type || null,
        trigger_field_config: addon.trigger_config || {},
        trigger_condition: 'package_in',
        trigger_condition_value: addon.packages.join(',')
      }));
      
      console.log('Transformed addons:', addonsArray);
      return addonsArray;
    }
  });
};

export type { PackageData };
