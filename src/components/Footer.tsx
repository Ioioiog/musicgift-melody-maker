import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Music, ArrowUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LegalModals, { useLegalModals } from "@/components/LegalModals";
import LegalCompliance from "@/components/LegalCompliance";
import NewsletterForm from "@/components/NewsletterForm";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import OptimizedLogo from "@/components/OptimizedLogo";

const Footer = () => {
  const {
    t
  } = useLanguage();
  const {
    openTerms,
    openPrivacy,
    openRefund,
    openCookie
  } = useLegalModals();
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return <>
      {/* Back to Top Button */}
      {showBackToTop && <motion.div initial={{
      opacity: 0,
      scale: 0.8
    }} animate={{
      opacity: 1,
      scale: 1
    }} exit={{
      opacity: 0,
      scale: 0.8
    }} transition={{
      duration: 0.3
    }} className="fixed bottom-6 left-6 z-[99999]">
          <Button onClick={scrollToTop} className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-2xl transition-all duration-300 hover:scale-110 border-4 border-white/30 backdrop-blur-sm" size="icon" aria-label="Back to top">
            <ArrowUp className="w-7 h-7 text-white drop-shadow-lg" />
          </Button>
        </motion.div>}

      <footer className="relative text-gray-900 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `url('/uploads/c8247b19-53ef-4926-888f-4d4fd609e783.png')`
    }}>
        {/* Semi-transparent overlay for better text readability */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Main Footer Content */}
          <div className="py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
              
              {/* Brand Column with Optimized Logo */}
              <div className="lg:col-span-1 space-y-6">
                <Link to="/" className="inline-block">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all duration-300">
                    <OptimizedLogo 
                      className="h-16" 
                      width={180} 
                      height={60}
                      alt="MusicGift by Mango Records - Logo Footer"
                    />
                  </div>
                </Link>
                
                <p className="text-gray-700 text-sm leading-relaxed">
                  {t('footerDescription')}
                </p>
                
                {/* Social Links */}
                <div className="space-y-4">
                  <h4 className="text-gray-900 font-semibold text-sm uppercase tracking-wide">
                    {t('followUs') || 'Follow Us'}
                  </h4>
                  <div className="flex space-x-3">
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
                  }) => <a key={label} href={href} className={`w-10 h-10 bg-gray-800/20 ${color} rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm`} aria-label={label}>
                        <Icon className="w-5 h-5 text-gray-800" />
                      </a>)}
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-6">
                <h3 className="text-gray-900 font-semibold text-lg">
                  {t('quickLinks')}
                </h3>
                <ul className="space-y-3">
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
                      <Link to={to} className="text-gray-700 hover:text-gray-900 transition-colors duration-300 hover:translate-x-1 inline-block">
                        {label}
                      </Link>
                    </li>)}
                </ul>
              </div>

              {/* Legal & Policies */}
              <div className="space-y-6">
                <h3 className="text-gray-900 font-semibold text-lg">
                  {t('legal')}
                </h3>
                <ul className="space-y-3">
                  <li>
                    <button onClick={openTerms} className="text-gray-700 hover:text-gray-900 transition-colors duration-300 hover:translate-x-1 inline-block text-left">
                      {t('termsConditions')}
                    </button>
                  </li>
                  <li>
                    <button onClick={openPrivacy} className="text-gray-700 hover:text-gray-900 transition-colors duration-300 hover:translate-x-1 inline-block text-left">
                      {t('privacyPolicy')}
                    </button>
                  </li>
                  <li>
                    <button onClick={openRefund} className="text-gray-700 hover:text-gray-900 transition-colors duration-300 hover:translate-x-1 inline-block text-left">
                      {t('refundPolicy')}
                    </button>
                  </li>
                  <li>
                    <button onClick={openCookie} className="text-gray-700 hover:text-gray-900 transition-colors duration-300 hover:translate-x-1 inline-block text-left">
                      {t('cookiePolicy')}
                    </button>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <h3 className="text-gray-900 font-semibold text-lg">
                  {t('contactInfo')}
                </h3>
                <div className="space-y-4">
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
                }) => <a key={text} href={href} className="flex items-start space-x-3 text-gray-700 hover:text-gray-900 transition-colors duration-300 group">
                      <div className="w-5 h-5 mt-0.5 flex-shrink-0">
                        <Icon className="w-5 h-5 text-purple-600 group-hover:text-purple-700" />
                      </div>
                      <span className="text-sm leading-relaxed">{text}</span>
                    </a>)}
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="border-t border-gray-400 py-12">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div>
                <h3 className="text-gray-900 font-semibold text-xl mb-3">
                  {t('stayUpdated')}
                </h3>
                <p className="text-gray-700 text-sm">
                  {t('subscribeNewsletter')}
                </p>
              </div>
              
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6
            }} className="bg-white/30 backdrop-blur-sm border border-gray-400 rounded-xl p-6">
                <NewsletterForm />
              </motion.div>
            </div>
          </div>

          {/* Legal Compliance Section */}
          <div className="border-t border-gray-400 py-8">
            <div className="space-y-4">
              <h3 className="text-gray-900 font-semibold text-lg text-center">
                {t('legalCompliance')}
              </h3>
              <LegalCompliance />
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="border-t border-gray-400 py-8">
            <div className="text-center px-12 md:px-4">
              <p className="text-gray-600 text-[10px] md:text-sm leading-tight px-0 mx-[22px]">
                © 2025 MusicGift.ro. All rights reserved. Made by RED DOMAIN with ❤️ for music lovers
              </p>
            </div>
          </div>
        </div>

        {/* Include the Legal Modals */}
        <LegalModals t={t} />
      </footer>
    </>;
};
export default Footer;
