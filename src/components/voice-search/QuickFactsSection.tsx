
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Clock, Star, Music, Shield, Award, Headphones } from 'lucide-react';

const QuickFactsSection = () => {
  const { t } = useLanguage();

  const quickFacts = [
    {
      icon: Clock,
      title: t('fastDelivery'),
      description: t('fastDeliveryDesc'),
      color: 'text-green-600'
    },
    {
      icon: Star,
      title: t('qualityGuaranteed'),
      description: t('qualityGuaranteedDesc'),
      color: 'text-yellow-500'
    },
    {
      icon: Music,
      title: t('vastExperience'),
      description: t('vastExperienceDesc'),
      color: 'text-purple-600'
    },
    {
      icon: Shield,
      title: t('moneyBackGuarantee', 'Money-Back Guarantee'),
      description: t('moneyBackGuaranteeDesc', '100% satisfaction guaranteed or your money back'),
      color: 'text-blue-600'
    },
    {
      icon: Award,
      title: t('awardWinning', 'Award-Winning'),
      description: t('awardWinningDesc', 'Recognized for excellence in personalized music composition'),
      color: 'text-orange-500'
    },
    {
      icon: Headphones,
      title: t('studioQuality', 'Studio Quality'),
      description: t('studioQualityDesc', 'Professional recording and mastering in state-of-the-art studios'),
      color: 'text-indigo-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {quickFacts.map((fact, index) => {
        const IconComponent = fact.icon;
        return (
          <Card key={index} className="text-center bg-white/80 backdrop-blur-sm hover:scale-105 transition-transform">
            <CardContent className="pt-6">
              <IconComponent className={`w-8 h-8 ${fact.color} mx-auto mb-3`} />
              <h3 className="font-semibold text-gray-900 mb-2 voice-search-content">{fact.title}</h3>
              <p className="text-sm text-gray-600 voice-search-content faq-answer">
                {fact.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default QuickFactsSection;
