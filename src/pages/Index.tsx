
import { Suspense, lazy } from 'react';
import HeroContent from '@/components/HeroContent';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ImpactCards from '@/components/ImpactCards';
import AnimatedStepFlow from '@/components/AnimatedStepFlow';
import CollaborationSection from '@/components/CollaborationSection';
import DidYouKnowCarousel from '@/components/DidYouKnowCarousel';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePageMeta } from '@/hooks/usePageMeta';

// Lazy load testimonials for better performance
const LazyTestimonialSlider = lazy(() => import('@/components/LazyTestimonialSlider'));

const Index = () => {
  const { t } = useLanguage();
  
  // SEO Meta Tags
  usePageMeta({
    title_en: t('homeTitle'),
    title_ro: t('homeTitle'),
    description_en: t('homeDescription'),
    description_ro: t('homeDescription'),
    keywords_en: t('homeKeywords'),
    keywords_ro: t('homeKeywords')
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navigation />
      <HeroContent />
      <ImpactCards />
      <AnimatedStepFlow />
      <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
        <LazyTestimonialSlider />
      </Suspense>
      <DidYouKnowCarousel />
      <CollaborationSection />
      <Footer />
    </div>
  );
};

export default Index;
