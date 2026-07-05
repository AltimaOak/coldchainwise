import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../Button/Button';
import { FiLogOut, FiMenu, FiX, FiLayers, FiShield } from 'react-icons/fi';

const Navbar: React.FC = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLandingPage = location.pathname === '/';

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (isLandingPage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${sectionId}`);
      // Wait for navigation then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass-nav enterprise-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-1.5 bg-primary-brand text-white rounded-md group-hover:bg-primary-hover transition-colors">
                <FiLayers className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-primary tracking-tight">
                Cold Chain<span className="text-primary-brand font-semibold">Wise</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => handleNavClick('features')} 
              className="text-sm font-medium text-slate-600 hover:text-primary-brand cursor-pointer transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => handleNavClick('solutions')} 
              className="text-sm font-medium text-slate-600 hover:text-primary-brand cursor-pointer transition-colors"
            >
              Solutions
            </button>
            <button 
              onClick={() => handleNavClick('how-it-works')} 
              className="text-sm font-medium text-slate-600 hover:text-primary-brand cursor-pointer transition-colors"
            >
              How It Works
            </button>

            <button 
              onClick={() => handleNavClick('faq')} 
              className="text-sm font-medium text-slate-600 hover:text-primary-brand cursor-pointer transition-colors"
            >
              FAQ
            </button>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-700">{user.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{user.company} • {user.role}</p>
                </div>
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => navigate('/dashboard')}
                  icon={<FiShield className="w-4 h-4" />}
                >
                  Console
                </Button>
                <button 
                  onClick={() => { logOut(); navigate('/'); }}
                  title="Sign Out" 
                  className="p-1.5 text-slate-400 hover:text-danger rounded-md hover:bg-slate-100 transition-all"
                >
                  <FiLogOut className="w-4.5 h-4.5" />
                </button>
              </div>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/signup')}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-brand"
            >
              {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => handleNavClick('features')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-brand"
            >
              Features
            </button>
            <button
              onClick={() => handleNavClick('solutions')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-brand"
            >
              Solutions
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-brand"
            >
              How It Works
            </button>

            <button
              onClick={() => handleNavClick('faq')}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-brand"
            >
              FAQ
            </button>
          </div>
          <div className="pt-4 pb-3 border-t border-slate-200 px-4">
            {user ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.company} • {user.role}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="primary" size="sm" onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}>
                    Console
                  </Button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); logOut(); navigate('/'); }}
                    className="p-2 text-slate-400 hover:text-danger rounded-md hover:bg-slate-100"
                  >
                    <FiLogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}>
                  Sign In
                </Button>
                <Button variant="primary" size="sm" onClick={() => { setMobileMenuOpen(false); navigate('/signup'); }}>
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
