import { useState, useEffect, useRef } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, TrendingUp, Clock } from 'lucide-react';

const VoiceSearchFAQ = () => {
  const { t, language } = useLanguage();
  const [currentSeason, setCurrentSeason] = useState('');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) setCurrentSeason('spring');
    else if (month >= 5 && month <= 7) setCurrentSeason('summer');
    else if (month >= 8 && month <= 10) setCurrentSeason('autumn');
    else setCurrentSeason('winter');
  }, []);

  const getCurrencyData = () => {
    switch (language) {
      case 'en': return { symbol: '£', personal: '49', premium: '79', wedding: '59' };
      case 'de': return { symbol: '€', personal: '59', premium: '99', wedding: '69' };
      case 'fr': return { symbol: '€', personal: '59', premium: '99', wedding: '69' };
      default: return { symbol: 'RON', personal: '299', premium: '499', wedding: '299' };
    }
  };

  const currencyData = getCurrencyData();

  const getSeasonalQuestions = () => {
    const seasonal = {
      spring: [
        {
          question: t('springWeddingSongs', 'What are the best spring wedding songs?'),
          answer: t('springWeddingSongsAnswer', 'Spring weddings call for fresh, romantic melodies. Our spring wedding package includes nature-inspired compositions perfect for outdoor ceremonies.')
        }
      ],
      summer: [
        {
          question: t('summerAnniversarySongs', 'How to create summer anniversary songs?'),
          answer: t('summerAnniversarySongsAnswer', 'Summer anniversaries deserve upbeat, joyful compositions. We create personalized songs that capture the warmth and energy of summer love.')
        }
      ],
      autumn: [
        {
          question: t('autumnRomanticGifts', 'What are romantic autumn musical gifts?'),
          answer: t('autumnRomanticGiftsAnswer', 'Autumn brings cozy, intimate vibes perfect for heartfelt musical gifts. Our autumn collection features warm, acoustic arrangements.')
        }
      ],
      winter: [
        {
          question: t('holidayPersonalizedSongs', 'Can you create holiday personalized songs?'),
          answer: t('holidayPersonalizedSongsAnswer', 'Yes! We create magical holiday songs perfect for Christmas, New Year, and winter celebrations with your personal story.')
        }
      ]
    };
    return seasonal[currentSeason] || [];
  };

  const coreQuestions = [
    {
      question: t('howToOrderSong'),
      answer: t('howToOrderAnswer'),
      category: 'ordering'
    },
    {
      question: t('weddingSongCost'),
      answer: t('weddingSongCostAnswer'),
      category: 'pricing'
    },
    {
      question: t('deliveryTime'),
      answer: t('deliveryTimeAnswer'),
      category: 'delivery'
    },
    {
      question: t('bestAnniversaryGifts'),
      answer: t('bestAnniversaryGiftsAnswer'),
      category: 'gifts'
    }
  ];

  const intentBasedQuestions = [
    {
      question: t('comparePersonalizedSongs', 'How do personalized songs compare to other gifts?'),
      answer: t('comparePersonalizedSongsAnswer', 'Personalized songs are unique, emotional, and lasting gifts that create memories, unlike material gifts that may be forgotten.'),
      category: 'comparison'
    },
    {
      question: t('whyChoosePersonalizedMusic', 'Why choose personalized music over store-bought gifts?'),
      answer: t('whyChoosePersonalizedMusicAnswer', 'Personalized music shows deep thought and creates an emotional connection that mass-produced gifts cannot match.'),
      category: 'comparison'
    },
    {
      question: t('bestTimeToOrder', 'When is the best time to order a personalized song?'),
      answer: t('bestTimeToOrderAnswer', 'Order at least 1-2 weeks before your special occasion to ensure perfect timing and allow for any revisions.'),
      category: 'timing'
    }
  ];

  const longTailQuestions = [
    {
      question: t('personalizedSongForHusband50thBirthday', 'Can I get a personalized song for my husband\'s 50th birthday?'),
      answer: t('personalizedSongForHusband50thBirthdayAnswer', 'Absolutely! We specialize in milestone birthday songs that celebrate life achievements and personal journeys.'),
      category: 'specific'
    },
    {
      question: t('romanticSongAnniversary25Years', 'How to create a romantic song for 25-year wedding anniversary?'),
      answer: t('romanticSongAnniversary25YearsAnswer', 'Silver anniversary songs are special - we incorporate your 25-year journey, memories, and continued love into a beautiful composition.'),
      category: 'specific'
    }
  ];

  const allQuestions = [
    ...coreQuestions,
    ...getSeasonalQuestions(),
    ...intentBasedQuestions,
    ...longTailQuestions
  ];

  return (
    <div ref={sectionRef} className="mb-12">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            {t('voiceSearchFaqTitle')}
            {currentSeason && (
              <span className="text-sm bg-blue-100 px-2 py-1 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {t(`${currentSeason}Trending`, `${currentSeason} trending`)}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {allQuestions.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left hover:text-blue-600 transition-colors voice-search-content">
                  <span className="font-medium">{faq.question}</span>
                  {faq.category && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full ml-2">
                      {faq.category}
                    </span>
                  )}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-2 pb-4 text-gray-700 leading-relaxed voice-search-content faq-answer">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceSearchFAQ;
