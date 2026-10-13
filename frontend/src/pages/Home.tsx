import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../api';
import {
  MapPin,
  Video,
  Calendar,
  FileText,
  Bell,
  PhoneCall,
  Sparkles,
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Activity,
  HeartPulse,
  Users,
  Clock,
  ChevronRight,
  Wifi,
  WifiOff,
  Stethoscope,
  Check,
  UploadCloud,
  FileCheck2,
  Heart,
  Star,
  BookOpen,
  TrendingUp,
  Award,
  AlertCircle,
  Loader2,
  ChevronDown
} from 'lucide-react';

// ---------- Types ----------
interface LiveStats {
  total_doctors: number;
  total_patients: number;
  total_consultations: number;
  total_articles: number;
  total_providers: number;
}

interface Article {
  id: number;
  title: string;
  category: string;
  summary: string;
  author: string;
  read_time: number;
  created_at: string;
}

// ---------- Animated counter ----------
const AnimatedCounter: React.FC<{ target: number; suffix?: string; duration?: number }> = ({
  target, suffix = '', duration = 2000
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(interval);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

export const Home: React.FC = () => {
  const { user } = useAuth();
  const { t, lang, lowBandwidth, setLowBandwidth } = useLanguage();

  // State
  const [liveStats, setLiveStats] = useState<LiveStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'original' | 'summary'>('summary');
  const [riskScore, setRiskScore] = useState(38);
  const [heroVisible, setHeroVisible] = useState(false);

  // Hero entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Fetch backend stats
  useEffect(() => {
    api.get('/stats/')
      .then(res => setLiveStats(res.data))
      .catch(() => setLiveStats(null))
      .finally(() => setStatsLoading(false));
  }, []);

  // Fetch recent articles (public endpoint)
  useEffect(() => {
    api.get('/articles/')
      .then(res => setRecentArticles((res.data.articles || []).slice(0, 3)))
      .catch(() => setRecentArticles([]))
      .finally(() => setArticlesLoading(false));
  }, []);

  const categoryColors: Record<string, string> = {
    'Nutrition': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    'Mental Health': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    'Disease Guides': 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    'Preventive Care': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    'Default': 'bg-slate-700/50 text-slate-300 border-slate-600/50',
  };

  const getCategoryColor = (cat: string) =>
    categoryColors[cat] || categoryColors['Default'];

  const quickActions = [
    {
      title: t('hub_find_doctor_title'),
      desc: t('hub_find_doctor_desc'),
      icon: MapPin,
      link: user ? '/find-providers' : '/signin',
      gradient: 'from-teal-500 to-emerald-600',
      ring: 'hover:ring-teal-500/30',
      badge: lang === 'en' ? 'By Location' : 'অবস্থান অনুযায়ী',
    },
    {
      title: t('hub_telemedicine_title'),
      desc: t('hub_telemedicine_desc'),
      icon: Video,
      link: user ? '/consult-doctor' : '/signin',
      gradient: 'from-sky-500 to-blue-600',
      ring: 'hover:ring-sky-500/30',
      badge: lang === 'en' ? 'Live Video' : 'লাইভ ভিডিও',
    },
    {
      title: t('hub_appointment_title'),
      desc: t('hub_appointment_desc'),
      icon: Calendar,
      link: user ? '/appointments' : '/signin',
      gradient: 'from-amber-500 to-orange-500',
      ring: 'hover:ring-amber-500/30',
      badge: lang === 'en' ? 'Instant Book' : 'তাৎক্ষণিক বুকিং',
    },
    {
      title: t('hub_records_title'),
      desc: t('hub_records_desc'),
      icon: FileText,
      link: user ? '/records' : '/signin',
      gradient: 'from-emerald-500 to-teal-600',
      ring: 'hover:ring-emerald-500/30',
      badge: lang === 'en' ? 'Encrypted EHR' : 'নিরাপদ রিপোর্ট',
    },
    {
      title: t('hub_reminders_title'),
      desc: t('hub_reminders_desc'),
      icon: Bell,
      link: user ? '/reminders' : '/signin',
      gradient: 'from-violet-500 to-purple-600',
      ring: 'hover:ring-violet-500/30',
      badge: lang === 'en' ? 'SMS Alert' : 'এসএমএস অ্যালার্ট',
    },
    {
      title: t('hub_emergency_title'),
      desc: t('hub_emergency_desc'),
      icon: PhoneCall,
      link: 'tel:16263',
      isPhone: true,
      gradient: 'from-rose-500 to-red-600',
      ring: 'hover:ring-rose-500/30',
      badge: '16263 • 24/7',
    },
  ];

  const howSteps = [
    {
      num: t('how_step1_number'),
      title: t('how_step1_title'),
      desc: t('how_step1_desc'),
      icon: Users,
      color: 'text-emerald-400',
      border: 'border-emerald-700/40 hover:border-emerald-500/60',
      numColor: 'text-emerald-400/40',
    },
    {
      num: t('how_step2_number'),
      title: t('how_step2_title'),
      desc: t('how_step2_desc'),
      icon: Stethoscope,
      color: 'text-sky-400',
      border: 'border-sky-700/40 hover:border-sky-500/60',
      numColor: 'text-sky-400/40',
    },
    {
      num: t('how_step3_number'),
      title: t('how_step3_title'),
      desc: t('how_step3_desc'),
      icon: HeartPulse,
      color: 'text-teal-400',
      border: 'border-teal-700/40 hover:border-teal-500/60',
      numColor: 'text-teal-400/40',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">

      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-teal-950/30 to-slate-950" />
        <div className="absolute top-1/4 right-0 w-[700px] h-[700px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.04)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left content */}
            <div className={`lg:col-span-7 space-y-7 transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-teal-950/80 text-teal-300 border border-teal-700/60 shadow backdrop-blur-md">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  {t('hero_badge')}
                </span>
                <button
                  onClick={() => setLowBandwidth(!lowBandwidth)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    lowBandwidth
                      ? 'bg-amber-950/60 text-amber-300 border-amber-600/60'
                      : 'bg-slate-900/70 text-slate-400 border-slate-700/60 hover:text-slate-200'
                  }`}
                >
                  {lowBandwidth ? <WifiOff className="h-3.5 w-3.5 text-amber-400" /> : <Wifi className="h-3.5 w-3.5 text-emerald-400" />}
                  {lowBandwidth ? (lang === 'en' ? 'Low-Bandwidth ON' : 'ধীর নেট মোড চালু') : (lang === 'en' ? 'Normal Mode' : 'সাধারণ মোড')}
                </button>
              </div>

              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.12]">
                {lang === 'en' ? <>Smart Healthcare,<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">Closer to Your Home.</span></> : <>স্মার্ট স্বাস্থ্যসেবা,<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">আপনার ঘরের কাছে।</span></>}
              </h1>

              <p className="text-slate-300 text-lg sm:text-xl leading-relaxed max-w-2xl">{t('hero_subheadline')}</p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link to={user ? '/find-providers' : '/signin'} className="group inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-emerald-950/60 hover:shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ring-2 ring-emerald-400/25">
                  <MapPin className="h-5 w-5 stroke-[2.5]" />
                  {t('hero_cta_doctor')}
                </Link>
                <Link to={user ? '/consult-doctor' : '/signin'} className="group inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base sm:text-lg border-2 border-teal-800/70 hover:border-teal-500/80 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                  <Video className="h-5 w-5 text-sky-400" />
                  {t('hero_cta_telemedicine')}
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/70">
                {[{ icon: CheckCircle2, text: t('hero_trust_badge_1'), color: 'text-emerald-400' }, { icon: CheckCircle2, text: t('hero_trust_badge_2'), color: 'text-teal-400' }, { icon: CheckCircle2, text: t('hero_trust_badge_3'), color: 'text-sky-400' }].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                    <item.icon className={`h-4 w-4 ${item.color} flex-shrink-0`} />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Live stats pills from backend */}
              {!statsLoading && liveStats && (
                <div className="flex flex-wrap gap-3 pt-1">
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-teal-800/40 text-sm">
                    <Stethoscope className="h-4 w-4 text-teal-400" />
                    <span className="text-white font-bold">{liveStats.total_doctors}</span>
                    <span className="text-slate-400">{lang === 'en' ? 'Registered Doctors' : 'নিবন্ধিত ডাক্তার'}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-emerald-800/40 text-sm">
                    <Users className="h-4 w-4 text-emerald-400" />
                    <span className="text-white font-bold">{liveStats.total_patients}</span>
                    <span className="text-slate-400">{lang === 'en' ? 'Active Patients' : 'সক্রিয় রোগী'}</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-sky-800/40 text-sm">
                    <Activity className="h-4 w-4 text-sky-400" />
                    <span className="text-white font-bold">{liveStats.total_consultations}</span>
                    <span className="text-slate-400">{lang === 'en' ? 'Consultations Done' : 'পরামর্শ সম্পন্ন'}</span>
                  </div>
                </div>
              )}
              {statsLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-teal-500" />
                  {lang === 'en' ? 'Loading live stats...' : 'লাইভ তথ্য লোড হচ্ছে...'}
                </div>
              )}
            </div>

            {/* Right visual */}
            <div className={`lg:col-span-5 flex justify-center lg:justify-end transition-all duration-1000 delay-300 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <div className="relative w-full max-w-md lg:max-w-none">
                <div className="absolute -inset-2 bg-gradient-to-r from-teal-500/25 via-emerald-500/15 to-sky-500/15 rounded-3xl blur-xl opacity-70" />
                <div className="relative rounded-3xl overflow-hidden border-2 border-teal-800/50 shadow-2xl shadow-teal-950/60 bg-slate-900 group">
                  <img
                    src="/images/rural_telemedicine_hero.jpg"
                    alt={lang === 'en' ? 'Rural family consulting doctor via video call' : 'গ্রামীণ পরিবার ভিডিও কলে ডাক্তারের পরামর্শ'}
                    className={`w-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ${lowBandwidth ? 'h-64' : 'h-80 sm:h-[400px] lg:h-[460px]'}`}
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  {/* Top pill */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                    <div className="bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-teal-700/50 flex items-center gap-2 text-xs font-semibold text-white shadow-lg">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      {lang === 'en' ? 'Live Telehealth Session' : 'লাইভ টেলিমেডিসিন সেশন'}
                    </div>
                    <div className="bg-emerald-950/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-700/60 text-xs font-bold text-emerald-300 flex items-center gap-1">
                      <Star className="h-3 w-3 fill-emerald-400 text-emerald-400" />
                      4.9 / 5.0
                    </div>
                  </div>

                  {/* Bottom caption */}
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/92 backdrop-blur-md p-4 rounded-2xl border border-teal-800/40">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 flex-shrink-0">
                        <Stethoscope className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{lang === 'en' ? 'Immediate Rural Telemedicine' : 'তাৎক্ষণিক গ্রামীণ টেলিমেডিসিন'}</p>
                        <p className="text-slate-400 text-xs mt-0.5">{lang === 'en' ? 'No travel. Verified doctors in minutes.' : 'দূরযাত্রা নেই, মিনিটেই ডাক্তার।'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="hidden sm:block absolute -left-6 top-1/3 bg-slate-900/95 border border-emerald-700/50 backdrop-blur-md rounded-2xl p-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold">Verified & Safe</p>
                      <p className="text-slate-400 text-[11px]">BMDC Registered</p>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block absolute -right-6 bottom-1/3 bg-slate-900/95 border border-sky-700/50 backdrop-blur-md rounded-2xl p-3 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-sky-500/20 rounded-lg flex items-center justify-center text-sky-400">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold">{lang === 'en' ? '< 10 Min Response' : '১০ মিনিটে সাড়া'}</p>
                      <p className="text-slate-400 text-[11px]">{lang === 'en' ? 'Average wait time' : 'গড় প্রতীক্ষার সময়'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="hidden lg:flex justify-center mt-14">
            <a href="#quick-hub" className="flex flex-col items-center gap-1 text-slate-500 hover:text-teal-400 transition-colors">
              <span className="text-xs font-medium tracking-widest uppercase">{lang === 'en' ? 'Explore Services' : 'সেবা দেখুন'}</span>
              <ChevronDown className="h-5 w-5 animate-bounce" />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════ QUICK ACTION HUB ═══════ */}
      <section id="quick-hub" className="py-20 sm:py-28 bg-slate-950 border-t border-teal-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 mb-4">
              <Activity className="h-3.5 w-3.5" />
              {lang === 'en' ? 'One-tap access' : 'এক ক্লিকেই সেবা'}
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">{t('hub_title')}</h2>
            <p className="mt-4 text-slate-400 text-base sm:text-lg leading-relaxed">{t('hub_subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              const inner = (
                <div className={`h-full flex flex-col p-6 sm:p-7 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border-2 border-slate-800/70 hover:border-teal-700/60 shadow-lg hover:shadow-2xl hover:shadow-teal-950/40 transition-all duration-300 group cursor-pointer ring-0 hover:ring-4 ${action.ring}`}>
                  <div className="flex items-start justify-between mb-5">
                    <div className={`p-4 rounded-2xl bg-gradient-to-tr ${action.gradient} text-white shadow-lg shadow-black/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <Icon className="h-7 w-7 stroke-[2]" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 group-hover:border-teal-700/50 group-hover:text-teal-300 transition-colors">
                      {action.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors mb-2 leading-tight">{action.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed flex-grow">{action.desc}</p>
                  <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between text-sm font-semibold text-teal-400/80 group-hover:text-emerald-400">
                    <span>{action.isPhone ? (lang === 'en' ? 'Tap to Call' : 'কল করুন') : (lang === 'en' ? 'Open Service' : 'সেবা খুলুন')}</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              );
              return action.isPhone
                ? <a key={index} href={action.link}>{inner}</a>
                : <Link key={index} to={action.link}>{inner}</Link>;
            })}
          </div>
        </div>
      </section>

      {/* ═══════ AI SUITE ═══════ */}
      <section id="ai-suite" className="py-20 sm:py-28 relative border-t border-teal-950/50 overflow-hidden" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(20,184,166,0.07) 0%, transparent 70%), rgb(2 6 23)' }}>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 mb-4">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              {t('ai_suite_badge')}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">{t('ai_suite_title')}</h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">{t('ai_suite_subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Card 1: Report Summarizer */}
            <div className="flex flex-col bg-slate-900/80 border-2 border-slate-800/80 hover:border-sky-700/60 rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-sky-950/30 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-5">
                <div className="p-3.5 rounded-2xl bg-sky-500/15 text-sky-400 border border-sky-500/20 group-hover:scale-110 transition-transform duration-300">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-950/80 text-sky-300 border border-sky-800/60">{t('ai_summarizer_sample_tag')}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2">{t('ai_summarizer_title')}</h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">{t('ai_summarizer_desc')}</p>

              <div className="flex-1 rounded-2xl bg-slate-950/80 border border-slate-800/70 overflow-hidden mb-6">
                <div className="flex border-b border-slate-800">
                  <button onClick={() => setActiveTab('original')} className={`flex-1 py-2.5 text-xs font-bold transition-colors ${activeTab === 'original' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                    {lang === 'en' ? '📄 Complex Lab Report' : '📄 জটিল রিপোর্ট'}
                  </button>
                  <button onClick={() => setActiveTab('summary')} className={`flex-1 py-2.5 text-xs font-bold transition-colors ${activeTab === 'summary' ? 'bg-emerald-600 text-slate-950' : 'text-slate-500 hover:text-slate-300'}`}>
                    {lang === 'en' ? '✅ AI Plain Summary' : '✅ সহজ সারসংক্ষেপ'}
                  </button>
                </div>
                <div className="p-4">
                  {activeTab === 'original' ? (
                    <div className="space-y-2 font-mono text-xs text-slate-400">
                      <p className="text-amber-400 font-bold mb-2">[LAB RECORD #94821]</p>
                      <p className="text-slate-300">• {t('ai_summarizer_complex_line1')}</p>
                      <p className="text-slate-300">• {t('ai_summarizer_complex_line2')}</p>
                      <p className="text-slate-300">• {t('ai_summarizer_complex_line3')}</p>
                      <p className="text-slate-500 italic text-[11px] mt-3 border-t border-slate-800 pt-2">{lang === 'en' ? 'Hard to interpret without medical expertise.' : 'বিশেষজ্ঞ ছাড়া বোঝা কঠিন।'}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-emerald-400 text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 mb-2">
                        <FileCheck2 className="h-4 w-4" /> {t('ai_summarizer_simple_title')}
                      </p>
                      {[{ text: t('ai_summarizer_simple_item1'), color: 'text-amber-400' }, { text: t('ai_summarizer_simple_item2'), color: 'text-emerald-400' }, { text: t('ai_summarizer_simple_item3'), color: 'text-sky-400' }].map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-200">
                          <Check className={`h-4 w-4 ${item.color} flex-shrink-0 mt-0.5`} />
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <Link to={user ? '/analyze-report' : '/signin'} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-lg shadow-sky-950/40 hover:scale-[1.01] active:scale-[0.98] transition-all">
                <UploadCloud className="h-5 w-5" />
                {t('ai_summarizer_btn')}
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Link>
            </div>

            {/* Card 2: Disease Risk Predictor */}
            <div className="flex flex-col bg-slate-900/80 border-2 border-slate-800/80 hover:border-emerald-700/60 rounded-3xl p-6 sm:p-8 shadow-xl hover:shadow-emerald-950/30 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-5">
                <div className="p-3.5 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                  <HeartPulse className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">{lang === 'en' ? 'Non-Alarmist' : 'ভীতিহীন মূল্যায়ন'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2">{t('ai_risk_title')}</h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">{t('ai_risk_desc')}</p>

              <div className="flex-1 rounded-2xl bg-slate-950/80 border border-slate-800/70 p-4 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">{t('ai_risk_score_label')}</p>
                    <p className={`text-sm font-bold mt-0.5 flex items-center gap-1.5 ${riskScore <= 40 ? 'text-emerald-400' : riskScore <= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
                      <Heart className="h-3.5 w-3.5 fill-current" />
                      {riskScore <= 40 ? (lang === 'en' ? 'Optimal' : 'চমৎকার') : riskScore <= 70 ? (lang === 'en' ? 'Moderate' : 'মধ্যম') : (lang === 'en' ? 'Needs Attention' : 'মনোযোগ প্রয়োজন')}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[{ label: lang === 'en' ? 'Low' : 'কম', val: 28, color: 'bg-emerald-600' }, { label: lang === 'en' ? 'Med' : 'মধ্যম', val: 55, color: 'bg-amber-500' }, { label: lang === 'en' ? 'High' : 'বেশি', val: 80, color: 'bg-rose-600' }].map((opt) => (
                      <button key={opt.val} onClick={() => setRiskScore(opt.val)} className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${riskScore === opt.val ? `${opt.color} text-white scale-105` : 'bg-slate-800 text-slate-400 hover:text-white'}`}>
                        {opt.label}
                      </button>
                    ))}
                    <div className="ml-2 text-right">
                      <span className="text-2xl font-black text-white">{riskScore}</span>
                      <span className="text-xs text-slate-500">/100</span>
                    </div>
                  </div>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden mb-1.5">
                  <div className={`h-full rounded-full transition-all duration-700 ${riskScore <= 40 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : riskScore <= 70 ? 'bg-gradient-to-r from-emerald-500 via-yellow-400 to-amber-500' : 'bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500'}`} style={{ width: `${riskScore}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-medium mb-4">
                  <span className="text-emerald-500">0 — Optimal</span>
                  <span className="text-amber-500">50 — Moderate</span>
                  <span className="text-rose-500">100 — Advisory</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[{ icon: Activity, text: t('ai_risk_card_bp'), color: 'text-emerald-400' }, { icon: HeartPulse, text: t('ai_risk_card_heart'), color: 'text-teal-400' }].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
                      <item.icon className={`h-3.5 w-3.5 ${item.color} flex-shrink-0`} />
                      <span className="leading-tight">{item.text}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-3 italic">{t('ai_risk_score_caption')}</p>
              </div>
              <Link to={user ? '/check-disease' : '/signin'} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-950/40 hover:scale-[1.01] active:scale-[0.98] transition-all">
                <HeartPulse className="h-5 w-5" />
                {t('ai_risk_btn')}
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ STATS / TRUST ═══════ */}
      <section className="py-20 sm:py-28 bg-slate-950 border-t border-teal-950/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.035] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-teal-950/60 text-teal-300 border border-teal-800/60 mb-4">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              {t('stats_badge')}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">{t('stats_title')}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {[
              { isLive: true, liveKey: 'total_doctors' as keyof LiveStats, staticVal: t('stats_stat1_number'), label: t('stats_stat1_label'), icon: Stethoscope, gradient: 'from-emerald-400 to-teal-300', iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/15', border: 'hover:border-emerald-600/50' },
              { isLive: false, liveKey: null, staticVal: t('stats_stat2_number'), label: t('stats_stat2_label'), icon: TrendingUp, gradient: 'from-sky-400 to-teal-300', iconColor: 'text-sky-400', iconBg: 'bg-sky-500/15', border: 'hover:border-sky-600/50' },
              { isLive: false, liveKey: null, staticVal: t('stats_stat3_number'), label: t('stats_stat3_label'), icon: Clock, gradient: 'from-amber-400 to-emerald-400', iconColor: 'text-amber-400', iconBg: 'bg-amber-500/15', border: 'hover:border-amber-600/50' },
              { isLive: true, liveKey: 'total_consultations' as keyof LiveStats, staticVal: t('stats_stat4_number'), label: t('stats_stat4_label'), icon: Activity, gradient: 'from-teal-400 to-emerald-400', iconColor: 'text-teal-400', iconBg: 'bg-teal-500/15', border: 'hover:border-teal-600/50' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              const liveVal = stat.isLive && liveStats && stat.liveKey ? liveStats[stat.liveKey] : null;
              return (
                <div key={i} className={`relative bg-gradient-to-b from-slate-900/80 to-slate-950 border-2 border-slate-800/70 ${stat.border} p-7 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden`}>
                  {stat.isLive && liveStats && (
                    <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />LIVE
                    </span>
                  )}
                  <div className={`p-3 rounded-xl ${stat.iconBg} mb-4 w-fit`}>
                    <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                  <div className={`text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient} mb-2`}>
                    {liveVal !== null ? <AnimatedCounter target={liveVal as number} suffix="+" /> : stat.staticVal}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Testimonial */}
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-teal-950/50 via-slate-900/80 to-emerald-950/50 border border-teal-800/40 p-7 sm:p-10 rounded-3xl shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-950/40 text-2xl font-black text-white">র</div>
              <div>
                <div className="flex gap-0.5 mb-3">{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
                <p className="text-slate-200 text-base sm:text-lg italic leading-relaxed">{t('trust_callout_quote')}</p>
                <p className="mt-3 text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider">{t('trust_callout_author')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section id="about" className="py-20 sm:py-28 border-t border-teal-950/50" style={{ background: 'linear-gradient(to bottom, rgb(2 6 23), rgba(15,23,42,0.5), rgb(2 6 23))' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-teal-950/60 text-teal-300 border border-teal-800/60 mb-4">
              <Clock className="h-3.5 w-3.5 text-emerald-400" />
              {t('how_badge')}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">{t('how_title')}</h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">{t('how_subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className={`relative bg-slate-900/70 border-2 ${step.border} p-8 rounded-3xl transition-all duration-300 group hover:bg-slate-900`}>
                  <div className="flex items-start justify-between mb-6">
                    <span className={`text-4xl font-black font-mono ${step.numColor} leading-none`}>{step.num}</span>
                    <div className={`p-3 rounded-xl bg-slate-800 group-hover:bg-slate-900 border border-slate-700/70 ${step.color} transition-colors`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className={`text-xl sm:text-2xl font-bold text-white mb-3 group-hover:${step.color} transition-colors`}>{step.title}</h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-14 text-center">
            <Link to={user ? '/find-providers' : '/signup'} className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-emerald-950/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
              {user ? t('hero_cta_doctor') : (lang === 'en' ? 'Get Started in 30 Seconds' : '৩০ সেকেন্ডে শুরু করুন')}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ HEALTH LIBRARY (Backend Connected) ═══════ */}
      <section className="py-20 sm:py-28 bg-slate-950 border-t border-teal-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-teal-950/60 text-teal-300 border border-teal-800/60 mb-3">
                <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
                {lang === 'en' ? 'Community Health Library' : 'স্বাস্থ্য জ্ঞান ভান্ডার'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">{lang === 'en' ? 'Latest Health Articles' : 'সর্বশেষ স্বাস্থ্য নিবন্ধ'}</h2>
              <p className="mt-2 text-slate-400 text-sm sm:text-base">{lang === 'en' ? 'Evidence-based guides from our medical editorial team, fetched live from our database.' : 'আমাদের চিকিৎসা দলের তৈরি, ডাটাবেজ থেকে সরাসরি লোড হওয়া স্বাস্থ্য নির্দেশিকা।'}</p>
            </div>
            <Link to={user ? '/health-library' : '/signin'} className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 border-2 border-teal-800/60 hover:border-teal-600 font-semibold text-sm transition-all">
              {lang === 'en' ? 'View All Articles' : 'সব নিবন্ধ দেখুন'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {articlesLoading ? (
            <div className="flex items-center justify-center py-16 text-slate-400 gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-teal-400" />
              <span>{lang === 'en' ? 'Loading articles from server...' : 'সার্ভার থেকে নিবন্ধ লোড হচ্ছে...'}</span>
            </div>
          ) : recentArticles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 gap-3">
              <AlertCircle className="h-10 w-10 text-slate-600" />
              <p>{lang === 'en' ? 'No articles published yet.' : 'এখনো কোনো নিবন্ধ প্রকাশিত হয়নি।'}</p>
              <p className="text-xs text-slate-600">{lang === 'en' ? 'Articles added via the Admin panel will appear here.' : 'অ্যাডমিন প্যানেলে যোগ করা নিবন্ধগুলো এখানে দেখাবে।'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentArticles.map((article) => (
                <Link key={article.id} to={user ? `/health-library/${article.id}` : '/signin'} className="group bg-slate-900/70 hover:bg-slate-900 border-2 border-slate-800/70 hover:border-teal-700/60 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:shadow-teal-950/30 transition-all duration-300 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getCategoryColor(article.category)}`}>{article.category}</span>
                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                      <Clock className="h-3 w-3" />
                      {article.read_time} min
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-teal-300 transition-colors mb-2 leading-tight flex-grow">{article.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4">{article.summary}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Award className="h-3 w-3 text-teal-500" />
                      <span className="truncate max-w-[150px]">{article.author}</span>
                    </div>
                    <span className="flex items-center gap-1 text-teal-400 group-hover:text-emerald-400 font-semibold">
                      {lang === 'en' ? 'Read' : 'পড়ুন'}
                      <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════ FINAL CTA BANNER ═══════ */}
      <section className="py-20 sm:py-28 border-t border-teal-900/60 relative overflow-hidden" style={{ background: 'linear-gradient(to right, rgb(5 17 37), rgb(15 23 42), rgb(2 19 14))' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)] pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 mb-6">
            <Heart className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" />
            {lang === 'en' ? 'Free for Rural Communities' : 'গ্রামীণ পরিবারের জন্য বিনামূল্যে'}
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6">
            {lang === 'en'
              ? <><span>Your Health. </span><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Our Mission.</span></>
              : <><span>আপনার স্বাস্থ্য। </span><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">আমাদের দায়িত্ব।</span></>}
          </h2>
          <p className="text-slate-300 text-lg sm:text-xl leading-relaxed mb-10 max-w-3xl mx-auto">
            {lang === 'en'
              ? 'Join thousands of rural families who now access quality healthcare from their homes, regardless of location or internet speed.'
              : 'হাজার হাজার গ্রামীণ পরিবারের সাথে যুক্ত হন যারা এখন ঘরে বসেই মানসম্মত স্বাস্থ্যসেবা পাচ্ছেন।'}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={user ? '/find-providers' : '/signup'} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-lg shadow-xl shadow-emerald-950/50 hover:scale-[1.03] active:scale-[0.98] transition-all">
              {user ? (lang === 'en' ? 'Access Patient Dashboard' : 'রোগীর পোর্টালে যান') : (lang === 'en' ? 'Register Free — 30 Seconds' : 'বিনামূল্যে নিবন্ধন করুন')}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a href="tel:16263" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-white font-bold text-lg border-2 border-teal-700/70 hover:border-teal-500 transition-all shadow-lg">
              <PhoneCall className="h-5 w-5 text-emerald-400" />
              {lang === 'en' ? 'Call Helpline: 16263' : 'হেল্পলাইনে কল: ১৬২৬৩'}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
