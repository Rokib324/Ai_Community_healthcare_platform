import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { User, Clipboard, MessageSquare, AlertCircle, Edit3, X, Calendar, MapPin, Phone, Mail, FileText, CheckCircle2, RefreshCw } from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const { user, refresh } = useAuth();
  
  // Modals state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Edit fields
  const [name, setName] = useState(user?.name || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [gender, setGender] = useState(user?.gender || 'Male');
  const [address, setAddress] = useState(user?.address || '');
  const [mobile, setMobile] = useState(user?.mobile_no || '');

  // Feedback fields
  const [feedback, setFeedback] = useState('');

  // Status states
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [fbError, setFbError] = useState('');
  const [fbSuccess, setFbSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Please sign in to view this page.
      </div>
    );
  }

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');
    setLoading(true);

    try {
      const response = await api.post(`/profiles/patient/${user.username}/`, {
        name,
        dob,
        gender,
        address,
        mobile_no: mobile
      });
      if (response.data.success) {
        setEditSuccess('Profile updated successfully!');
        await refresh();
        setTimeout(() => {
          setIsEditOpen(false);
          setEditSuccess('');
        }, 1500);
      } else {
        setEditError(response.data.error || 'Failed to update profile.');
      }
    } catch (err: any) {
      setEditError(err.response?.data?.error || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setFbError('');
    setFbSuccess('');

    if (!feedback.trim()) {
      setFbError('Please enter a feedback message.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/feedbacks/', { feedback });
      if (response.data.success) {
        setFbSuccess('Feedback successfully sent! Thank you.');
        setFeedback('');
        setTimeout(() => {
          setIsFeedbackOpen(false);
          setFbSuccess('');
        }, 2000);
      } else {
        setFbError(response.data.error || 'Failed to submit feedback.');
      }
    } catch (err: any) {
      setFbError(err.response?.data?.error || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-white">Patient Dashboard</h1>
          <p className="text-slate-400 mt-1">Manage your health profile, predict diseases, and view consultations.</p>
        </div>

        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-sky-950 flex items-center justify-center text-sky-400 border border-sky-850 mb-4 shadow-inner">
              <User className="h-12 w-12" />
            </div>
            <h3 className="text-white font-bold text-lg text-center">{user.name || user.username}</h3>
            <span className="text-slate-500 text-xs uppercase tracking-wider font-semibold mt-1">Patient ID: {user.username}</span>
            
            <div className="w-full border-t border-slate-800/80 my-6 pt-4 space-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-500 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-500 shrink-0" />
                <span>{user.mobile_no || 'No mobile listed'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500 shrink-0" />
                <span>{user.dob || 'DOB not provided'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
                <span className="truncate">{user.address || 'No address listed'}</span>
              </div>
            </div>

            <button
              onClick={() => setIsEditOpen(true)}
              className="mt-auto w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700/80 border border-slate-750 text-slate-200 text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h4 className="text-white font-bold text-lg">Quick Actions</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  to="/check-disease"
                  className="p-5 bg-sky-950/20 hover:bg-sky-950/30 border border-sky-900/40 hover:border-sky-800 rounded-2xl flex flex-col justify-between h-36 group transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20 group-hover:scale-105 transition-transform duration-200">
                    <Clipboard className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-white font-semibold group-hover:text-sky-300 transition-colors">Check Symptoms</h5>
                    <p className="text-slate-400 text-xs mt-1">Predict possible disease conditions using our ML engine.</p>
                  </div>
                </Link>

                <Link
                  to="/consultations"
                  className="p-5 bg-emerald-950/20 hover:bg-emerald-950/30 border border-emerald-900/40 hover:border-emerald-800 rounded-2xl flex flex-col justify-between h-36 group transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="text-white font-semibold group-hover:text-emerald-300 transition-colors">Consultations</h5>
                    <p className="text-slate-400 text-xs mt-1">View previous predictions and consult doctor history.</p>
                  </div>
                </Link>
              </div>

              <button
                onClick={() => setIsFeedbackOpen(true)}
                className="w-full py-3.5 bg-slate-800/50 hover:bg-slate-800 border border-slate-750 text-slate-300 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="h-5 w-5 text-sky-400" />
                <span>Give Platform Feedback</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsEditOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-white font-bold text-xl mb-4">Edit Profile</h3>

            <form onSubmit={handleEditProfile} className="space-y-4">
              {editError && (
                <div className="bg-red-950/40 border border-red-900/50 rounded-xl p-3 flex items-start gap-2.5 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{editError}</span>
                </div>
              )}

              {editSuccess && (
                <div className="bg-emerald-950/40 border border-emerald-900/50 rounded-xl p-3 flex items-start gap-2.5 text-emerald-400 text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{editSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Mobile No</label>
                <input
                  type="text"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="mt-1.5 block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="mt-1.5 block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="mt-1.5 block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-sm"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1.5 block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-1.5"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
                <span>Save Changes</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsFeedbackOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-white font-bold text-xl mb-4">Send Feedback</h3>

            <form onSubmit={handleFeedback} className="space-y-4">
              {fbError && (
                <div className="bg-red-950/40 border border-red-900/50 rounded-xl p-3 flex items-start gap-2.5 text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{fbError}</span>
                </div>
              )}

              {fbSuccess && (
                <div className="bg-emerald-950/40 border border-emerald-900/50 rounded-xl p-3 flex items-start gap-2.5 text-emerald-400 text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{fbSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Feedback Message</label>
                <textarea
                  rows={5}
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-sm"
                  placeholder="Tell us what you think of the platform..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-1.5"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
                <span>Submit Feedback</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
