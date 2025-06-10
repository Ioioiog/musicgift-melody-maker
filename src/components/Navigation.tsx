import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage, languageNames, Language } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart, Check, Globe, LogOut, UserCircle, User, History, ChevronDown, ChevronUp } from "lucide-react";
import CurrencyIcon from "@/components/CurrencyIcon";
import UnifiedSettingsMenu from "@/components/UnifiedSettingsMenu";

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { user, signOut } = useAuth();

  // Get order text based on language
  const getOrderText = () => {
    switch (language) {
      case "ro":
        return "COMANDA";
      default:
        return "ORDER";
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  const navItems = [{
    path: "/",
    label: t("home") || "Home"
  }, {
    path: "/about",
    label: t("about") || "About"
  }, {
    path: "/packages",
    label: t("packages") || "Packages"
  }, {
    path: "/gift",
    label: "Gift Cards"
  }, {
    path: "/how-it-works",
    label: t("howItWorks") || "How It Works"
  }, {
    path: "/testimonials",
    label: t("testimonials") || "Testimonials"
  }, {
    path: "/contact",
    label: t("contact") || "Contact"
  }];

  const languages: Language[] = ["en", "ro", "fr", "pl", "de"];

  return <>
      {/* Background behind navbar */}
      <div style={{
      backgroundImage: 'url(/lovable-uploads/c84c3950-498f-4375-9214-40fe7004aa5f.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }} className="fixed top-0 left-0 w-full h-8 sm:h-10 z-1"></div>

      {/* Floating Logo - Mobile responsive positioning and sizing */}
      <div className="fixed top-2 left-4 sm:top-3 sm:left-5 md:top-4 md:left-6 z-50">
        <Link to="/" className="block group">
          <img alt="MusicGift Logo" className="w-32 sm:w-40 md:w-48 lg:w-60 h-auto transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" src="/lovable-uploads/407b475e-cd49-4ba1-918b-57bd3fc6c955.png" />
        </Link>
      </div>

      {/* Navigation Bar - Mobile responsive spacing */}
      <header className="fixed top-3 sm:top-4 w-full z-40 border-b border-white/10 bg-white/95 backdrop-blur-md shadow-lg px-4 sm:px-6 py-2 sm:py-3">
        <div className="container mx-auto relative z-10">
          <div className="flex items-center justify-between h-8 sm:h-10">
            
            {/* Empty space for logo - Mobile responsive */}
            <div className="flex items-center w-32 sm:w-40 md:w-48 lg:w-48">
              {/* This space maintains layout balance */}
            </div>

            {/* Desktop Nav - enhanced */}
            <nav className="hidden lg:flex items-center">
              <div className="flex items-center space-x-6 xl:space-x-8">
                {navItems.map(item => <Link key={item.path + item.label} to={item.path} className={`relative text-sm font-semibold transition-all duration-300 hover:text-violet-600 ${location.pathname === item.path ? "text-violet-600" : "text-gray-700 hover:text-violet-600"} after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-violet-600 after:left-0 after:-bottom-1 after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left ${location.pathname === item.path ? "after:scale-x-100" : ""}`}>
                    {item.label}
                  </Link>)}
              </div>
            </nav>

            {/* Right Side: Desktop - Unified Settings + Order Button */}
            <div className="hidden lg:flex items-center space-x-3 ml-auto">
              {/* Unified Settings Menu */}
              <UnifiedSettingsMenu />
              
              {/* Orange Shopping Cart Button */}
              <Link to="/order" className="relative group">
                <div className="flex items-center bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl rounded-full h-10 pl-3 pr-12 min-h-[40px] touch-manipulation">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-2">
                    <ShoppingCart className="w-4 h-4 text-orange-500" />
                  </div>
                  <span className="text-sm font-bold">
                    {getOrderText()}
                  </span>
                </div>
              </Link>
            </div>

            {/* Mobile Menu Toggle - Enhanced touch target */}
            <button className="lg:hidden ml-auto p-3 rounded-lg hover:bg-gray-100/80 transition-colors duration-200 min-h-[44px] min-w-[44px] touch-manipulation flex items-center justify-center" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <div className={`w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-0.5" : ""}`} />
                <div className={`w-5 h-0.5 my-0.5 transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
                <div className={`w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-0.5" : ""}`} />
              </div>
            </button>
          </div>

          {/* Enhanced Mobile Menu */}
          {isMenuOpen && <div className="lg:hidden py-4 sm:py-6 border-t border-gray-200/50 bg-white/98 backdrop-blur-md rounded-b-xl shadow-xl animate-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto">
              
              {/* Website Pages Section */}
              <div className="mb-6">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 mb-3">
                  Website Pages
                </div>
                <nav className="flex flex-col space-y-1">
                  {navItems.map(item => <Link key={item.path + item.label} to={item.path} className={`text-base font-medium transition-colors duration-200 hover:text-violet-600 px-4 py-3 rounded-lg hover:bg-violet-50 touch-manipulation min-h-[44px] flex items-center text-right ${location.pathname === item.path ? "text-violet-600 bg-violet-50" : "text-gray-700"}`} onClick={() => setIsMenuOpen(false)}>
                      {item.label}
                    </Link>)}
                </nav>
              </div>

              {/* User Account Section */}
              <div className="mb-6">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 mb-3">
                  Account
                </div>
                {user ? (
                  <div>
                    {/* User Info Header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-50 rounded-lg mx-4 mb-3 border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-800">{user.user_metadata?.full_name || 'User'}</div>
                          <div className="text-xs text-gray-500 truncate">{user.email}</div>
                        </div>
                        <button 
                          onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          {isUserDropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    
                    {/* User Dropdown Content */}
                    {isUserDropdownOpen && (
                      <div className="space-y-1 mb-3">
                        <Link 
                          to="/settings" 
                          className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg mx-4 transition-all duration-200 min-h-[44px] touch-manipulation"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User className="w-4 h-4 mr-3" />
                          <span className="font-medium">{t('accountSettings')}</span>
                        </Link>
                        <Link 
                          to="/history" 
                          className="flex items-center px-4 py-3 text-gray-700 hover:text-green-700 hover:bg-green-50 rounded-lg mx-4 transition-all duration-200 min-h-[44px] touch-manipulation"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <History className="w-4 h-4 mr-3" />
                          <span className="font-medium">{t('history')}</span>
                        </Link>
                        <button 
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg mx-4 transition-all duration-200 min-h-[44px] touch-manipulation"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          <span className="font-medium">{t('signOut')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link 
                    to="/auth" 
                    className="flex items-center px-4 py-3 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg mx-4 transition-all duration-200 min-h-[44px] touch-manipulation"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserCircle className="w-4 h-4 mr-3" />
                    <span className="font-medium">{t('signIn')}</span>
                  </Link>
                )}
              </div>

              {/* Currency Section */}
              <div className="mb-6">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 mb-3">
                  Currency
                </div>
                <div className="space-y-1">
                  <button 
                    onClick={() => setCurrency('EUR')} 
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg mx-4 transition-all duration-200 min-h-[44px] touch-manipulation ${currency === 'EUR' ? "bg-gradient-to-r from-orange-100 to-orange-100 text-orange-700 font-semibold" : "text-gray-700 hover:bg-orange-50"}`}
                  >
                    <div className="flex items-center space-x-3">
                      <CurrencyIcon currency="EUR" className="w-5 h-5" />
                      <span className="font-medium">EUR</span>
                    </div>
                    {currency === 'EUR' && <Check className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={() => setCurrency('RON')} 
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg mx-4 transition-all duration-200 min-h-[44px] touch-manipulation ${currency === 'RON' ? "bg-gradient-to-r from-orange-100 to-orange-100 text-orange-700 font-semibold" : "text-gray-700 hover:bg-orange-50"}`}
                  >
                    <div className="flex items-center space-x-3">
                      <CurrencyIcon currency="RON" className="w-5 h-5" />
                      <span className="font-medium">RON</span>
                    </div>
                    {currency === 'RON' && <Check className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Language Section */}
              <div className="mb-6">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 mb-3">
                  Language
                </div>
                <div className="space-y-1">
                  {languages.map(lang => (
                    <button 
                      key={lang}
                      onClick={() => setLanguage(lang)} 
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg mx-4 transition-all duration-200 min-h-[44px] touch-manipulation ${language === lang ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-semibold" : "text-gray-700 hover:bg-purple-50"}`}
                    >
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5" />
                        <span className="font-medium">{languageNames[lang]}</span>
                      </div>
                      {language === lang && <Check className="w-5 h-5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Button Section */}
              <div className="pt-4 border-t border-gray-200">
                <Link to="/order" className="block mx-4 mb-2" onClick={() => setIsMenuOpen(false)}>
                  <div className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl rounded-full h-12 min-h-[48px] touch-manipulation">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-3">
                      <ShoppingCart className="w-4 h-4 text-orange-500" />
                    </div>
                    <span className="text-base font-bold">
                      {getOrderText()}
                    </span>
                  </div>
                </Link>
              </div>
            </div>}
        </div>
      </header>
    </>;
};

export default Navigation;
