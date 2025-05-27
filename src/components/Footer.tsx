
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/61b6a361-9741-4d73-8075-0df2b2f8fb27.png" 
                alt="MusicGift by Mango Records" 
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-gray-600">
              Creating personalized musical memories since 2020.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 hover:text-purple-600 transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-purple-600 transition-colors">About</Link></li>
              <li><Link to="/packages" className="text-gray-600 hover:text-purple-600 transition-colors">Packages</Link></li>
              <li><Link to="/how-it-works" className="text-gray-600 hover:text-purple-600 transition-colors">How It Works</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Refund Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Newsletter</h3>
            <p className="text-gray-600 mb-4">Subscribe to get special offers and updates</p>
            <div className="flex space-x-2">
              <Input placeholder="Your email address" className="flex-1" />
              <Button className="bg-gradient-purple hover:opacity-90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center text-gray-600">
          <p>&copy; 2025 MusicGift.ro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
