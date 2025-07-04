
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Star, ArrowRight, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { packages } from '@/data/packages';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getPackagePrice, formatCurrency } from '@/utils/pricing';

const Packages = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { t } = useLanguage();
  const { currency } = useCurrency();

  const renderPackagePrice = (pkg: any) => {
    if (pkg.value === 'gift') {
      const startingPrice = getPackagePrice(packages.find(p => p.value === 'personal')!, currency);
      return (
        <div className="relative group">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl p-6 transition-all duration-300 group-hover:shadow-lg group-hover:border-orange-300">
            <div className="flex items-center justify-center gap-2 text-orange-700">
              <Gift className="w-5 h-5" />
              <div className="text-center">
                <div className="text-sm font-medium text-orange-600 mb-1">
                  {t('startingFrom', 'Starting from')}
                </div>
                <div className="text-2xl font-bold text-orange-800">
                  {formatCurrency(startingPrice, currency)}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const price = getPackagePrice(pkg, currency);
    return (
      <div className="relative group">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl p-6 transition-all duration-300 group-hover:shadow-lg group-hover:border-orange-300 py-[10px] px-[23px] my-px mx-[54px]">
          <div className="text-center">
            <div className="text-sm font-medium text-orange-600 mb-2">Price</div>
            <div className="text-3xl font-bold text-orange-800 tracking-tight">
              {formatCurrency(price, currency)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Define the desired order for packages - updated to include DJ package
  const packageOrder = ['personal', 'premium', 'dj', 'gift', 'business', 'remix', 'instrumental', 'wedding', 'baptism', 'comingOfAge', 'artist', 'plus'];

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
      <section className="pt-16 md:pt-20 lg:pt-24 pb-6 px-4 text-center text-white relative overflow-hidden" style={{
        backgroundImage: 'url(/uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }} 
            className="my-[42px]"
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
      <section className="py-20 px-4 relative overflow-hidden" style={{
        backgroundImage: 'url(/uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="absolute inset-0 bg-black/20 py-[9px] my-0"></div>
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
                <Card className={`h-full transition-all duration-300 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:shadow-xl ${hoveredCard === pkg.value ? 'scale-105' : ''} ${pkg.tag === 'popular' ? 'ring-2 ring-purple-500' : ''}`}>
                  <CardHeader className="relative px-[7px] mx-[9px]">
                    {pkg.tag === 'popular' && (
                      <Badge className="absolute -top-2 -right-2 bg-orange-500">
                        <Star className="w-4 h-4 mr-1" />
                        {t('popular', 'Popular')}
                      </Badge>
                    )}
                    <CardTitle className="text-2xl md:text-3xl font-bold mb-3 leading-tight tracking-wide bg-gradient-to-r from-white to-white/90 bg-clip-text drop-shadow-lg text-orange-500 text-center">
                      {t(pkg.label_key)}
                    </CardTitle>
                    <CardDescription className="text-white/80 text-center mb-4">
                      {t(pkg.description_key)}
                    </CardDescription>
                    <div className="mb-4">
                      {renderPackagePrice(pkg)}
                    </div>
                    <div className="flex items-center justify-center text-sm text-white/70">
                      <Clock className="w-4 h-4 mr-1" />
                      {t(pkg.delivery_time_key)}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col mx-0 py-[4px] my-0">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-3 text-orange-500 text-center">
                        {t('whatsIncluded', "What's included:")}
                      </h4>
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
                        <Button size="lg" className="w-full text-white border-white/30 backdrop-blur-sm bg-orange-500 hover:bg-orange-400">
                          {t('orderNow')}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <Link to={`/packages/${pkg.value}`}>
                        <Button variant="outline" className="w-full border-white/30 hover:bg-white/20 backdrop-blur-sm text-orange-500 text-lg">
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

      <Footer />
    </div>
  );
};

export default Packages;
