import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Music, ArrowUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LegalModals, { useLegalModals } from "@/components/LegalModals";
import LegalCompliance from "@/components/LegalCompliance";
import NewsletterForm from "@/components/NewsletterForm";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
      {/* Lighter Multi-layer Background System */}
      <div className="absolute inset-0">
        {/* Much lighter base gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-gray-100/70 to-gray-200/60"></div>
        
        {/* Subtle secondary gradient for minimal depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-100/30 via-transparent to-pink-100/20"></div>
        
        {/* Very light radial gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-purple-50/20 to-gray-100/30"></div>
        
        {/* Subtle pulse animation overlay - much lighter */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-50/20 animate-pulse opacity-30"></div>
      </div>

      {/* Keep the grid pattern but make it lighter */}
      <div style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }} className="absolute inset-0 opacity-20"></div>

      {/* Musical notes pattern overlay - keep purple but make more subtle */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-15">
        <div className="absolute top-4 left-8 w-3 h-3 bg-purple-500/40 rounded-full animate-pulse" style={{
        animationDelay: '0s'
      }}></div>
        <div className="absolute top-8 right-12 w-2 h-2 bg-purple-600/50 rounded-full animate-pulse" style={{
        animationDelay: '0.5s'
      }}></div>
        <div className="absolute top-16 left-1/4 w-2.5 h-2.5 bg-purple-500/45 rounded-full animate-pulse" style={{
        animationDelay: '1s'
      }}></div>
        <div className="absolute top-20 right-1/3 w-3 h-3 bg-purple-600/40 rounded-full animate-pulse" style={{
        animationDelay: '1.5s'
      }}></div>
        <div className="absolute top-32 left-1/2 w-2 h-2 bg-purple-500/50 rounded-full animate-pulse" style={{
        animationDelay: '2s'
      }}></div>
        <div className="absolute bottom-1/4 left-16 w-2.5 h-2.5 bg-purple-600/45 rounded-full animate-pulse" style={{
        animationDelay: '2.5s'
      }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-purple-500/40 rounded-full animate-pulse" style={{
        animationDelay: '3s'
      }}></div>
        <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-purple-600/50 rounded-full animate-pulse" style={{
        animationDelay: '3.5s'
      }}></div>
        <div className="absolute bottom-4 right-8 w-3 h-3 bg-purple-500/40 rounded-full animate-pulse" style={{
        animationDelay: '4s'
      }}></div>
        <div className="absolute bottom-8 left-1/5 w-2.5 h-2.5 bg-purple-600/45 rounded-full animate-pulse" style={{
        animationDelay: '4.5s'
      }}></div>
        <div className="absolute top-1/2 left-8 w-2 h-2 bg-purple-500/50 rounded-full animate-pulse" style={{
        animationDelay: '5s'
      }}></div>
        <div className="absolute top-1/3 right-16 w-3 h-3 bg-purple-600/40 rounded-full animate-pulse" style={{
        animationDelay: '5.5s'
      }}></div>
      </div>

      {/* Back to Top Button - moved to bottom-left */}
      {showBackToTop && (
        <Button 
          onClick={scrollToTop} 
          className="fixed bottom-8 left-8 z-50 w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 border-2 border-white/20 shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110 animate-fade-in" 
          size="icon"
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </Button>
      )}

      <div className="container mx-auto px-4 sm:px-6 relative z-10 sm:py-1 py-[1px]">
        {/* Main 4-column layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Column 1: Brand & Social */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <Link to="/" className="inline-block group">
              <div className="backdrop-blur-sm border border-gray-200/30 p-2 sm:p-3 transition-all duration-300 group-hover:border-gray-300/40 group-hover:scale-105 bg-white/20 rounded-lg px-[39px] py-[26px]">
                <img src="/lovable-uploads/407b475e-cd49-4ba1-918b-57bd3fc6c955.png" alt="MusicGift by Mango Records" className="h-18s m:h-18 md:h-18 w-auto object-cover drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] mx-auto sm:mx-0" />
              </div>
            </Link>
            
            <p className="text-gray-700 leading-relaxed text-xs font-medium">
              {t('footerDescription')}
            </p>
            
            {/* Social Links */}
            <div className="space-y-2">
              <h4 className="text-gray-800 font-bold text-xs uppercase tracking-wider">
                {t('followUs') || 'Follow Us'}
              </h4>
              <div className="flex justify-center sm:justify-start space-x-2">
                {[{
                icon: Facebook,
                href: "https://www.facebook.com/MusicGiftofficialpage/",
                label: "Facebook",
                color: "hover:bg-blue-600"
              }, {
                icon: Instagram,
                href: "https://www.instagram.com/musicgiftofficial/",
                label: "Instagram",
                color: "hover:bg-pink-600"
              }, {
                icon: Youtube,
                href: "https://www.youtube.com/@MangoRecordsChannel",
                label: "YouTube",
                color: "hover:bg-red-600"
              }, {
                icon: Music,
                href: "https://www.tiktok.com/@musicgiftofficial",
                label: "TikTok",
                color: "hover:bg-gray-800"
              }].map(({
                icon: Icon,
                href,
                label,
                color
              }) => <a key={label} href={href} className={`w-8 h-8 bg-white/20 backdrop-blur-sm border border-gray-200/30 ${color} rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-gray-300/40 group touch-manipulation min-h-[32px]`} aria-label={label}>
                    <Icon className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-300" />
                  </a>)}
              </div>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <div className="relative">
              <h3 className="text-gray-800 font-bold text-sm mb-1">
                {t('quickLinks')}
              </h3>
              <div className="w-8 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto sm:mx-0"></div>
            </div>
            
            <ul className="space-y-0.5">
              {[{
              to: "/",
              label: t('home')
            }, {
              to: "/about",
              label: t('about')
            }, {
              to: "/packages",
              label: t('packages')
            }, {
              to: "/how-it-works",
              label: t('howItWorks')
            }, {
              to: "/testimonials",
              label: t('testimonials')
            }, {
              to: "/admin",
              label: t('admin')
            }].map(({
              to,
              label
            }) => <li key={to}>
                  <Link to={to} className="text-gray-600 hover:text-gray-800 transition-all duration-300 relative group inline-block py-0.5 px-1 rounded text-xs hover:bg-white/20 backdrop-blur-sm touch-manipulation min-h-[28px] flex items-center justify-center sm:justify-start">
                    <span className="relative z-10">{label}</span>
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* Column 3: Legal & Policies */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <div className="relative">
              <h3 className="text-gray-800 font-bold text-sm mb-1">
                {t('legal')}
              </h3>
              <div className="w-8 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto sm:mx-0"></div>
            </div>
            
            <ul className="space-y-0.5">
              <li>
                <button onClick={openTerms} className="text-gray-600 hover:text-purple-600 transition-all duration-300 relative group py-0.5 px-1 rounded text-xs hover:bg-white/20 backdrop-blur-sm touch-manipulation min-h-[28px] flex items-center justify-center sm:justify-start w-full">
                  <span className="relative z-10">{t('termsConditions')}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></div>
                </button>
              </li>
              <li>
                <button onClick={openPrivacy} className="text-gray-600 hover:text-purple-600 transition-all duration-300 relative group py-0.5 px-1 rounded text-xs hover:bg-white/20 backdrop-blur-sm touch-manipulation min-h-[28px] flex items-center justify-center sm:justify-start w-full">
                  <span className="relative z-10">{t('privacyPolicy')}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></div>
                </button>
              </li>
              <li>
                <button onClick={openRefund} className="text-gray-600 hover:text-purple-600 transition-all duration-300 relative group py-0.5 px-1 rounded text-xs hover:bg-white/20 backdrop-blur-sm touch-manipulation min-h-[28px] flex items-center justify-center sm:justify-start w-full">
                  <span className="relative z-10">{t('refundPolicy')}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></div>
                </button>
              </li>
              <li>
                <button onClick={openCookie} className="text-gray-600 hover:text-purple-600 transition-all duration-300 relative group py-0.5 px-1 rounded text-xs hover:bg-white/20 backdrop-blur-sm touch-manipulation min-h-[28px] flex items-center justify-center sm:justify-start w-full">
                  <span className="relative z-10">{t('cookiePolicy')}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></div>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info Only */}
          <div className="space-y-3 sm:space-y-4 text-center sm:text-left">
            <div className="relative">
              <h3 className="text-gray-800 font-bold text-sm mb-1">
                {t('contactInfo')}
              </h3>
              <div className="w-8 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto sm:mx-0"></div>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-2">
              {[{
              icon: Mail,
              text: "info@musicgift.ro",
              href: "mailto:info@musicgift.ro"
            }, {
              icon: Phone,
              text: "+40 723 141 501",
              href: "tel:+40723141501"
            }, {
              icon: MapPin,
              text: "Strada Fabrica de Glucoza 6-8, București",
              href: "#"
            }].map(({
              icon: Icon,
              text,
              href
            }) => <a key={text} href={href} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-all duration-300 group p-1.5 rounded-lg hover:bg-white/20 backdrop-blur-sm border border-transparent hover:border-gray-200/30 touch-manipulation min-h-[36px]">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-gray-200/30 rounded-lg flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300 flex-shrink-0">
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-medium break-words">{text}</span>
                </a>)}
            </div>
          </div>
        </div>

        {/* Newsletter Section - New Addition */}
        <div className="mt-8 sm:mt-12 space-y-3 sm:space-y-4">
          <div className="relative text-center">
            <h3 className="text-gray-800 font-bold text-lg mb-2">
              {t('stayUpdated')}
            </h3>
            <div className="w-12 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto mb-4"></div>
            <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
              {t('subscribeNewsletter')}
            </p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto"
          >
            <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-4">
              <NewsletterForm />
            </div>
          </motion.div>
        </div>

        {/* Legal Compliance Section - Full Width */}
        <div className="mt-6 sm:mt-12 space-y-3 sm:space-y-4">
          <div className="relative text-center sm:text-left">
            <h3 className="text-gray-800 font-bold text-sm mb-1">
              {t('legalCompliance')}
            </h3>
            <div className="w-8 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto sm:mx-0"></div>
          </div>
          <LegalCompliance />
        </div>

        {/* Enhanced Visual Separator */}
        <div className="border-t border-gray-300/20 mt-8 sm:mt-16 relative"></div>

        {/* Enhanced Final Copyright Section */}
        <div className="mt-8 sm:mt-12 pt-8 sm:pt-12 relative overflow-hidden">
          {/* Full Width Enhanced Gradient Background with lighter colors */}
          <div className="absolute inset-0 w-full" style={{
          backgroundImage: 'url(/lovable-uploads/1247309a-2342-4b12-af03-20eca7d1afab.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
            {/* Much lighter layered background effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100/50 via-violet-50/40 to-pink-100/50"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-purple-50/20 to-fuchsia-50/35"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-100/20 via-transparent to-pink-100/20"></div>
            
            {/* Very light vignette effect */}
            <div className="bg-transparent"></div>
            
            {/* Subtle bottom fade effect */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-200/60 via-gray-100/30 to-transparent"></div>
          </div>
          
          {/* Copyright Text Content */}
          <div className="relative z-10 text-center py-6">
            <p className="text-gray-700 text-sm font-medium">
              © 2025 MusicGift.ro. All rights reserved. Made by RED DOMAIN with ❤️ for music lovers
            </p>
          </div>

          {/* Subtle fade to bottom effect */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-100/20 to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* Include the Legal Modals */}
      <LegalModals t={t} />
    </footer>
  );
};

export default Footer;

</edits_to_apply>
