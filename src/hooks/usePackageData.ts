
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from './useTranslations';

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

export const usePackages = () => {
  const { t } = useTranslation();
  
  return useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      console.log('Fetching packages...');
      
      const { data: packages, error } = await supabase
        .from('package_info')
        .select(`
          *,
          tags:package_tags(*),
          includes:package_includes(*)
        `)
        .eq('is_active', true)
        .order('value');

      if (error) {
        console.error('Error fetching packages:', error);
        throw error;
      }
      
      console.log('Fetched packages:', packages);
      
      // Transform packages to include translated labels where available
      const transformedPackages = packages?.map(pkg => ({
        ...pkg,
        // Keep original structure but allow translations to be used in components
        includes: pkg.includes?.sort((a: any, b: any) => a.include_order - b.include_order) || []
      }));
      
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

      console.log('Fetching steps for package:', packageValue);

      try {
        // First get the package info
        const { data: packageInfo, error: packageError } = await supabase
          .from('package_info')
          .select('id')
          .eq('value', packageValue)
          .single();

        if (packageError) {
          console.error('Error fetching package info:', packageError);
          throw new Error(`Package not found: ${packageValue}`);
        }

        if (!packageInfo) {
          console.error('Package info not found for value:', packageValue);
          throw new Error(`Package not found: ${packageValue}`);
        }

        console.log('Found package info:', packageInfo);

        // Then get the steps with fields
        const { data: steps, error: stepsError } = await supabase
          .from('steps')
          .select(`
            *,
            fields:step_fields(*)
          `)
          .eq('package_id', packageInfo.id)
          .eq('is_active', true)
          .order('step_order');

        if (stepsError) {
          console.error('Error fetching steps:', stepsError);
          throw stepsError;
        }

        console.log('Raw steps data from database:', steps);

        if (!steps || steps.length === 0) {
          console.warn('No steps found for package:', packageValue, 'with package_id:', packageInfo.id);
          return [];
        }

        // Transform and validate the data
        const transformedSteps = steps.map(step => {
          const transformedFields = (step.fields || [])
            .sort((a: any, b: any) => a.field_order - b.field_order)
            .map((field: any) => ({
              ...field,
              // Transform options to proper FieldOption format
              options: field.options ? field.options.map((option: any) => {
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
      console.log('Fetching addons...');
      
      const { data, error } = await supabase
        .from('addons')
        .select('*')
        .eq('is_active', true)
        .order('addon_key');

      if (error) {
        console.error('Error fetching addons:', error);
        throw error;
      }
      
      console.log('Fetched addons:', data);
      return data;
    }
  });
};
