import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Shield, Users, ArrowRight } from 'lucide-react';

export const Home: React.FC = () => {
  const { user } = useAuth();

  const doctorsList = [
    {
      name: 'Dr. Mukul Kumar',
      hospital: 'Danip Hospital, UK',
      img: '/static/homepage/c31.jpg',
    },
    {
      name: 'Dr. Pankaj',
      hospital: 'Appwars Hospital, Delhi',
      img: '/static/homepage/c41.jpg',
    },
    {
      name: 'Dr. Deepika',
      hospital: 'ALen Hospital, NOIDA',
      img: '/static/homepage/girl.jpg',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32 bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-900/30 via-slate-950 to-slate-950 -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            {/* Hero Left */}
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-6">
                <Brain className="h-3.5 w-3.5" />
                Intelligent Disease Predictor
              </span>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-none mb-6">
                Be Your Own <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">Doctor</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-400 mb-8 leading-relaxed">
                Need medical guidance immediately but doctors aren't available? 
                HealthBridge uses intelligent machine learning models to analyze your symptoms 
                and predict potential conditions instantly, letting you contact specialists immediately.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:justify-center lg:justify-start">
                {user ? (
                  <Link
                    to={user.is_patient ? "/check-disease" : user.is_doctor ? "/doctor-dashboard" : "/admin-dashboard"}
                    className="inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-base font-medium rounded-xl text-white bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/signin"
                      className="inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-base font-medium rounded-xl text-white bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <Link
                      to="/signup"
                      className="inline-flex items-center justify-center px-6 py-3.5 border border-slate-700 hover:border-slate-600 text-base font-medium rounded-xl text-slate-300 bg-slate-950/50 hover:bg-slate-900/60 transition-all duration-200"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Hero Right */}
            <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Decorative background glow */}
                <div className="absolute top-0 -left-4 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 -right-4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>

                <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        <Brain className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">Intelligent Prediction</h3>
                        <p className="text-slate-400 text-sm mt-1">Advanced data mining algorithms match symptoms to predict health conditions.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">Instant Consultation</h3>
                        <p className="text-slate-400 text-sm mt-1">Connect with verified doctors, start consultations, and chat instantly.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                        <Shield className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg">Secure & Private</h3>
                        <p className="text-slate-400 text-sm mt-1">Your queries, history, and chat transcripts are protected via secure session gates.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">How it Works</h2>
            <p className="text-slate-400">Our seamless diagnostic pipeline puts healthcare back in your hands.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900/30 border border-slate-800/80 p-8 rounded-2xl text-center">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto mb-6 text-xl font-bold">1</div>
              <h3 className="text-white font-semibold text-xl mb-3">Input Symptoms</h3>
              <p className="text-slate-400 text-sm">Select symptoms you are experiencing from our comprehensive verified listing.</p>
            </div>
            
            <div className="bg-slate-900/30 border border-slate-800/80 p-8 rounded-2xl text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-6 text-xl font-bold">2</div>
              <h3 className="text-white font-semibold text-xl mb-3">ML Prediction</h3>
              <p className="text-slate-400 text-sm">Our prediction engine calculates confidence matrices and specifies the optimal medical specialist.</p>
            </div>

            <div className="bg-slate-900/30 border border-slate-800/80 p-8 rounded-2xl text-center">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mx-auto mb-6 text-xl font-bold">3</div>
              <h3 className="text-white font-semibold text-xl mb-3">Consult Doctor</h3>
              <p className="text-slate-400 text-sm">Start a live secure consultation portal to chat directly and resolve your queries.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className="py-20 bg-slate-900 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Our Featured Doctors</h2>
            <p className="text-slate-400">Get assistance from highly qualified and recommended doctors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {doctorsList.map((doc, idx) => (
              <div key={idx} className="bg-slate-950/40 border border-slate-855 rounded-2xl overflow-hidden shadow-lg group hover:border-slate-700 transition-all duration-300">
                <div className="h-60 overflow-hidden relative bg-slate-800">
                  <img
                    src={doc.img}
                    alt={doc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback icon/placeholder if static image fails
                      (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-white font-semibold text-xl mb-1">{doc.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{doc.hospital}</p>
                  <span className="inline-block text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                    Verified Consultant
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
