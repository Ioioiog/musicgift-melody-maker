
import { lazy, Suspense } from 'react';

const OptimizedCollaborationSection = lazy(() => import('./OptimizedCollaborationSection'));

const LazyCollaborationSection = () => {
  return (
    <Suspense fallback={
      <div 
        className="py-8 flex justify-center items-center"
        style={{
          minHeight: '400px',
          contain: 'layout style',
          contentVisibility: 'auto',
          containIntrinsicSize: '100vw 400px',
          backgroundImage: 'url(/uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="animate-pulse text-white/70">Loading collaboration form...</div>
      </div>
    }>
      <OptimizedCollaborationSection />
    </Suspense>
  );
};

export default LazyCollaborationSection;
