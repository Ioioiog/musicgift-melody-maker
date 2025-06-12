
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

  // Sample facts for the carousel - updated to match DidYouKnowFact interface
  const didYouKnowFacts = [
    { 
      title: t('didYouKnowTitle1', 'Music & Memory'), 
      description: t('didYouKnowFact1', 'Music can trigger powerful emotional memories and create lasting connections') 
    },
    { 
      title: t('didYouKnowTitle2', 'Personalized Impact'), 
      description: t('didYouKnowFact2', 'Personalized songs create stronger emotional connections than generic music') 
    },
    { 
      title: t('didYouKnowTitle3', 'Brain Processing'), 
      description: t('didYouKnowFact3', 'Music is processed in multiple areas of the brain simultaneously') 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navigation />
      <HeroContent />
      <ImpactCards />
      <AnimatedStepFlow />
      <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
        <LazyTestimonialSlider />
      </Suspense>
      <DidYouKnowCarousel facts={didYouKnowFacts} />
      <CollaborationSection />
      <Footer />
    </div>
  );
};

export default Index;
