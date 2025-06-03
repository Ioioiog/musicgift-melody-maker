
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

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {t('chooseYourPackage', 'Choose Your Package')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              {t('packagesSubtitle', 'Professional music creation tailored to your needs')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages?.map((pkg, index) => (
              <motion.div
                key={pkg.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onHoverStart={() => setHoveredCard(pkg.value)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <Card className={`h-full transition-all duration-300 ${
                  hoveredCard === pkg.value ? 'shadow-xl scale-105' : 'shadow-lg'
                } ${pkg.tag === 'popular' ? 'ring-2 ring-purple-500' : ''}`}>
                  <CardHeader className="relative">
                    {pkg.tag === 'popular' && (
                      <Badge className="absolute -top-2 -right-2 bg-purple-500 hover:bg-purple-600">
                        <Star className="w-4 h-4 mr-1" />
                        {t('popular', 'Popular')}
                      </Badge>
                    )}
                    <CardTitle className="text-xl mb-2">
                      {t(pkg.label_key)}
                    </CardTitle>
                    <CardDescription>
                      {t(pkg.description_key)}
                    </CardDescription>
                    <div className="text-3xl font-bold text-purple-600">
                      {currency === 'EUR' ? '€' : 'RON'} {pkg.price}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      {t(pkg.delivery_time_key)}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1">
                      <h4 className="font-semibold mb-3">{t('whatsIncluded', 'What\'s included:')}</h4>
                      <ul className="space-y-2 mb-6">
                        {pkg.includes?.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start">
                            <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{t(item.include_key)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <Link to={`/order?package=${pkg.value}`}>
                        <Button className="w-full" size="lg">
                          {t('orderNow')}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <Link to={`/packages/${pkg.value}`}>
                        <Button variant="outline" className="w-full">
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
      <section className="py-20 px-4 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Gift className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('giftCardTitle', 'Give the Gift of Music')}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {t('giftCardSubtitle', 'Perfect for any occasion - let them choose their perfect song')}
          </p>
          <Link to="/gift">
            <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
              <Gift className="w-5 h-5 mr-2" />
              {t('buyGiftCard', 'Buy Gift Card')}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Packages;
