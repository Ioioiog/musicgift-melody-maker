import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Music, ArrowUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LegalModals, { useLegalModals } from "@/components/LegalModals";
import LegalCompliance from "@/components/LegalCompliance";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const Footer = () => {
  const { t } = useLanguage();
  const { openTerms, openPrivacy, openRefund, openCookie } = useLegalModals();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden" style={{
      backgroundImage: 'url(/lovable-uploads/80488a4f-b392-4eca-b181-f587474721fd.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Enhanced Multi-layer Background System */}
      <div className="absolute inset-0">
        {/* Base gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/60 via-violet-800/70 to-indigo-900/80"></div>
        
        {/* Secondary gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/40 via-transparent to-pink-600/30"></div>
        
        {/* Radial gradient for focus */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-purple-800/20 to-black/40"></div>
        
        {/* Subtle pulse animation overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/30 animate-pulse opacity-60"></div>
      </div>

      {/* Subtle grid pattern overlay */}
      <div
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
        className="absolute inset-0 opacity-30"
      ></div>

      {/* Enhanced animated musical notes pattern overlay */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-4 left-8 w-3 h-3 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-8 right-12 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-16 left-1/4 w-2.5 h-2.5 bg-white/35 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-20 right-1/3 w-3 h-3 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-32 left-1/2 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-16 w-2.5 h-2.5 bg-white/35 rounded-full animate-pulse" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '3.5s' }}></div>
        <div className="absolute bottom-4 right-8 w-3 h-3 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-8 left-1/5 w-2.5 h-2.5 bg-white/35 rounded-full animate-pulse" style={{ animationDelay: '4.5s' }}></div>
        <div className="absolute top-1/2 left-8 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '5s' }}></div>
        <div className="absolute top-1/3 right-16 w-3 h-3 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '5.5s' }}></div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-2 border-white/20 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110 animate-fade-in"
          size="icon"
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </Button>
      )}

      <div className="container mx-auto px-4 sm:px-6 relative z-10 py-6 sm:py-8">
        {/* Main 4-column layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Column 1: Brand & Social */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <Link to="/" className="inline-block group">
              <div className="backdrop-blur-sm border border-black/10 p-2 sm:p-3 transition-all duration-300 group-hover:border-black/20 group-hover:scale-105 bg-transparent rounded-lg px-[39px] py-[26px]">
                <img src="/lovable-uploads/407b475e-cd49-4ba1-918b-57bd3fc6c955.png" alt="MusicGift by Mango Records" className="h-18s m:h-18 md:h-18 w-auto object-cover drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] mx-auto sm:mx-0" />
              </div>
            </Link>
            
            <p className="text-gray-800 leading-relaxed text-xs font-medium">
              {t('footerDescription')}
            </p>
            
            {/* Social Links */}
            <div className="space-y-2">
              <h4 className="text-gray-900 font-bold text-xs uppercase tracking-wider">
                {t('followUs') || 'Follow Us'}
              </h4>
              <div className="flex justify-center sm:justify-start space-x-2">
                {[
                  { icon: Facebook, href: "https://www.facebook.com/MusicGiftofficialpage/", label: "Facebook", color: "hover:bg-blue-600" },
                  { icon: Instagram, href: "https://www.instagram.com/musicgiftofficial/", label: "Instagram", color: "hover:bg-pink-600" },
                  { icon: Youtube, href: "https://www.youtube.com/@MangoRecordsChannel", label: "YouTube", color: "hover:bg-red-600" },
                  { icon: Music, href: "https://www.tiktok.com/@musicgiftofficial", label: "TikTok", color: "hover:bg-gray-800" }
                ].map(({ icon: Icon, href, label, color }) => (
                  <a
                    key={label}
                    href={href}
                    className={`w-8 h-8 bg-white/10 backdrop-blur-sm border border-black/10 ${color} rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-black/30 group touch-manipulation min-h-[32px]`}
                    aria-label={label}
                  >
                    <Icon className="w-4 h-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <div className="relative">
              <h3 className="text-gray-900 font-bold text-sm mb-1">
                {t('quickLinks')}
              </h3>
              <div className="w-8 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto sm:mx-0"></div>
            </div>
            
            <ul className="space-y-0.5">
              {[
                { to: "/", label: t('home') },
                { to: "/about", label: t('about') },
                { to: "/packages", label: t('packages') },
                { to: "/how-it-works", label: t('howItWorks') },
                { to: "/testimonials", label: t('testimonials') },
                { to: "/admin", label: t('admin') }
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-700 hover:text-gray-900 transition-all duration-300 relative group inline-block py-0.5 px-1 rounded text-xs hover:bg-white/10 backdrop-blur-sm touch-manipulation min-h-[28px] flex items-center justify-center sm:justify-start"
                  >
                    <span className="relative z-10">{label}</span>
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal & Policies */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <div className="relative">
              <h3 className="text-gray-900 font-bold text-sm mb-1">
                {t('legal')}
              </h3>
              <div className="w-8 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto sm:mx-0"></div>
            </div>
            
            <ul className="space-y-0.5">
              <li>
                <button
                  onClick={openTerms}
                  className="text-gray-700 hover:text-purple-600 transition-all duration-300 relative group py-0.5 px-1 rounded text-xs hover:bg-white/10 backdrop-blur-sm touch-manipulation min-h-[28px] flex items-center justify-center sm:justify-start w-full"
                >
                  <span className="relative z-10">{t('termsConditions')}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></div>
                </button>
              </li>
              <li>
                <button
                  onClick={openPrivacy}
                  className="text-gray-700 hover:text-purple-600 transition-all duration-300 relative group py-0.5 px-1 rounded text-xs hover:bg-white/10 backdrop-blur-sm touch-manipulation min-h-[28px] flex items-center justify-center sm:justify-start w-full"
                >
                  <span className="relative z-10">{t('privacyPolicy')}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></div>
                </button>
              </li>
              <li>
                <button
                  onClick={openRefund}
                  className="text-gray-700 hover:text-purple-600 transition-all duration-300 relative group py-0.5 px-1 rounded text-xs hover:bg-white/10 backdrop-blur-sm touch-manipulation min-h-[28px] flex items-center justify-center sm:justify-start w-full"
                >
                  <span className="relative z-10">{t('refundPolicy')}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></div>
                </button>
              </li>
              <li>
                <button
                  onClick={openCookie}
                  className="text-gray-700 hover:text-purple-600 transition-all duration-300 relative group py-0.5 px-1 rounded text-xs hover:bg-white/10 backdrop-blur-sm touch-manipulation min-h-[28px] flex items-center justify-center sm:justify-start w-full"
                >
                  <span className="relative z-10">{t('cookiePolicy')}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></div>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info Only */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <div className="relative">
              <h3 className="text-gray-900 font-bold text-sm mb-1">
                {t('contactInfo')}
              </h3>
              <div className="w-8 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto sm:mx-0"></div>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-2">
              {[
                { icon: Mail, text: "info@musicgift.ro", href: "mailto:info@musicgift.ro" },
                { icon: Phone, text: "+40 723 141 501", href: "tel:+40723141501" },
                { icon: MapPin, text: "Strada Fabrica de Glucoza 6-8, București", href: "#" }
              ].map(({ icon: Icon, text, href }) => (
                <a
                  key={text}
                  href={href}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-all duration-300 group p-1.5 rounded-lg hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-black/10 touch-manipulation min-h-[36px]"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-black/10 rounded-lg flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300 flex-shrink-0">
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-medium break-words">{text}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Legal Compliance Section - Full Width */}
        <div className="mt-6 sm:mt-12 space-y-3 sm:space-y-4">
          <div className="relative text-center sm:text-left">
            <h3 className="text-gray-900 font-bold text-sm mb-1">
              {t('legalCompliance')}
            </h3>
            <div className="w-8 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto sm:mx-0"></div>
          </div>
          <LegalCompliance />
        </div>

        {/* Enhanced Visual Separator */}
        <div className="border-t border-white/10 mt-8 sm:mt-16 relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
        </div>

        {/* Enhanced Final Copyright Section - Now with stronger visual impact */}
        <div className="mt-8 sm:mt-12 pt-8 sm:pt-12 relative overflow-hidden">
          {/* Full Width Enhanced Gradient Background with deeper colors */}
          <div
            className="absolute inset-0 w-full"
            style={{
              backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Enhanced layered background effects with stronger gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-800/70 via-violet-700/60 to-pink-800/70"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-800/50 via-purple-700/40 to-fuchsia-800/55"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 via-transparent to-pink-900/30"></div>
            
            {/* Vignette effect for natural ending */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60"></div>
            
            {/* Bottom fade effect */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-6 py-8 sm:py-12">
              {/* Enhanced Brand Signature */}
              <div className="text-center space-y-4">
                <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-8 py-6 shadow-2xl hover:bg-white/25 transition-all duration-500 group max-w-2xl">
                  <p className="text-sm sm:text-base text-white font-bold text-center group-hover:text-white/90 transition-colors duration-300 leading-relaxed">
                    {t('copyright')}
                  </p>
                  
                  {/* Tagline */}
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-xs sm:text-sm text-white/90 font-medium italic">
                      "Where every moment becomes a melody, and every memory turns into music"
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Enhanced decorative musical elements */}
              <div className="flex items-center space-x-8 opacity-70">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400/40 to-pink-400/40 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center animate-pulse">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <div className="flex space-x-2">
                  <div className="w-2 h-8 bg-gradient-to-t from-purple-400 to-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-12 bg-gradient-to-t from-purple-400 to-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-6 bg-gradient-to-t from-purple-400 to-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                  <div className="w-2 h-10 bg-gradient-to-t from-purple-400 to-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  <div className="w-2 h-4 bg-gradient-to-t from-purple-400 to-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400/40 to-pink-400/40 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center animate-pulse">
                  <Music className="w-5 h-5 text-white" />
                </div>
              </div>

              {/* Final closing element */}
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full"></div>
            </div>
          </div>

          {/* Subtle fade to bottom effect */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* Include the Legal Modals */}
      <LegalModals t={t} />
    </footer>
  );
};

export default Footer;
