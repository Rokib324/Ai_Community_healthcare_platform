import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Activity, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getProfileLink = () => {
    if (user?.is_patient) return '/patient-dashboard';
    if (user?.is_doctor) return '/doctor-dashboard';
    if (user?.is_superuser) return '/admin-dashboard';
    return '/';
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-sky-400 font-bold text-xl tracking-wide hover:opacity-90 transition-opacity">
              <Activity className="h-6 w-6 text-sky-400" />
              <span>HealthBridge</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <Link to="/" className="text-slate-300 hover:text-sky-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</Link>
            
            {user?.is_patient && (
              <>
                <Link to="/find-providers" className="text-slate-300 hover:text-sky-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Find Facilities</Link>
                <Link to="/records" className="text-slate-300 hover:text-sky-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Records (EHR)</Link>
                <Link to="/reminders" className="text-slate-300 hover:text-sky-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Alarms</Link>
              </>
            )}
            {user && (
              <Link to="/health-library" className="text-slate-300 hover:text-sky-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Library</Link>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to={getProfileLink()}
                  className="text-emerald-400 hover:text-emerald-300 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>
                    {user.is_superuser
                      ? `Admin: ${user.username}`
                      : user.is_patient
                      ? `Hello, ${user.name}`
                      : `Hello, Dr. ${user.name}`}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-950/40 text-red-400 hover:bg-red-900/30 border border-red-900/50 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 transition-all duration-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/signin"
                  className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Signin
                </Link>
                <Link
                  to="/signup"
                  className="bg-sky-600 text-white hover:bg-sky-500 px-4 py-2 rounded-md text-sm font-medium shadow-md shadow-sky-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block text-slate-300 hover:text-sky-400 px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </Link>
            
            {user?.is_patient && (
              <>
                <Link
                  to="/find-providers"
                  onClick={() => setIsOpen(false)}
                  className="block text-slate-300 hover:text-sky-400 px-3 py-2 rounded-md text-base font-medium"
                >
                  Find Facilities
                </Link>
                <Link
                  to="/records"
                  onClick={() => setIsOpen(false)}
                  className="block text-slate-300 hover:text-sky-400 px-3 py-2 rounded-md text-base font-medium"
                >
                  Records (EHR)
                </Link>
                <Link
                  to="/reminders"
                  onClick={() => setIsOpen(false)}
                  className="block text-slate-300 hover:text-sky-400 px-3 py-2 rounded-md text-base font-medium"
                >
                  Alarms
                </Link>
              </>
            )}
            {user && (
              <Link
                to="/health-library"
                onClick={() => setIsOpen(false)}
                className="block text-slate-300 hover:text-sky-400 px-3 py-2 rounded-md text-base font-medium"
              >
                Health Library
              </Link>
            )}

            {user ? (
              <div className="pt-4 pb-2 border-t border-slate-800 px-3">
                <Link
                  to={getProfileLink()}
                  onClick={() => setIsOpen(false)}
                  className="block text-emerald-400 hover:text-emerald-300 py-2 rounded-md text-base font-medium"
                >
                  Profile: {user.name || user.username}
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="mt-2 w-full text-left bg-red-950/40 text-red-400 border border-red-950 px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </button>
              </div>
            ) : (
              <div className="pt-4 pb-2 border-t border-slate-800 px-3 flex flex-col gap-2">
                <Link
                  to="/signin"
                  onClick={() => setIsOpen(false)}
                  className="text-center block text-slate-300 hover:text-white py-2 rounded-md text-base font-medium border border-slate-700"
                >
                  Signin
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="text-center block bg-sky-600 text-white py-2 rounded-md text-base font-medium"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
