
import { lazy, Suspense } from 'react';

const OptimizedAnimatedStepFlow = lazy(() => import('./OptimizedAnimatedStepFlow'));

const LazyAnimatedStepFlow = () => {
  return (
    <Suspense fallback={
      <div 
        className="py-8 flex justify-center items-center"
        style={{
          minHeight: '400px',
          contain: 'layout style',
          contentVisibility: 'auto',
          containIntrinsicSize: '100vw 400px'
        }}
      >
        <div className="animate-pulse text-white/70">Loading process...</div>
      </div>
    }>
      <OptimizedAnimatedStepFlow />
    </Suspense>
  );
};

export default LazyAnimatedStepFlow;
