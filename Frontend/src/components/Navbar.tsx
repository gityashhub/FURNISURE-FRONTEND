import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, Settings, LogOut, User, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CartDrawer from './CartDrawer';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, useAuth, SignInButton, UserButton, SignedIn, SignedOut } from '@clerk/clerk-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items } = useCart();
  const location = useLocation();

  const { user, isSignedIn } = useUser();
  const { signOut } = useAuth();

  // console.log('====================================');
  // console.log(user);
  // console.log('====================================');

  // Fetch isAdmin from user publicMetadata (Clerk)
  const isAdmin = user?.publicMetadata?.isAdmin === true;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Products', path: '/products' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <nav className="absolute top-0 left-0 w-full z-50 bg-transparent">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center bg-white rounded-tl-3xl rounded-br-3xl px-6 sm:px-14 py-2 sm:py-3 ml-[-16px] sm:ml-[-24px]">
                <img src="/images/site-logo.png" alt="Furnisure Logo" className="h-10 sm:h-14 w-auto rounded-2xl" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-[#bb9a65] border-b-2 border-[#bb9a65]'
                      : 'text-white hover:text-[#bb9a65]'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-2">
              {/* Clerk User Menu */}
              <SignedIn>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="hidden lg:flex">
                      <User className="h-4 w-4 mr-2" />
                      {user?.firstName || 'Account'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin">
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem >
                      <Link  to="/profile" className="m-0 p-0 flex align-middle">
                      <UserRound className="h-4 w-4 mr-2" />
                      Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* <div className="hidden lg:flex ml-2">
                  <UserButton afterSignOutUrl="/" />
                </div> */}
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline" size="sm" className="hidden lg:flex">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>

              {/* Cart Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="relative"
              >
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#bb9a65] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>

              {/* Mobile menu button */}
              <div className="lg:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-white hover:text-[#bb9a65]"
                >
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="px-4 pt-2 pb-3 space-y-1 bg-white/95 backdrop-blur-sm border-t">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block px-3 py-2 text-base font-medium transition-colors rounded-md ${
                      location.pathname === item.path
                        ? 'text-[#bb9a65] bg-[#bb9a65]/10'
                        : 'text-gray-900 hover:text-[#bb9a65] hover:bg-[#bb9a65]/5'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="px-3 py-2 space-y-2 border-t mt-2">
                  <SignedIn>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setIsOpen(false)}>
                        <Button variant="secondary" size="sm" className="w-full justify-start">
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Button>
                      </Link>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSignOut}
                      className="w-full justify-start"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                    {/* <div className="mt-2">
                      <UserButton afterSignOutUrl="/" />
                    </div> */}
                  </SignedIn>
                  <SignedOut>
                    <SignInButton mode="modal">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <User className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                    </SignInButton>
                  </SignedOut>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
