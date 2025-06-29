
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Volume2, Smartphone, MessageSquare } from 'lucide-react';

const VoiceSearchTips = () => {
  const { t, language } = useLanguage();

  const getVoiceExamples = () => {
    switch (language) {
      case 'en':
        return [
          '"Hey Google, how much does a personalized song cost?"',
          '"Alexa, find music composition services near me"',
          '"Siri, what are the best musical gifts for anniversaries?"',
          '"OK Google, how to order a custom wedding song?"'
        ];
      case 'de':
        return [
          '"Hey Google, was kostet ein personalisiertes Lied?"',
          '"Alexa, finde Musikkompositionsdienste in meiner Nähe"',
          '"Siri, was sind die besten Musikgeschenke für Jubiläen?"',
          '"OK Google, wie bestelle ich ein Hochzeitslied?"'
        ];
      case 'fr':
        return [
          '"Hey Google, combien coûte une chanson personnalisée?"',
          '"Alexa, trouve des services de composition musicale près de moi"',
          '"Siri, quels sont les meilleurs cadeaux musicaux pour les anniversaires?"',
          '"OK Google, comment commander une chanson de mariage?"'
        ];
      default:
        return [
          '"Hey Google, cât costă o melodie personalizată?"',
          '"Alexa, găsește servicii de compoziții muzicale lângă mine"',
          '"Siri, care sunt cele mai bune cadouri muzicale pentru aniversări?"',
          '"OK Google, cum comand o melodie pentru nuntă?"'
        ];
    }
  };

  const voiceExamples = getVoiceExamples();

  return (
    <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Volume2 className="w-5 h-5 text-blue-600" />
          {t('voiceSearchTips', 'Voice Search Tips')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              {t('tryTheseQuestions', 'Try These Voice Questions:')}
            </h4>
            <ul className="space-y-2">
              {voiceExamples.map((example, index) => (
                <li key={index} className="text-sm text-gray-700 voice-search-content italic">
                  {example}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {t('voiceSearchBenefits', 'Voice Search Benefits:')}
            </h4>
            <ul className="space-y-2">
              <li className="text-sm text-gray-700 flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                {t('handsFreeBrowsing', 'Hands-free browsing while multitasking')}
              </li>
              <li className="text-sm text-gray-700 flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                {t('naturalLanguage', 'Ask questions in natural language')}
              </li>
              <li className="text-sm text-gray-700 flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                {t('quickAnswers', 'Get quick answers to specific questions')}
              </li>
              <li className="text-sm text-gray-700 flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                {t('localResults', 'Find local services easily')}
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceSearchTips;
