import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import UnifiedSettingsMenu from "@/components/UnifiedSettingsMenu";
import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/contexts/AuthContext";
import OptimizedLogo from "@/components/OptimizedLogo";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useLanguage();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { href: "/", label: t('home') },
    { href: "/packages", label: t('packages') },
    { href: "/how-it-works", label: t('howItWorks') },
    { href: "/about", label: t('about') },
    { href: "/testimonials", label: t('testimonials') },
    { href: "/contact", label: t('contact') },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 transition-transform duration-300 hover:scale-105" onClick={closeMenu}>
            <OptimizedLogo 
              className="h-12 lg:h-16" 
              width={180} 
              height={60} 
              priority={true}
              alt="MusicGift.ro - Cadouri Muzicale Personalizate | Melodii Unice pentru Persoanele Dragi"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`font-medium transition-colors duration-200 ${
                  location.pathname === item.href
                    ? isScrolled 
                      ? 'text-purple-600 border-b-2 border-purple-600' 
                      : 'text-white border-b-2 border-white'
                    : isScrolled 
                      ? 'text-gray-700 hover:text-purple-600' 
                      : 'text-white/90 hover:text-white'
                } pb-1`}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            <UnifiedSettingsMenu />
            {user && <UserMenu />}
            
            {/* CTA Button */}
            <Link to="/order" onClick={closeMenu}>
              <Button 
                size="sm" 
                className={`transition-all duration-300 font-semibold ${
                  isScrolled 
                    ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm shadow-lg hover:shadow-xl'
                }`}
              >
                {t('orderNow')}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className={`lg:hidden ${isScrolled ? 'text-gray-700 hover:text-purple-600' : 'text-white hover:text-white/80'}`}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/20 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    location.pathname === item.href
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                  }`}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
