import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  LogOut, 
  User, 
  Menu, 
  X, 
  Globe, 
  HeartHandshake, 
  PhoneCall, 
  Type, 
  ChevronDown,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { lang, setLang, textSize, setTextSize, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getProfileLink = () => {
    if (user?.is_patient) return '/patient-dashboard';
    if (user?.is_doctor) return '/doctor-dashboard';
    if (user?.is_superuser) return '/admin-dashboard';
    return '/signin';
  };

  const toggleTextSize = () => {
    setTextSize(textSize === 'normal' ? 'large' : 'normal');
  };

  const navLinks = [
    { label: t('nav_home'), path: '/' },
    { label: t('nav_find_doctor'), path: '/find-providers' },
    { label: t('nav_telemedicine'), path: '/consult-doctor' },
    { 
      label: t('nav_ai_tools'), 
      path: location.pathname === '/' ? '#ai-suite' : '/check-disease',
      isAnchor: location.pathname === '/'
    },
    { label: t('nav_patient_portal'), path: getProfileLink() },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-teal-900/30 shadow-lg shadow-black/20">
      {/* Top Accessibility & Emergency Bar */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 text-slate-300 px-4 py-1.5 text-xs sm:text-sm border-b border-teal-900/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-300 hidden sm:inline">{t('hero_emergency_banner')}</span>
            <span className="font-medium text-slate-300 sm:hidden">24/7 Helpline: 16263</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Text Sizing Accessibility Toggle */}
            <button
              onClick={toggleTextSize}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-teal-300 border border-teal-800/50 text-xs font-semibold transition"
              title="Toggle Large Text for Accessibility"
            >
              <Type className="h-3 w-3" />
              <span>{textSize === 'large' ? 'Text: A+' : 'Text: A'}</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-teal-950/80 hover:bg-teal-900/80 text-emerald-300 border border-teal-700/60 font-medium text-xs sm:text-sm transition shadow-sm"
              >
                <Globe className="h-3.5 w-3.5 text-emerald-400" />
                <span>{lang === 'en' ? 'English' : 'বাংলা (Bangla)'}</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {langDropdownOpen && (
                <div 
                  className="absolute right-0 mt-1 w-36 bg-slate-900 border border-teal-800/60 rounded-lg shadow-xl py-1 z-50"
                  onMouseLeave={() => setLangDropdownOpen(false)}
                >
                  <button
                    onClick={() => {
                      setLang('en');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs sm:text-sm flex items-center justify-between hover:bg-teal-950/60 transition ${
                      lang === 'en' ? 'text-emerald-400 font-bold bg-teal-950/40' : 'text-slate-300'
                    }`}
                  >
                    <span>English</span>
                    {lang === 'en' && <span className="text-emerald-400">✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      setLang('bn');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs sm:text-sm flex items-center justify-between hover:bg-teal-950/60 transition ${
                      lang === 'bn' ? 'text-emerald-400 font-bold bg-teal-950/40' : 'text-slate-300'
                    }`}
                  >
                    <span>বাংলা (Bangla)</span>
                    {lang === 'bn' && <span className="text-emerald-400">✓</span>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-teal-600 via-emerald-600 to-teal-400 flex items-center justify-center shadow-md shadow-teal-900/30 group-hover:scale-105 transition-transform">
              <HeartHandshake className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-teal-300 transition-colors flex items-center gap-1.5">
                {t('brand_name')}
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                  RuralCare
                </span>
              </span>
              <span className="text-xs text-teal-400 font-medium tracking-wide">
                {t('brand_tagline')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-3">
            {navLinks.map((item, idx) => {
              if (item.isAnchor) {
                return (
                  <a
                    key={idx}
                    href={item.path}
                    className="text-slate-200 hover:text-emerald-300 px-3 py-2 rounded-lg text-base font-semibold tracking-wide hover:bg-slate-900/60 transition-colors flex items-center gap-1"
                  >
                    {item.label === t('nav_ai_tools') && <Sparkles className="h-4 w-4 text-emerald-400 inline" />}
                    <span>{item.label}</span>
                  </a>
                );
              }
              return (
                <Link
                  key={idx}
                  to={item.path}
                  className={`text-slate-200 hover:text-emerald-300 px-3 py-2 rounded-lg text-base font-semibold tracking-wide hover:bg-slate-900/60 transition-colors flex items-center gap-1 ${
                    location.pathname === item.path ? 'text-emerald-400 bg-slate-900/80 border border-teal-800/40' : ''
                  }`}
                >
                  {item.label === t('nav_ai_tools') && <Sparkles className="h-4 w-4 text-emerald-400 inline" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions & Primary CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getProfileLink()}
                  className="bg-slate-900 hover:bg-slate-800 border border-teal-800/50 text-emerald-300 px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition"
                >
                  <User className="h-4 w-4 text-emerald-400" />
                  <span className="max-w-[130px] truncate">
                    {user.name || user.username}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-950/40 text-red-300 hover:bg-red-900/40 border border-red-900/50 px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/signin"
                className="text-slate-300 hover:text-white px-3.5 py-2 rounded-xl text-base font-semibold transition hover:bg-slate-900"
              >
                {t('nav_sign_in')}
              </Link>
            )}

            {/* High Contrast Primary CTA */}
            <Link
              to={user ? "/find-providers" : "/signin"}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm lg:text-base px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-950/50 hover:scale-[1.03] active:scale-[0.98] transition-all ring-2 ring-emerald-400/40"
            >
              <PhoneCall className="h-4 w-4 text-slate-950 stroke-[2.5]" />
              <span>{t('nav_emergency_help')}</span>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              to={user ? "/find-providers" : "/signin"}
              className="sm:inline-flex hidden items-center gap-1.5 bg-emerald-500 text-slate-950 font-bold text-xs px-3 py-2 rounded-lg"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>{lang === 'en' ? 'Get Help' : 'সাহায্য'}</span>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6 text-emerald-400" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-slate-950/98 border-b border-teal-900/60 px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((item, idx) => {
              if (item.isAnchor) {
                return (
                  <a
                    key={idx}
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className="block text-slate-200 hover:text-emerald-300 hover:bg-slate-900 px-3 py-2.5 rounded-lg text-lg font-semibold"
                  >
                    {item.label}
                  </a>
                );
              }
              return (
                <Link
                  key={idx}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="block text-slate-200 hover:text-emerald-300 hover:bg-slate-900 px-3 py-2.5 rounded-lg text-lg font-semibold"
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <Link
              to={user ? "/find-providers" : "/signin"}
              onClick={() => setIsOpen(false)}
              className="w-full text-center flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black py-3 rounded-xl text-base shadow-md"
            >
              <PhoneCall className="h-5 w-5" />
              <span>{t('nav_emergency_help')}</span>
            </Link>

            {user ? (
              <div className="flex gap-2">
                <Link
                  to={getProfileLink()}
                  onClick={() => setIsOpen(false)}
                  className="flex-1 text-center py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-emerald-300 font-semibold"
                >
                  {user.name || user.username}
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="px-4 py-2.5 bg-red-950/50 text-red-300 border border-red-900/50 rounded-xl font-semibold flex items-center justify-center"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/signin"
                  onClick={() => setIsOpen(false)}
                  className="text-center py-2.5 bg-slate-900 text-slate-200 rounded-xl font-semibold border border-slate-800"
                >
                  {t('nav_sign_in')}
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="text-center py-2.5 bg-teal-800 text-white rounded-xl font-semibold"
                >
                  {t('nav_sign_up')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
