
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { packages } from '@/data/packages';

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

// Create a simple Package type that matches our actual data structure
export interface PackageData {
  id: string;
  type: string;
  name: string;
  basePrice: {
    EUR: number;
    RON: number;
  };
  description: string;
  features: string[];
  isPopular?: boolean;
  steps: Array<{
    id: string;
    title: string;
    description: string;
    fields: any[];
  }>;
}

export const usePackages = () => {
  const { t } = useLanguage();
  
  return useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      console.log('Using consolidated packages data...');
      
      // Return packages as they are, with the correct type
      const transformedPackages = packages.map(pkg => ({
        ...pkg,
        // Map the properties to match what components expect
        value: pkg.id,
        label_key: pkg.name,
        tagline_key: pkg.description,
        description_key: pkg.description,
        price_ron: pkg.basePrice.RON,
        price_eur: pkg.basePrice.EUR,
        delivery_time_key: '5-7 working days', // Default value
        tag: pkg.isPopular ? 'popular' : undefined,
        is_active: true,
        is_popular: pkg.isPopular || false,
        includes: pkg.features?.map((feature, index) => ({
          id: `${pkg.id}_feature_${index}`,
          include_key: feature,
          include_order: index
        })) || [],
        available_addons: [], // Default empty array
        steps: pkg.steps.map((step, stepIndex) => ({
          ...step,
          step_number: stepIndex + 1,
          title_key: step.title,
          fields: step.fields.map((field, fieldIndex) => ({
            id: field.id,
            field_name: field.label || field.id,
            field_type: field.type,
            label_key: field.label,
            placeholder_key: field.placeholder,
            required: field.required || false,
            field_order: fieldIndex,
            options: field.options?.map(opt => ({
              value: opt.value,
              label_key: opt.label
            })) || undefined
          }))
        }))
      }));
      
      console.log('Transformed packages:', transformedPackages);
      return transformedPackages;
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
        // Find the package in consolidated data using either id or name
        const packageData = packages.find(pkg => pkg.id === packageValue || pkg.name === packageValue);

        if (!packageData) {
          console.error('Package not found in consolidated data:', packageValue);
          throw new Error(`Package not found: ${packageValue}`);
        }

        console.log('Found package data:', packageData);

        if (!packageData.steps || packageData.steps.length === 0) {
          console.warn('No steps found for package:', packageValue);
          return [];
        }

        // Transform steps to match the expected StepData format
        const transformedSteps: StepData[] = packageData.steps.map((step, stepIndex) => ({
          id: step.id,
          step_number: stepIndex + 1,
          title_key: step.title,
          fields: step.fields.map((field, fieldIndex) => ({
            id: field.id,
            field_name: field.label || field.id,
            field_type: field.type,
            placeholder_key: field.placeholder,
            required: field.required || false,
            field_order: fieldIndex,
            options: field.options?.map(opt => ({
              value: opt.value,
              label_key: opt.label
            })) || undefined
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
      console.log('No addons data available, returning empty array');
      
      // Return empty array since addOns is not defined in packages.ts
      return [];
    }
  });
};

export type { PackageData as Package };
