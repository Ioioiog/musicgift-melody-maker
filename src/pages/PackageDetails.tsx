
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Clock, Star, Users, Mic, Music, FileText, HelpCircle, ChevronDown, ChevronUp, Lightbulb, Plus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { usePackages, useAddons } from '@/hooks/usePackageData';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getAddonPrice } from '@/utils/pricing';
import { useState } from 'react';

const PackageDetails = () => {
  const { packageId } = useParams();
  const { t } = useLanguage();
  const { currency } = useCurrency();
  const { data: packages, isLoading } = usePackages();
  const { data: addons, isLoading: addonsLoading } = useAddons();
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  if (isLoading || addonsLoading) {
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

  const getPackagePrice = (pkg: any) => {
    return currency === 'EUR' ? pkg.price_eur : pkg.price_ron;
  };

  const renderPackagePrice = (pkg: any) => {
    if (pkg.value === 'gift') {
      return (
        <div className="text-3xl font-bold mb-2 text-white">
          {t('startingFrom', 'Starting from')} {currency === 'EUR' ? '€59' : '299 RON'}
        </div>
      );
    }
    
    return (
      <div className="text-4xl font-bold mb-2 text-white">
        {currency === 'EUR' ? '€' : 'RON'} {getPackagePrice(pkg)}
      </div>
    );
  };

  const renderOrderButtonPrice = (pkg: any) => {
    if (pkg.value === 'gift') {
      return t('orderNow');
    }
    
    return `${t('orderNow')} - ${currency === 'EUR' ? '€' : 'RON'} ${getPackagePrice(pkg)}`;
  };

  // Enhanced package features based on package type
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

  // Did you know facts based on package type
  const getDidYouKnowFacts = (packageValue: string) => {
    switch (packageValue) {
      case 'personal':
        return [
          {
            title: t('didYouKnowPersonal1Title', 'Music triggers memories'),
            description: t('didYouKnowPersonal1Desc', 'Studies show that personalized songs can trigger stronger emotional memories than generic music, making them perfect for special occasions.')
          },
          {
            title: t('didYouKnowPersonal2Title', 'Unique gift impact'),
            description: t('didYouKnowPersonal2Desc', 'Personalized gifts are remembered 3x longer than traditional gifts, creating lasting emotional connections.')
          }
        ];
      
      case 'premium':
        return [
          {
            title: t('didYouKnowPremium1Title', 'Global reach potential'),
            description: t('didYouKnowPremium1Desc', 'Songs distributed globally can reach over 100 million potential listeners across all major streaming platforms.')
          },
          {
            title: t('didYouKnowPremium2Title', 'Video engagement'),
            description: t('didYouKnowPremium2Desc', 'Music videos receive 1200% more shares than text and images combined on social media platforms.')
          }
        ];
      
      case 'business':
        return [
          {
            title: t('didYouKnowBusiness1Title', 'Brand recall boost'),
            description: t('didYouKnowBusiness1Desc', 'Brands with custom jingles have 96% higher recall rates compared to those using generic background music.')
          },
          {
            title: t('didYouKnowBusiness2Title', 'Emotional marketing'),
            description: t('didYouKnowBusiness2Desc', 'Emotional content is shared 2x more than rational content, making custom songs powerful marketing tools.')
          }
        ];
      
      case 'artist':
        return [
          {
            title: t('didYouKnowArtist1Title', 'First impression matters'),
            description: t('didYouKnowArtist1Desc', 'Music industry professionals decide within the first 15 seconds if a song has potential, highlighting the importance of professional production.')
          },
          {
            title: t('didYouKnowArtist2Title', 'Streaming success'),
            description: t('didYouKnowArtist2Desc', 'Independent artists account for 43% of the global music market, proving that quality production can compete with major labels.')
          }
        ];
      
      case 'gift':
        return [
          {
            title: t('didYouKnowGift1Title', 'Experience gifts'),
            description: t('didYouKnowGift1Desc', 'Experience-based gifts like custom songs create longer-lasting happiness than material gifts, according to psychological studies.')
          },
          {
            title: t('didYouKnowGift2Title', 'Musical bonding'),
            description: t('didYouKnowGift2Desc', 'Sharing music strengthens relationships by releasing oxytocin, the "bonding hormone", making musical gifts especially meaningful.')
          }
        ];
      
      default:
        return [
          {
            title: t('didYouKnowGeneral1Title', 'Music and emotions'),
            description: t('didYouKnowGeneral1Desc', 'Music activates the same neural pathways as food, sex, and drugs, explaining why personalized songs feel so rewarding.')
          },
          {
            title: t('didYouKnowGeneral2Title', 'Memory enhancement'),
            description: t('didYouKnowGeneral2Desc', 'The human brain can remember lyrics and melodies for decades, making songs perfect time capsules for preserving memories.')
          }
        ];
    }
  };

  // Get add-on icon based on add-on type
  const getAddonIcon = (addonKey: string) => {
    switch (addonKey) {
      case 'rushDelivery':
        return <Clock className="w-4 h-4" />;
      case 'socialMediaRights':
      case 'commercialRightsUpgrade':
        return <FileText className="w-4 h-4" />;
      case 'distributieMangoRecords':
        return <Star className="w-4 h-4" />;
      case 'customVideo':
        return <FileText className="w-4 h-4" />;
      case 'audioMessageFromSender':
      case 'brandedAudioMessage':
        return <Mic className="w-4 h-4" />;
      case 'extendedSong':
        return <Music className="w-4 h-4" />;
      case 'godparentsmelody':
        return <Users className="w-4 h-4" />;
      default:
        return <Plus className="w-4 h-4" />;
    }
  };

  // Filter add-ons available for this package
  const getAvailableAddOns = () => {
    if (!addons || !packageData.available_addons) return [];
    
    return addons.filter(addon => 
      packageData.available_addons.includes(addon.addon_key)
    ).map(addon => ({
      title: t(addon.label_key),
      description: t(addon.description_key),
      price: addon.price_ron === 0 && addon.price_eur === 0 
        ? t('free', 'Free') 
        : `${currency === 'EUR' ? '€' : 'RON'} ${getAddonPrice(addon, currency)}`,
      icon: getAddonIcon(addon.addon_key)
    }));
  };

  // Get package-specific revision answer
  const getRevisionAnswer = (packageValue: string) => {
    if (packageValue === 'wedding') {
      return t('faqRevisionsAnswerWedding', 'Yes, the wedding package includes one free revision to ensure your complete satisfaction with the final product.');
    }
    return t('faqRevisionsAnswerOther', 'Revisions are only available for the Wedding package. Other packages do not include revision options to maintain our streamlined production process and competitive pricing.');
  };

  const packageFeatures = getPackageFeatures(packageData.value);
  const didYouKnowFacts = getDidYouKnowFacts(packageData.value);
  const availableAddOns = getAvailableAddOns();
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
                    {renderPackagePrice(packageData)}
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

              {/* Available Add-ons Section */}
              {availableAddOns.length > 0 && (
                <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <ShoppingCart className="w-5 h-5 mr-2 text-blue-400" />
                      {t('availableAddOns', 'Available Add-ons')}
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      {t('enhanceYourPackage', 'Enhance your package with additional options')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableAddOns.map((addon, index) => (
                        <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                          <div className="flex items-start space-x-3">
                            <div className="text-blue-400 mt-1">
                              {addon.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white mb-1">{addon.title}</h4>
                              <p className="text-white/70 text-sm mb-2">{addon.description}</p>
                              <div className="text-blue-300 font-medium text-sm">{addon.price}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Did You Know Section */}
              <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                    {t('didYouKnow', 'Știai că?')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {didYouKnowFacts.map((fact, index) => (
                      <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <h4 className="font-semibold text-white mb-2">{fact.title}</h4>
                        <p className="text-white/80 text-sm leading-relaxed">{fact.description}</p>
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
                        {getRevisionAnswer(packageData.value)}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="border-white/20">
                      <AccordionTrigger className="text-white hover:text-white/80">
                        {t('faqLanguage', 'What languages are supported?')}
                      </AccordionTrigger>
                      <AccordionContent className="text-white/70">
                        {t('faqLanguageAnswer', 'We support multiple languages including English, Romanian, French, German, Polish, and Italian.')}
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
                    <AccordionItem value="item-4" className="border-white/20">
                      <AccordionTrigger className="text-white hover:text-white/80">
                        {t('faqDeliveryTime', 'How long does it take to receive my song?')}
                      </AccordionTrigger>
                      <AccordionContent className="text-white/70">
                        {t('faqDeliveryTimeAnswer', 'Your song will be ready within 3–5 business days after your order and story are confirmed. We want every creation to be crafted with care and professionalism.')}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5" className="border-white/20">
                      <AccordionTrigger className="text-white hover:text-white/80">
                        {t('faqDeliveryMethod', 'How will I receive my song?')}
                      </AccordionTrigger>
                      <AccordionContent className="text-white/70">
                        {t('faqDeliveryMethodAnswer', 'You will receive your personalized song via email, in high-quality format (MP3, or WAV upon request). You can download the song for up to 6 months using the link we send. After that, the link will expire and MusicGift will no longer store the song on any server, so make sure to save your file during that time.')}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6" className="border-white/20">
                      <AccordionTrigger className="text-white hover:text-white/80">
                        {t('faqSatisfaction', 'What if I\'m not satisfied?')}
                      </AccordionTrigger>
                      <AccordionContent className="text-white/70">
                        {t('faqSatisfactionAnswer', 'We work with the utmost care to capture the emotion behind your story. If there are any real issues (e.g., wrong delivery, corrupted file, etc.), we will fix them at no extra cost.')}
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
                      {renderOrderButtonPrice(packageData)}
                    </Button>
                  </Link>
                  <p className="text-sm text-white/70 text-center">
                    {t('professionalQuality', 'Professional quality guaranteed')}
                  </p>
                  <div className="border-t border-white/20 pt-4">
                    <h4 className="font-semibold text-white mb-2">{t('guarantees', 'Our Guarantees')}</h4>
                    <ul className="space-y-1 text-sm text-white/70">
                      <li>✓ {t('onTime', 'On-time delivery')}</li>
                      <li>✓ {t('securePayments', 'Secure payments')}</li>
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
                          <p className="text-white/70 text-xs">
                            {pkg.value === 'gift' 
                              ? `${t('startingFrom', 'Starting from')} ${currency === 'EUR' ? '€59' : '299 RON'}`
                              : `${currency === 'EUR' ? '€' : 'RON'} ${getPackagePrice(pkg)}`
                            }
                          </p>
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
