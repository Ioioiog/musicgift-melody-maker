
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Music } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6 md:col-span-1">
            <Link to="/" className="flex items-center space-x-3 group">
              <img src="/lovable-uploads/61b6a361-9741-4d73-8075-0df2b2f8fb27.png" alt="MusicGift by Mango Records" className="h-12 w-auto transition-transform duration-300 group-hover:scale-105" />
            </Link>
            <p className="text-gray-300 leading-relaxed">
              Creating personalized musical memories since 2020. Transform your special moments into beautiful custom songs.
            </p>
            <div className="flex space-x-4">
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
            }) => (
              <a key={label} href={href} className="w-10 h-10 bg-white/10 hover:bg-purple-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group" aria-label={label}>
                <Icon className="w-5 h-5 group-hover:text-white" />
              </a>
            ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6 relative">
              Quick Links
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400"></div>
            </h3>
            <ul className="space-y-3">
              {[{
              to: "/",
              label: "Home"
            }, {
              to: "/about",
              label: "About Us"
            }, {
              to: "/packages",
              label: "Packages"
            }, {
              to: "/how-it-works",
              label: "How It Works"
            }, {
              to: "/testimonials",
              label: "Testimonials"
            }, {
              to: "/admin",
              label: "Admin"
            }].map(({
              to,
              label
            }) => (
              <li key={to}>
                <Link to={to} className="text-gray-300 hover:text-purple-400 transition-all duration-300 hover:translate-x-2 inline-block relative group">
                  {label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6 relative">
              Contact Info
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400"></div>
            </h3>
            <div className="space-y-4">
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
            }) => (
              <a key={text} href={href} className="flex items-center space-x-3 text-gray-300 hover:text-purple-400 transition-colors duration-300 group">
                <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center group-hover:bg-purple-600/40 transition-colors duration-300">
                  <Icon className="w-4 h-4" />
                </div>
                <span>{text}</span>
              </a>
            ))}
            </div>

            {/* Legal Links */}
            <div className="pt-4">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                {["Terms & Conditions", "Privacy Policy", "Refund Policy", "Cookie Policy"].map(item => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6 relative">
              Stay Updated
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400"></div>
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Subscribe to get special offers, new packages, and exclusive musical content delivered to your inbox.
            </p>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Input placeholder="Enter your email address" className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20" />
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 transition-all duration-300 hover:scale-105 shadow-lg">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-slate-50">© 2025 MusicGift.ro. All rights reserved. Made by RED DOMAIN with ❤️ for music lovers.</p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>🎵 Crafting Musical Magic</span>
              <span>•</span>
              <span>🎁 Personalized Gifts</span>
              <span>•</span>
              <span>🌟 Premium Quality</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
