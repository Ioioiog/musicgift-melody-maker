
import { Suspense, ComponentType, lazy } from 'react';

interface LazyComponentProps {
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

const DefaultFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const LazyComponent = ({ fallback = <DefaultFallback />, children }: LazyComponentProps) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);

export default LazyComponent;

// Helper function to create lazy components
export const createLazyComponent = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
) => lazy(importFunc);
