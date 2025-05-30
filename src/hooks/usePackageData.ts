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
    options?: string[];
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
      if (!packageValue) return [];

      console.log('Fetching steps for package:', packageValue);

      const { data: packageInfo, error: packageError } = await supabase
        .from('package_info')
        .select('id')
        .eq('value', packageValue)
        .single();

      if (packageError) {
        console.error('Error fetching package info:', packageError);
        throw packageError;
      }

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

      console.log('Fetched steps:', steps);

      return steps.map(step => ({
        ...step,
        fields: step.fields
          .sort((a: any, b: any) => a.field_order - b.field_order)
          .map((field: any) => ({
            ...field,
            options: field.options ? JSON.parse(field.options) : undefined
          }))
      })) as StepData[];
    },
    enabled: !!packageValue
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
