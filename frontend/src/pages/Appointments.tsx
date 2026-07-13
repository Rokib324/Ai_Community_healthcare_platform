import React, { useEffect, useState } from 'react';
import api from '../api';
import { Calendar, Clock, MapPin, AlertCircle, RefreshCw, XCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AppointmentItem {
  id: number;
  patient_name: string;
  provider_name: string;
  provider_address: string;
  provider_type: string;
  doctor_name: string | null;
  appointment_date: string;
  time_slot: string;
  status: string;
  reasons: string;
}

export const Appointments: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/appointments/');
      if (response.data.appointments) {
        setAppointments(response.data.appointments);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (appId: number) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    
    setCancelingId(appId);
    try {
      const response = await api.post(`/appointments/${appId}/cancel/`);
      if (response.data.success) {
        // Refresh local items
        setAppointments(prev => 
          prev.map(app => app.id === appId ? { ...app, status: 'cancelled' } : app)
        );
      }
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to cancel appointment');
    } finally {
      setCancelingId(null);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Please sign in to view this page.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-955 py-12 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-white">Your Appointments</h1>
          <p className="text-slate-400 mt-1">Check scheduled slots and manage your online facility bookings.</p>
        </div>

        {error && (
          <div className="bg-red-950/40 border border-red-900/50 rounded-2xl p-4 flex items-start gap-3 text-red-400 text-sm mb-6">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-slate-500 flex justify-center items-center gap-2">
            <RefreshCw className="h-6 w-6 animate-spin text-sky-400" />
            <span>Syncing appointments...</span>
          </div>
        ) : appointments.length === 0 ? (
          <div className="py-20 border-2 border-dashed border-slate-800 rounded-3xl text-center text-slate-500 space-y-3">
            <p>You have no scheduled appointments at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((app) => (
              <div 
                key={app.id} 
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-750 transition-all shadow-xl"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-semibold text-sky-400 uppercase tracking-wider block">Facility Booking</span>
                    <h3 className="text-white font-bold text-lg">{app.provider_name}</h3>
                    <p className="text-slate-450 text-xs flex items-center gap-1 mt-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" />
                      <span>{app.provider_address}</span>
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
                    app.status === 'scheduled' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' :
                    app.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {app.status === 'scheduled' ? <Calendar className="h-3 w-3" /> :
                     app.status === 'completed' ? <CheckCircle className="h-3 w-3" /> :
                     <XCircle className="h-3 w-3" />}
                    <span className="capitalize">{app.status}</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2 text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Date</span>
                      <span className="font-semibold">{app.appointment_date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                    <Clock className="h-4 w-4 text-slate-500" />
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Time Slot</span>
                      <span className="font-semibold">{app.time_slot}</span>
                    </div>
                  </div>
                  {app.doctor_name && (
                    <div className="flex items-center gap-2 text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-850">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 uppercase shrink-0">
                        {app.doctor_name.slice(0, 2)}
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Doctor</span>
                        <span className="font-semibold">Dr. {app.doctor_name}</span>
                      </div>
                    </div>
                  )}
                </div>

                {app.reasons && (
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850/80 mb-4">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Reason for Booking</span>
                    <p className="text-slate-300 text-xs leading-relaxed">{app.reasons}</p>
                  </div>
                )}

                {app.status === 'scheduled' && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => handleCancelAppointment(app.id)}
                      disabled={cancelingId === app.id}
                      className="px-4 py-2 bg-red-950/30 hover:bg-red-900/30 border border-red-900/50 text-red-400 hover:text-red-300 text-xs font-semibold rounded-xl transition-all flex items-center gap-1"
                    >
                      {cancelingId === app.id ? <RefreshCw className="h-3 w-3 animate-spin" /> : null}
                      <span>Cancel Appointment</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
