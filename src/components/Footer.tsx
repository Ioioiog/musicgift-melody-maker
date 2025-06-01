
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Music } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import NewsletterForm from "@/components/NewsletterForm";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gradient-to-br from-gray-800 via-gray-900 to-slate-900 text-white relative overflow-hidden">
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/2 to-transparent backdrop-blur-sm"></div>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-white rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-gray-400 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto sm:px-6 sm:py-12 md:py-16 relative z-10 px-[20px] py-[36px] backdrop-blur-md bg-white/5 border-t border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
          {/* Brand */}
          <div className="space-y-4 sm:space-y-6 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 group">
              <img src="/lovable-uploads/61b6a361-9741-4d73-8075-0df2b2f8fb27.png" alt="MusicGift by Mango Records" className="h-10 sm:h-12 w-auto transition-transform duration-300 group-hover:scale-105" />
            </Link>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              {t('footerDescription')}
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              {[{
              icon: Facebook,
              href: "#",
              label: "Facebook"
            }, {
              icon: Instagram,
              href: "#",
              label: "Instagram"
            }, {
              icon: Youtube,
              href: "#",
              label: "YouTube"
            }, {
              icon: Music,
              href: "#",
              label: "TikTok"
            }].map(({
              icon: Icon,
              href,
              label
            }) => <a key={label} href={href} className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 hover:bg-purple-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group" aria-label={label}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:text-white" />
                </a>)}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 relative">
              {t('quickLinks')}
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400"></div>
            </h3>
            <ul className="space-y-2 sm:space-y-3">
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
                  <Link to={to} className="text-gray-300 hover:text-purple-400 transition-all duration-300 hover:translate-x-2 inline-block relative group text-sm sm:text-base">
                    {label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </li>)}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 relative">
              {t('contactInfo')}
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400"></div>
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {[{
              icon: Mail,
              text: "info@musicgift.ro",
              href: "mailto:info@musicgift.ro"
            }, {
              icon: Phone,
              text: "+40 721 234 567",
              href: "tel:+40721234567"
            }, {
              icon: MapPin,
              text: "Strada Muzicii 42, București",
              href: "#"
            }].map(({
              icon: Icon,
              text,
              href
            }) => <a key={text} href={href} className="flex items-center space-x-2 sm:space-x-3 text-gray-300 hover:text-purple-400 transition-colors duration-300 group text-sm sm:text-base">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-600/20 rounded-lg flex items-center justify-center group-hover:bg-purple-600/40 transition-colors duration-300 flex-shrink-0">
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  </div>
                  <span className="break-all">{text}</span>
                </a>)}
            </div>

            {/* Legal Links */}
            <div className="pt-3 sm:pt-4">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 sm:mb-3">
                {t('legal')}
              </h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                {[t('termsConditions'), t('privacyPolicy'), t('refundPolicy'), t('cookiePolicy')].map(item => <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                      {item}
                    </a>
                  </li>)}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4 sm:space-y-6 sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 relative">
              {t('stayUpdated')}
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400"></div>
            </h3>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              {t('newsletterDescription')}
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-8 sm:mt-12 md:mt-16 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <p className="text-xs sm:text-sm text-slate-50 text-center sm:text-left">
              {t('copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
