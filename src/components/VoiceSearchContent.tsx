
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, Music, Heart, Gift } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const VoiceSearchContent: React.FC = () => {
  const { t } = useLanguage();

  const conversationalContent = [
    {
      question: "Unde pot să găsesc servicii de compoziții muzicale lângă mine?",
      answer: "MusicGift.ro oferă servicii profesionale de compoziții muzicale personalizate în toată România, inclusiv în București, Cluj-Napoca, Timișoara, Iași și toate celelalte orașe.",
      icon: <MapPin className="w-6 h-6" />,
      badge: "Național",
      cta: "Vezi Serviciile"
    },
    {
      question: "Care este cel mai bun cadou muzical pentru soția mea?",
      answer: "Pentru soția dumneavoastră recomandăm Pachetul Premium cu o melodie personalizată care să povestească momentele speciale din relația voastră, fiind un cadou romantic și emoționant.",
      icon: <Heart className="w-6 h-6" />,
      badge: "Romantic",
      cta: "Comandă Acum"
    },
    {
      question: "Cum să aleg cel mai bun studio de înregistrări pentru melodia mea?",
      answer: "MusicGift.ro lucrează cu studiouri profesionale echipate cu tehnologie de ultimă generație și compozitori cu peste 20 de ani de experiență în industria muzicală românească.",
      icon: <Music className="w-6 h-6" />,
      badge: "Profesional",
      cta: "Despre Noi"
    },
    {
      question: "Ce cadouri muzicale sunt potrivite pentru părinți?",
      answer: "Pentru părinți recomandăm melodii personalizate care să celebreze sacrificiile și dragostea lor necondiționată, cu versuri care să exprime recunoștința și respectul pentru tot ce au făcut.",
      icon: <Gift className="w-6 h-6" />,
      badge: "Familie",
      cta: "Pachete Cadou"
    }
  ];

  const localCities = [
    { name: "București", description: "Servicii de compoziții muzicale profesionale în Capitală" },
    { name: "Cluj-Napoca", description: "Cadouri muzicale personalizate în inima Transilvaniei" },
    { name: "Timișoara", description: "Melodii personalizate în orașul florilor" },
    { name: "Iași", description: "Compoziții muzicale în orașul celor șapte coline" },
    { name: "Constanța", description: "Cadouri muzicale la malul mării" },
    { name: "Brașov", description: "Servicii muzicale în orașul de la poalele Tâmpei" }
  ];

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
            Răspunsuri la Întrebările Dumneavoastră despre Cadourile Muzicale
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto voice-search-content">
            Găsiți rapid informațiile de care aveți nevoie despre serviciile noastre de compoziții muzicale personalizate
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
                Servicii de Compoziții Muzicale în Toată România
              </CardTitle>
              <CardDescription className="text-lg">
                Oferim cadouri muzicale personalizate în toate orașele mari din România
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
              <h3 className="font-semibold text-gray-900 mb-2">Livrare Rapidă</h3>
              <p className="text-sm text-gray-600 voice-search-content">
                Melodia dumneavoastră personalizată va fi gata în doar 3-5 zile lucrătoare
              </p>
            </CardContent>
          </Card>

          <Card className="text-center bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Calitate Garantată</h3>
              <p className="text-sm text-gray-600 voice-search-content">
                Peste 2000 de melodii create cu o rată de satisfacție de 98%
              </p>
            </CardContent>
          </Card>

          <Card className="text-center bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <Music className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Experiență Vastă</h3>
              <p className="text-sm text-gray-600 voice-search-content">
                Peste 20 de ani de experiență în industria muzicală românească
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default VoiceSearchContent;
