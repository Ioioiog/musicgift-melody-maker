import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Music } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import NewsletterForm from "@/components/NewsletterForm";
import LegalModals, { useLegalModals } from "@/components/LegalModals";
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
      <div className="absolute inset-0 opacity-[0.02]" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }}></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 py-8 sm:py-12">
        {/* Mobile-first responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          
          {/* Brand Section - Mobile optimized */}
          <div className="space-y-4 sm:space-y-6 text-center sm:text-left">
            <Link to="/" className="inline-block group">
              <div className="backdrop-blur-sm border border-black/10 p-3 sm:p-4 transition-all duration-300 group-hover:border-black/20 group-hover:scale-105 bg-transparent rounded-lg">
                <img src="/lovable-uploads/407b475e-cd49-4ba1-918b-57bd3fc6c955.png" alt="MusicGift by Mango Records" className="h-16 sm:h-20 md:h-24 w-auto object-cover drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] mx-auto sm:mx-0" />
              </div>
            </Link>
            
            <p className="text-gray-800 leading-relaxed text-sm font-medium">
              {t('footerDescription')}
            </p>
            
            {/* Enhanced Social Links - Mobile optimized */}
            <div className="space-y-3">
              <h4 className="text-gray-900 font-bold text-sm uppercase tracking-wider">
                {t('followUs') || 'Follow Us'}
              </h4>
              <div className="flex justify-center sm:justify-start space-x-3">
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
              }) => <a key={label} href={href} className={`w-11 h-11 bg-white/10 backdrop-blur-sm border border-black/10 ${color} rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-black/30 group touch-manipulation min-h-[44px]`} aria-label={label}>
                    <Icon className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors duration-300" />
                  </a>)}
              </div>
            </div>
          </div>

          {/* Quick Links - Mobile optimized */}
          <div className="space-y-4 sm:space-y-6 text-center sm:text-left">
            <div className="relative">
              <h3 className="text-gray-900 font-bold text-lg mb-2">
                {t('quickLinks')}
              </h3>
              <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto sm:mx-0"></div>
            </div>
            
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
                  <Link to={to} className="text-gray-700 hover:text-gray-900 transition-all duration-300 relative group inline-block py-2 px-3 rounded-lg hover:bg-white/10 backdrop-blur-sm touch-manipulation min-h-[44px] flex items-center justify-center sm:justify-start">
                    <span className="relative z-10">{label}</span>
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* Contact Info - Mobile optimized */}
          <div className="space-y-4 sm:space-y-6 text-center sm:text-left">
            <div className="relative">
              <h3 className="text-gray-900 font-bold text-lg mb-2">
                {t('contactInfo')}
              </h3>
              <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto sm:mx-0"></div>
            </div>
            
            <div className="space-y-3">
              {[{
              icon: Mail,
              text: "mihai.gruia@mangorecords.net",
              href: "mailto:mihai.gruia@mangorecords.net"
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
            }) => <a key={text} href={href} className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 text-gray-700 hover:text-gray-900 transition-all duration-300 group p-3 rounded-xl hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-black/10 touch-manipulation min-h-[44px]">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-black/10 rounded-lg flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300 flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-center sm:text-left break-words">{text}</span>
                </a>)}
            </div>

            {/* Legal Links - Mobile optimized */}
            <div className="pt-4 border-t border-black/10">
              <h4 className="text-gray-900 font-bold text-sm uppercase tracking-wider mb-4">
                {t('legal')}
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <li>
                  <button onClick={openTerms} className="text-gray-600 hover:text-purple-600 transition-colors duration-300 hover:underline py-2 px-3 text-center sm:text-left w-full rounded-lg hover:bg-white/10 touch-manipulation min-h-[44px] flex items-center justify-center sm:justify-start">
                    {t('termsConditions')}
                  </button>
                </li>
                <li>
                  <button onClick={openPrivacy} className="text-gray-600 hover:text-purple-600 transition-colors duration-300 hover:underline py-2 px-3 text-center sm:text-left w-full rounded-lg hover:bg-white/10 touch-manipulation min-h-[44px] flex items-center justify-center sm:justify-start">
                    {t('privacyPolicy')}
                  </button>
                </li>
                <li>
                  <button onClick={openRefund} className="text-gray-600 hover:text-purple-600 transition-colors duration-300 hover:underline py-2 px-3 text-center sm:text-left w-full rounded-lg hover:bg-white/10 touch-manipulation min-h-[44px] flex items-center justify-center sm:justify-start">
                    {t('refundPolicy')}
                  </button>
                </li>
                <li>
                  <button onClick={openCookie} className="text-gray-600 hover:text-purple-600 transition-colors duration-300 hover:underline py-2 px-3 text-center sm:text-left w-full rounded-lg hover:bg-white/10 touch-manipulation min-h-[44px] flex items-center justify-center sm:justify-start">
                    {t('cookiePolicy')}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter - Mobile optimized */}
          <div className="space-y-4 sm:space-y-6 text-center sm:text-left">
            <div className="relative">
              <h3 className="text-gray-900 font-bold text-lg mb-2">
                {t('stayUpdated')}
              </h3>
              <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto sm:mx-0"></div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border border-black/10 rounded-2xl p-4 sm:p-6 hover:bg-white/20 transition-all duration-300">
              <p className="text-gray-700 leading-relaxed text-sm mb-4 sm:mb-6 font-medium">
                {t('newsletterDescription')}
              </p>
              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* Bottom Section - Mobile optimized */}
        <div className="border-t border-black/10 mt-8 sm:mt-16 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="bg-white/10 backdrop-blur-sm border border-black/10 rounded-full px-4 py-2 sm:py-3 sm:px-[214px]">
              <p className="text-sm text-gray-700 font-medium text-center">
                {t('copyright')}
              </p>
            </div>
            
            {/* Trust indicators - Mobile optimized */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-xs text-gray-600">
              
              
            </div>
          </div>
        </div>
      </div>

      {/* Include the Legal Modals */}
      <LegalModals t={t} />
    </footer>;
};
export default Footer;