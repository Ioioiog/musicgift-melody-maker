import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage, languageNames, Language } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingCart, Check, Globe, LogOut, UserCircle, User, History, ChevronDown, ChevronUp, Settings } from "lucide-react";
import CurrencyIcon from "@/components/CurrencyIcon";
const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLanguageCurrencyDropdownOpen, setIsLanguageCurrencyDropdownOpen] = useState(false);
  const [isDesktopUserDropdownOpen, setIsDesktopUserDropdownOpen] = useState(false);
  const [isDesktopSettingsDropdownOpen, setIsDesktopSettingsDropdownOpen] = useState(false);
  const {
    language,
    setLanguage,
    t
  } = useLanguage();
  const {
    currency,
    setCurrency
  } = useCurrency();
  const {
    user,
    signOut
  } = useAuth();

  // Refs for click outside detection
  const mainMenuRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const languageCurrencyDropdownRef = useRef<HTMLDivElement>(null);
  const desktopUserDropdownRef = useRef<HTMLDivElement>(null);
  const desktopSettingsDropdownRef = useRef<HTMLDivElement>(null);
  const mainMenuButtonRef = useRef<HTMLButtonElement>(null);
  const userDropdownButtonRef = useRef<HTMLButtonElement>(null);
  const languageCurrencyButtonRef = useRef<HTMLButtonElement>(null);
  const desktopUserDropdownButtonRef = useRef<HTMLButtonElement>(null);
  const desktopSettingsDropdownButtonRef = useRef<HTMLButtonElement>(null);

  // Helper function to close all menus
  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
    setIsLanguageCurrencyDropdownOpen(false);
    setIsDesktopUserDropdownOpen(false);
    setIsDesktopSettingsDropdownOpen(false);
  };

  // Click outside detection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if any menu is open first
      if (!isMenuOpen && !isUserDropdownOpen && !isLanguageCurrencyDropdownOpen && !isDesktopUserDropdownOpen && !isDesktopSettingsDropdownOpen) {
        return;
      }

      // Check if click is inside any menu area or button
      const isInsideMainMenu = mainMenuRef.current && mainMenuRef.current.contains(target) || mainMenuButtonRef.current && mainMenuButtonRef.current.contains(target);
      const isInsideUserDropdown = userDropdownRef.current && userDropdownRef.current.contains(target) || userDropdownButtonRef.current && userDropdownButtonRef.current.contains(target);
      const isInsideLanguageCurrency = languageCurrencyDropdownRef.current && languageCurrencyDropdownRef.current.contains(target) || languageCurrencyButtonRef.current && languageCurrencyButtonRef.current.contains(target);
      const isInsideDesktopUserDropdown = desktopUserDropdownRef.current && desktopUserDropdownRef.current.contains(target) || desktopUserDropdownButtonRef.current && desktopUserDropdownButtonRef.current.contains(target);
      const isInsideDesktopSettingsDropdown = desktopSettingsDropdownRef.current && desktopSettingsDropdownRef.current.contains(target) || desktopSettingsDropdownButtonRef.current && desktopSettingsDropdownButtonRef.current.contains(target);

      // If click is outside all menu areas, close all menus
      if (!isInsideMainMenu && !isInsideUserDropdown && !isInsideLanguageCurrency && !isInsideDesktopUserDropdown && !isInsideDesktopSettingsDropdown) {
        closeAllMenus();
      }
    };
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeAllMenus();
      }
    };

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMenuOpen, isUserDropdownOpen, isLanguageCurrencyDropdownOpen, isDesktopUserDropdownOpen, isDesktopSettingsDropdownOpen]);
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
    closeAllMenus();
  };

  // Enhanced button handlers with mutual exclusivity
  const handleMainMenuToggle = () => {
    setIsUserDropdownOpen(false);
    setIsLanguageCurrencyDropdownOpen(false);
    setIsDesktopUserDropdownOpen(false);
    setIsDesktopSettingsDropdownOpen(false);
    setIsMenuOpen(!isMenuOpen);
  };
  const handleUserDropdownToggle = () => {
    setIsMenuOpen(false);
    setIsLanguageCurrencyDropdownOpen(false);
    setIsDesktopUserDropdownOpen(false);
    setIsDesktopSettingsDropdownOpen(false);
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };
  const handleLanguageCurrencyToggle = () => {
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
    setIsDesktopUserDropdownOpen(false);
    setIsDesktopSettingsDropdownOpen(false);
    setIsLanguageCurrencyDropdownOpen(!isLanguageCurrencyDropdownOpen);
  };
  const handleDesktopUserDropdownToggle = () => {
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
    setIsLanguageCurrencyDropdownOpen(false);
    setIsDesktopSettingsDropdownOpen(false);
    setIsDesktopUserDropdownOpen(!isDesktopUserDropdownOpen);
  };
  const handleDesktopSettingsDropdownToggle = () => {
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
    setIsLanguageCurrencyDropdownOpen(false);
    setIsDesktopUserDropdownOpen(false);
    setIsDesktopSettingsDropdownOpen(!isDesktopSettingsDropdownOpen);
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
      <div className="fixed top-2 left-1 sm:top-3 sm:left-5 md:top-4 md:left-6 z-50">
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

            {/* Right Side: Desktop - Settings + User Menu + Order Button */}
            <div className="hidden lg:flex items-center space-x-3 ml-auto">
              {/* Settings Dropdown */}
              <div className="relative">
                <button ref={desktopSettingsDropdownButtonRef} onClick={handleDesktopSettingsDropdownToggle} className="relative overflow-hidden group bg-white/80 backdrop-blur-sm border-2 border-gray-200/50 hover:border-gray-300 text-gray-700 hover:text-gray-800 transition-all duration-300 rounded-xl px-3 py-2 shadow-lg hover:shadow-xl hover:bg-white/90 flex items-center space-x-1 min-h-[40px] touch-manipulation">
                  <Settings className="w-4 h-4" />
                </button>

                {/* Settings Dropdown Menu */}
                {isDesktopSettingsDropdownOpen && <div ref={desktopSettingsDropdownRef} className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md border-2 border-gray-200 shadow-2xl z-50 rounded-xl p-2 animate-in slide-in-from-top-2 duration-200">
                    {/* Currency Section */}
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Currency
                    </div>
                    <button onClick={() => {
                  setCurrency('EUR');
                  closeAllMenus();
                }} className={`w-full hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-50 transition-all duration-300 rounded-lg mx-1 px-3 py-2 cursor-pointer transform hover:scale-105 min-h-[40px] touch-manipulation flex items-center justify-between ${currency === 'EUR' ? "bg-gradient-to-r from-orange-100 to-orange-100 text-orange-700 font-semibold shadow-sm" : "text-gray-700"}`}>
                      <div className="flex items-center space-x-2">
                        <CurrencyIcon currency="EUR" className="w-4 h-4" />
                        <span>EUR</span>
                      </div>
                      {currency === 'EUR' && <Check className="w-4 h-4" />}
                    </button>
                    <button onClick={() => {
                  setCurrency('RON');
                  closeAllMenus();
                }} className={`w-full hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-50 transition-all duration-300 rounded-lg mx-1 px-3 py-2 cursor-pointer transform hover:scale-105 min-h-[40px] touch-manipulation flex items-center justify-between ${currency === 'RON' ? "bg-gradient-to-r from-orange-100 to-orange-100 text-orange-700 font-semibold shadow-sm" : "text-gray-700"}`}>
                      <div className="flex items-center space-x-2">
                        <CurrencyIcon currency="RON" className="w-4 h-4" />
                        <span>RON</span>
                      </div>
                      {currency === 'RON' && <Check className="w-4 h-4" />}
                    </button>

                    <div className="bg-gray-200 my-2 h-px" />

                    {/* Language Section */}
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Language
                    </div>
                    {languages.map(lang => <button key={lang} onClick={() => {
                  setLanguage(lang);
                  closeAllMenus();
                }} className={`w-full hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 rounded-lg mx-1 px-3 py-2 cursor-pointer transform hover:scale-105 min-h-[40px] touch-manipulation flex items-center justify-between ${language === lang ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-semibold shadow-sm" : "text-gray-700"}`}>
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4" />
                          <span>{languageNames[lang]}</span>
                        </div>
                        {language === lang && <Check className="w-4 h-4" />}
                      </button>)}
                  </div>}
              </div>

              {/* User Menu */}
              <div className="relative">
                {user ? <button ref={desktopUserDropdownButtonRef} onClick={handleDesktopUserDropdownToggle} className="relative overflow-hidden group bg-white/80 backdrop-blur-sm border-2 border-rose-200/50 hover:border-rose-300 text-gray-700 hover:text-rose-700 transition-all duration-300 rounded-xl px-4 py-2.5 shadow-lg hover:shadow-xl hover:bg-white/90 flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="hidden md:inline text-sm font-medium">
                      {user.user_metadata?.full_name || user.email?.split('@')[0] || t('user')}
                    </span>
                  </button> : <Link to="/auth">
                    <button className="relative overflow-hidden group bg-white/80 backdrop-blur-sm border-2 border-emerald-200/50 hover:border-emerald-300 text-gray-700 hover:text-emerald-700 transition-all duration-300 rounded-xl px-4 py-2.5 shadow-lg hover:shadow-xl hover:bg-white/90 flex items-center space-x-2">
                      <UserCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">{t('signIn')}</span>
                    </button>
                  </Link>}

                {/* User Dropdown Menu */}
                {user && isDesktopUserDropdownOpen && <div ref={desktopUserDropdownRef} className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md shadow-2xl border-2 border-pink-200 rounded-xl p-2 animate-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 text-sm text-gray-600 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg mx-1 mb-2 border border-pink-100">
                      <div className="font-medium text-gray-800">{user.user_metadata?.full_name || 'User'}</div>
                      <div className="text-xs text-gray-500 truncate">{user.email}</div>
                    </div>
                    <div className="bg-pink-200 my-2 h-px" />
                    <Link to="/settings" className="flex items-center cursor-pointer hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 transition-all duration-300 rounded-lg mx-1 text-gray-700 hover:text-pink-700 px-3 py-2 transform hover:scale-105" onClick={closeAllMenus}>
                      <Settings className="w-4 h-4 mr-3" />
                      <span className="font-medium">{t('accountSettings')}</span>
                    </Link>
                    <div className="bg-pink-200 my-2 h-px" />
                    <button onClick={handleSignOut} className="w-full text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 transition-all duration-300 rounded-lg mx-1 px-3 py-2 cursor-pointer font-medium transform hover:scale-105 flex items-center">
                      <LogOut className="w-4 h-4 mr-3" />
                      {t('signOut')}
                    </button>
                  </div>}
              </div>
              
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

            {/* Mobile Right Section: Language/Currency + User Account + Menu + Order Button */}
            <div className="lg:hidden flex items-center space-x-2 ml-auto">
              {/* Mobile Language/Currency Button */}
              <div className="relative">
                <button ref={languageCurrencyButtonRef} onClick={handleLanguageCurrencyToggle} className="p-2 rounded-lg hover:bg-gray-100/80 transition-colors duration-200 min-h-[44px] min-w-[44px] touch-manipulation flex items-center justify-center">
                  <Settings className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Mobile User Account Button */}
              <div className="relative">
                {user ? <button ref={userDropdownButtonRef} onClick={handleUserDropdownToggle} className="p-2 rounded-lg hover:bg-gray-100/80 transition-colors duration-200 min-h-[44px] min-w-[44px] touch-manipulation flex items-center justify-center relative">
                    <User className="w-5 h-5 text-gray-700" />
                    {/* Online indicator */}
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </button> : <Link to="/auth" className="p-2 rounded-lg hover:bg-gray-100/80 transition-colors duration-200 min-h-[44px] min-w-[44px] touch-manipulation flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-gray-700" />
                  </Link>}
              </div>

              {/* Mobile Menu Toggle */}
              <button ref={mainMenuButtonRef} className="p-3 rounded-lg hover:bg-gray-100/80 transition-colors duration-200 min-h-[44px] min-w-[44px] touch-manipulation flex items-center justify-center" onClick={handleMainMenuToggle}>
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <div className={`w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-0.5" : ""}`} />
                  <div className={`w-5 h-0.5 my-0.5 transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
                  <div className={`w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-0.5" : ""}`} />
                </div>
              </button>

              {/* Mobile Order Button - Icon Only - After Menu */}
              <Link to="/order" className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-md transition duration-300 min-h-[44px] min-w-[44px] touch-manipulation flex items-center justify-center">
                <ShoppingCart className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Enhanced Mobile Menu - Compact styling */}
          {isMenuOpen && <div ref={mainMenuRef} className="lg:hidden mt-2 rounded-lg shadow-xl animate-in slide-in-from-top-2 duration-300 backdrop-blur-xl border border-white/20 overflow-hidden bg-zinc-100">
              {/* Website Pages Section */}
              <div className="p-3 ml-36 sm:ml-44 md:ml-52">
                <div className="text-center mb-3">
                  <h3 className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-1">Website Pages</h3>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-violet-400 to-purple-400 mx-auto rounded-full"></div>
                </div>
                
                <nav className="space-y-0.5">
                  {navItems.map(item => <Link key={item.path + item.label} to={item.path} className={`group flex items-center justify-center text-center py-2.5 px-4 rounded-lg transition-all duration-300 hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-md transform hover:scale-[1.02] ${location.pathname === item.path ? "bg-white/20 backdrop-blur-sm text-violet-700 shadow-lg font-semibold" : "text-gray-700 hover:text-violet-700"}`} onClick={closeAllMenus}>
                      <span className="font-medium text-sm">{item.label}</span>
                      {location.pathname === item.path && <div className="ml-2 w-1.5 h-1.5 bg-violet-600 rounded-full animate-pulse"></div>}
                    </Link>)}
                </nav>
              </div>
            </div>}

          {/* Language/Currency Dropdown for Mobile - Compact styling */}
          {isLanguageCurrencyDropdownOpen && <div ref={languageCurrencyDropdownRef} className="lg:hidden mt-2 rounded-lg shadow-xl animate-in slide-in-from-top-2 duration-300 backdrop-blur-xl border border-white/20 overflow-hidden bg-zinc-50 py-0">
              {/* Currency Section */}
              <div className="p-3 ml-36 sm:ml-44 md:ml-52 py-[10px]">
                <div className="text-center mb-3">
                  <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Currency</h3>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto rounded-full"></div>
                </div>
                
                <div className="space-y-0.5">
                  <button onClick={() => {
                setCurrency('EUR');
                closeAllMenus();
              }} className={`group w-full flex items-center justify-between py-2.5 px-4 rounded-lg transition-all duration-300 hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-md transform hover:scale-[1.02] ${currency === 'EUR' ? "bg-white/20 backdrop-blur-sm text-emerald-700 shadow-lg font-semibold" : "text-gray-700 hover:text-emerald-700"}`}>
                    <div className="flex items-center space-x-2">
                      <CurrencyIcon currency="EUR" className="w-4 h-4" />
                      <span className="font-medium text-sm">EUR</span>
                    </div>
                    {currency === 'EUR' && <Check className="w-4 h-4 animate-pulse" />}
                  </button>
                  
                  <button onClick={() => {
                setCurrency('RON');
                closeAllMenus();
              }} className={`group w-full flex items-center justify-between py-2.5 px-4 rounded-lg transition-all duration-300 hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-md transform hover:scale-[1.02] ${currency === 'RON' ? "bg-white/20 backdrop-blur-sm text-emerald-700 shadow-lg font-semibold" : "text-gray-700 hover:text-emerald-700"}`}>
                    <div className="flex items-center space-x-2">
                      <CurrencyIcon currency="RON" className="w-4 h-4" />
                      <span className="font-medium text-sm">RON</span>
                    </div>
                    {currency === 'RON' && <Check className="w-4 h-4 animate-pulse" />}
                  </button>
                </div>
              </div>

              {/* Language Section */}
              <div className="px-3 pb-3 border-t border-white/20 ml-36 sm:ml-44 md:ml-52">
                <div className="pt-3">
                  <div className="text-center mb-3">
                    <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Language</h3>
                    <div className="w-8 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto rounded-full"></div>
                  </div>
                  
                  <div className="space-y-0.5">
                    {languages.map(lang => <button key={lang} onClick={() => {
                  setLanguage(lang);
                  closeAllMenus();
                }} className={`group w-full flex items-center justify-between py-2.5 px-4 rounded-lg transition-all duration-300 hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-md transform hover:scale-[1.02] ${language === lang ? "bg-white/20 backdrop-blur-sm text-emerald-700 shadow-lg font-semibold" : "text-gray-700 hover:text-emerald-700"}`}>
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4" />
                          <span className="font-medium text-sm">{languageNames[lang]}</span>
                        </div>
                        {language === lang && <Check className="w-4 h-4 animate-pulse" />}
                      </button>)}
                  </div>
                </div>
              </div>
            </div>}

          {/* User Dropdown for Mobile - Compact styling */}
          {user && isUserDropdownOpen && <div ref={userDropdownRef} className="lg:hidden mt-2 rounded-lg shadow-xl animate-in slide-in-from-top-2 duration-300 backdrop-blur-xl border border-white/20 overflow-hidden bg-zinc-100 px-0 my-0 py-[41px]">
              {/* User Info Header */}
              <div className="p-3 ml-36 sm:ml-44 md:ml-52 px-0 mx-[39px]">
                <div className="text-center mb-3">
                  <h3 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">User Account</h3>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-rose-400 to-pink-400 mx-auto rounded-full"></div>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-3 text-center border border-white/20">
                  <div className="flex items-center justify-center mb-1">
                    <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-gray-800 mb-0.5">
                    {user.user_metadata?.full_name || 'User'}
                  </div>
                  <div className="text-xs text-gray-600 truncate">
                    {user.email}
                  </div>
                </div>
              </div>
              
              {/* User Actions */}
              <div className="px-3 pb-3 border-t border-white/20 ml-36 sm:ml-44 md:ml-52">
                <div className="pt-2 space-y-0.5">
                  <Link to="/settings" className="group w-full flex items-center py-2.5 px-4 rounded-lg transition-all duration-300 hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-md transform hover:scale-[1.02] text-gray-700 hover:text-rose-700" onClick={closeAllMenus}>
                    <User className="w-4 h-4 mr-2" />
                    <span className="font-medium text-sm">{t('accountSettings')}</span>
                  </Link>
                  
                  <Link to="/history" className="group w-full flex items-center py-2.5 px-4 rounded-lg transition-all duration-300 hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-md transform hover:scale-[1.02] text-gray-700 hover:text-rose-700" onClick={closeAllMenus}>
                    <History className="w-4 h-4 mr-2" />
                    <span className="font-medium text-sm">{t('history')}</span>
                  </Link>
                  
                  <button onClick={handleSignOut} className="group w-full flex items-center py-2.5 px-4 rounded-lg transition-all duration-300 hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-md transform hover:scale-[1.02] text-red-600 hover:text-red-700">
                    <LogOut className="w-4 h-4 mr-2" />
                    <span className="font-medium text-sm">{t('signOut')}</span>
                  </button>
                </div>
              </div>
            </div>}
        </div>
      </header>
    </>;
};
export default Navigation;