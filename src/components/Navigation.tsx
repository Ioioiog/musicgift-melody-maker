
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About Us" },
    { path: "/packages", label: "Packages" },
    { path: "/how-it-works", label: "How It Works" },
    { path: "/testimonials", label: "Testimonials" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 w-full bg-white z-50 border-b border-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo positioned on the left */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/9d0d10ef-2340-4632-8df0-f5058547a0c9.png" 
              alt="MusicGift" 
              className="h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation - centered */}
          <nav className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-12">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-base font-medium transition-colors hover:text-purple-600 ${
                    location.pathname === item.path
                      ? "text-purple-600"
                      : "text-gray-700"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/packages"
                className="text-base font-medium transition-colors hover:text-purple-600 text-gray-700"
              >
                Order
              </Link>
            </div>
          </nav>

          {/* Language selector on the right */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <Button variant="ghost" size="sm" className="text-sm font-medium px-3 py-1 h-8 rounded-none bg-gray-100 hover:bg-gray-200">
                EN
              </Button>
              <Button variant="ghost" size="sm" className="text-sm font-medium px-3 py-1 h-8 rounded-none hover:bg-gray-100">
                RO
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <div className={`w-4 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? 'rotate-45 translate-y-0.5' : ''}`} />
              <div className={`w-4 h-0.5 bg-gray-600 my-0.5 transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
              <div className={`w-4 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-0.5' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                    location.pathname === item.path
                      ? "text-purple-600"
                      : "text-gray-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/packages"
                className="text-sm font-medium transition-colors hover:text-purple-600 text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Order
              </Link>
              <div className="flex items-center pt-4">
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <Button variant="ghost" size="sm" className="text-sm font-medium px-3 py-1 h-8 rounded-none bg-gray-100">
                    EN
                  </Button>
                  <Button variant="ghost" size="sm" className="text-sm font-medium px-3 py-1 h-8 rounded-none">
                    RO
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;
