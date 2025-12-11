import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-[#bb9a65] mb-4">Furnisure</h3>
            <p className="text-muted-foreground mb-4">
              Your trusted partner for premium furniture solutions. We bring comfort and style to your home with our carefully curated collection of furniture.
            </p>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+91 9737888669</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>furnisureecommerce@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-[#bb9a65] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-[#bb9a65] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm text-muted-foreground hover:text-[#bb9a65] transition-colors">
                  Browse Products
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-sm text-muted-foreground hover:text-[#bb9a65] transition-colors">
                  Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
               <Link to="/products" className="text-sm text-muted-foreground hover:text-[#bb9a65] transition-colors">Beds</Link>
              </li>
              <li>
                <Link to="/products" className="text-sm text-muted-foreground hover:text-[#bb9a65] transition-colors">Sofas</Link> 
              </li>
              <li>
                <Link to="/products" className="text-sm text-muted-foreground hover:text-[#bb9a65] transition-colors">Dining Sets</Link>
              </li>
              <li>
                <Link to="/products" className="text-sm text-muted-foreground hover:text-[#bb9a65] transition-colors">Recliners</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Furnisure. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
