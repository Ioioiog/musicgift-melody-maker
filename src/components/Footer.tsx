
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Music } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import NewsletterForm from "@/components/NewsletterForm";
import LegalModals, { useLegalModals } from "@/components/LegalModals";

const Footer = () => {
  const { t } = useLanguage();
  const { openTerms, openPrivacy, openRefund, openCookie } = useLegalModals();

  return (
    <footer className="relative overflow-hidden" style={{
      backgroundImage: 'url(/lovable-uploads/80488a4f-b392-4eca-b181-f587474721fd.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* White glass overlay for glassmorphism effect */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="container mx-auto px-6 relative z-10 py-0">
        <div className="grid grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-5 py-0 px-px">
          
          {/* Brand Section - Enhanced */}
          <div className="space-y-20 lg:col-span-1 py-0 px-0">
            <Link to="/" className="inline-block group">
              <div className="backdrop-blur-sm border border-black/10 p-4 transition-all duration-300 group-hover:border-black/20 group-hover:scale-105 bg-transparent rounded-none py-[5px] px-[34px]">
                <img 
                  src="/lovable-uploads/407b475e-cd49-4ba1-918b-57bd3fc6c955.png" 
                  alt="MusicGift by Mango Records" 
                  className="h-30 w-30 object-cover drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" 
                />
              </div>
            </Link>
            
            <p className="text-gray-800 leading-relaxed text-sm font-medium text-left py-0 my-[2px]">
              {t('footerDescription')}
            </p>
            
            {/* Enhanced Social Links */}
            <div className="space-y-3 my-[31px]">
              <h4 className="text-gray-900 font-bold text-sm uppercase tracking-wider my-0">
                {t('followUs') || 'Follow Us'}
              </h4>
              <div className="flex space-x-3">
                {[
                  {
                    icon: Facebook,
                    href: "https://www.facebook.com/MusicGiftofficialpage/",
                    label: "Facebook",
                    color: "hover:bg-blue-600"
                  },
                  {
                    icon: Instagram,
                    href: "https://www.instagram.com/musicgiftofficial/",
                    label: "Instagram",
                    color: "hover:bg-pink-600"
                  },
                  {
                    icon: Youtube,
                    href: "https://www.youtube.com/@MangoRecordsChannel",
                    label: "YouTube",
                    color: "hover:bg-red-600"
                  },
                  {
                    icon: Music,
                    href: "https://www.tiktok.com/@musicgiftofficial",
                    label: "TikTok",
                    color: "hover:bg-gray-800"
                  }
                ].map(({ icon: Icon, href, label, color }) => (
                  <a 
                    key={label} 
                    href={href} 
                    className={`w-11 h-11 bg-white/10 backdrop-blur-sm border border-black/10 ${color} rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-black/30 group`} 
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors duration-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links - Enhanced */}
          <div className="space-y-6 py-[17px]">
            <div className="relative">
              <h3 className="text-gray-900 font-bold text-lg mb-1 text-right">
                {t('quickLinks')}
              </h3>
              <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full py-0 px-[141px]"></div>
            </div>
            
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
                    className="text-gray-700 hover:text-gray-900 transition-all duration-300 relative group inline-block py-1"
                  >
                    <span className="relative z-10 text-right">{label}</span>
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-lg scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Enhanced */}
          <div className="space-y-6 py-[17px]">
            <div className="relative">
              <h3 className="text-gray-900 font-bold text-lg mb-1 text-right">
                {t('contactInfo')}
              </h3>
              <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-[139px]"></div>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  icon: Mail,
                  text: "mihai.gruia@mangorecords.net",
                  href: "mailto:mihai.gruia@mangorecords.net"
                },
                {
                  icon: Phone,
                  text: "+40 723 141 501",
                  href: "tel:+40723141501"
                },
                {
                  icon: MapPin,
                  text: "Strada Fabrica de Glucoza 6-8, București",
                  href: "#"
                }
              ].map(({ icon: Icon, text, href }) => (
                <a 
                  key={text} 
                  href={href} 
                  className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition-all duration-300 group p-3 rounded-xl hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-black/10"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-black/10 rounded-lg flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300 flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium break-all">{text}</span>
                </a>
              ))}
            </div>

            {/* Legal Links - Enhanced with Modal Triggers */}
            <div className="pt-4 border-t border-black/10">
              <h4 className="text-gray-900 font-bold text-sm uppercase tracking-wider mb-4">
                {t('legal')}
              </h4>
              <ul className="grid grid-cols-2 gap-2 text-sm">
                <li>
                  <button 
                    onClick={openTerms}
                    className="text-gray-600 hover:text-purple-600 transition-colors duration-300 hover:underline block py-1 text-left w-full"
                  >
                    {t('termsConditions')}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={openPrivacy}
                    className="text-gray-600 hover:text-purple-600 transition-colors duration-300 hover:underline block py-1 text-left w-full"
                  >
                    {t('privacyPolicy')}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={openRefund}
                    className="text-gray-600 hover:text-purple-600 transition-colors duration-300 hover:underline block py-1 text-left w-full"
                  >
                    {t('refundPolicy')}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={openCookie}
                    className="text-gray-600 hover:text-purple-600 transition-colors duration-300 hover:underline block py-1 text-left w-full"
                  >
                    {t('cookiePolicy')}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter - Enhanced */}
          <div className="space-y-6 py-[17px]">
            <div className="relative">
              <h3 className="text-gray-900 font-bold text-lg mb-1 text-right">
                {t('stayUpdated')}
              </h3>
              <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-[138px]"></div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border border-black/10 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
              <p className="text-gray-700 leading-relaxed text-sm mb-6 font-medium">
                {t('newsletterDescription')}
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Bottom Section - Enhanced */}
        <div className="border-t border-black/10 mt-16 pt-8 py-0">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="bg-white/10 backdrop-blur-sm border border-black/10 rounded-full px-6 py-3">
              <p className="text-sm text-gray-700 font-medium px-[151px]">
                {t('copyright')}
              </p>
            </div>
            
            {/* Additional trust indicators */}
            <div className="flex items-center space-x-4 text-xs text-gray-600">
              <span className="bg-white/10 backdrop-blur-sm border border-black/10 rounded-full px-3 py-1">
                🔒 {t('securePayments') || 'Secure Payments'}
              </span>
              <span className="bg-white/10 backdrop-blur-sm border border-black/10 rounded-full px-3 py-1">
                ⚡ {t('fastDelivery') || 'Fast Delivery'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Include the Legal Modals */}
      <LegalModals t={t} />
    </footer>
  );
};

export default Footer;
