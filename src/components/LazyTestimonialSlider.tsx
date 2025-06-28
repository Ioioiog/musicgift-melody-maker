
import { lazy, Suspense } from 'react';

const OptimizedTestimonialSlider = lazy(() => import('./OptimizedTestimonialSlider'));

const LazyTestimonialSlider = () => {
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
        <div className="animate-pulse text-white/70">Loading testimonials...</div>
      </div>
    }>
      <OptimizedTestimonialSlider />
    </Suspense>
  );
};

export default LazyTestimonialSlider;
