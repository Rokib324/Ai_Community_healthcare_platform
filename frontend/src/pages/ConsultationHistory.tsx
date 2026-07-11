import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { FileText, Calendar, ArrowRight, User, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

interface ConsultationItem {
  id: number;
  consultation_date: string;
  status: string;
  diseasename: string;
  doctor_name: string;
  patient_name: string;
}

export const ConsultationHistory: React.FC = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<ConsultationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/consultations/');
      if (response.data.consultations) {
        setConsultations(response.data.consultations);
      } else {
        setError('Could not retrieve consultation history.');
      }
    } catch (err) {
      console.error(err);
      setError('Error loading consultations. Make sure you are authenticated.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchConsultations();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Please sign in to view your consultation history.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
              <FileText className="text-sky-400 h-8 w-8" />
              <span>Consultation History</span>
            </h1>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">
              Review your previous diagnoses, active consultation chats, and doctor references.
            </p>
          </div>
          <button
            onClick={fetchConsultations}
            className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
            disabled={loading}
          >
            {loading ? <RefreshCw className="h-3 w-3 animate-spin" /> : null}
            <span>Refresh History</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-900/50 rounded-2xl p-4 flex items-start gap-3 text-red-400 text-sm mb-6">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Listings */}
        {loading ? (
          <div className="py-20 text-center text-slate-500 flex justify-center items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin text-sky-400" />
            <span>Loading history logs...</span>
          </div>
        ) : consultations.length === 0 ? (
          <div className="py-20 border-2 border-dashed border-slate-800 rounded-3xl text-center text-slate-500">
            No consultations recorded yet.
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden divide-y divide-slate-800/60">
            {consultations.map((c) => (
              <div
                key={c.id}
                className="p-6 hover:bg-slate-850/20 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{c.consultation_date}</span>
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        c.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-950 text-slate-500 border-slate-800'
                      }`}
                    >
                      <CheckCircle className="h-3 w-3" />
                      <span className="capitalize">{c.status}</span>
                    </span>
                  </div>

                  <h3 className="text-white font-bold text-lg tracking-wide">{c.diseasename}</h3>
                  
                  <p className="text-slate-400 text-xs flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-500" />
                    <span>
                      {user.is_patient
                        ? `Consulting Dr. ${c.doctor_name}`
                        : `Patient: ${c.patient_name}`}
                    </span>
                  </p>
                </div>

                <Link
                  to={`/consultation/${c.id}`}
                  className="w-full sm:w-auto py-2.5 px-5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-sky-400 hover:text-sky-300 text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-slate-950 hover:scale-[1.01] transition-all duration-200 shrink-0"
                >
                  <span>{c.status === 'active' ? 'Enter Chat Room' : 'View Details'}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
