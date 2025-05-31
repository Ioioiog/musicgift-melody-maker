
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
    currentLanguage,
    setCurrentLanguage,
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

  return (
    <>
      {/* Navigation Bar with integrated logo */}
      <header className="fixed top-2 sm:top-4 w-full bg-white z-50 border-b border-gray-100">
        <div className="container mx-auto px-2 sm:px-4 md:px-6">
          <div className="flex items-center justify-between h-20 sm:h-24 md:h-28">
            
            {/* Logo - now part of the navigation flow */}
            <div className="flex-shrink-0 -mt-4 sm:-mt-6 md:-mt-8">
              <Link to="/" className="block">
                <img 
                  src="/lovable-uploads/9d0d10ef-2340-4632-8df0-f5058547a0c9.png" 
                  alt="MusicGift Logo" 
                  className="h-28 w-16 sm:h-32 sm:w-20 md:h-36 md:w-24 lg:h-40 lg:w-28 transition-transform duration-100 ease-in-out hover:scale-105" 
                />
              </Link>
            </div>

            {/* Desktop Nav - centered with proper logo spacing */}
            <nav className="hidden lg:flex items-center justify-center flex-1 mx-8">
              <div className="flex items-center space-x-6 xl:space-x-8">
                {navItems.map(item => (
                  <Link 
                    key={item.path + item.label} 
                    to={item.path} 
                    className={`text-sm font-medium transition-colors hover:text-violet-600 ${
                      location.pathname === item.path ? "text-violet-600" : "text-gray-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Right Side: Language + User Menu + Order */}
            <div className="hidden lg:flex items-center space-x-3 xl:space-x-4 flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="text-sm font-medium bg-white hover:bg-gray-50">
                    {languageNames[currentLanguage]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border shadow-lg z-50">
                  {languages.map(lang => (
                    <DropdownMenuItem 
                      key={lang} 
                      onClick={() => setCurrentLanguage(lang)} 
                      className={`hover:bg-gray-100 ${currentLanguage === lang ? "bg-violet-50" : ""}`}
                    >
                      {languageNames[lang]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <UserMenu />
              
              <Link 
                to="/order" 
                className="bg-violet-600 text-white px-4 xl:px-6 py-2 rounded-lg font-medium hover:bg-violet-700 transition-colors text-sm"
              >
                {t("orderNow") || "Order Now"}
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden flex-shrink-0 p-2" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <div className={`w-5 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? "rotate-45 translate-y-0.5" : ""}`} />
                <div className={`w-5 h-0.5 bg-gray-600 my-0.5 transition-all ${isMenuOpen ? "opacity-0" : ""}`} />
                <div className={`w-5 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? "-rotate-45 -translate-y-0.5" : ""}`} />
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t bg-white">
              <nav className="flex flex-col space-y-3">
                {navItems.map(item => (
                  <Link 
                    key={item.path + item.label} 
                    to={item.path} 
                    className={`text-base font-medium transition-colors hover:text-violet-600 px-2 py-1 ${
                      location.pathname === item.path ? "text-violet-600" : "text-gray-600"
                    }`} 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex flex-col sm:flex-row items-start sm:items-center pt-3 space-y-3 sm:space-y-0 sm:space-x-3 px-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="text-sm font-medium w-full sm:w-auto bg-white hover:bg-gray-50">
                        {languageNames[currentLanguage]}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border shadow-lg z-50">
                      {languages.map(lang => (
                        <DropdownMenuItem 
                          key={lang} 
                          onClick={() => setCurrentLanguage(lang)} 
                          className={`hover:bg-gray-100 ${currentLanguage === lang ? "bg-violet-50" : ""}`}
                        >
                          {languageNames[lang]}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <UserMenu />
                  
                  <Link 
                    to="/order" 
                    className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors w-full sm:w-auto text-center" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("orderNow") || "Order Now"}
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Navigation;
