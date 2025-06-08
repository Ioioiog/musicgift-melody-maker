
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Star, ArrowRight, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { usePackages } from '@/hooks/usePackageData';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';

const Packages = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { t } = useLanguage();
  const { currency } = useCurrency();
  const { data: packages, isLoading } = usePackages();

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto py-8 px-4">
          <div className="text-center">Loading packages...</div>
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
        <div className="text-2xl font-bold text-white">
          {t('startingFrom', 'Starting from')} {currency === 'EUR' ? '€59' : '299 RON'}
        </div>
      );
    }
    return (
      <div className="text-3xl font-bold text-white">
        {currency === 'EUR' ? '€' : 'RON'} {getPackagePrice(pkg)}
      </div>
    );
  };

  // Define the desired order for packages - updated to include new special event packages
  const packageOrder = ['personal', 'premium', 'business', 'instrumental', 'remix', 'gift', 'wedding', 'baptism', 'coming-of-age', 'plus', 'artist'];
  
  // Sort packages according to the defined order
  const sortedPackages = packages?.sort((a, b) => {
    const indexA = packageOrder.indexOf(a.value);
    const indexB = packageOrder.indexOf(b.value);
    
    // If package not found in order, put it at the end
    const orderA = indexA === -1 ? packageOrder.length : indexA;
    const orderB = indexB === -1 ? packageOrder.length : indexB;
    
    return orderA - orderB;
  });

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Compact Hero Section with Music Background - Matching Gift Cards Style */}
      <section 
        className="pt-16 md:pt-20 lg:pt-24 pb-6 px-4 text-center text-white relative overflow-hidden" 
        style={{
          backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {t('chooseYourPackage', 'Choose Your Package')}
            </h1>
            <p className="text-base md:text-lg mb-4 opacity-90">
              {t('packagesSubtitle', 'Professional music creation tailored to your needs')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Packages Grid with Music Background */}
      <section 
        className="py-20 px-4 relative overflow-hidden" 
        style={{
          backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPackages?.map((pkg, index) => (
              <motion.div
                key={pkg.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onHoverStart={() => setHoveredCard(pkg.value)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <Card className={`h-full transition-all duration-300 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:shadow-xl ${
                  hoveredCard === pkg.value ? 'scale-105' : ''
                } ${pkg.tag === 'popular' ? 'ring-2 ring-purple-500' : ''}`}>
                  <CardHeader className="relative">
                    {pkg.tag === 'popular' && (
                      <Badge className="absolute -top-2 -right-2 bg-purple-500 hover:bg-purple-600">
                        <Star className="w-4 h-4 mr-1" />
                        {t('popular', 'Popular')}
                      </Badge>
                    )}
                    <CardTitle className="text-xl mb-2 text-white">
                      {t(pkg.label_key)}
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      {t(pkg.description_key)}
                    </CardDescription>
                    {renderPackagePrice(pkg)}
                    <div className="flex items-center text-sm text-white/70">
                      <Clock className="w-4 h-4 mr-1" />
                      {t(pkg.delivery_time_key)}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-3 text-white">{t('whatsIncluded', 'What\'s included:')}</h4>
                      <ul className="space-y-2 mb-6">
                        {pkg.includes?.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start">
                            <Check className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-white/90">{t(item.include_key)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <Link to={`/order?package=${pkg.value}`}>
                        <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm" size="lg">
                          {t('orderNow')}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <Link to={`/packages/${pkg.value}`}>
                        <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
                          {t('learnMore', 'Learn More')}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gift Card CTA */}

      <Footer />
    </div>
  );
};

export default Packages;
