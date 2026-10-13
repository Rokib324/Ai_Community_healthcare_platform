import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  HeartHandshake, 
  PhoneCall, 
  Mail, 
  MapPin, 
  AlertTriangle, 
  ShieldCheck, 
  Clock
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, lang } = useLanguage();

  return (
    <footer className="bg-slate-950 border-t border-teal-950/80 text-slate-300 pt-16 pb-12 mt-auto relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-900/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Prominent Emergency Disclaimer Box */}
        <div className="mb-14 p-6 sm:p-8 rounded-2xl bg-amber-950/30 border-2 border-amber-500/40 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="p-3.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30 flex-shrink-0">
              <AlertTriangle className="h-8 w-8 stroke-[2.2]" />
            </div>
            <div className="flex-1">
              <h3 className="text-amber-300 font-extrabold text-lg sm:text-xl flex items-center gap-2">
                <span>{t('footer_emergency_disclaimer_title')}</span>
                <span className="px-2 py-0.5 text-xs bg-red-500/20 text-red-300 border border-red-500/40 rounded-full font-bold">
                  24/7 National Emergency: 999
                </span>
              </h3>
              <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
                {t('footer_emergency_disclaimer')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
              <a
                href="tel:16263"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition shadow-lg shadow-amber-950/40"
              >
                <PhoneCall className="h-4 w-4" />
                <span>Call Helpline 16263</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4-Column Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-900">
          
          {/* Column 1: Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center shadow-md shadow-teal-900/30">
                <HeartHandshake className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                {t('brand_name')}
              </span>
            </div>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-md">
              {t('footer_tagline')}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-950/80 text-teal-300 border border-teal-800/60">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                HIPAA & Data Privacy Protected
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                <Clock className="h-3.5 w-3.5 text-emerald-400" />
                24/7 Rural Telehealth
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white font-bold text-lg tracking-wide border-l-4 border-emerald-500 pl-3">
              {t('footer_quick_links')}
            </h4>
            <ul className="space-y-2.5 text-sm sm:text-base">
              <li>
                <Link to="/" className="text-slate-400 hover:text-emerald-300 transition-colors">
                  {t('nav_home')}
                </Link>
              </li>
              <li>
                <Link to="/find-providers" className="text-slate-400 hover:text-emerald-300 transition-colors">
                  {t('nav_find_doctor')}
                </Link>
              </li>
              <li>
                <Link to="/consult-doctor" className="text-slate-400 hover:text-emerald-300 transition-colors">
                  {t('nav_telemedicine')}
                </Link>
              </li>
              <li>
                <a href="#ai-suite" className="text-slate-400 hover:text-emerald-300 transition-colors">
                  {t('nav_ai_tools')}
                </a>
              </li>
              <li>
                <Link to="/patient-dashboard" className="text-slate-400 hover:text-emerald-300 transition-colors">
                  {t('nav_patient_portal')}
                </Link>
              </li>
              <li>
                <a href="#about" className="text-slate-400 hover:text-emerald-300 transition-colors">
                  {t('footer_about')}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Helpline (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-white font-bold text-lg tracking-wide border-l-4 border-teal-500 pl-3">
              {t('footer_contact_title')}
            </h4>
            <p className="text-xs text-teal-400 font-semibold uppercase tracking-wider">
              {t('footer_helpline_label')}
            </p>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-teal-800/40 space-y-3">
              <a 
                href="tel:16263"
                className="flex items-center gap-3 text-emerald-400 hover:text-emerald-300 font-black text-lg transition"
              >
                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-300">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <span>{t('footer_phone')}</span>
              </a>

              <a 
                href="mailto:care@commhealth.ai"
                className="flex items-center gap-3 text-slate-300 hover:text-teal-300 text-sm transition"
              >
                <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400">
                  <Mail className="h-4 w-4" />
                </div>
                <span>{t('footer_email')}</span>
              </a>

              <div className="flex items-start gap-3 text-slate-400 text-xs pt-1">
                <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>{t('footer_location')}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2">
              <Link to="/health-library" className="hover:text-slate-300 transition">
                {t('footer_privacy')}
              </Link>
              <span>•</span>
              <Link to="/health-library" className="hover:text-slate-300 transition">
                {t('footer_terms')}
              </Link>
              <span>•</span>
              <a href="#about" className="hover:text-slate-300 transition">
                {t('footer_support')}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} {t('brand_name')}. {t('footer_copyright')}
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              {lang === 'en' ? 'Rural Systems: Online & Operational' : 'গ্রামীণ স্বাস্থ্য সার্ভার: সচল ও সক্রিয়'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
