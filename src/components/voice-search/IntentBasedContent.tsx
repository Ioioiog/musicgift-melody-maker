
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, TrendingUp, Users, Heart, Gift, Calendar } from 'lucide-react';

const IntentBasedContent = () => {
  const { t, language } = useLanguage();

  const getIntentSections = () => [
    {
      intent: 'comparison',
      icon: TrendingUp,
      title: t('whyChooseUs', 'Why Choose Personalized Music?'),
      content: [
        t('uniqueMemories', 'Creates unique, lasting memories unlike any other gift'),
        t('emotionalConnection', 'Builds deep emotional connections through personalized storytelling'),
        t('professionalQuality', 'Professional studio quality with experienced composers'),
        t('affordablePrice', 'More meaningful than expensive jewelry, more lasting than flowers')
      ]
    },
    {
      intent: 'occasion',
      icon: Calendar,
      title: t('perfectFor', 'Perfect For Every Occasion'),
      content: [
        t('weddings', 'Weddings - First dance songs and ceremony music'),
        t('anniversaries', 'Anniversaries - Celebrating your love journey'),
        t('birthdays', 'Birthdays - Milestone celebrations and personal tributes'),
        t('valentines', 'Valentine\'s Day - Romantic declarations of love'),
        t('holidays', 'Holidays - Christmas, New Year, Easter celebrations')
      ]
    },
    {
      intent: 'demographic',
      icon: Users,
      title: t('whoItsFor', 'Who It\'s For'),
      content: [
        t('forSpouses', 'Spouses - Romantic partners seeking meaningful gifts'),
        t('forParents', 'Parents - Children honoring their parents\' stories'),
        t('forCouples', 'Couples - Celebrating relationship milestones'),
        t('forFriends', 'Friends - Unique friendship commemorations'),
        t('forBusinesses', 'Businesses - Corporate events and team celebrations')
      ]
    },
    {
      intent: 'emotional',
      icon: Heart,
      title: t('emotionalBenefits', 'Emotional Benefits'),
      content: [
        t('touchesHearts', 'Touches hearts in ways material gifts cannot'),
        t('preservesMemories', 'Preserves precious memories in musical form'),
        t('showsThoughtfulness', 'Demonstrates deep thoughtfulness and care'),
        t('createsLegacy', 'Creates a musical legacy for future generations')
      ]
    }
  ];

  const intentSections = getIntentSections();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      {intentSections.map((section, index) => {
        const IconComponent = section.icon;
        return (
          <Card key={index} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <IconComponent className="w-5 h-5 text-blue-600" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2 text-sm text-gray-700 voice-search-content">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default IntentBasedContent;
