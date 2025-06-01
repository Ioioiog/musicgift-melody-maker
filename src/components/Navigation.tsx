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
    }} className="fixed top-0 left-0 w-full h-24 z-1"></div>

      {/* Navigation Bar */}
      <header className="fixed top-2 sm:top-4 w-full z-50 border-b border-white/10 bg-white/95 backdrop-blur-md shadow-lg">        
        <div className="container mx-auto sm:px-6 md:px-8 my-0 relative z-10 py-0 px-[19px]">
          <div className="flex items-center justify-between h-20 py-[12px]">
            
            {/* Logo - enhanced */}
            <div className="flex items-center">
              <Link to="/" className="block group">
                <img alt="MusicGift Logo" src="/lovable-uploads/fc25a6ff-2842-4b54-a3a9-a38754893226.png" className="h-14 w-auto sm:h-16 md:h-18 lg:h-20 transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:drop-shadow-lg" />
              </Link>
            </div>

            {/* Desktop Nav - enhanced */}
            <nav className="hidden lg:flex items-center ml-12">
              <div className="flex items-center space-x-8 xl:space-x-10">
                {navItems.map(item => <Link key={item.path + item.label} to={item.path} className={`relative text-sm font-semibold transition-all duration-300 hover:text-violet-600 ${location.pathname === item.path ? "text-violet-600" : "text-gray-700 hover:text-violet-600"} after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-violet-600 after:left-0 after:-bottom-1 after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left ${location.pathname === item.path ? "after:scale-x-100" : ""}`}>
                    {item.label}
                  </Link>)}
              </div>
            </nav>

            {/* Right Side: Enhanced buttons */}
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-5 ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="text-sm font-medium bg-white/80 hover:bg-white border-gray-200 hover:border-violet-300 text-gray-700 hover:text-violet-600 transition-all duration-300 backdrop-blur-sm shadow-sm hover:shadow-md">
                    {languageNames[language]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl z-50 rounded-lg">
                  {languages.map(lang => <DropdownMenuItem key={lang} onClick={() => setLanguage(lang)} className={`hover:bg-violet-50 transition-colors duration-200 ${language === lang ? "bg-violet-50 text-violet-600" : ""}`}>
                      {languageNames[lang]}
                    </DropdownMenuItem>)}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <UserMenu />
              
              <Link to="/order" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white border-0 px-6 xl:px-8 py-2.5 rounded-full font-semibold transition-all duration-300 text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105">
                {t("orderNow") || "Order Now"}
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
                      <Button variant="outline" size="sm" className="text-sm font-medium w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-violet-300 hover:text-violet-600 transition-all duration-300">
                        {languageNames[language]}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white border shadow-lg z-50">
                      {languages.map(lang => <DropdownMenuItem key={lang} onClick={() => setLanguage(lang)} className={`hover:bg-violet-50 transition-colors duration-200 ${language === lang ? "bg-violet-50 text-violet-600" : ""}`}>
                          {languageNames[lang]}
                        </DropdownMenuItem>)}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <UserMenu />
                  
                  <Link to="/order" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 w-full sm:w-auto text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" onClick={() => setIsMenuOpen(false)}>
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
