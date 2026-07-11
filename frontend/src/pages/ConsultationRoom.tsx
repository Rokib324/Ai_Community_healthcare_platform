import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Heart, Send, Star, AlertCircle, RefreshCw } from 'lucide-react';

interface Message {
  sender: string;
  message: string;
  time: string;
}

interface ConsultationDetails {
  id: number;
  consultation_date: string;
  status: string;
  diseaseinfo: {
    diseasename: string;
    confidence: number;
    symptoms: string[];
  } | null;
  doctor: {
    name: string;
    username: string;
    email: string;
    mobile_no: string;
    rating: number;
  } | null;
  patient: {
    name: string;
    username: string;
    email: string;
    mobile_no: string;
    age: number;
  } | null;
}

export const ConsultationRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // States
  const [details, setDetails] = useState<ConsultationDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals / forms state
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false);

  const fetchDetails = async () => {
    try {
      const response = await api.get(`/consultations/${id}/`);
      if (response.data.consultation) {
        setDetails(response.data.consultation);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load consultation details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/consultations/${id}/messages/`);
      if (response.data.messages) {
        setMessages(response.data.messages);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDetails();
  }, [id]);

  // Polling for messages
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [id]);

  // Auto-scroll to bottom of chats
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Please sign in to access consultation portals.
      </div>
    );
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const tempMsg = inputMsg;
    setInputMsg('');

    try {
      await api.post(`/consultations/${id}/messages/`, { message: tempMsg });
      fetchMessages();
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message.');
    }
  };

  const handleCloseConsultation = async () => {
    try {
      const response = await api.post(`/consultations/${id}/close/`);
      if (response.data.success) {
        setIsCloseConfirmOpen(false);
        fetchDetails();
      }
    } catch (err) {
      console.error(err);
      setError('Failed to close consultation.');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');
    setReviewLoading(true);

    try {
      const response = await api.post(`/consultations/${id}/review/`, { rating, review });
      if (response.data.success) {
        setReviewSuccess('Thank you for rating and reviewing your doctor!');
        setReview('');
        fetchDetails();
      } else {
        setReviewError(response.data.error || 'Failed to submit review.');
      }
    } catch (err: any) {
      setReviewError(err.response?.data?.error || 'An error occurred.');
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center gap-2 text-slate-500">
        <RefreshCw className="h-6 w-6 animate-spin text-sky-400" />
        <span>Syncing chat transcripts...</span>
      </div>
    );
  }

  if (error && !details) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-red-950/40 border border-red-900/50 rounded-2xl p-6 max-w-md text-center text-red-400">
          <AlertCircle className="h-10 w-10 mx-auto mb-4" />
          <p>{error}</p>
          <Link to="/consultations" className="mt-4 inline-block text-sky-400 underline text-sm">Return to consultation history</Link>
        </div>
      </div>
    );
  }

  const isActive = details?.status === 'active';

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Case details & Ratings */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Header Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex justify-between items-start gap-4 flex-wrap mb-4">
              <div>
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Consultation Portal</span>
                <h2 className="text-white font-extrabold text-xl mt-0.5">Case Log #{id}</h2>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}
              >
                <span className="capitalize">{details?.status}</span>
              </span>
            </div>

            {/* Diagnostic Data */}
            {details?.diseaseinfo && (
              <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 mt-4 space-y-3.5">
                <div>
                  <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">Condition Predicted</span>
                  <span className="text-sky-400 font-bold block text-base mt-0.5">{details.diseaseinfo.diseasename}</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider">Confidence Matrix</span>
                  <span className="text-emerald-400 font-bold block text-base mt-0.5">{details.diseaseinfo.confidence}%</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider block mb-1.5">Selected Symptoms</span>
                  <div className="flex flex-wrap gap-1.5">
                    {details.diseaseinfo.symptoms.map((sym) => (
                      <span key={sym} className="text-[10px] font-semibold px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 rounded-full">
                        {sym.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* User Info Cards */}
            <div className="grid grid-cols-2 gap-4 mt-6 border-t border-slate-800/80 pt-4">
              <div>
                <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider block">Patient</span>
                <span className="text-slate-200 font-bold text-sm block mt-0.5 truncate">{details?.patient?.name}</span>
                <span className="text-slate-500 text-xs block">Age: {details?.patient?.age}</span>
              </div>
              
              <div>
                <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-wider block">Consultant</span>
                <span className="text-slate-200 font-bold text-sm block mt-0.5 truncate">Dr. {details?.doctor?.name}</span>
                <span className="text-slate-500 text-xs flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current text-amber-500" />
                  <span>{details?.doctor?.rating}/5</span>
                </span>
              </div>
            </div>
          </div>

          {/* Close Consultation Controls */}
          {isActive && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h4 className="text-white font-bold text-sm">Consultation Management</h4>
              {!isCloseConfirmOpen ? (
                <button
                  onClick={() => setIsCloseConfirmOpen(true)}
                  className="w-full py-2.5 bg-red-950/20 hover:bg-red-900/30 border border-red-900/40 text-red-400 text-sm font-semibold rounded-xl transition-all"
                >
                  Close Consultation
                </button>
              ) : (
                <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 text-center">
                  <p className="text-slate-350 text-xs leading-relaxed mb-3">Are you sure you want to close this consultation session? This will lock the chat box.</p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={handleCloseConsultation}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Yes, Close
                    </button>
                    <button
                      onClick={() => setIsCloseConfirmOpen(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-750 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Review & Ratings Submission (Patients only, when closed/anytime) */}
          {user.is_patient && details?.doctor && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h4 className="text-white font-bold text-sm flex items-center gap-2">
                <Heart className="text-red-500 h-4 w-4 fill-current" />
                <span>Rate & Review Dr. {details.doctor.name}</span>
              </h4>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                {reviewSuccess && (
                  <div className="bg-emerald-950/40 border border-emerald-900/50 rounded-xl p-3 flex items-start gap-2.5 text-emerald-400 text-xs">
                    <span>{reviewSuccess}</span>
                  </div>
                )}

                {reviewError && (
                  <div className="bg-red-950/40 border border-red-900/50 rounded-xl p-3 flex items-start gap-2.5 text-red-400 text-xs">
                    <span>{reviewError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Rating (Out of 5)</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-24 px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Good</option>
                    <option value={3}>3 - Average</option>
                    <option value={2}>2 - Poor</option>
                    <option value={1}>1 - Terrible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Review Details</label>
                  <textarea
                    rows={4}
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    required
                    placeholder="Write a feedback about your consultation experience..."
                    className="block w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-650 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  {reviewLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
                  <span>Submit Review</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Chat Room Window */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden flex flex-col h-[75vh]">
          {/* Chat Header */}
          <div className="bg-slate-950 border-b border-slate-850/80 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm tracking-wide">Live Consultation Messenger</h3>
                <span className="text-xs text-slate-500">
                  {isActive ? 'Polled for new messages' : 'This conversation has concluded.'}
                </span>
              </div>
            </div>
          </div>

          {/* Messages Display */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/20">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                No messages sent yet. Start the conversation below.
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isMe = msg.sender === user.username;
                return (
                  <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-md border ${
                        isMe
                          ? 'bg-sky-650 text-white border-sky-600/50 rounded-br-none'
                          : 'bg-slate-900 text-slate-200 border-slate-800/80 rounded-bl-none'
                      }`}
                    >
                      <span className="text-[10px] text-slate-400 block font-semibold mb-1 uppercase tracking-wide">
                        {isMe ? 'You' : msg.sender}
                      </span>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed break-words">{msg.message}</p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Message Input Form */}
          <div className="bg-slate-950 border-t border-slate-850 px-6 py-4">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                type="text"
                disabled={!isActive}
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder={isActive ? "Type your message..." : "This chat is locked."}
                className="flex-1 px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!isActive || !inputMsg.trim()}
                className="px-4 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow-lg transition-all disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
