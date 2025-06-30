
import { useState, useEffect, useRef } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocationContext } from '@/contexts/LocationContext';
import { MessageCircle, Volume2, Search, MapPin, Clock, Star, Music, Quote } from 'lucide-react';
import { testimonials } from '@/data/testimonials';

const OptimizedVoiceSearchSection = () => {
  const { t, language } = useLanguage();
  const { location, loading: locationLoading } = useLocationContext();
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

  // Filter testimonials based on location
  const getLocationBasedTestimonials = () => {
    const approvedTestimonials = testimonials.filter(t => t.approved);
    
    if (!location) {
      // Fallback to Romanian testimonials if no location
      return approvedTestimonials
        .filter(t => t.location && (t.location.includes('Bucuresti') || t.location.includes('Cluj') || t.location.includes('Timisoara')))
        .slice(0, 3);
    }

    // First try to match by city
    let cityMatches = approvedTestimonials.filter(t => 
      t.location && t.location.toLowerCase().includes(location.city.toLowerCase())
    );

    if (cityMatches.length >= 2) {
      return cityMatches.slice(0, 3);
    }

    // Then try to match by country
    const countryMatches = approvedTestimonials.filter(t => {
      if (!t.location) return false;
      
      // Map country codes to testimonial locations
      const countryMappings: { [key: string]: string[] } = {
        'RO': ['Bucuresti', 'Cluj', 'Timisoara', 'Iași', 'Constanța'],
        'FR': ['France', 'Lyon'],
        'CA': ['Vancouver'],
        'GB': ['London', 'Manchester'],
        'DE': ['Berlin', 'München'],
      };

      const locationPatterns = countryMappings[location.countryCode] || [];
      return locationPatterns.some(pattern => t.location!.includes(pattern));
    });

    if (countryMatches.length >= 2) {
      return [...cityMatches, ...countryMatches].slice(0, 3);
    }

    // Fallback to top testimonials
    return approvedTestimonials
      .sort((a, b) => (b.display_order || 0) - (a.display_order || 0))
      .slice(0, 3);
  };

  const locationTestimonials = getLocationBasedTestimonials();

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

  const getLocationTitle = () => {
    if (locationLoading) return t('testimonials', 'Testimonials');
    
    if (location?.city) {
      return language === 'ro' 
        ? `Mărturii din ${location.city}` 
        : `Testimonials from ${location.city}`;
    }
    
    if (location?.country) {
      return language === 'ro' 
        ? `Mărturii din ${location.country}` 
        : `Testimonials from ${location.country}`;
    }
    
    return t('testimonials', 'Testimonials');
  };

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

        {/* Location-Based Testimonials */}
        <Card className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-blue-200 mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {getLocationTitle()}
            </CardTitle>
            <CardDescription className="text-lg">
              {language === 'ro' 
                ? 'Ce spun clienții noștri din zona dumneavoastră'
                : 'What our clients from your area are saying'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {locationLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-pulse text-gray-400">
                  {language === 'ro' ? 'Se încarcă...' : 'Loading...'}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locationTestimonials.map((testimonial, index) => (
                  <Card key={testimonial.id} className="bg-white/60 hover:bg-white/80 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Quote className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <div className="flex items-center gap-1">
                          {[...Array(testimonial.stars || 5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                        {testimonial.message}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-medium">{testimonial.name}</span>
                        {testimonial.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{testimonial.location}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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
