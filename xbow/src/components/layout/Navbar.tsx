import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  TruckIcon, 
  Bars3Icon, 
  XMarkIcon,
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/CustomButton';
import Logo from '../../assets/WhatsApp Image 2025-09-08 at 00.16.58_e20dd409.jpg';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = user?.role === 'load_provider' 
    ? [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Post Load', href: '/post-load' },
        { name: 'My Loads', href: '/my-loads' },
        { name: 'Payments', href: '/payments' },
        { name: 'Bidding', href: '/bidding-info' },
      ]
    : [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Find Loads', href: '/find-loads' },
        { name: 'My Vehicles', href: '/my-vehicles' },
        { name: 'Add Vehicle', href: '/add-vehicle' },
        { name: 'Payments', href: '/payments' },
        { name: 'Bidding', href: '/bidding-info' },
      ];

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3">
            <img src={Logo} alt="Free Left" className="h-[100px] w-[180px]" />
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
              Free Left
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Admin Login Link - Only show if user is not logged in or is admin */}
            {(!user || user.role === 'admin') && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                  location.pathname === '/admin'
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
                }`}
              >
                <ShieldCheckIcon className="h-4 w-4 mr-1" />
                Admin
              </Link>
            )}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
              <BellIcon className="h-6 w-6" />
            </button>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{user?.role?.replace('_', ' ')}</p>
                  </div>
                  <UserCircleIcon className="h-8 w-8 text-slate-400" />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      <Link
                        to="/subscription"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Subscription
                      </Link>
                      <hr className="my-2 border-slate-200" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <ArrowRightOnRectangleIcon className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/admin"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors flex items-center"
              >
                <ShieldCheckIcon className="h-4 w-4 mr-1" />
                Admin Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-200"
          >
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-lg text-base font-medium ${
                    location.pathname === item.href
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Admin Login Link in Mobile Menu */}
              <Link
                to="/admin"
                className={`block px-3 py-2 rounded-lg text-base font-medium flex items-center ${
                  location.pathname === '/admin'
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-slate-600 hover:text-purple-600 hover:bg-slate-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <ShieldCheckIcon className="h-5 w-5 mr-2" />
                Admin
              </Link>
              
              <hr className="my-4 border-slate-200" />
              {user ? (
                <>
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{user?.role?.replace('_', ' ')}</p>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                    icon={<ArrowRightOnRectangleIcon className="h-4 w-4" />}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link
                  to="/admin"
                  className="block w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors text-center flex items-center justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShieldCheckIcon className="h-4 w-4 mr-1" />
                  Admin Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};