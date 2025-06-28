
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, Music, Heart, Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const VoiceSearchContent: React.FC = () => {
  const { t, language } = useLanguage();

  const conversationalContent = [
    {
      question: t('musicServicesNearMe'),
      answer: t('musicServicesNearMeAnswer'),
      icon: <MapPin className="w-6 h-6" />,
      badge: t('fastDelivery'),
      cta: t('seePackages', 'See Services')
    },
    {
      question: t('bestGiftForWife'),
      answer: t('bestGiftForWifeAnswer'),
      icon: <Heart className="w-6 h-6" />,
      badge: t('qualityGuaranteed'),
      cta: t('orderNow', 'Order Now')
    },
    {
      question: t('howToOrderSong'),
      answer: t('howToOrderAnswer'),
      icon: <Music className="w-6 h-6" />,
      badge: t('vastExperience'),
      cta: t('about', 'About Us')
    },
    {
      question: t('bestAnniversaryGifts'),
      answer: t('bestAnniversaryGiftsAnswer'),
      icon: <Gift className="w-6 h-6" />,
      badge: t('perfectGifts', 'Perfect Gifts'),
      cta: t('packages', 'Gift Packages')
    }
  ];

  // Region-specific cities based on language
  const getLocalCities = () => {
    switch (language) {
      case 'en':
        return [
          { name: "London", description: t('londonServices', 'Professional music composition services in the capital') },
          { name: "Manchester", description: t('manchesterServices', 'Personalized musical gifts in the heart of England') },
          { name: "Birmingham", description: t('birminghamServices', 'Custom songs in England\'s second city') },
          { name: "Glasgow", description: t('glasgowServices', 'Music compositions in Scotland\'s largest city') },
          { name: "Dublin", description: t('dublinServices', 'Musical gifts in the Irish capital') },
          { name: "Edinburgh", description: t('edinburghServices', 'Music services in Scotland\'s historic capital') }
        ];
      case 'fr':
        return [
          { name: "Paris", description: t('parisServices', 'Services de composition musicale professionnels dans la capitale') },
          { name: "Lyon", description: t('lyonServices', 'Cadeaux musicaux personnalisés dans la capitale gastronomique') },
          { name: "Marseille", description: t('marseilleServices', 'Chansons personnalisées dans la cité phocéenne') },
          { name: "Toulouse", description: t('toulouseServices', 'Compositions musicales dans la ville rose') },
          { name: "Bordeaux", description: t('bordeauxServices', 'Cadeaux musicaux dans la capitale mondiale du vin') },
          { name: "Lille", description: t('lilleServices', 'Services musicaux dans le nord de la France') }
        ];
      case 'de':
        return [
          { name: "Berlin", description: t('berlinServices', 'Professionelle Musikkompositionsdienste in der Hauptstadt') },
          { name: "München", description: t('munichenServices', 'Personalisierte Musikgeschenke im Herzen Bayerns') },
          { name: "Hamburg", description: t('hamburgServices', 'Maßgeschneiderte Lieder in der Hansestadt') },
          { name: "Köln", description: t('cologneServices', 'Musikcompositionen in der Domstadt') },
          { name: "Frankfurt", description: t('frankfurtServices', 'Musikgeschenke in der Finanzmetropole') },
          { name: "Stuttgart", description: t('stuttgartServices', 'Musikdienste in der Automobilstadt') }
        ];
      case 'pl':
        return [
          { name: "Warszawa", description: t('warsawServices', 'Profesjonalne usługi kompozycji muzycznej w stolicy') },
          { name: "Kraków", description: t('krakowServices', 'Spersonalizowane prezenty muzyczne w królewskim mieście') },
          { name: "Gdańsk", description: t('gdanskServices', 'Niestandardowe piosenki nad Bałtykiem') },
          { name: "Wrocław", description: t('wroclawServices', 'Kompozycje muzyczne w mieście stu mostów') },
          { name: "Poznań", description: t('poznanServices', 'Prezenty muzyczne w kolebce Polski') },
          { name: "Łódź", description: t('lodzServices', 'Usługi muzyczne w sercu Polski') }
        ];
      case 'it':
        return [
          { name: "Roma", description: t('romeServices', 'Servizi professionali di composizione musicale nella capitale') },
          { name: "Milano", description: t('milanServices', 'Regali musicali personalizzati nella capitale della moda') },
          { name: "Napoli", description: t('naplesServices', 'Canzoni personalizzate nella città della pizza') },
          { name: "Torino", description: t('turinServices', 'Composizioni musicali nella prima capitale d\'Italia') },
          { name: "Firenze", description: t('florenceServices', 'Regali musicali nella culla del Rinascimento') },
          { name: "Venezia", description: t('veniceServices', 'Servizi musicali nella città dei canali') }
        ];
      default: // Romanian
        return [
          { name: "București", description: "Servicii de compoziții muzicale profesionale în Capitală" },
          { name: "Cluj-Napoca", description: "Cadouri muzicale personalizate în inima Transilvaniei" },
          { name: "Timișoara", description: "Melodii personalizate în orașul florilor" },
          { name: "Iași", description: "Compoziții muzicale în orașul celor șapte coline" },
          { name: "Constanța", description: "Cadouri muzicale la malul mării" },
          { name: "Brașov", description: "Servicii muzicale în orașul de la poalele Tâmpei" }
        ];
    }
  };

  const localCities = getLocalCities();

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto">
        {/* Voice Search Optimized Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 voice-search-content">
            {t('voiceSearchFaqTitle')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto voice-search-content">
            {t('voiceSearchFaqSubtitle')}
          </p>
        </motion.div>

        {/* Conversational Q&A Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {conversationalContent.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-blue-600">{item.icon}</div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {item.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
                    {item.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 voice-search-content leading-relaxed">
                    {item.answer}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    {item.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Local SEO Section */}
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

        {/* Quick Facts for Voice Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
      </div>
    </section>
  );
};

export default VoiceSearchContent;
