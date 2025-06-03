
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { usePackages } from '@/hooks/usePackageData';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';

const PackageDetails = () => {
  const { packageId } = useParams();
  const { t } = useLanguage();
  const { currency } = useCurrency();
  const { data: packages, isLoading } = usePackages();

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

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Content with Music Background */}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2 text-white">
                      {t(packageData.label_key)}
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      {t(packageData.description_key)}
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
                  <div className="text-3xl font-bold mb-2 text-white">
                    {currency === 'EUR' ? '€' : 'RON'} {packageData.price}
                  </div>
                  <div className="flex items-center text-sm text-white/70">
                    <Clock className="w-4 h-4 mr-1" />
                    {t(packageData.delivery_time_key)}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-white">{t('whatsIncluded', 'What\'s included:')}</h3>
                  <ul className="space-y-2">
                    {packageData.includes?.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-white/90">{t(item.include_key)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardHeader>
                <CardTitle className="text-white">{t('readyToStart', 'Ready to Start?')}</CardTitle>
                <CardDescription className="text-white/80">
                  {t('packageDetailsCta', 'Create your personalized song today')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={`/order?package=${packageData.value}`}>
                  <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm" size="lg">
                    {t('orderNow')} - {currency === 'EUR' ? '€' : 'RON'} {packageData.price}
                  </Button>
                </Link>
                <p className="text-sm text-white/70 mt-4 text-center">
                  {t('professionalQuality', 'Professional quality guaranteed')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PackageDetails;
