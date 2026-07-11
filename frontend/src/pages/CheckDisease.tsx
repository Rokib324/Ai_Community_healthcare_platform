import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, Trash2, ShieldAlert, AlertCircle, RefreshCw, Sparkles, Heart, SearchCheck, CheckCircle } from 'lucide-react';

export const CheckDisease: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Symptoms lists
  const [allSymptoms, setAllSymptoms] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  // Prediction states
  const [predictedDisease, setPredictedDisease] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [consultDoctor, setConsultDoctor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [symptomsLoading, setSymptomsLoading] = useState(true);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await api.get('/symptoms/');
        if (response.data.symptoms) {
          setAllSymptoms(response.data.symptoms);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load symptoms list.');
      } finally {
        setSymptomsLoading(false);
      }
    };
    fetchSymptoms();
  }, []);

  if (!user || !user.is_patient) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Access Denied. Only patient accounts can access the symptom checker.
      </div>
    );
  }

  const handleAddSymptom = (symptom: string) => {
    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
    setSearchTerm('');
  };

  const handleRemoveSymptom = (symptom: string) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
  };

  const handlePredict = async () => {
    if (selectedSymptoms.length === 0) {
      alert('Please add at least one symptom.');
      return;
    }

    setLoading(true);
    setError('');
    setPredictedDisease('');

    try {
      const response = await api.post('/predict/', { symptoms: selectedSymptoms });
      if (response.data.success) {
        setPredictedDisease(response.data.predicteddisease);
        setConfidence(response.data.confidencescore);
        setConsultDoctor(response.data.consultdoctor);

        // Scroll to results
        setTimeout(() => {
          document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        setError(response.data.error || 'Prediction failed.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred during prediction.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSymptoms = allSymptoms.filter(
    (s) =>
      s.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedSymptoms.includes(s)
  );

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-2">
            <Sparkles className="text-sky-400 h-8 w-8 animate-pulse" />
            <span>Symptom Checker</span>
          </h1>
          <p className="text-slate-400 mt-2 max-w-xl mx-auto text-sm sm:text-base">
            Identify potential medical conditions by selecting symptoms. Connect directly with recommended specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Column: Symptom Input */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <h3 className="text-white font-bold text-lg">Add Symptoms</h3>

            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search symptoms (e.g. fever, headache)..."
                className="block w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              />
            </div>

            {/* Search Results Dropdown */}
            {searchTerm && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl max-h-48 overflow-y-auto divide-y divide-slate-900 shadow-2xl">
                {filteredSymptoms.length === 0 ? (
                  <div className="p-3 text-slate-500 text-xs text-center">No matching symptoms found</div>
                ) : (
                  filteredSymptoms.map((sym) => (
                    <button
                      key={sym}
                      onClick={() => handleAddSymptom(sym)}
                      className="w-full text-left p-3 hover:bg-slate-900 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-between"
                    >
                      <span>{sym.replace(/_/g, ' ')}</span>
                      <Plus className="h-3 w-3 text-sky-400" />
                    </button>
                  ))
                )}
              </div>
            )}

            {/* Loading Indicator */}
            {symptomsLoading && (
              <div className="py-4 text-center text-slate-500 flex justify-center items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin text-sky-400" />
                <span>Loading symptoms catalog...</span>
              </div>
            )}

            {/* Selected Symptoms Box */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-slate-400 font-semibold text-xs uppercase tracking-wide">Selected Symptoms ({selectedSymptoms.length})</h4>
                {selectedSymptoms.length > 0 && (
                  <button
                    onClick={() => setSelectedSymptoms([])}
                    className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              {selectedSymptoms.length === 0 ? (
                <div className="border-2 border-dashed border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
                  Select symptoms from the search bar above to begin prediction.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                  {selectedSymptoms.map((sym) => (
                    <span
                      key={sym}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-sky-950/40 text-sky-300 border border-sky-900/50"
                    >
                      <span>{sym.replace(/_/g, ' ')}</span>
                      <button
                        onClick={() => handleRemoveSymptom(sym)}
                        className="hover:text-red-400 p-0.5 rounded-full hover:bg-slate-850"
                      >
                        <Plus className="h-3.5 w-3.5 rotate-45" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Predict Button */}
            <button
              onClick={handlePredict}
              disabled={loading || selectedSymptoms.length === 0}
              className="w-full py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-950/30 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Analyzing Matrix...</span>
                </>
              ) : (
                <>
                  <SearchCheck className="h-4 w-4" />
                  <span>Run ML Diagnosis</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Information & Notices */}
          <div className="space-y-6">
            {error && (
              <div className="bg-red-950/40 border border-red-900/50 rounded-2xl p-5 flex items-start gap-3.5 text-red-400 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Medical Disclaimer */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 space-y-3">
              <h4 className="text-white font-bold text-sm flex items-center gap-2 text-amber-500">
                <ShieldAlert className="h-4 w-4" />
                <span>Medical Disclaimer</span>
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                This diagnostic tool is powered by a machine learning classification model trained on symptom indicators. 
                It does **not** provide professional medical advice, diagnosis, or treatment. 
                Use it for informational purposes only. In case of emergency, contact a healthcare professional immediately.
              </p>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        {predictedDisease && (
          <div
            id="result-section"
            className="mt-12 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>

            <div className="flex justify-between items-start border-b border-slate-800/60 pb-6 mb-6">
              <div>
                <h3 className="text-emerald-400 font-bold text-xl flex items-center gap-2">
                  <CheckCircle className="h-6 w-6" />
                  <span>Prediction Output</span>
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  Patient name: <strong className="text-slate-200">{user.name}</strong> &nbsp;•&nbsp; Gender: <strong className="text-slate-200">{user.gender}</strong>
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wide block">Predicted Condition</span>
                <span className="text-white font-extrabold text-2xl sm:text-3xl mt-1 block tracking-wide">{predictedDisease}</span>
              </div>

              {/* Confidence Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-slate-500 uppercase tracking-wide">Confidence Score</span>
                  <span className="text-sky-400">{confidence}%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-emerald-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${confidence}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(predictedDisease)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 font-semibold rounded-xl text-center text-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Learn more about {predictedDisease}</span>
                  <Plus className="h-3.5 w-3.5 rotate-45" />
                </a>

                <button
                  onClick={() => navigate('/consult-doctor', { state: { specialization: consultDoctor } })}
                  className="flex-1 py-3 bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-500 hover:to-emerald-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-sky-950/30 transition-all flex items-center justify-center gap-1.5"
                >
                  <Heart className="h-4 w-4" />
                  <span>Consult {consultDoctor || 'General'} Specialist</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
