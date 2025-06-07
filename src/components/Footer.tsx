import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Music } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import LegalModals, { useLegalModals } from "@/components/LegalModals";
import LegalCompliance from "@/components/LegalCompliance";
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
  return <footer className="relative overflow-hidden" style={{
    backgroundImage: 'url(/lovable-uploads/80488a4f-b392-4eca-b181-f587474721fd.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}>
      {/* White glass overlay for glassmorphism effect */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

      {/* Subtle grid pattern overlay */}
      <div style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }} className="inset-0.5 inset-0 -bottom-0.5 bg-violet-500 bg-gradient-purple"></div>

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
              }) => <a key={label} href={href} className={`w-8 h-8 bg-white/10 backdrop-blur-sm border border-black/10 ${color} rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-black/30 group touch-manipulation min-h-[32px]`} aria-label={label}>
                    <Icon className="w-4 h-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
                  </a>)}
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
                  <Link to={to} className="text-gray-700 hover:text-gray-900 transition-all duration-300 relative group inline-block py-0.5 px-1 rounded text-xs hover:bg-white/10 backdrop-blur-sm touch-manipulation min-h-[28px] flex items-center justify-center sm:justify-start">
                    <span className="relative z-10">{label}</span>
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </li>)}
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
                <button onClick={openTerms} className="text-gray-700 hover:text-purple-600 transition-all duration-300 relative group py-0.5 px-1 rounded text-xs hover:bg-white/10 backdrop-blur-sm touch-manipulation min-h-[28px] flex items-center justify-center sm:justify-start w-full">
                  <span className="relative z-10">{t('termsConditions')}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></div>
                </button>
              </li>
              <li>
                <button onClick={openPrivacy} className="text-gray-700 hover:text-purple-600 transition-all duration-300 relative group py-0.5 px-1 rounded text-xs hover:bg-white/10 backdrop-blur-sm touch-manipulation min-h-[28px] flex items-center justify-center sm:justify-start w-full">
                  <span className="relative z-10">{t('privacyPolicy')}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></div>
                </button>
              </li>
              <li>
                <button onClick={openRefund} className="text-gray-700 hover:text-purple-600 transition-all duration-300 relative group py-0.5 px-1 rounded text-xs hover:bg-white/10 backdrop-blur-sm touch-manipulation min-h-[28px] flex items-center justify-center sm:justify-start w-full">
                  <span className="relative z-10">{t('refundPolicy')}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></div>
                </button>
              </li>
              <li>
                <button onClick={openCookie} className="text-gray-700 hover:text-purple-600 transition-all duration-300 relative group py-0.5 px-1 rounded text-xs hover:bg-white/10 backdrop-blur-sm touch-manipulation min-h-[28px] flex items-center justify-center sm:justify-start w-full">
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
            }) => <a key={text} href={href} className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-all duration-300 group p-1.5 rounded-lg hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-black/10 touch-manipulation min-h-[36px]">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-black/10 rounded-lg flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300 flex-shrink-0">
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-medium break-words">{text}</span>
                </a>)}
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

        {/* Bottom Section - Copyright */}
        <div className="border-t border-black/10 mt-6 sm:mt-12 pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div className="bg-white/10 backdrop-blur-sm border border-black/10 rounded-full px-3 py-1.5 sm:py-2 sm:px-[180px]">
              <p className="text-xs text-gray-700 font-medium text-center">
                {t('copyright')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Include the Legal Modals */}
      <LegalModals t={t} />
    </footer>;
};
export default Footer;