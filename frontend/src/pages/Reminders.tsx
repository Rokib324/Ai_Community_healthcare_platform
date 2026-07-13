import React, { useEffect, useState } from 'react';
import api from '../api';
import { Bell, Plus, Trash2, Calendar, Clock, ShieldAlert, CheckCircle2, AlertCircle, RefreshCw, Power } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MedicineReminderItem {
  id: number;
  medicine_name: string;
  dosage: string;
  frequency: string;
  times: string[];
  start_date: string;
  end_date: string;
  active: boolean;
}

export const Reminders: React.FC = () => {
  const { user } = useAuth();
  
  const [reminders, setReminders] = useState<MedicineReminderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('1 Tablet');
  const [frequency, setFrequency] = useState('Daily');
  const [start_date, setStartDate] = useState('');
  const [end_date, setEndDate] = useState('');
  
  // Custom list of daily times
  const [timesList, setTimesList] = useState<string[]>(['08:00 AM']);
  const [newTime, setNewTime] = useState('08:00');

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const fetchReminders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/reminders/');
      if (response.data.reminders) {
        setReminders(response.data.reminders);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to retrieve medicine reminders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleToggleReminder = async (id: number, currentActive: boolean) => {
    try {
      const response = await api.patch(`/reminders/${id}/`, { active: !currentActive });
      if (response.data.success) {
        setReminders(prev => 
          prev.map(rem => rem.id === id ? { ...rem, active: response.data.active } : rem)
        );
      }
    } catch (err) {
      console.error(err);
      alert('Failed to toggle reminder status.');
    }
  };

  const handleDeleteReminder = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this medicine reminder?')) return;
    
    try {
      const response = await api.delete(`/reminders/${id}/`);
      if (response.data.success) {
        setReminders(prev => prev.filter(rem => rem.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete reminder.');
    }
  };

  const handleAddTime = () => {
    if (!newTime) return;
    // Format to 12-hour AM/PM for easier reading
    const [hoursStr, minutesStr] = newTime.split(':');
    const hours = parseInt(hoursStr);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const dispHours = hours % 12 || 12;
    const formatted = `${dispHours.toString().padStart(2, '0')}:${minutesStr} ${ampm}`;
    
    if (!timesList.includes(formatted)) {
      setTimesList([...timesList, formatted]);
    }
  };

  const handleRemoveTime = (index: number) => {
    setTimesList(timesList.filter((_, i) => i !== index));
  };

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (timesList.length === 0) {
      setFormError('Please add at least one daily reminder time.');
      return;
    }
    
    setFormLoading(true);
    setFormError('');
    setFormSuccess('');

    try {
      const response = await api.post('/reminders/', {
        medicine_name: medicineName,
        dosage,
        frequency,
        times: timesList,
        start_date,
        end_date
      });
      if (response.data.success) {
        setFormSuccess('Medicine reminder active!');
        setMedicineName('');
        setStartDate('');
        setEndDate('');
        setTimesList(['08:00 AM']);
        fetchReminders();
        setTimeout(() => {
          setIsAddOpen(false);
          setFormSuccess('');
        }, 1500);
      }
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Failed to create medicine reminder.');
    } finally {
      setFormLoading(false);
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
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
              <Bell className="text-sky-400 h-8 w-8" />
              <span>Medicine Reminders</span>
            </h1>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">
              Set schedules, configure daily dose alerts, and manage your health prescriptions.
            </p>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="w-full sm:w-auto py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-sky-950/20"
          >
            <Plus className="h-4 w-4" />
            <span>Add Medication Reminder</span>
          </button>
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
            <span>Syncing reminder lists...</span>
          </div>
        ) : reminders.length === 0 ? (
          <div className="py-20 border-2 border-dashed border-slate-800 rounded-3xl text-center text-slate-500">
            <Bell className="h-12 w-12 mx-auto mb-4 text-slate-700" />
            <p className="font-semibold text-slate-400 text-sm">No active medicine reminders.</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Configure your daily medications and schedule using the button above to receive notifications.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reminders.map((rem) => (
              <div 
                key={rem.id} 
                className={`bg-slate-900 border rounded-2xl p-6 transition-all shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 ${
                  rem.active ? 'border-slate-800' : 'border-slate-850 opacity-60'
                }`}
              >
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-white font-bold text-lg">{rem.medicine_name}</h3>
                    <span className="px-2 py-0.5 bg-slate-950 border border-slate-850 rounded text-[10px] text-slate-400 font-bold">
                      {rem.dosage}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      <span>Frequency: <strong>{rem.frequency}</strong></span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-500" />
                      <span>Span: {rem.start_date} to {rem.end_date}</span>
                    </span>
                  </div>

                  {/* Daily times tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {rem.times.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 bg-sky-950/20 border border-sky-900/30 text-sky-400 rounded-md">
                        ⏰ {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions Panel */}
                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end pt-3 sm:pt-0 border-t sm:border-0 border-slate-800/60">
                  <button
                    onClick={() => handleToggleReminder(rem.id, rem.active)}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
                      rem.active 
                        ? 'bg-emerald-950/20 hover:bg-emerald-900/20 border-emerald-900/40 text-emerald-400' 
                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-400'
                    }`}
                    title={rem.active ? "Deactivate Reminder" : "Activate Reminder"}
                  >
                    <Power className="h-4 w-4" />
                    <span>{rem.active ? 'Active' : 'Disabled'}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteReminder(rem.id)}
                    className="p-2.5 bg-red-950/20 hover:bg-red-900/30 border border-red-900/40 text-red-400 hover:text-red-300 rounded-xl transition-all"
                    title="Delete Reminder"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Reminder Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200 text-slate-200">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>
            <h3 className="text-white font-bold text-xl mb-1">Set Medicine Reminder</h3>
            <p className="text-slate-450 text-xs mb-4">Add medication schedule details below.</p>

            <form onSubmit={handleCreateReminder} className="space-y-4">
              {formError && (
                <div className="bg-red-950/40 border border-red-900/50 rounded-xl p-3 flex items-start gap-2.5 text-red-400 text-xs">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="bg-emerald-950/40 border border-emerald-900/50 rounded-xl p-3 flex items-start gap-2.5 text-emerald-400 text-xs">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Medicine Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paracetamol, Cetirizine, Vitamin C"
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-slate-200 placeholder-slate-650"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Dosage</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 Tablet, 5 ml"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-slate-350"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Alternate Days">Alternate Days</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={start_date}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={end_date}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-slate-300"
                  />
                </div>
              </div>

              {/* Set Times list */}
              <div className="border border-slate-800 rounded-xl p-4 space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Daily Times (Alarms)</label>
                
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="flex-grow px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none text-slate-200"
                  />
                  <button
                    type="button"
                    onClick={handleAddTime}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-750 text-slate-200 text-xs font-bold rounded-xl"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-2">
                  {timesList.map((t, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 bg-slate-950 border border-slate-800 text-slate-300 rounded-lg"
                    >
                      <span>{t}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTime(idx)}
                        className="text-red-400 hover:text-red-300 font-bold"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-1.5"
              >
                {formLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
                <span>Activate Medication Alert</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
