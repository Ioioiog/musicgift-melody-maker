
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage, languageNames, Language } from "@/contexts/LanguageContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe, ChevronDown } from "lucide-react";
import UserMenu from "@/components/UserMenu";

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    language,
    setLanguage,
    t
  } = useLanguage();
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
    }} className="fixed top-0 left-0 w-full h-10 z-1"></div>

      {/* Floating Logo - positioned on the left side */}
      <div className="fixed top-4 left-4 z-50">
        <Link to="/" className="block group">
          <img alt="MusicGift Logo" className="w-60 h-auto transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg" src="/lovable-uploads/407b475e-cd49-4ba1-918b-57bd3fc6c955.png" />
        </Link>
      </div>

      {/* Navigation Bar */}
      <header className="fixed top-4 w-full z-40 border-b border-white/10 bg-white/95 backdrop-blur-md shadow-lg py-[15px] my-[14px]">        
        <div className="container mx-auto sm:px-6 md:px-8 my-0 relative z-10 px-[18px] py-[3px]">
          <div className="flex items-center justify-between h-10 py-0 px-0 mx-0 my-0">
            
            {/* Empty space where logo was - now used for spacing */}
            <div className="flex items-center lg:w-48">
              {/* This space maintains layout balance */}
            </div>

            {/* Desktop Nav - enhanced */}
            <nav className="hidden lg:flex items-center">
              <div className="flex items-center space-x-8 xl:space-x-10">
                {navItems.map(item => <Link key={item.path + item.label} to={item.path} className={`relative text-sm font-semibold transition-all duration-300 hover:text-violet-600 ${location.pathname === item.path ? "text-violet-600" : "text-gray-700 hover:text-violet-600"} after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-violet-600 after:left-0 after:-bottom-1 after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left ${location.pathname === item.path ? "after:scale-x-100" : ""}`}>
                    {item.label}
                  </Link>)}
              </div>
            </nav>

            {/* Right Side: Redesigned buttons with modern styling */}
            <div className="hidden lg:flex items-center space-x-3 xl:space-x-4 ml-auto">
              {/* Language Selector - Glass morphism design */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="relative overflow-hidden group bg-white/80 backdrop-blur-sm border-2 border-purple-200/50 hover:border-purple-300 text-gray-700 hover:text-purple-700 transition-all duration-300 rounded-xl px-4 py-2.5 shadow-lg hover:shadow-xl hover:bg-white/90 flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">{languageNames[language]}</span>
                    <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-md border-2 border-purple-200 shadow-2xl z-50 rounded-xl p-2 animate-in slide-in-from-top-2 duration-200">
                  {languages.map(lang => <DropdownMenuItem key={lang} onClick={() => setLanguage(lang)} className={`hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 rounded-lg mx-1 px-3 py-2 cursor-pointer transform hover:scale-105 ${language === lang ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-semibold shadow-sm" : "text-gray-700"}`}>
                      {languageNames[lang]}
                    </DropdownMenuItem>)}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* User Menu - Now styled with glass morphism */}
              <UserMenu />
              
              {/* Order Now Button - Premium gradient with animation */}
              <Link to="/order" className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <button className="relative px-6 xl:px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-full transition-all duration-300 text-sm shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 flex items-center space-x-2">
                  <span>{t("orderNow") || "Order Now"}</span>
                  <span className="text-lg">🎵</span>
                </button>
              </Link>
            </div>

            {/* Mobile Menu Toggle - enhanced */}
            <button className="lg:hidden ml-auto p-3 rounded-lg hover:bg-gray-100/80 transition-colors duration-200" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <div className={`w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-0.5" : ""}`} />
                <div className={`w-5 h-0.5 bg-gray-700 my-0.5 transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
                <div className={`w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-0.5" : ""}`} />
              </div>
            </button>
          </div>

          {/* Mobile Menu - enhanced */}
          {isMenuOpen && <div className="lg:hidden py-6 border-t border-gray-200/50 bg-white/98 backdrop-blur-md rounded-b-xl shadow-xl">
              <nav className="flex flex-col space-y-4">
                {navItems.map(item => <Link key={item.path + item.label} to={item.path} className={`text-base font-medium transition-colors duration-200 hover:text-violet-600 px-4 py-2 rounded-lg hover:bg-violet-50 ${location.pathname === item.path ? "text-violet-600 bg-violet-50" : "text-gray-700"}`} onClick={() => setIsMenuOpen(false)}>
                    {item.label}
                  </Link>)}
                <div className="flex flex-col sm:flex-row items-start sm:items-center pt-4 space-y-3 sm:space-y-0 sm:space-x-3 px-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="relative overflow-hidden group text-sm font-semibold w-full sm:w-auto bg-white/80 backdrop-blur-sm border-2 border-purple-200/50 hover:border-purple-300 text-gray-700 hover:text-purple-700 rounded-xl flex items-center justify-center space-x-2 py-2.5 transform hover:scale-105">
                        <Globe className="w-4 h-4" />
                        <span>{languageNames[language]}</span>
                        <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border-2 border-purple-200 shadow-2xl z-50 rounded-xl p-2">
                      {languages.map(lang => <DropdownMenuItem key={lang} onClick={() => setLanguage(lang)} className={`hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 rounded-lg px-3 py-2 cursor-pointer ${language === lang ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-semibold" : "text-gray-700"}`}>
                          {languageNames[lang]}
                        </DropdownMenuItem>)}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <UserMenu />
                  
                  <Link to="/order" className="relative group w-full sm:w-auto" onClick={() => setIsMenuOpen(false)}>
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <button className="relative w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-full transition-all duration-300 text-sm shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2">
                      <span>{t("orderNow") || "Order Now"}</span>
                      <span className="text-lg">🎵</span>
                    </button>
                  </Link>
                </div>
              </nav>
            </div>}
        </div>
      </header>
    </>;
};

export default Navigation;
