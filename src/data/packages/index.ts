
import type { Package, Addon } from '@/types';
import { personalPackages } from './personalPackages';
import { businessPackages } from './businessPackages';
import { specialtyPackages } from './specialtyPackages';
import { eventPackages } from './eventPackages';
import { addOns } from '../addons';

// Combine all packages
export const packages: Package[] = [
  ...personalPackages,
  ...businessPackages,
  ...specialtyPackages,
  ...eventPackages
];

// Export addons
export { addOns };

// Export type alias for backwards compatibility
export type PackageData = Package;
export type { Package, Addon };
