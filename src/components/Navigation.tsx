
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
    }} className="fixed top-0 left-0 w-full h-8 sm:h-10 z-1"></div>

      {/* Floating Logo - Mobile responsive positioning and sizing */}
      <div className="fixed top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 z-50">
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

            {/* Right Side: Mobile responsive buttons */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-3 ml-auto">
              {/* Language Selector - Mobile friendly sizing */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="relative overflow-hidden group bg-white/80 backdrop-blur-sm border-2 border-purple-200/50 hover:border-purple-300 text-gray-700 hover:text-purple-700 transition-all duration-300 rounded-xl px-3 py-2 shadow-lg hover:shadow-xl hover:bg-white/90 flex items-center space-x-2 min-h-[44px] touch-manipulation">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">{languageNames[language]}</span>
                    <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-md border-2 border-purple-200 shadow-2xl z-50 rounded-xl p-2 animate-in slide-in-from-top-2 duration-200">
                  {languages.map(lang => <DropdownMenuItem key={lang} onClick={() => setLanguage(lang)} className={`hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 rounded-lg mx-1 px-3 py-2 cursor-pointer transform hover:scale-105 min-h-[44px] touch-manipulation ${language === lang ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-semibold shadow-sm" : "text-gray-700"}`}>
                      {languageNames[lang]}
                    </DropdownMenuItem>)}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* User Menu */}
              <UserMenu />
              
              {/* Vinyl Record Order Button - Simplified */}
              <Link to="/order" className="relative group">
                <div className="relative w-20 h-20 xl:w-24 xl:h-24 transition-all duration-500 transform hover:scale-110 hover:rotate-12">
                  {/* Vinyl Record Image */}
                  <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl transition-all duration-300">
                    <img 
                      src="/lovable-uploads/ff8d0c13-4ac3-4079-aa17-03f0128b70ff.png" 
                      alt="Vinyl Record" 
                      className="w-full h-full object-cover rounded-full"
                    />
                    
                    {/* Text overlay - Mobile responsive */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="relative z-10 font-bold leading-tight drop-shadow-lg text-lg xl:text-xl text-white text-center px-2 bg-black/30 rounded-full py-2">
                        {t("orderNow") || "Order Now"}
                      </span>
                    </div>
                  </div>
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

          {/* Mobile Menu - Enhanced mobile layout with right-aligned text */}
          {isMenuOpen && <div className="lg:hidden py-4 sm:py-6 border-t border-gray-200/50 bg-white/98 backdrop-blur-md rounded-b-xl shadow-xl animate-in slide-in-from-top-2 duration-200">
              <nav className="flex flex-col space-y-2">
                {navItems.map(item => <Link key={item.path + item.label} to={item.path} className={`text-base font-medium transition-colors duration-200 hover:text-violet-600 px-4 py-3 rounded-lg hover:bg-violet-50 touch-manipulation min-h-[44px] flex items-center justify-end text-right ${location.pathname === item.path ? "text-violet-600 bg-violet-50" : "text-gray-700"}`} onClick={() => setIsMenuOpen(false)}>
                    {item.label}
                  </Link>)}
                <div className="flex flex-col space-y-3 pt-4 px-4 items-end">
                  {/* Mobile Language Selector - Right aligned */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="relative overflow-hidden group text-sm font-semibold bg-white/80 backdrop-blur-sm border-2 border-purple-200/50 hover:border-purple-300 text-gray-700 hover:text-purple-700 rounded-xl flex items-center justify-center space-x-2 py-3 transform hover:scale-105 min-h-[44px] touch-manipulation ml-auto">
                        <Globe className="w-4 h-4" />
                        <span>{languageNames[language]}</span>
                        <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border-2 border-purple-200 shadow-2xl z-50 rounded-xl p-2">
                      {languages.map(lang => <DropdownMenuItem key={lang} onClick={() => setLanguage(lang)} className={`hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 rounded-lg px-3 py-3 cursor-pointer min-h-[44px] touch-manipulation text-right justify-end ${language === lang ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-semibold" : "text-gray-700"}`}>
                          {languageNames[lang]}
                        </DropdownMenuItem>)}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <div className="ml-auto">
                    <UserMenu />
                  </div>
                  
                  {/* Mobile Vinyl Record Button - Simplified */}
                  <Link to="/order" className="relative group ml-auto" onClick={() => setIsMenuOpen(false)}>
                    <div className="relative w-16 h-16 transition-all duration-500 transform hover:scale-110 hover:rotate-12">
                      {/* Mobile Vinyl Record Image */}
                      <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl transition-all duration-300">
                        <img 
                          src="/lovable-uploads/ff8d0c13-4ac3-4079-aa17-03f0128b70ff.png" 
                          alt="Vinyl Record" 
                          className="w-full h-full object-cover rounded-full"
                        />
                        
                        {/* Text overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="relative z-10 text-white font-bold text-xs text-center leading-tight drop-shadow-lg bg-black/40 rounded-full px-2 py-1">
                            {t("orderNow") || "Order"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </nav>
            </div>}
        </div>
      </header>
    </>;
};

export default Navigation;
