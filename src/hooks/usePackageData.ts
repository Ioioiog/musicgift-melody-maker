
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { packages, addOns } from '@/data/packages';
import type { Package, Addon, Step, Field } from '@/types';

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
      
      // The packages are already in the correct format matching Package interface
      console.log('Transformed packages:', packages);
      return packages as Package[];
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

        // Steps are already in the correct format
        console.log('Steps ready for component:', packageData.steps);
        return packageData.steps as StepData[];

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
      
      // The addons are already in the correct format matching Addon interface
      console.log('Addons ready for components:', addOns);
      return addOns as Addon[];
    }
  });
};

export type { Package as PackageData, Addon };
