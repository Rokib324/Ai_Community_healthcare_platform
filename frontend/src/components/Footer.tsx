import React from 'react';
import { Mail, Phone, MapPin, Activity } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="footer" className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Slogan */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2 text-sky-400 font-bold text-xl">
              <Activity className="h-6 w-6 text-sky-400" />
              <span>HealthBridge</span>
            </div>
            <p className="text-sm text-slate-500 max-w-xs">
              Be your own doctor. Get instant guidance on your health symptoms powered by intelligent machine learning models.
            </p>
          </div>

          {/* Quick Info */}
          <div>
            <h4 className="text-slate-200 font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="hover:text-sky-400 transition-colors">About Us</a>
              </li>
              <li>
                <a href="#doctors" className="hover:text-sky-400 transition-colors">Our Doctors</a>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition-colors">GitHub Repository</a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-slate-200 font-semibold text-lg mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-sky-400" />
                <span>healthbridge@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-sky-400" />
                <span>+44 7251018338</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-sky-400" />
                <span>Manchester, UK</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-8 pt-8 text-center text-xs text-slate-600">
          <p>© {new Date().getFullYear()} HealthBridge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
