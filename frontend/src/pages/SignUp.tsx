import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Activity, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

export const SignUp: React.FC = () => {
  const { refresh } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  
  // Shared Form Fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [password1, setPassword1] = useState('');

  // Doctor Only Fields
  const [regNo, setRegNo] = useState('');
  const [yor, setYor] = useState('');
  const [qualification, setQualification] = useState('');
  const [council, setCouncil] = useState('');
  const [specialization, setSpecialization] = useState('');

  // States
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== password1) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        username,
        email,
        name,
        dob,
        gender,
        address,
        mobile,
        password,
        password1,
      };

      let url = '/auth/signup/patient/';

      if (role === 'doctor') {
        url = '/auth/signup/doctor/';
        payload.registration_no = regNo;
        payload.year_of_registration = yor;
        payload.qualification = qualification;
        payload.State_Medical_Council = council;
        payload.specialization = specialization;
      }

      const response = await api.post(url, payload);
      if (response.data.success) {
        setSuccess(response.data.message || 'Account created successfully!');
        // Refresh authentication context state
        await refresh();
        // Redirect to homepage/dashboard
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError(response.data.error || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'An error occurred during signup.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-950 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <Link to="/" className="inline-flex items-center space-x-2 text-sky-400 font-bold text-2xl tracking-wide mb-4">
          <Activity className="h-8 w-8" />
          <span>HealthBridge</span>
        </Link>
        <h2 className="text-3xl font-extrabold text-white">Create an Account</h2>
        <p className="mt-2 text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/signin" className="font-medium text-sky-400 hover:text-sky-300 transition-colors">
            Sign in instead
          </Link>
        </p>

        {/* Role Toggle Tabs */}
        <div className="mt-8 flex justify-center p-1 bg-slate-900 border border-slate-800 rounded-xl max-w-sm mx-auto">
          <button
            onClick={() => { setRole('patient'); setError(''); }}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
              role === 'patient'
                ? 'bg-sky-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register as Patient
          </button>
          <button
            onClick={() => { setRole('doctor'); setError(''); }}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
              role === 'doctor'
                ? 'bg-sky-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register as Doctor
          </button>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl py-8 px-6 shadow-2xl backdrop-blur-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-950/40 border border-red-900/50 rounded-xl p-4 flex items-start gap-3 text-red-400 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-emerald-950/40 border border-emerald-900/50 rounded-xl p-4 flex items-start gap-3 text-emerald-400 text-sm">
                <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            {/* Grid Layout for Forms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Account Details */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1.5 block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm"
                  placeholder="johndoe"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="mt-1.5 block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm"
                  placeholder="1234567890"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="mt-1.5 block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-1.5 block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1.5 block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm"
                  placeholder="123 Main St, Delhi"
                />
              </div>

              {/* Doctor Specific Fields */}
              {role === 'doctor' && (
                <>
                  <div className="sm:col-span-2 border-t border-slate-800/80 pt-4 mt-2">
                    <h4 className="text-sm font-semibold text-sky-400 mb-2">Professional Qualifications</h4>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Registration No.</label>
                    <input
                      type="text"
                      required
                      value={regNo}
                      onChange={(e) => setRegNo(e.target.value)}
                      className="mt-1.5 block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm"
                      placeholder="REG-991823"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Year of Registration</label>
                    <input
                      type="date"
                      required
                      value={yor}
                      onChange={(e) => setYor(e.target.value)}
                      className="mt-1.5 block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Qualification</label>
                    <input
                      type="text"
                      required
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      className="mt-1.5 block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm"
                      placeholder="MBBS, MD"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">State Medical Council</label>
                    <input
                      type="text"
                      required
                      value={council}
                      onChange={(e) => setCouncil(e.target.value)}
                      className="mt-1.5 block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm"
                      placeholder="Delhi Medical Council"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Specialization</label>
                    <select
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="mt-1.5 block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-350 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm"
                    >
                      <option value="">Select Specialization</option>
                      <option value="Rheumatologist">Rheumatologist</option>
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="ENT specialist">ENT specialist</option>
                      <option value="Orthopedist">Orthopedist</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Allergist/Immunologist">Allergist/Immunologist</option>
                      <option value="Urologist">Urologist</option>
                      <option value="Dermatologist">Dermatologist</option>
                      <option value="Gastroenterologist">Gastroenterologist</option>
                    </select>
                  </div>
                </>
              )}

              {/* Passwords */}
              <div className="sm:col-span-2 border-t border-slate-800/80 pt-4 mt-2">
                <h4 className="text-sm font-semibold text-sky-400 mb-2">Passwords</h4>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5 block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={password1}
                  onChange={(e) => setPassword1(e.target.value)}
                  className="mt-1.5 block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-950/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-900 transition-all duration-150 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Sign Up</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
