import React from 'react';
import { Link } from 'react-router-dom';
import { FiLayers, FiTwitter, FiLinkedin, FiGithub, FiMail } from 'react-icons/fi';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-1.5 bg-primary-brand text-white rounded-md">
                <FiLayers className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Cold Chain<span className="text-primary-brand">Wise</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-slate-400">
              Enterprise-grade AI-powered temperature telemetry and route optimization for pharma, biotech, and food fleets.
            </p>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="hover:text-white transition-colors" aria-label="Twitter"><FiTwitter className="w-4 h-4" /></a>
              <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn"><FiLinkedin className="w-4 h-4" /></a>
              <a href="#" className="hover:text-white transition-colors" aria-label="GitHub"><FiGithub className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Solution Links */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Solutions</h3>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Pharma Cargo</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Vaccine Distribution</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Biotech Logistics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Food & Dairy fleets</a></li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Legal / Policy */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Compliance Certs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">SLA Agreement</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-slate-500">
            &copy; {new Date().getFullYear()} Cold Chain Wise, Inc. All rights reserved. Registered ISO-9001 Logistics Vendor.
          </p>
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <FiMail className="w-3.5 h-3.5" />
            <span>ops@coldchainwise.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
