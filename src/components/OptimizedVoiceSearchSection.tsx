
import { useState, useEffect, useRef } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, Volume2, Search, MapPin, Clock, Star, Music } from 'lucide-react';

const OptimizedVoiceSearchSection = () => {
  const { t, language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection observer for lazy loading
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

  // Don't render content until visible
  if (!isVisible) {
    return (
      <div ref={sectionRef} className="py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-6xl mx-auto h-96 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading FAQ...</div>
        </div>
      </div>
    );
  }

  const getPersonalPrice = () => language === 'ro' ? '299' : '59';
  const getPremiumPrice = () => language === 'ro' ? '499' : '99';

  // Reduced FAQ items for better performance
  const voiceSearchFAQs = [
    {
      question: t('howToOrderSong'),
      answer: t('howToOrderAnswer'),
    },
    {
      question: t('weddingSongCost'),
      answer: t('weddingSongCostAnswer'),
    },
    {
      question: t('deliveryTime'),
      answer: t('deliveryTimeAnswer'),
    },
    {
      question: t('bestAnniversaryGifts'),
      answer: language === 'ro' 
        ? `Pentru aniversări recomandăm Pachetul Personal (${getPersonalPrice()} RON) sau Pachetul Premium (${getPremiumPrice()} RON).`
        : `For anniversaries, we recommend the Personal Package (${getPersonalPrice()} EUR) or Premium Package (${getPremiumPrice()} EUR).`,
    }
  ];

  // Simplified cities data
  const localCities = language === 'ro' 
    ? [
        { name: "București", description: "Servicii de compoziții muzicale în Capitală" },
        { name: "Cluj-Napoca", description: "Cadouri muzicale în Transilvania" },
        { name: "Timișoara", description: "Melodii personalizate în orașul florilor" }
      ]
    : [
        { name: "London", description: "Professional music services in the capital" },
        { name: "Manchester", description: "Personalized musical gifts in England" },
        { name: "Birmingham", description: "Custom songs in England's second city" }
      ];

  return (
    <section ref={sectionRef} className="py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        {/* Header - simplified */}
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

        {/* FAQ Accordion - simplified */}
        <div className="mb-16">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {voiceSearchFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:text-blue-600 transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-2 pb-4 text-gray-700 leading-relaxed">
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Local Services - simplified */}
        <Card className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-blue-200 mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {t('servicesInCountry')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {localCities.map((city, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{city.name}</h4>
                    <p className="text-sm text-gray-600">{city.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Facts - simplified grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center bg-white/80">
            <CardContent className="pt-6">
              <Clock className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">{t('fastDelivery')}</h3>
              <p className="text-sm text-gray-600">{t('fastDeliveryDesc')}</p>
            </CardContent>
          </Card>

          <Card className="text-center bg-white/80">
            <CardContent className="pt-6">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">{t('qualityGuaranteed')}</h3>
              <p className="text-sm text-gray-600">{t('qualityGuaranteedDesc')}</p>
            </CardContent>
          </Card>

          <Card className="text-center bg-white/80">
            <CardContent className="pt-6">
              <Music className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">{t('vastExperience')}</h3>
              <p className="text-sm text-gray-600">{t('vastExperienceDesc')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default OptimizedVoiceSearchSection;
