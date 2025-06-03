
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Clock, Star, Users, Mic, Music, FileText, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { usePackages } from '@/hooks/usePackageData';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useState } from 'react';

const PackageDetails = () => {
  const { packageId } = useParams();
  const { t } = useLanguage();
  const { currency } = useCurrency();
  const { data: packages, isLoading } = usePackages();
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto py-8 px-4">
          <div className="text-center">Loading package details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  const packageData = packages?.find(pkg => pkg.value === packageId);

  if (!packageData) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto py-8 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Package not found</h1>
            <Link to="/packages">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Packages
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Enhanced package details based on package type
  const getPackageFeatures = (packageValue: string) => {
    const baseFeatures = [
      {
        icon: <Music className="w-5 h-5" />,
        title: t('professionalProduction', 'Professional Production'),
        description: t('highQualityStudio', 'High-quality studio recording and production')
      },
      {
        icon: <Mic className="w-5 h-5" />,
        title: t('expertVocals', 'Expert Vocals'),
        description: t('professionalSingers', 'Professional singers with years of experience')
      },
      {
        icon: <FileText className="w-5 h-5" />,
        title: t('customLyrics', 'Custom Lyrics'),
        description: t('personalizedSong', 'Personalized song based on your story')
      }
    ];

    if (packageValue === 'premium') {
      return [
        ...baseFeatures,
        {
          icon: <Users className="w-5 h-5" />,
          title: t('globalDistribution', 'Global Distribution'),
          description: t('worldwideRelease', 'Release your song on all major platforms worldwide')
        }
      ];
    }

    return baseFeatures;
  };

  const getDeliverySteps = (packageValue: string) => {
    const baseSteps = [
      { step: 1, title: t('orderPlacement', 'Order Placement'), time: t('immediate', 'Immediate') },
      { step: 2, title: t('storyReview', 'Story Review'), time: t('24hours', '24 hours') },
      { step: 3, title: t('songCreation', 'Song Creation'), time: t('2-3days', '2-3 days') },
      { step: 4, title: t('finalDelivery', 'Final Delivery'), time: t('1day', '1 day') }
    ];

    if (packageValue === 'premium') {
      return [
        ...baseSteps,
        { step: 5, title: t('videoProduction', 'Video Production'), time: t('2-3days', '2-3 days') },
        { step: 6, title: t('distribution', 'Distribution'), time: t('1-2days', '1-2 days') }
      ];
    }

    return baseSteps;
  };

  const packageFeatures = getPackageFeatures(packageData.value);
  const deliverySteps = getDeliverySteps(packageData.value);
  const relatedPackages = packages?.filter(pkg => pkg.value !== packageData.value).slice(0, 2);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section with Music Background */}
      <div className="py-20 px-4 relative overflow-hidden min-h-screen" style={{
        backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto relative z-10">
          <div className="mb-6">
            <Link to="/packages">
              <Button variant="ghost" className="text-white hover:bg-white/20 backdrop-blur-sm border border-white/30">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('backToPackages', 'Back to Packages')}
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Package Info */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-3xl mb-2 text-white">
                        {t(packageData.label_key)}
                      </CardTitle>
                      <CardDescription className="text-xl text-white/80">
                        {t(packageData.tagline_key)}
                      </CardDescription>
                    </div>
                    {packageData.tag === 'popular' && (
                      <Badge className="ml-4 bg-purple-500 hover:bg-purple-600">
                        <Star className="w-4 h-4 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="text-4xl font-bold mb-2 text-white">
                      {currency === 'EUR' ? '€' : 'RON'} {packageData.price}
                    </div>
                    <div className="flex items-center text-sm text-white/70">
                      <Clock className="w-4 h-4 mr-1" />
                      {t(packageData.delivery_time_key)}
                    </div>
                  </div>

                  <p className="text-white/90 text-lg leading-relaxed">
                    {t(packageData.description_key)}
                  </p>
                </CardContent>
              </Card>

              {/* What's Included */}
              <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">{t('whatsIncluded', 'What\'s included:')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {packageData.includes?.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-white/90 text-lg">{t(item.include_key)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Enhanced Features */}
              <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">{t('keyFeatures', 'Key Features')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {packageFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-white/5">
                        <div className="text-purple-400 mt-1">
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                          <p className="text-white/70 text-sm">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Timeline */}
              <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">{t('deliveryTimeline', 'Delivery Timeline')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deliverySteps.map((step, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{step.title}</h4>
                          <p className="text-white/70 text-sm">{step.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* FAQ Section */}
              <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">{t('frequentlyAsked', 'Frequently Asked Questions')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-white/20">
                      <AccordionTrigger className="text-white hover:text-white/80">
                        {t('faqRevisions', 'Can I request revisions?')}
                      </AccordionTrigger>
                      <AccordionContent className="text-white/70">
                        {t('faqRevisionsAnswer', 'Yes, we offer one free revision to ensure your complete satisfaction with the final product.')}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="border-white/20">
                      <AccordionTrigger className="text-white hover:text-white/80">
                        {t('faqLanguage', 'What languages are supported?')}
                      </AccordionTrigger>
                      <AccordionContent className="text-white/70">
                        {t('faqLanguageAnswer', 'We support multiple languages including English, Romanian, French, German, and Polish.')}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" className="border-white/20">
                      <AccordionTrigger className="text-white hover:text-white/80">
                        {t('faqRights', 'Who owns the rights to the song?')}
                      </AccordionTrigger>
                      <AccordionContent className="text-white/70">
                        {t('faqRightsAnswer', 'Rights vary by package. Personal packages include personal use rights, while business and artist packages include commercial rights.')}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Card */}
              <Card className="bg-white/10 backdrop-blur-md border border-white/20 sticky top-6">
                <CardHeader>
                  <CardTitle className="text-white">{t('readyToStart', 'Ready to Start?')}</CardTitle>
                  <CardDescription className="text-white/80">
                    {t('packageDetailsCta', 'Create your personalized song today')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link to={`/order?package=${packageData.value}`}>
                    <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm" size="lg">
                      {t('orderNow')} - {currency === 'EUR' ? '€' : 'RON'} {packageData.price}
                    </Button>
                  </Link>
                  <p className="text-sm text-white/70 text-center">
                    {t('professionalQuality', 'Professional quality guaranteed')}
                  </p>
                  <div className="border-t border-white/20 pt-4">
                    <h4 className="font-semibold text-white mb-2">{t('guarantees', 'Our Guarantees')}</h4>
                    <ul className="space-y-1 text-sm text-white/70">
                      <li>✓ {t('moneyBack', 'Money-back guarantee')}</li>
                      <li>✓ {t('onTime', 'On-time delivery')}</li>
                      <li>✓ {t('support', '24/7 customer support')}</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Related Packages */}
              {relatedPackages && relatedPackages.length > 0 && (
                <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">{t('otherPackages', 'Other Packages')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {relatedPackages.map((pkg) => (
                      <Link key={pkg.value} to={`/packages/${pkg.value}`}>
                        <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                          <h4 className="font-semibold text-white text-sm">{t(pkg.label_key)}</h4>
                          <p className="text-white/70 text-xs">{currency === 'EUR' ? '€' : 'RON'} {pkg.price}</p>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PackageDetails;
