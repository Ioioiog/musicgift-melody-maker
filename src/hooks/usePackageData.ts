import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from './useTranslations';
import { samplePackages } from '@/data/samplePackages';

export interface PackageData {
  id: string;
  value: string;
  label_key: string;
  price: number;
  tagline_key?: string;
  description_key?: string;
  delivery_time_key?: string;
  tags: Array<{
    tag_type: string;
    tag_label_key?: string;
    styling_class?: string;
  }>;
  includes: Array<{
    include_key: string;
    include_order: number;
  }>;
}

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

// Mapping between simplified values and database values
const PACKAGE_VALUE_MAPPING: Record<string, string> = {
  'business': 'pachet-business',
  'personal': 'pachet-personal',
  'premium': 'premium',
  'artist': 'artist',
  'instrumental': 'instrumental',
  'remix': 'remix'
};

// Reverse mapping for database values to simplified values
const DATABASE_TO_SIMPLE_MAPPING: Record<string, string> = {
  'pachet-business': 'business',
  'pachet-personal': 'personal',
  'premium': 'premium',
  'artist': 'artist',
  'instrumental': 'instrumental',
  'remix': 'remix'
};

export const usePackages = () => {
  const { t } = useTranslation();
  
  return useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      console.log('Using sample packages data directly...');
      
      // Transform sample packages to match the expected interface
      const transformedPackages = samplePackages.map(pkg => ({
        ...pkg,
        // Convert database value to simplified value for UI consistency
        value: DATABASE_TO_SIMPLE_MAPPING[pkg.value] || pkg.value,
        // Keep original database value for internal use
        originalValue: pkg.value,
        includes: pkg.includes?.sort((a: any, b: any) => a.include_order - b.include_order) || []
      }));
      
      console.log('Transformed sample packages:', transformedPackages);
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

      console.log('Getting steps for package from sample data:', packageValue);

      try {
        // Find the package in sample data
        const packageData = samplePackages.find(pkg => {
          const simplifiedValue = DATABASE_TO_SIMPLE_MAPPING[pkg.value] || pkg.value;
          return simplifiedValue === packageValue;
        });

        if (!packageData) {
          console.error('Package not found in sample data:', packageValue);
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
      console.log('Using sample addons (empty for now)...');
      
      // Return empty array for now since sample packages don't have addons configured
      return [];
    }
  });
};
