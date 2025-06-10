
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { packages, addOns } from '@/data/packages';
import { Package, Addon } from '@/types';
import { transformStepsForWizard } from '@/utils/dynamicStepConfig';

export interface StepData {
  id: string;
  step_number: number;
  title_key: string;
  fields: Array<{
    id: string;
    field_name: string;
    field_type: string;
    label_key?: string;
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
      return transformedPackages as Package[];
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

      console.log('🔍 Getting steps for package from consolidated data:', packageValue);

      try {
        // Find the package in consolidated data
        const packageData = packages.find(pkg => pkg.value === packageValue);

        if (!packageData) {
          console.error('Package not found in consolidated data:', packageValue);
          throw new Error(`Package not found: ${packageValue}`);
        }

        console.log('🔍 Found package data:', packageData);
        console.log('🔍 Package steps before transformation:', packageData.steps);

        if (!packageData.steps || packageData.steps.length === 0) {
          console.warn('No steps found for package:', packageValue);
          return [];
        }

        // Log each step before transformation
        packageData.steps.forEach((step, index) => {
          console.log(`🔍 Step ${index + 1} before transformation:`, {
            id: step.id,
            title_key: step.title_key,
            step_number: step.step_number,
            fieldsCount: step.fields?.length || 0,
            fields: step.fields?.map(f => ({ 
              field_name: f.field_name, 
              field_type: f.field_type,
              label_key: f.label_key 
            })) || []
          });
        });

        // Transform steps to ensure all fields have proper label_key for translations
        const transformedSteps = transformStepsForWizard(packageData.steps);
        
        console.log('🔍 Steps after transformation:', transformedSteps);
        
        // Log each transformed step
        transformedSteps.forEach((step, index) => {
          console.log(`🔍 Transformed Step ${index + 1}:`, {
            id: step.id,
            title_key: step.title_key,
            step_number: step.step_number,
            fieldsCount: step.fields?.length || 0,
            fields: step.fields?.map(f => ({ 
              field_name: f.field_name, 
              field_type: f.field_type,
              label_key: f.label_key 
            })) || []
          });
        });
        
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
      
      // The addons are already in the correct format, just return them
      console.log('Addons ready for components:', addOns);
      return addOns;
    }
  });
};

export type { Package };
