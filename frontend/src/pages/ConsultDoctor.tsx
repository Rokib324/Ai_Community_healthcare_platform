import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { User, Star, Award, Mail, Phone, MapPin, AlertCircle, RefreshCw, Activity, ArrowRight } from 'lucide-react';

interface DoctorItem {
  username: string;
  name: string;
  specialization: string;
  qualification: string;
  rating: number;
  mobile_no: string;
  address: string;
  gender: string;
  email: string;
}

export const ConsultDoctor: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve recommended specialization if passed from symptom checker
  const defaultSpec = location.state?.specialization || '';

  // States
  const [specialization, setSpecialization] = useState(defaultSpec);
  const [doctors, setDoctors] = useState<DoctorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [consultLoading, setConsultLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params: any = {};
      if (specialization) {
        params.specialization = specialization;
      }

      const response = await api.get('/doctors/', { params });
      if (response.data.doctors) {
        setDoctors(response.data.doctors);
      } else {
        setError('Could not retrieve doctors.');
      }
    } catch (err) {
      console.error(err);
      setError('Error loading doctors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [specialization]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Please sign in to access consultation portals.
      </div>
    );
  }

  const handleStartConsultation = async (docUsername: string) => {
    if (!user.is_patient) {
      alert('Only patients can initiate consultations.');
      return;
    }

    setConsultLoading(docUsername);
    setError('');

    try {
      const response = await api.post('/consultations/', { doctor_username: docUsername });
      if (response.data.success && response.data.consultation_id) {
        navigate(`/consultation/${response.data.consultation_id}`);
      } else {
        setError(response.data.error || 'Failed to start consultation.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred. Make sure you have symptom checker predictions in your current session.');
    } finally {
      setConsultLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center sm:text-left mb-10">
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Activity className="text-sky-400 h-8 w-8" />
            <span>Consult a Doctor</span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">
            Select a specialist below to open an interactive consultation room and resolve your concerns.
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-8">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Filter Specialization</label>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="px-4 py-2 bg-slate-950 border border-slate-850 rounded-xl text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            >
              <option value="">All Specialists</option>
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
          {defaultSpec && (
            <div className="text-xs text-sky-400 bg-sky-950/20 border border-sky-900/40 rounded-xl px-4 py-2">
              Recommended: <strong>{defaultSpec}</strong> (matched to symptoms)
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-900/50 rounded-2xl p-4 flex items-start gap-3 text-red-400 text-sm mb-6 max-w-2xl">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Doctors Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-500 flex justify-center items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin text-sky-400" />
            <span>Loading medical team...</span>
          </div>
        ) : doctors.length === 0 ? (
          <div className="py-20 border-2 border-dashed border-slate-800 rounded-3xl text-center text-slate-500">
            No doctors found for the selected specialization.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <div
                key={doc.username}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-6 flex flex-col justify-between shadow-xl transition-all duration-300 relative group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-sky-950 flex items-center justify-center text-sky-400 border border-sky-850">
                      <User className="h-6 w-6" />
                    </div>
                    
                    <div className="flex items-center gap-1 text-amber-400 bg-amber-950/20 border border-amber-900/40 rounded-xl px-2 py-1 text-xs font-semibold">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{doc.rating || 0}/5</span>
                    </div>
                  </div>

                  <h3 className="text-white font-bold text-lg">Dr. {doc.name}</h3>
                  <span className="inline-block text-xs font-semibold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 mt-1">
                    {doc.specialization}
                  </span>

                  <div className="mt-6 space-y-2.5 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
                    <div className="flex items-center gap-2">
                      <Award className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span>{doc.qualification}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{doc.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span>{doc.mobile_no}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{doc.address}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/40">
                  <button
                    onClick={() => handleStartConsultation(doc.username)}
                    disabled={consultLoading !== null}
                    className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-sky-950/30 group-hover:scale-[1.01] transition-all"
                  >
                    {consultLoading === doc.username ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <span>Consult Now</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
