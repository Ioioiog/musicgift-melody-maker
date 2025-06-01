import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage, languageNames, Language } from "@/contexts/LanguageContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
    }} className="fixed top-0 left-0 w-full h-20 z-1"></div>

      {/* Floating Logo - responsive positioning */}
      <div className="fixed -top-4 left-2 sm:left-4 md:left-6 lg:left-10 z-[100]">
        <Link to="/" className="block">
          <img alt="MusicGift Logo" src="/lovable-uploads/fc25a6ff-2842-4b54-a3a9-a38754893226.png" className="h-40 w-30 sm:h-48 sm:w-28 md:h-56 md:w-36 lg:h-60 lg:w-40 transition-transform duration-100 ease-in-out hover:scale-105" />
        </Link>
      </div>

      {/* Navigation Bar */}
      <header className="fixed top-2 sm:top-4 w-full z-50 border-b border-gray-200 bg-white">        
        <div className="container mx-auto sm:px-0 md:px-0 my-0 relative z-10 px-[26px] py-0">
          <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 py-[30px]">
            
            {/* Desktop Nav - positioned after logo */}
            <nav className="hidden lg:flex items-center ml-32 sm:ml-36 md:ml-48 lg:ml-56 xl:ml-60">
              <div className="flex items-center space-x-6 xl:space-x-8">
                {navItems.map(item => <Link key={item.path + item.label} to={item.path} className={`text-sm font-medium transition-colors hover:text-violet-600 ${location.pathname === item.path ? "text-violet-600" : "text-gray-700"}`}>
                    {item.label}
                  </Link>)}
              </div>
            </nav>

            {/* Right Side: Language + User Menu + Order - responsive */}
            <div className="hidden lg:flex items-center space-x-3 xl:space-x-4 ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="text-sm font-medium bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400">
                    {languageNames[language]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border shadow-lg z-50">
                  {languages.map(lang => <DropdownMenuItem key={lang} onClick={() => setLanguage(lang)} className={`hover:bg-gray-100 ${language === lang ? "bg-violet-50" : ""}`}>
                      {languageNames[lang]}
                    </DropdownMenuItem>)}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <UserMenu />
              
              <Link to="/order" className="bg-violet-600 hover:bg-violet-700 text-white border border-violet-600 hover:border-violet-700 px-4 xl:px-6 py-2 rounded-lg font-medium transition-colors text-sm">
                {t("orderNow") || "Order Now"}
              </Link>
            </div>

            {/* Mobile Menu Toggle - adjusted for smaller screens */}
            <button className="lg:hidden ml-auto p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <div className={`w-5 h-0.5 bg-gray-700 transition-all ${isMenuOpen ? "rotate-45 translate-y-0.5" : ""}`} />
                <div className={`w-5 h-0.5 bg-gray-700 my-0.5 transition-all ${isMenuOpen ? "opacity-0" : ""}`} />
                <div className={`w-5 h-0.5 bg-gray-700 transition-all ${isMenuOpen ? "-rotate-45 -translate-y-0.5" : ""}`} />
              </div>
            </button>
          </div>

          {/* Mobile Menu - improved mobile layout */}
          {isMenuOpen && <div className="lg:hidden py-4 border-t bg-white/95 backdrop-blur-md">
              <nav className="flex flex-col space-y-3">
                {navItems.map(item => <Link key={item.path + item.label} to={item.path} className={`text-base font-medium transition-colors hover:text-violet-600 px-2 py-1 ${location.pathname === item.path ? "text-violet-600" : "text-gray-700"}`} onClick={() => setIsMenuOpen(false)}>
                    {item.label}
                  </Link>)}
                <div className="flex flex-col sm:flex-row items-start sm:items-center pt-3 space-y-3 sm:space-y-0 sm:space-x-3 px-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="text-sm font-medium w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400">
                        {languageNames[language]}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border shadow-lg z-50">
                      {languages.map(lang => <DropdownMenuItem key={lang} onClick={() => setLanguage(lang)} className={`hover:bg-gray-100 ${language === lang ? "bg-violet-50" : ""}`}>
                          {languageNames[lang]}
                        </DropdownMenuItem>)}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <UserMenu />
                  
                  <Link to="/order" className="bg-violet-600 hover:bg-violet-700 text-white border border-violet-600 hover:border-violet-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto text-center" onClick={() => setIsMenuOpen(false)}>
                    {t("orderNow") || "Order Now"}
                  </Link>
                </div>
              </nav>
            </div>}
        </div>
      </header>
    </>;
};
export default Navigation;