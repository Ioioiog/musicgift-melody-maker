

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Phone, MessageCircle } from 'lucide-react';

const VoiceSearchTips = () => {
  const { t } = useLanguage();

  const handsOccupiedExamples = [
    t('whileDriving'),
    t('holdingBaby'),
    t('whileCooking'),
    t('whileCleaning')
  ];

  return (
    <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-center">
          <Search className="w-5 h-5 text-blue-600" />
          <Phone className="w-5 h-5 text-green-600" />
          <MessageCircle className="w-5 h-5 text-purple-600" />
          {t('quickSearchTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        {/* Main message */}
        <p className="text-lg text-gray-800 mb-6 font-medium">
          {t('searchMethods')}
        </p>
        
        {/* Hands occupied examples */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">
            {t('handsOccupiedTitle')}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {handsOccupiedExamples.map((example, index) => (
              <div key={index} className="text-sm text-gray-700 p-3 bg-white/60 rounded-lg border border-gray-200">
                <span className="italic">"{example}"</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceSearchTips;

