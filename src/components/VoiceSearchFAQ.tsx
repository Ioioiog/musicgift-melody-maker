
import React from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, Volume2, Search } from 'lucide-react';

const VoiceSearchFAQ: React.FC = () => {
  const { t } = useLanguage();

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
      answer: t('bestAnniversaryGiftsAnswer'),
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

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
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

        {/* Voice Search Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
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

export default VoiceSearchFAQ;
