
import React from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { MessageCircle, Volume2, Search, MapPin, Clock, Star, Music } from 'lucide-react';

const VoiceSearchSection: React.FC = () => {
  const { t, language } = useLanguage();
  const { currency } = useCurrency();

  // Get pricing based on currency
  const getPersonalPrice = () => {
    return currency === 'EUR' ? '59' : '299';
  };

  const getPremiumPrice = () => {
    return currency === 'EUR' ? '99' : '499';
  };

  const voiceSearchFAQs = [
    {
      question: t('howToOrderSong'),
      answer: t('howToOrderAnswer'),
      category: "ordering"
    },
    {
      question: t('weddingSongCost'),
      answer: t('weddingSongCostAnswer'),
      category: "pricing"
    },
    {
      question: t('deliveryTime'),
      answer: t('deliveryTimeAnswer'),
      category: "delivery"
    },
    {
      question: t('bestAnniversaryGifts'),
      answer: language === 'ro' 
        ? `Pentru aniversări recomandăm Pachetul Personal (${getPersonalPrice()} RON) sau Pachetul Premium (${getPremiumPrice()} RON). Acestea includ melodii personalizate cu versuri care spun povestea persoanei sărbătorite.`
        : `For anniversaries, we recommend the Personal Package (${getPersonalPrice()} EUR) or Premium Package (${getPremiumPrice()} EUR). These include personalized songs with lyrics that tell the story of the person being celebrated.`,
      category: "gifts"
    },
    {
      question: t('musicServicesNearMe'),
      answer: t('musicServicesNearMeAnswer'),
      category: "location"
    },
    {
      question: t('bestGiftForWife'),
      answer: t('bestGiftForWifeAnswer'),
      category: "relationship"
    }
  ];

  // Region-specific cities based on language
  const getLocalCities = () => {
    switch (language) {
      case 'en':
        return [
          { name: "London", description: t('londonServices', 'Professional music composition services in the capital') },
          { name: "Manchester", description: t('manchesterServices', 'Personalized musical gifts in the heart of England') },
          { name: "Birmingham", description: t('birminghamServices', 'Custom songs in England\'s second city') }
        ];
      case 'fr':
        return [
          { name: "Paris", description: t('parisServices', 'Services de composition musicale professionnels dans la capitale') },
          { name: "Lyon", description: t('lyonServices', 'Cadeaux musicaux personnalisés dans la capitale gastronomique') },
          { name: "Marseille", description: t('marseilleServices', 'Chansons personnalisées dans la cité phocéenne') }
        ];
      case 'de':
        return [
          { name: "Berlin", description: t('berlinServices', 'Professionelle Musikkompositionsdienste in der Hauptstadt') },
          { name: "München", description: t('munichenServices', 'Personalisierte Musikgeschenke im Herzen Bayerns') },
          { name: "Hamburg", description: t('hamburgServices', 'Maßgeschneiderte Lieder in der Hansestadt') }
        ];
      case 'pl':
        return [
          { name: "Warszawa", description: t('warsawServices', 'Profesjonalne usługi kompozycji muzycznej w stolicy') },
          { name: "Kraków", description: t('krakowServices', 'Spersonalizowane prezenty muzyczne w królewskim mieście') },
          { name: "Gdańsk", description: t('gdanskServices', 'Niestandardowe piosenki nad Bałtykiem') }
        ];
      case 'it':
        return [
          { name: "Roma", description: t('romeServices', 'Servizi professionali di composizione musicale nella capitale') },
          { name: "Milano", description: t('milanServices', 'Regali musicali personalizzati nella capitale della moda') },
          { name: "Napoli", description: t('naplesServices', 'Canzoni personalizzate nella città della pizza') }
        ];
      default: // Romanian
        return [
          { name: "București", description: "Servicii de compoziții muzicale profesionale în Capitală" },
          { name: "Cluj-Napoca", description: "Cadouri muzicale personalizate în inima Transilvaniei" },
          { name: "Timișoara", description: "Melodii personalizate în orașul florilor" }
        ];
    }
  };

  const localCities = getLocalCities();

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Volume2 className="w-8 h-8 text-blue-600" />
            <MessageCircle className="w-8 h-8 text-purple-600" />
            <Search className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('voiceSearchFaqTitle')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('voiceSearchFaqSubtitle')}
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                {t('voiceSearchFaqTitle')}
              </CardTitle>
              <CardDescription>
                {t('voiceSearchTip')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {voiceSearchFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:text-blue-600 transition-colors">
                      <span className="font-medium">{faq.question}</span>
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
        </motion.div>

        {/* Local Services Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-blue-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                {t('servicesInCountry')}
              </CardTitle>
              <CardDescription className="text-lg">
                {t('servicesInCountryDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        </motion.div>

        {/* Quick Facts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="text-center bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <Clock className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">{t('fastDelivery')}</h3>
              <p className="text-sm text-gray-600 voice-search-content">
                {t('fastDeliveryDesc')}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">{t('qualityGuaranteed')}</h3>
              <p className="text-sm text-gray-600 voice-search-content">
                {t('qualityGuaranteedDesc')}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <Music className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">{t('vastExperience')}</h3>
              <p className="text-sm text-gray-600 voice-search-content">
                {t('vastExperienceDesc')}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Voice Search Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Volume2 className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">{t('fastDelivery')}</span>
              </div>
              <p className="text-sm text-gray-600">
                {t('voiceSearchTip')}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default VoiceSearchSection;
