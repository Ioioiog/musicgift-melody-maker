import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Volume2, MessageCircle } from 'lucide-react';
import VoiceSearchFAQ from './VoiceSearchFAQ';
import TestimonialsByLocationSection from './TestimonialsByLocationSection';
import IntentBasedContent from './IntentBasedContent';
import QuickFactsSection from './QuickFactsSection';
import VoiceSearchTips from './VoiceSearchTips';

const EnhancedVoiceSearchSection = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!isVisible) {
    return (
      <div ref={sectionRef} className="py-16 px-4">
        <div className="max-w-6xl mx-auto h-96 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading Enhanced FAQ...</div>
        </div>
      </div>
    );
  }

  return (
    <section ref={sectionRef} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Volume2 className="w-8 h-8 text-blue-600" />
            <MessageCircle className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('voiceSearchFaqTitle')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('voiceSearchFaqSubtitle')}
          </p>
        </div>

        {/* Intent-Based Content */}
        <IntentBasedContent />

        {/* Enhanced FAQ */}
        <VoiceSearchFAQ />

        {/* Testimonials by Location - replaces LocalServicesSection */}
        <TestimonialsByLocationSection />

        {/* Quick Facts */}
        <QuickFactsSection />

        {/* Voice Search Tips */}
        <VoiceSearchTips />
      </div>
    </section>
  );
};

export default EnhancedVoiceSearchSection;
