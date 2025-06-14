import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCookieContext } from "@/contexts/CookieContext";
import NewsletterForm from "./NewsletterForm";
import LegalModals from "./LegalModals";
import LegalCompliance from "./LegalCompliance";
import CookieSettings from "./CookieSettings";
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Phone, 
  Mail, 
  MapPin, 
  Headphones,
  MessageCircle,
  Cookie
} from "lucide-react";

const Footer = () => {
  const { t } = useLanguage();
  const { preferences, savePreferences, withdrawConsent } = useCookieContext();
  const [showLegalModal, setShowLegalModal] = useState<string | null>(null);
  const [showCookieSettings, setShowCookieSettings] = useState(false);

  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        
        
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              
              {/* Company Info */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  MusicGift.ro
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {t('footerDescription')}
                </p>
                <div className="flex space-x-4">
                  <a href="https://facebook.com/musicgift.ro" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="https://instagram.com/musicgift.ro" className="text-gray-400 hover:text-pink-400 transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="https://youtube.com/@musicgift" className="text-gray-400 hover:text-red-400 transition-colors">
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </motion.div>

              {/* Quick Links */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-4"
              >
                <h4 className="text-md font-semibold text-white">{t('quickLinks')}</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/packages" className="text-gray-300 hover:text-orange-400 transition-colors">{t('packages')}</Link></li>
                  <li><Link to="/how-it-works" className="text-gray-300 hover:text-orange-400 transition-colors">{t('howItWorks')}</Link></li>
                  <li><Link to="/about" className="text-gray-300 hover:text-orange-400 transition-colors">{t('about')}</Link></li>
                  <li><Link to="/contact" className="text-gray-300 hover:text-orange-400 transition-colors">{t('contact')}</Link></li>
                  <li><Link to="/testimonials" className="text-gray-300 hover:text-orange-400 transition-colors">{t('testimonials')}</Link></li>
                </ul>
              </motion.div>

              {/* Contact Info */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                <h4 className="text-md font-semibold text-white">{t('contactInfo')}</h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-orange-400" />
                    <a href="tel:+40758048048" className="text-gray-300 hover:text-orange-400 transition-colors">
                      +40 758 048 048
                    </a>
                  </li>
                  <li className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-orange-400" />
                    <a href="https://wa.me/40758048048" className="text-gray-300 hover:text-orange-400 transition-colors">
                      WhatsApp
                    </a>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-orange-400" />
                    <a href="mailto:info@musicgift.ro" className="text-gray-300 hover:text-orange-400 transition-colors">
                      info@musicgift.ro
                    </a>
                  </li>
                  <li className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-orange-400 mt-0.5" />
                    <span className="text-gray-300">Bucharest, Romania</span>
                  </li>
                </ul>
              </motion.div>

              {/* Newsletter */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-4"
              >
                <h4 className="text-md font-semibold text-white">{t('stayUpdated')}</h4>
                <p className="text-gray-300 text-xs leading-relaxed">
                  {t('newsletterDescription')}
                </p>
                <NewsletterForm />
              </motion.div>
            </div>

            {/* Legal Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.4 }}
              className="border-t border-gray-700 pt-8 mb-8"
            >
              <div className="flex flex-wrap justify-center md:justify-between items-center gap-4">
                <div className="flex flex-wrap justify-center gap-4 text-xs">
                  <button
                    onClick={() => setShowLegalModal('terms')}
                    className="text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    {t('termsConditions')}
                  </button>
                  <button
                    onClick={() => setShowLegalModal('privacy')}
                    className="text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    {t('privacyPolicy')}
                  </button>
                  <button
                    onClick={() => setShowLegalModal('refund')}
                    className="text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    {t('refundPolicy')}
                  </button>
                  <button
                    onClick={() => setShowLegalModal('cookies')}
                    className="text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    {t('cookiePolicy')}
                  </button>
                  <button
                    onClick={() => setShowCookieSettings(true)}
                    className="text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-1"
                  >
                    <Cookie className="w-3 h-3" />
                    {t('manageCookies')}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Legal Compliance Section */}
            <LegalCompliance />

            {/* Copyright */}
            <motion.div 
              initial={{ opacity: 0 }} 
              whileInView={{ opacity: 1 }} 
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center text-xs text-gray-400 border-t border-gray-700 pt-6"
            >
              <p>{t('copyright', `© ${currentYear} MusicGift.ro. All rights reserved. Made by RED DOMAIN with ❤️ for music lovers`)}</p>
            </motion.div>
          </div>
        </div>
      </footer>

      {/* Legal Modals */}
      <LegalModals 
        showModal={showLegalModal} 
        onClose={() => setShowLegalModal(null)} 
      />

      {/* Cookie Settings Modal */}
      <CookieSettings
        isOpen={showCookieSettings}
        onClose={() => setShowCookieSettings(false)}
        preferences={preferences}
        onSave={savePreferences}
      />
    </>
  );
};

export default Footer;
