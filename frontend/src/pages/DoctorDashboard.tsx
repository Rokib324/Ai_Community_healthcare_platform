import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { User, FileText, Star, MessageSquare, AlertCircle, Edit3, X, Phone, Mail, Award, CheckCircle2, RefreshCw } from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
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
  const [regNo, setRegNo] = useState(user?.registration_no || '');
  const [yor, setYor] = useState(user?.dob || ''); // using dob as placeholder if yor is empty
  const [qualification, setQualification] = useState(user?.qualification || '');
  const [council, setCouncil] = useState(user?.State_Medical_Council || '');
  const [specialization, setSpecialization] = useState(user?.specialization || '');

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
      const response = await api.post(`/profiles/doctor/${user.username}/`, {
        name,
        dob,
        gender,
        address,
        mobile_no: mobile,
        registration_no: regNo,
        year_of_registration: yor || dob,
        qualification,
        State_Medical_Council: council,
        specialization
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
          <h1 className="text-3xl font-extrabold text-white">Doctor Dashboard</h1>
          <p className="text-slate-400 mt-1">Manage professional credentials, patient consultation lines, and ratings.</p>
        </div>

        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-emerald-950 flex items-center justify-center text-emerald-400 border border-emerald-850 mb-4 shadow-inner">
              <User className="h-12 w-12" />
            </div>
            <h3 className="text-white font-bold text-lg text-center">Dr. {user.name || user.username}</h3>
            <span className="text-emerald-400 text-xs font-semibold px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 mt-1.5">{user.specialization}</span>
            <span className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold mt-1">NPI/Reg No: {user.registration_no}</span>
            
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
                <Award className="h-4 w-4 text-slate-500 shrink-0" />
                <span>{user.qualification} ({user.State_Medical_Council})</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500 shrink-0" />
                <span className="text-slate-300 font-semibold">{user.rating || 0}/5 Rating</span>
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
              
              <div className="grid grid-cols-1 gap-4">
                <Link
                  to="/consultations"
                  className="p-5 bg-emerald-950/20 hover:bg-emerald-950/30 border border-emerald-900/40 hover:border-emerald-800 rounded-2xl flex items-center justify-between group transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h5 className="text-white font-semibold group-hover:text-emerald-300 transition-colors">Consultations Lines</h5>
                      <p className="text-slate-400 text-xs mt-0.5">Manage patient cases, logs, and ongoing messaging.</p>
                    </div>
                  </div>
                  <span className="text-sky-400 text-xs font-semibold group-hover:translate-x-0.5 transition-transform">View Cases &rarr;</span>
                </Link>

                <button
                  onClick={() => setIsFeedbackOpen(true)}
                  className="w-full py-4 bg-slate-850 hover:bg-slate-805 border border-slate-750 text-slate-300 font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="h-5 w-5 text-emerald-400" />
                  <span>Give Feedback to Admin</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[90vh] relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsEditOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-white font-bold text-xl mb-4">Edit Professional Profile</h3>

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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1.5 block w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Mobile No</label>
                  <input
                    type="text"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="mt-1.5 block w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Registration No</label>
                  <input
                    type="text"
                    required
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    className="mt-1.5 block w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Year of Registration</label>
                  <input
                    type="date"
                    required
                    value={yor}
                    onChange={(e) => setYor(e.target.value)}
                    className="mt-1.5 block w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Qualification</label>
                  <input
                    type="text"
                    required
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="mt-1.5 block w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">State Medical Council</label>
                  <input
                    type="text"
                    required
                    value={council}
                    onChange={(e) => setCouncil(e.target.value)}
                    className="mt-1.5 block w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="mt-1.5 block w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="mt-1.5 block w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-sm"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Specialization</label>
                  <select
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="mt-1.5 block w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-350 focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-sm"
                  >
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

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide">Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1.5 block w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-1.5 mt-4"
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
                  placeholder="Tell the administration about any feedback or suggestions..."
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
