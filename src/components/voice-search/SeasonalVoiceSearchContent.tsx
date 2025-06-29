
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, TrendingUp, Snowflake, Sun, Leaf, Flower } from 'lucide-react';

const SeasonalVoiceSearchContent = () => {
  const { t } = useLanguage();
  const [currentSeason, setCurrentSeason] = useState('');
  const [seasonalQuestions, setSeasonalQuestions] = useState<Array<{question: string, answer: string}>>([]);

  useEffect(() => {
    const month = new Date().getMonth();
    let season = '';
    
    if (month >= 2 && month <= 4) season = 'spring';
    else if (month >= 5 && month <= 7) season = 'summer';
    else if (month >= 8 && month <= 10) season = 'autumn';
    else season = 'winter';
    
    setCurrentSeason(season);
    setSeasonalQuestions(getSeasonalQuestions(season));
  }, []);

  const getSeasonalQuestions = (season: string) => {
    const seasonalContent = {
      spring: [
        { 
          question: t('springWeddingSongs', 'Care sunt cele mai bune melodii de nuntă de primăvară?'),
          answer: t('springWeddingSongsAnswer', 'Nunțile de primăvară cer melodii proaspete și romantice. Pachetul nostru de nuntă de primăvară include compoziții inspirate de natură, perfecte pentru ceremonii în aer liber.')
        },
        {
          question: "Cum să comand o melodie pentru Paște?",
          answer: "Creăm melodii speciale pentru Paște care combină tradiția cu emoția personală, perfecte pentru reuniunile de familie."
        }
      ],
      summer: [
        {
          question: t('summerAnniversarySongs', 'Cum să creez melodii de aniversare de vară?'),
          answer: t('summerAnniversarySongsAnswer', 'Aniversările de vară merită compoziții vesele și pline de energie. Creăm melodii personalizate care surprind căldura și energia dragostei de vară.')
        },
        {
          question: "Ce melodii sunt perfecte pentru nunțile de vară?",
          answer: "Nunțile de vară beneficiază de melodii cu ritmuri mai deschise și aranjamente luminoase, perfecte pentru dansul în aer liber."
        }
      ],
      autumn: [
        {
          question: t('autumnRomanticGifts', 'Care sunt cadourile muzicale romantice de toamnă?'),
          answer: t('autumnRomanticGiftsAnswer', 'Toamna aduce o atmosferă caldă și intimă, perfectă pentru cadouri muzicale emoționante. Colecția noastră de toamnă prezintă aranjamente calde și acustice.')
        }
      ],
      winter: [
        {
          question: t('holidayPersonalizedSongs', 'Puteți crea melodii personalizate pentru sărbători?'),
          answer: t('holidayPersonalizedSongsAnswer', 'Da! Creăm melodii magice pentru sărbători, perfecte pentru Crăciun, Anul Nou și celebrările de iarnă cu povestea voastră personală.')
        },
        {
          question: "Cât timp durează să primesc o melodie de Crăciun?",
          answer: "Pentru melodiile de Crăciun recomandăm să comandați cu 2-3 săptămâni înainte pentru a asigura livrarea la timp pentru sărbători."
        }
      ]
    };
    
    return seasonalContent[season as keyof typeof seasonalContent] || [];
  };

  const getSeasonIcon = () => {
    switch (currentSeason) {
      case 'spring': return <Flower className="w-5 h-5 text-green-500" />;
      case 'summer': return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'autumn': return <Leaf className="w-5 h-5 text-orange-500" />;
      case 'winter': return <Snowflake className="w-5 h-5 text-blue-500" />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  const getSeasonName = () => {
    const seasons = {
      spring: 'Primăvară',
      summer: 'Vară', 
      autumn: 'Toamnă',
      winter: 'Iarnă'
    };
    return seasons[currentSeason as keyof typeof seasons] || '';
  };

  if (!seasonalQuestions.length) return null;

  return (
    <Card className="mb-6 border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getSeasonIcon()}
          <span className="text-lg">Întrebări Sezoniere - {getSeasonName()}</span>
          <span className="text-xs bg-blue-100 px-2 py-1 rounded-full flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Trending
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {seasonalQuestions.map((item, index) => (
            <div key={index} className="voice-search-content">
              <h4 className="font-semibold text-gray-900 mb-2">{item.question}</h4>
              <p className="text-gray-700 faq-answer">{item.answer}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SeasonalVoiceSearchContent;
