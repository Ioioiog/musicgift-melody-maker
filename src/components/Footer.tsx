
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
      <footer className="bg-white text-black relative overflow-hidden border-t border-gray-200">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NGgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEG0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        </div>
        
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
                <p className="text-gray-700 text-sm leading-relaxed">
                  {t('footerDescription')}
                </p>
                <div className="flex space-x-4">
                  <a 
                    href="https://facebook.com/musicgift.ro" 
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                    aria-label="Vizitează pagina noastră de Facebook"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://instagram.com/musicgift.ro" 
                    className="text-gray-600 hover:text-pink-600 transition-colors"
                    aria-label="Vizitează pagina noastră de Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://youtube.com/@musicgift" 
                    className="text-gray-600 hover:text-red-600 transition-colors"
                    aria-label="Vizitează canalul nostru de YouTube"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
                <h4 className="text-md font-semibold text-black">{t('quickLinks')}</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/packages" className="text-gray-700 hover:text-orange-500 transition-colors" aria-label="Vezi pachetele de servicii muzicale">{t('packages')}</Link></li>
                  <li><Link to="/how-it-works" className="text-gray-700 hover:text-orange-500 transition-colors" aria-label="Află cum funcționează procesul nostru">{t('howItWorks')}</Link></li>
                  <li><Link to="/about" className="text-gray-700 hover:text-orange-500 transition-colors" aria-label="Citește despre echipa noastră">{t('about')}</Link></li>
                  <li><Link to="/contact" className="text-gray-700 hover:text-orange-500 transition-colors" aria-label="Contactează-ne pentru întrebări">{t('contact')}</Link></li>
                  <li><Link to="/testimonials" className="text-gray-700 hover:text-orange-500 transition-colors" aria-label="Citește mărturiile clienților noștri">{t('testimonials')}</Link></li>
                </ul>
              </motion.div>

              {/* Contact Info */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                <h4 className="text-md font-semibold text-black">{t('contactInfo')}</h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-orange-500" />
                    <a href="tel:+40723141501" className="text-gray-700 hover:text-orange-500 transition-colors" aria-label="Sună-ne la numărul de telefon +40 723 141 501">
                      +40 723 141 501
                    </a>
                  </li>
                  <li className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-orange-500" />
                    <a href="https://wa.me/40723141501" className="text-gray-700 hover:text-orange-500 transition-colors" aria-label="Contactează-ne pe WhatsApp" target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-orange-500" />
                    <a href="mailto:info@musicgift.ro" className="text-gray-700 hover:text-orange-500 transition-colors" aria-label="Trimite-ne un email la info@musicgift.ro">
                      info@musicgift.ro
                    </a>
                  </li>
                  <li className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-orange-500 mt-0.5" />
                    <span className="text-gray-700">Bucharest, Romania</span>
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
                <h4 className="text-md font-semibold text-black">{t('stayUpdated')}</h4>
                <p className="text-gray-700 text-xs leading-relaxed">
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
              className="border-t border-gray-300 pt-8 mb-8"
            >
              <div className="flex flex-wrap justify-center md:justify-between items-center gap-4">
                <div className="flex flex-wrap justify-center gap-4 text-xs">
                  <button
                    onClick={() => setShowLegalModal('terms')}
                    className="text-gray-600 hover:text-orange-500 transition-colors"
                    aria-label="Citește termenii și condițiile"
                  >
                    {t('termsConditions')}
                  </button>
                  <button
                    onClick={() => setShowLegalModal('privacy')}
                    className="text-gray-600 hover:text-orange-500 transition-colors"
                    aria-label="Citește politica de confidențialitate"
                  >
                    {t('privacyPolicy')}
                  </button>
                  <button
                    onClick={() => setShowLegalModal('refund')}
                    className="text-gray-600 hover:text-orange-500 transition-colors"
                    aria-label="Citește politica de rambursare"
                  >
                    {t('refundPolicy')}
                  </button>
                  <button
                    onClick={() => setShowLegalModal('cookies')}
                    className="text-gray-600 hover:text-orange-500 transition-colors"
                    aria-label="Citește politica de cookies"
                  >
                    {t('cookiePolicy')}
                  </button>
                  <button
                    onClick={() => setShowCookieSettings(true)}
                    className="text-gray-600 hover:text-orange-500 transition-colors flex items-center gap-1"
                    aria-label="Gestionează setările de cookies"
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
              className="text-center text-xs text-gray-600 border-t border-gray-300 pt-6"
            >
              <p>{t('copyright', `© ${currentYear} MusicGift.ro. All rights reserved. Made by RED DOMAIN with ❤️ for music lovers`)}</p>
            </div>
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
