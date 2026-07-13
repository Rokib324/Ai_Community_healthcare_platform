import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { MapPin, Phone, ShieldAlert, CheckCircle2, Calendar, RefreshCw, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Provider {
  id: number;
  name: string;
  provider_type: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  mobile_no: string;
  services: string[];
  rating: number;
}

export const FindProviders: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  
  // Booking Form State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSlot, setBookingSlot] = useState('09:00 AM');
  const [bookingReason, setBookingReason] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/providers/', {
        params: {
          type: selectedType,
          q: searchQuery
        }
      });
      if (response.data.providers) {
        setProviders(response.data.providers);
      }
    } catch (err) {
      console.error("Error fetching providers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, [selectedType, searchQuery]);

  const handleOpenBooking = (provider: Provider) => {
    if (!user) {
      navigate('/signin');
      return;
    }
    setSelectedProvider(provider);
    setIsBookingOpen(true);
    setBookingSuccess(false);
    setBookingError('');
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProvider) return;
    
    setBookingLoading(true);
    setBookingError('');
    try {
      const response = await api.post('/appointments/', {
        provider_id: selectedProvider.id,
        appointment_date: bookingDate,
        time_slot: bookingSlot,
        reasons: bookingReason
      });
      if (response.data.success) {
        setBookingSuccess(true);
        setBookingReason('');
        setBookingDate('');
        setTimeout(() => {
          setIsBookingOpen(false);
          setBookingSuccess(false);
          navigate('/appointments');
        }, 2000);
      }
    } catch (err: any) {
      setBookingError(err.response?.data?.error || 'Failed to book appointment.');
    } finally {
      setBookingLoading(false);
    }
  };

  // Helper to color map node based on provider type
  const getNodeColor = (type: string, isSelected: boolean) => {
    if (isSelected) return '#38bdf8'; // sky-400
    switch (type) {
      case 'hospital': return '#f43f5e'; // rose-500
      case 'clinic': return '#10b981'; // emerald-500
      case 'pharmacy': return '#f59e0b'; // amber-500
      default: return '#a855f7'; // purple-500
    }
  };

  return (
    <div className="min-h-screen bg-slate-955 py-12 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-white">Healthcare Providers Directory</h1>
          <p className="text-slate-400 mt-1">Find nearby hospitals, clinics, pharmacies, and book appointments instantly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Filters & Directory List (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-grow">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by facility name or address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  />
                </div>
                {/* Type Filter */}
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-slate-300"
                >
                  <option value="">All Categories</option>
                  <option value="hospital">Hospitals</option>
                  <option value="clinic">Clinics</option>
                  <option value="pharmacy">Pharmacies</option>
                  <option value="diagnostic">Diagnostic Centers</option>
                </select>
              </div>

              {/* Providers count */}
              <div className="text-xs font-semibold text-slate-450 uppercase tracking-wide">
                Found {providers.length} Facilities
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center text-slate-500 flex justify-center items-center gap-2">
                <RefreshCw className="h-6 w-6 animate-spin text-sky-400" />
                <span>Locating providers...</span>
              </div>
            ) : providers.length === 0 ? (
              <div className="py-20 border-2 border-dashed border-slate-800 rounded-3xl text-center text-slate-500">
                No healthcare providers found matching your search.
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {providers.map((p) => {
                  const isSelected = selectedProvider?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProvider(p)}
                      className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                        isSelected 
                          ? 'bg-slate-900 border-sky-500/70 shadow-lg shadow-sky-950/10' 
                          : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-2 border ${
                            p.provider_type === 'hospital' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                            p.provider_type === 'clinic' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            p.provider_type === 'pharmacy' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          }`}>
                            {p.provider_type}
                          </span>
                          <h3 className="text-white font-bold text-lg">{p.name}</h3>
                          <p className="text-slate-400 text-sm flex items-center gap-1.5 mt-1.5">
                            <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
                            <span>{p.address}</span>
                          </p>
                          <p className="text-slate-400 text-sm flex items-center gap-1.5 mt-1">
                            <Phone className="h-4 w-4 text-slate-500 shrink-0" />
                            <span>{p.mobile_no}</span>
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-amber-400 font-bold text-sm">
                            ★ {p.rating}
                          </span>
                        </div>
                      </div>

                      {/* Services list */}
                      <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-800/60">
                        {p.services.map((srv, idx) => (
                          <span key={idx} className="text-[10px] font-medium px-2 py-0.5 bg-slate-950/80 border border-slate-850 text-slate-400 rounded-md">
                            {srv}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenBooking(p);
                          }}
                          className="flex-grow py-2 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Book Online Appointment</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Interactive Map Section (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="text-white font-bold text-lg">Interactive Area Map</h2>
            <p className="text-slate-450 text-xs leading-relaxed">
              Visualize nearby community centers. Click on map markers (colored dots) to select a provider facility.
            </p>

            {/* Simulated Map using SVG */}
            <div className="relative w-full aspect-square bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden shadow-inner">
              <svg className="w-full h-full" viewBox="0 0 400 400">
                {/* Background Grid Gridlines */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Simulated roads / landscape lines */}
                <path d="M 0,100 L 400,100 M 0,300 L 400,300 M 150,0 L 150,400 M 300,0 L 300,400" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
                <path d="M 0,100 L 400,100 M 0,300 L 400,300 M 150,0 L 150,400 M 300,0 L 300,400" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

                {/* Patient home marker */}
                <circle cx="200" cy="200" r="10" fill="#38bdf8" fillOpacity="0.2" className="animate-ping" />
                <circle cx="200" cy="200" r="6" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
                <text x="212" y="204" fill="#38bdf8" fontSize="10" fontWeight="bold">You (Center)</text>

                {/* Facilities map nodes */}
                {providers.map((p) => {
                  // Map coordinates from real lat/long offset from home (23.8103, 90.4125)
                  const latOffset = p.latitude ? (p.latitude - 23.8103) * 5000 : 0;
                  const lngOffset = p.longitude ? (p.longitude - 90.4125) * 5000 : 0;
                  
                  // Keep coordinates within bounds [50, 350]
                  const cx = Math.max(50, Math.min(350, 200 + lngOffset));
                  const cy = Math.max(50, Math.min(350, 200 - latOffset)); // Y decreases going up

                  const isSelected = selectedProvider?.id === p.id;
                  const color = getNodeColor(p.provider_type, isSelected);

                  return (
                    <g 
                      key={p.id} 
                      className="cursor-pointer group"
                      onClick={() => setSelectedProvider(p)}
                    >
                      {/* Pulse ring if selected */}
                      {isSelected && (
                        <circle cx={cx} cy={cy} r="18" fill="none" stroke={color} strokeWidth="1.5" className="animate-pulse" />
                      )}
                      
                      {/* Interactive dot */}
                      <circle 
                        cx={cx} 
                        cy={cy} 
                        r={isSelected ? 10 : 7} 
                        fill={color} 
                        stroke="#ffffff" 
                        strokeWidth="1.5"
                        className="transition-all duration-300 group-hover:scale-125"
                      />
                      
                      {/* Tiny tooltip label */}
                      <text
                        x={cx}
                        y={cy - 14}
                        textAnchor="middle"
                        fill={isSelected ? '#38bdf8' : '#cbd5e1'}
                        fontSize="9"
                        fontWeight="bold"
                        className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-950"
                      >
                        {p.name}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Mini Legend Overlay */}
              <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg space-y-1.5 text-[9px] font-semibold text-slate-350">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#f43f5e]"></span>
                  <span>Hospitals</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                  <span>Clinics</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span>
                  <span>Pharmacies</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#a855f7]"></span>
                  <span>Diagnostic Centers</span>
                </div>
              </div>
            </div>

            {/* Selected Faclity Panel */}
            {selectedProvider ? (
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="text-white font-bold text-sm">{selectedProvider.name}</h4>
                  <span className="text-xs text-slate-400 capitalize">{selectedProvider.provider_type}</span>
                </div>
                <p className="text-xs text-slate-400">{selectedProvider.address}</p>
                <div className="flex flex-wrap gap-1 text-[9px] text-sky-400">
                  {selectedProvider.services.slice(0, 3).map((s, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-sky-950/20 border border-sky-900/30 rounded">{s}</span>
                  ))}
                  {selectedProvider.services.length > 3 && <span>+{selectedProvider.services.length - 3} more</span>}
                </div>
                <button
                  onClick={() => handleOpenBooking(selectedProvider)}
                  className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-lg transition-all"
                >
                  Book Appointment Now
                </button>
              </div>
            ) : (
              <div className="p-4 border border-dashed border-slate-800 rounded-2xl text-center text-xs text-slate-500">
                Click a facility card or map marker to view detailed actions.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Appointment Booking Modal */}
      {isBookingOpen && selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200 text-slate-200">
            <button
              onClick={() => setIsBookingOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>
            <h3 className="text-white font-bold text-xl mb-1">Book Online Appointment</h3>
            <p className="text-slate-450 text-xs mb-4">Scheduling visit at <strong>{selectedProvider.name}</strong></p>

            <form onSubmit={handleBookAppointment} className="space-y-4">
              {bookingError && (
                <div className="bg-red-950/40 border border-red-900/50 rounded-xl p-3 flex items-start gap-2.5 text-red-400 text-xs">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{bookingError}</span>
                </div>
              )}

              {bookingSuccess ? (
                <div className="bg-emerald-950/40 border border-emerald-900/50 rounded-xl p-5 text-center text-emerald-400 space-y-2">
                  <CheckCircle2 className="h-8 w-8 mx-auto" />
                  <h4 className="font-bold text-sm">Appointment Reserved!</h4>
                  <p className="text-xs text-slate-400">Redirecting to your scheduled list...</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Preferred Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-slate-350"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Available Time Slot</label>
                    <select
                      value={bookingSlot}
                      onChange={(e) => setBookingSlot(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-slate-300"
                    >
                      <option value="09:00 AM">09:00 AM - Morning</option>
                      <option value="10:30 AM">10:30 AM - Morning</option>
                      <option value="11:30 AM">11:30 AM - Morning</option>
                      <option value="02:00 PM">02:00 PM - Afternoon</option>
                      <option value="03:30 PM">03:30 PM - Afternoon</option>
                      <option value="06:00 PM">06:00 PM - Evening</option>
                      <option value="07:30 PM">07:30 PM - Evening</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Reason for Visit</label>
                    <textarea
                      required
                      rows={3}
                      value={bookingReason}
                      onChange={(e) => setBookingReason(e.target.value)}
                      placeholder="E.g., consultation for high fever, diagnostic blood sample submission, physical checkup..."
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-slate-300"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    {bookingLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
                    <span>Confirm Booking</span>
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
