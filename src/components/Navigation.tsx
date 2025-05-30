
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage, languageNames, Language } from "@/contexts/LanguageContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
    label: t("home")
  }, {
    path: "/about",
    label: t("about")
  }, {
    path: "/packages",
    label: t("packages")
  }, {
    path: "/how-it-works",
    label: t("howItWorks")
  }, {
    path: "/testimonials",
    label: t("testimonials")
  }, {
    path: "/contact",
    label: t("contact")
  }];

  const languages: Language[] = ["en", "ro", "fr", "pl", "de"];

  return (
    <>
      {/* Floating Logo - positioned absolutely and centered */}
      <div className="fixed top-3 left-2/3 transform -translate-x-1/2 z-[100]">
        <Link to="/" className="block">
          <img 
            src="/lovable-uploads/9d0d10ef-2340-4632-8df0-f5058547a0c9.png" 
            alt="MusicGift Logo" 
            className="h-24 w-auto transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </Link>
      </div>

      {/* Navigation Bar */}
      <header className="fixed top-0 w-full bg-white z-50 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            
            {/* Desktop Nav - centered */}
            <nav className="hidden lg:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-8">
                {navItems.map(item => 
                  <Link 
                    key={item.path + item.label} 
                    to={item.path} 
                    className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                      location.pathname === item.path ? "text-purple-600" : "text-gray-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            </nav>

            {/* Right Side: Language + Order */}
            <div className="hidden lg:flex items-center space-x-4 ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="text-sm font-medium">
                    {languageNames[currentLanguage]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {languages.map(lang => 
                    <DropdownMenuItem 
                      key={lang} 
                      onClick={() => setCurrentLanguage(lang)} 
                      className={currentLanguage === lang ? "bg-purple-50" : ""}
                    >
                      {languageNames[lang]}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <Link to="/packages" className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                {t("orderNow")}
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="lg:hidden ml-auto" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <div className={`w-4 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? "rotate-45 translate-y-0.5" : ""}`} />
                <div className={`w-4 h-0.5 bg-gray-600 my-0.5 transition-all ${isMenuOpen ? "opacity-0" : ""}`} />
                <div className={`w-4 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? "-rotate-45 -translate-y-0.5" : ""}`} />
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t">
              <nav className="flex flex-col space-y-4">
                {navItems.map(item => 
                  <Link 
                    key={item.path + item.label} 
                    to={item.path} 
                    className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                      location.pathname === item.path ? "text-purple-600" : "text-gray-600"
                    }`} 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
                <div className="flex items-center pt-4 space-x-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="text-sm font-medium">
                        {languageNames[currentLanguage]}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {languages.map(lang => 
                        <DropdownMenuItem 
                          key={lang} 
                          onClick={() => setCurrentLanguage(lang)} 
                          className={currentLanguage === lang ? "bg-purple-50" : ""}
                        >
                          {languageNames[lang]}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Link 
                    to="/packages" 
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("orderNow")}
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
