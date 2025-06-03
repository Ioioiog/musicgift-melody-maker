
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
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link to="/packages">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backToPackages', 'Back to Packages')}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">
                    {t(packageData.label_key)}
                  </CardTitle>
                  <CardDescription>
                    {t(packageData.description_key)}
                  </CardDescription>
                </div>
                {packageData.tag === 'popular' && (
                  <Badge variant="secondary" className="ml-4">
                    <Star className="w-4 h-4 mr-1" />
                    Popular
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="text-3xl font-bold mb-2">
                  {currency === 'EUR' ? '€' : 'RON'} {packageData.price}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {t(packageData.delivery_time_key)}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">{t('whatsIncluded', 'What\'s included:')}</h3>
                <ul className="space-y-2">
                  {packageData.includes?.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{t(item.include_key)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('readyToStart', 'Ready to Start?')}</CardTitle>
              <CardDescription>
                {t('packageDetailsCta', 'Create your personalized song today')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={`/order?package=${packageData.value}`}>
                <Button className="w-full" size="lg">
                  {t('orderNow')} - {currency === 'EUR' ? '€' : 'RON'} {packageData.price}
                </Button>
              </Link>
              <p className="text-sm text-gray-600 mt-4 text-center">
                {t('professionalQuality', 'Professional quality guaranteed')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PackageDetails;
