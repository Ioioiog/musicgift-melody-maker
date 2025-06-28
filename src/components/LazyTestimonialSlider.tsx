
import { lazy, Suspense } from 'react';

const TestimonialSlider = lazy(() => import('./TestimonialSlider'));

const LazyTestimonialSlider = () => {
  return (
    <Suspense fallback={
      <div className="py-8 flex justify-center items-center">
        <div className="animate-pulse text-white/70">Loading testimonials...</div>
      </div>
    }>
      <TestimonialSlider />
    </Suspense>
  );
};

export default LazyTestimonialSlider;
