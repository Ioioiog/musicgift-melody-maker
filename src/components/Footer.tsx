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
      setShowBackToTop(window.scrollY > 200); // Even lower threshold for better visibility
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Back to Top Button - Moved to left side with orange color */}
      {showBackToTop && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-6 z-[99999]"
        >
          <Button 
            onClick={scrollToTop} 
            className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-2xl transition-all duration-300 hover:scale-110 border-4 border-white/30 backdrop-blur-sm" 
            size="icon"
            aria-label="Back to top"
          >
            <ArrowUp className="w-7 h-7 text-white drop-shadow-lg" />
          </Button>
        </motion.div>
      )}

      <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Main Footer Content */}
          <div className="py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
              
              {/* Brand Column */}
              <div className="lg:col-span-1 space-y-6">
                <Link to="/" className="inline-block">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-all duration-300">
                    <img 
                      src="/lovable-uploads/407b475e-cd49-4ba1-918b-57bd3fc6c955.png" 
                      alt="MusicGift by Mango Records" 
                      className="h-16 w-auto object-contain" 
                    />
                  </div>
                </Link>
                
                <p className="text-slate-300 text-sm leading-relaxed">
                  {t('footerDescription')}
                </p>
                
                {/* Social Links */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold text-sm uppercase tracking-wide">
                    {t('followUs') || 'Follow Us'}
                  </h4>
                  <div className="flex space-x-3">
                    {[
                      { icon: Facebook, href: "https://www.facebook.com/MusicGiftofficialpage/", label: "Facebook", color: "hover:bg-blue-600" },
                      { icon: Instagram, href: "https://www.instagram.com/musicgiftofficial/", label: "Instagram", color: "hover:bg-pink-600" },
                      { icon: Youtube, href: "https://www.youtube.com/@MangoRecordsChannel", label: "YouTube", color: "hover:bg-red-600" },
                      { icon: Music, href: "https://www.tiktok.com/@musicgiftofficial", label: "TikTok", color: "hover:bg-gray-800" }
                    ].map(({ icon: Icon, href, label, color }) => (
                      <a 
                        key={label} 
                        href={href} 
                        className={`w-10 h-10 bg-white/10 ${color} rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm`} 
                        aria-label={label}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-6">
                <h3 className="text-white font-semibold text-lg">
                  {t('quickLinks')}
                </h3>
                <ul className="space-y-3">
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
                        className="text-slate-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal & Policies */}
              <div className="space-y-6">
                <h3 className="text-white font-semibold text-lg">
                  {t('legal')}
                </h3>
                <ul className="space-y-3">
                  <li>
                    <button 
                      onClick={openTerms} 
                      className="text-slate-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block text-left"
                    >
                      {t('termsConditions')}
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={openPrivacy} 
                      className="text-slate-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block text-left"
                    >
                      {t('privacyPolicy')}
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={openRefund} 
                      className="text-slate-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block text-left"
                    >
                      {t('refundPolicy')}
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={openCookie} 
                      className="text-slate-300 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block text-left"
                    >
                      {t('cookiePolicy')}
                    </button>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <h3 className="text-white font-semibold text-lg">
                  {t('contactInfo')}
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: Mail, text: "info@musicgift.ro", href: "mailto:info@musicgift.ro" },
                    { icon: Phone, text: "+40 723 141 501", href: "tel:+40723141501" },
                    { icon: MapPin, text: "Strada Fabrica de Glucoza 6-8, București", href: "#" }
                  ].map(({ icon: Icon, text, href }) => (
                    <a 
                      key={text} 
                      href={href} 
                      className="flex items-start space-x-3 text-slate-300 hover:text-white transition-colors duration-300 group"
                    >
                      <div className="w-5 h-5 mt-0.5 flex-shrink-0">
                        <Icon className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                      </div>
                      <span className="text-sm leading-relaxed">{text}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="border-t border-slate-700 py-12">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div>
                <h3 className="text-white font-semibold text-xl mb-3">
                  {t('stayUpdated')}
                </h3>
                <p className="text-slate-300 text-sm">
                  {t('subscribeNewsletter')}
                </p>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6 }}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-xl p-6"
              >
                <NewsletterForm />
              </motion.div>
            </div>
          </div>

          {/* Legal Compliance Section */}
          <div className="border-t border-slate-700 py-8">
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg text-center">
                {t('legalCompliance')}
              </h3>
              <LegalCompliance />
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-slate-700 py-8">
            <div className="text-center">
              <p className="text-slate-400 text-sm">
                © 2025 MusicGift.ro. All rights reserved. Made by RED DOMAIN with ❤️ for music lovers
              </p>
            </div>
          </div>
        </div>

        {/* Include the Legal Modals */}
        <LegalModals t={t} />
      </footer>
    </>
  );
};

export default Footer;
