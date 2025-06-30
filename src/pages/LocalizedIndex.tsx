
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocationContext } from '@/contexts/LocationContext';
import { useCookieContext } from '@/contexts/CookieContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getCountryConfig, getSupportedCountries, type LandingConfig } from '@/config/landingConfig';
import { packages } from '@/data/packages';

// Import existing components
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import VideoHero from '@/components/VideoHero';
import HeroContent from '@/components/HeroContent';
import ScenarioHero from '@/components/ScenarioHero';
import ImpactCards from '@/components/ImpactCards';
import CollaborationSection from '@/components/CollaborationSection';
import LazyTestimonialSlider from '@/components/LazyTestimonialSlider';
import DidYouKnowCarousel from '@/components/DidYouKnowCarousel';
import OptimizedVoiceSearchSection from '@/components/OptimizedVoiceSearchSection';
import WelcomeBanner from '@/components/WelcomeBanner';
import SEOHead from '@/components/SEOHead';
import BreadcrumbStructuredData from '@/components/BreadcrumbStructuredData';
import StructuredDataLoader from '@/components/StructuredDataLoader';

// Package display component for featured packages
const FeaturedPackages: React.FC<{ featuredPackageIds: string[] }> = ({ featuredPackageIds }) => {
  const featuredPackages = packages.filter(pkg => featuredPackageIds.includes(pkg.id));
  
  if (featuredPackages.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Featured Packages
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {featuredPackages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{pkg.name}</h3>
              <p className="text-gray-600 mb-4">{pkg.description}</p>
              <div className="text-2xl font-bold text-orange-600 mb-4">
                From {pkg.price_eur ? `€${pkg.price_eur}` : `${pkg.price_ron} RON`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LocalizedIndex: React.FC = () => {
  const { countryCode } = useParams<{ countryCode: string }>();
  const navigate = useNavigate();
  const { location, loading: locationLoading } = useLocationContext();
  const { isCookieAllowed } = useCookieContext();
  const { setCurrency } = useCurrency();
  const { setLanguage } = useLanguage();
  
  const [config, setConfig] = useState<LandingConfig>(getCountryConfig('ro'));
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Determine the effective country code
  const getEffectiveCountryCode = (): string => {
    // URL parameter takes priority
    if (countryCode && getSupportedCountries().includes(countryCode.toLowerCase())) {
      return countryCode.toLowerCase();
    }
    
    // Fallback to location detection if cookies allowed
    if (isCookieAllowed('analytics') && location?.countryCode) {
      const detectedCountry = location.countryCode.toLowerCase();
      if (getSupportedCountries().includes(detectedCountry)) {
        return detectedCountry;
      }
    }
    
    // Default to Romania
    return 'ro';
  };

  useEffect(() => {
    const effectiveCountry = getEffectiveCountryCode();
    const newConfig = getCountryConfig(effectiveCountry);
    
    setConfig(newConfig);
    
    // Set currency and language based on config
    setCurrency(newConfig.currency);
    setLanguage(newConfig.language);
    
    // Check if we should redirect (only if no URL country code and cookies allowed)
    if (!countryCode && 
        isCookieAllowed('analytics') && 
        location?.countryCode && 
        location.countryCode.toLowerCase() !== 'ro' &&
        getSupportedCountries().includes(location.countryCode.toLowerCase())) {
      setShouldRedirect(true);
    }
  }, [countryCode, location, isCookieAllowed, setCurrency, setLanguage]);

  // Handle automatic redirection
  useEffect(() => {
    if (shouldRedirect && location?.countryCode) {
      const targetCountry = location.countryCode.toLowerCase();
      navigate(`/${targetCountry}`, { replace: true });
      setShouldRedirect(false);
    }
  }, [shouldRedirect, location, navigate]);

  // Show loading state while determining location
  if (locationLoading && !countryCode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead 
        title={config.seoTitle}
        description={config.seoDescription}
        url={`https://www.musicgift.ro${countryCode ? `/${countryCode}` : ''}`}
      />
      <BreadcrumbStructuredData />
      <StructuredDataLoader />
      
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <WelcomeBanner />
        
        {/* Hero Section with Country-Specific Content */}
        <section className="relative">
          <VideoHero />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4 max-w-4xl">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-4xl">{config.flag}</span>
                <span className="text-lg font-medium">{config.countryName}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {config.heroTitle}
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                {config.heroSubtitle}
              </p>
            </div>
          </div>
        </section>

        <ScenarioHero />
        
        {/* Featured Packages Section */}
        <FeaturedPackages featuredPackageIds={config.featuredPackages} />
        
        <ImpactCards />
        <CollaborationSection />
        <LazyTestimonialSlider />
        <DidYouKnowCarousel />
        <OptimizedVoiceSearchSection />
        
        <Footer />
      </div>
    </>
  );
};

export default LocalizedIndex;
