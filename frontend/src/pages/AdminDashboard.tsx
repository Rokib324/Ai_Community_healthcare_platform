import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { User, Shield, ExternalLink, Calendar, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';

interface FeedbackItem {
  id: number;
  feedback: string;
  sender: string;
  created: string;
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/feedbacks/');
      if (response.data.feedbacks) {
        setFeedbacks(response.data.feedbacks);
      } else {
        setError('Could not retrieve feedbacks.');
      }
    } catch (err) {
      console.error(err);
      setError('Error loading feedbacks. Make sure you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.is_superuser) {
      fetchFeedbacks();
    }
  }, [user]);

  if (!user || !user.is_superuser) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Access Denied. Admins only.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
              <Shield className="text-sky-400 h-8 w-8" />
              <span>Admin Control Panel</span>
            </h1>
            <p className="text-slate-400 mt-1">Hello, {user.username}. Monitor user activities and feedback loops.</p>
          </div>
          <a
            href="/admin/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-sky-950/20"
          >
            <span>Manage User Data</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Feedbacks Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-800/80 flex justify-between items-center">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <MessageSquare className="text-emerald-400 h-5 w-5" />
                <span>User Feedbacks</span>
              </h3>
              <button
                onClick={fetchFeedbacks}
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
                disabled={loading}
              >
                {loading ? <RefreshCw className="h-3 w-3 animate-spin" /> : null}
                <span>Refresh</span>
              </button>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-500 flex justify-center items-center gap-2">
                <RefreshCw className="h-5 w-5 animate-spin text-sky-400" />
                <span>Loading feedbacks...</span>
              </div>
            ) : error ? (
              <div className="p-12 text-center text-red-400 flex justify-center items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                No feedbacks submitted yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60 max-h-[500px] overflow-y-auto">
                {feedbacks.map((fb) => (
                  <div key={fb.id} className="p-6 hover:bg-slate-850/20 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-sky-500/10 text-sky-400 rounded-full border border-sky-500/20">
                        <User className="h-3 w-3" />
                        <span>Sender: {fb.sender}</span>
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{fb.created}</span>
                      </span>
                    </div>
                    <p className="text-slate-350 text-sm leading-relaxed whitespace-pre-wrap">{fb.feedback}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
