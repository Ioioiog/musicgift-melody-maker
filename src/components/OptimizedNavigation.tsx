
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { memo } from "react";

const OptimizedNavigation = memo(() => {
  const { t } = useLanguage();

  return (
    <nav className="nav-critical nav-optimized" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 md:py-4">
          {/* Logo with LCP optimizations */}
          <Link 
            to="/" 
            className="flex-shrink-0 group hw-accelerated" 
            aria-label="MusicGift.ro - Home"
          >
            <img
              alt="MusicGift Logo"
              className="logo-critical logo-lcp-optimized"
              src="/uploads/logo_musicgift.webp"
              width="256"
              height="64"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </Link>

          {/* Navigation items - deferred for LCP */}
          <div className="hidden md:flex space-x-8 defer-load">
            <Link to="/packages" className="text-white hover:text-gray-300 transition-colors">
              {t('packages')}
            </Link>
            <Link to="/how-it-works" className="text-white hover:text-gray-300 transition-colors">
              {t('howItWorks')}
            </Link>
            <Link to="/about" className="text-white hover:text-gray-300 transition-colors">
              {t('about')}
            </Link>
            <Link to="/contact" className="text-white hover:text-gray-300 transition-colors">
              {t('contact')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
});

OptimizedNavigation.displayName = 'OptimizedNavigation';

export default OptimizedNavigation;
