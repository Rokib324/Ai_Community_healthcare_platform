import React, { useState } from 'react';
import api from '../api';
import { 
  FileText, RefreshCw, Sparkles, Heart, Brain, Wind, Users, CheckCircle, 
  AlertCircle, ChevronRight, FileUp, ClipboardList
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AnalysisResult {
  cardiologist_report: string;
  psychologist_report: string;
  pulmonologist_report: string;
  final_diagnosis: string;
}

export const ReportAnalyzer: React.FC = () => {
  const { user } = useAuth();
  
  const [reportText, setReportText] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'team' | 'cardio' | 'psych' | 'pulm'>('team');
  const [fileName, setFileName] = useState('');

  // Sample reports for quick testing
  const sarahReport = `Medical Case Report  
Patient ID: 458902  
Name: Sarah Thompson  
Age: 42  
Gender: Female  
Date of Report: 2024-11-12  

Chief Complaint:  
The patient presents with persistent fatigue, unexplained weight gain, dry skin, and sensitivity to cold. She also reports difficulty concentrating, occasional depression, and irregular menstrual cycles over the past six months.  

Medical History:  
Family History: Mother has hypothyroidism; father has hypertension.  
Personal Medical History:  
Hypothyroidism: Suspected based on symptoms, not previously diagnosed.  
Anemia: Diagnosed at age 35, treated with iron supplements.  

Recent Lab and Diagnostic Results:  
Thyroid Panel: Elevated TSH (6.8 µIU/mL), low free T4 (0.6 ng/dL) — indicative of primary hypothyroidism.  
CBC: Mild normocytic anemia (Hemoglobin: 11.2 g/dL).  
Lipid Profile: Elevated LDL cholesterol (160 mg/dL), low HDL cholesterol (38 mg/dL).`;

  const jamesReport = `Medical Case Report  
Patient ID: 682014  
Name: James Patel  
Age: 58  
Gender: Male  
Date of Report: 2024-12-07  

Chief Complaint:  
Patient reports frequent urination (especially at night), excessive thirst, and occasional blurry vision. He also notes fatigue and unintentional weight loss of 4 kg over the past 3 months.

Medical History:  
Family History: Strong history of diabetes on both maternal and paternal sides.  
Personal Medical History:  
Hypertension (Diagnosed at 52)  
Lifestyle Factors: Sedentary, poor dietary habits, smoker (1 pack/day), high sugar intake.  
Medications: Amlodipine 5 mg daily.  

Recent Lab and Diagnostic Results:  
Fasting Blood Sugar: 165 mg/dL  
HbA1c: 8.1%  
Lipid Profile: Total cholesterol 210 mg/dL, HDL 36 mg/dL, LDL 145 mg/dL  
Urinalysis: Glucosuria present, no ketones.`;

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Please sign in to view this page.
      </div>
    );
  }

  const handleQuickLoad = (report: string, name: string) => {
    setReportText(report);
    setFileName(name);
    setResults(null);
    setError('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.txt')) {
      setError('Please upload a valid .txt plain text file.');
      return;
    }

    setFileName(file.name);
    setError('');
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setReportText(text);
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!reportText.trim()) {
      setError('Please enter or upload a medical report to analyze.');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);
    setLoadingStep(1);

    // Simulate clinical review steps for premium feel
    const steps = [
      "Contacting specialist AI agents...",
      "Cardiologist evaluating cardiac parameters...",
      "Psychologist assessing neuropsychological signs...",
      "Pulmonologist checking respiratory risks...",
      "Multidisciplinary Team consolidating diagnosis..."
    ];

    let currentStep = 1;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setLoadingStep(currentStep + 1);
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 1200);

    try {
      const response = await api.post('/report-analyzer/analyze/', {
        report_text: reportText
      });

      clearInterval(interval);

      if (response.data.success) {
        setResults({
          cardiologist_report: response.data.cardiologist_report,
          psychologist_report: response.data.psychologist_report,
          pulmonologist_report: response.data.pulmonologist_report,
          final_diagnosis: response.data.final_diagnosis
        });
        setActiveTab('team');
      } else {
        setError(response.data.error || 'Failed to complete analysis.');
      }
    } catch (err: any) {
      clearInterval(interval);
      setError(err.response?.data?.error || 'An error occurred during medical report analysis.');
    } finally {
      setLoading(false);
      setLoadingStep(0);
    }
  };

  const formatDiagnosisList = (text: string) => {
    if (!text) return null;
    
    // Split by bullet points if present, or newlines
    const items = text.split(/(?=-\s|\*\s|^\d+\.\s)/m).filter(item => item.trim().length > 0);
    
    if (items.length <= 1) {
      // If split didn't find clear bullet symbols, split by lines
      return text.split('\n').filter(l => l.trim()).map((line, idx) => (
        <div key={idx} className="flex gap-3 bg-slate-950/45 p-4 rounded-xl border border-slate-900">
          <ChevronRight className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
          <p className="text-slate-350 text-sm leading-relaxed">{line.replace(/^[-*\s]+/, '')}</p>
        </div>
      ));
    }

    return items.map((item, idx) => {
      // Clean symbol prefix
      const cleanedText = item.replace(/^[-*\s\d.]+\s*/, '').trim();
      // Try to bold the prefix title if there's a colon
      const parts = cleanedText.split(':');
      if (parts.length > 1) {
        return (
          <div key={idx} className="flex gap-3 bg-slate-950/45 p-4.5 rounded-2xl border border-slate-850/80 shadow-inner hover:border-slate-800 transition-colors">
            <ChevronRight className="h-5 w-5 text-sky-400 shrink-0 mt-0.5 animate-pulse" />
            <p className="text-slate-300 text-sm leading-relaxed">
              <strong className="text-white font-bold block mb-1 text-base">{parts[0]}</strong>
              {parts.slice(1).join(':').trim()}
            </p>
          </div>
        );
      }
      return (
        <div key={idx} className="flex gap-3 bg-slate-950/45 p-4.5 rounded-2xl border border-slate-850/80 shadow-inner hover:border-slate-800 transition-colors">
          <ChevronRight className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
          <p className="text-slate-300 text-sm leading-relaxed">{cleanedText}</p>
        </div>
      );
    });
  };

  const formatReportText = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-2"></div>;
      
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        return <h4 key={idx} className="text-white font-bold text-sm mt-4 mb-2 uppercase tracking-wide">{trimmed.replace(/\*\*/g, '')}</h4>;
      }
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        return (
          <li key={idx} className="text-slate-300 text-sm list-disc ml-5 mb-1.5 leading-relaxed">
            {trimmed.replace(/^[-*\s]+/, '')}
          </li>
        );
      }
      if (trimmed.match(/^\d+\./)) {
        return (
          <li key={idx} className="text-slate-300 text-sm list-decimal ml-5 mb-1.5 leading-relaxed">
            {trimmed.replace(/^\d+\.\s*/, '')}
          </li>
        );
      }
      return <p key={idx} className="text-slate-300 text-sm leading-relaxed mb-2.5">{trimmed}</p>;
    });
  };

  const stepsList = [
    "Awaiting clinical input...",
    "Contacting Groq LLM and initializing specialists...",
    "Cardiologist evaluating cardiac parameters...",
    "Psychologist checking neuropsychological indicators...",
    "Pulmonologist assessing respiratory health...",
    "Consolidating multidisciplinary team diagnosis..."
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-slate-100">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 flex justify-center -z-10">
            <div className="w-80 h-24 bg-sky-500/10 rounded-full blur-3xl"></div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white flex items-center justify-center gap-2.5">
            <Sparkles className="text-sky-400 h-8 w-8 animate-pulse" />
            <span>AI Medical Report Analyzer</span>
          </h1>
          <p className="text-slate-400 mt-2.5 max-w-xl mx-auto text-sm sm:text-base">
            Upload clinical case records or paste reports. Receive an automated multidisciplinary diagnosis from our panel of agent specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Report Input Form */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-white font-bold text-sm uppercase tracking-wide">Clinical Case Report</label>
                {fileName && (
                  <span className="text-[10px] bg-slate-950 border border-slate-800 text-slate-400 px-2 py-0.5 rounded truncate max-w-[200px]" title={fileName}>
                    📄 {fileName}
                  </span>
                )}
              </div>

              {/* Text Area */}
              <textarea
                value={reportText}
                onChange={(e) => {
                  setReportText(e.target.value);
                  if (fileName && !e.target.value) setFileName('');
                }}
                placeholder="Paste the medical case report or patient history here..."
                rows={12}
                disabled={loading}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 placeholder-slate-750 resize-none font-mono"
              />
            </div>

            {/* File Upload Dropzone */}
            <div className="border border-dashed border-slate-800 rounded-2xl p-4 text-center bg-slate-950/40 relative hover:border-slate-700 transition-colors">
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                disabled={loading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <FileUp className="h-6 w-6 text-sky-400" />
                <div>
                  <span className="text-xs font-semibold text-slate-350 block">Upload .txt Report File</span>
                  <span className="text-[10px] text-slate-500">Drag and drop or browse files</span>
                </div>
              </div>
            </div>

            {/* Quick Load Test Cases */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Load Quick-Test Templates</span>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleQuickLoad(sarahReport, 'Sarah_Thompson_Report.txt')}
                  disabled={loading}
                  className="w-full text-left p-3 rounded-xl bg-slate-950 border border-slate-850 hover:bg-slate-900/60 hover:border-slate-800 text-xs font-medium flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-2 truncate">
                    <ClipboardList className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-300 font-bold truncate">Sarah Thompson</span>
                    <span className="text-[10px] text-slate-500 truncate">(Hypothyroidism, Anemia)</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                </button>
                <button
                  onClick={() => handleQuickLoad(jamesReport, 'James_Patel_Report.txt')}
                  disabled={loading}
                  className="w-full text-left p-3 rounded-xl bg-slate-950 border border-slate-850 hover:bg-slate-900/60 hover:border-slate-800 text-xs font-medium flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-2 truncate">
                    <ClipboardList className="h-4 w-4 text-sky-400 shrink-0" />
                    <span className="text-slate-300 font-bold truncate">James Patel</span>
                    <span className="text-[10px] text-slate-500 truncate">(Type 2 Diabetes, Smoker)</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleAnalyze}
              disabled={loading || !reportText.trim()}
              className="w-full py-3.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-2xl shadow-lg shadow-sky-950/20 transition-all disabled:opacity-40 disabled:hover:scale-100 flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Analyzing Clinical Data...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Synthesize Medical Report</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Loading or Results */}
          <div className="lg:col-span-7 h-full">
            {error && (
              <div className="bg-red-950/40 border border-red-900/50 rounded-2xl p-5 flex items-start gap-3.5 text-red-400 text-sm mb-6">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {loading && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center min-h-[450px] space-y-6">
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-4 border-slate-850 border-t-sky-500 animate-spin"></div>
                  <Sparkles className="absolute text-sky-400 h-5 w-5 animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-white font-bold text-lg">AI Specialist Console</h3>
                  <p className="text-sky-400 text-sm font-semibold tracking-wide animate-pulse">
                    {stepsList[loadingStep] || "Processing..."}
                  </p>
                  <p className="text-slate-500 text-xs max-w-sm">
                    Specialists are evaluating details independently and collaborating in the multidisciplinary diagnostic chamber.
                  </p>
                </div>
                <div className="w-full max-w-xs bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                  <div 
                    className="bg-gradient-to-r from-sky-500 to-emerald-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${(loadingStep / (stepsList.length - 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {!loading && !results && (
              <div className="border-2 border-dashed border-slate-800 rounded-3xl p-12 text-center text-slate-500 min-h-[450px] flex flex-col justify-center items-center">
                <FileText className="h-16 w-16 text-slate-800 mb-4" />
                <h3 className="text-slate-400 font-bold text-base">No Active Analysis</h3>
                <p className="text-xs text-slate-500 mt-2 max-w-md">
                  Load a patient case study template or paste custom clinical exam notes, then select "Synthesize Medical Report" to run cardiology, psychology, and pulmonology evaluations in parallel.
                </p>
              </div>
            )}

            {!loading && results && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden min-h-[450px] flex flex-col">
                
                {/* Tabs Header */}
                <div className="flex border-b border-slate-800 bg-slate-950/60 p-2 gap-1.5 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('team')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 select-none ${
                      activeTab === 'team'
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-950/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    <span>Multidisciplinary Team</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('cardio')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 select-none ${
                      activeTab === 'cardio'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Heart className="h-4 w-4" />
                    <span>Cardiologist</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('psych')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 select-none ${
                      activeTab === 'psych'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Brain className="h-4 w-4" />
                    <span>Psychologist</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('pulm')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 select-none ${
                      activeTab === 'pulm'
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-950/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Wind className="h-4 w-4" />
                    <span>Pulmonologist</span>
                  </button>
                </div>

                {/* Tab Content Body */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  
                  {activeTab === 'team' && (
                    <div className="space-y-5 animate-in fade-in duration-200">
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <CheckCircle className="text-sky-400 h-5 w-5 shrink-0" />
                          <span>Combined Team Diagnostic Summary</span>
                        </h3>
                        <p className="text-slate-400 text-xs mt-1 leading-normal">
                          Unified evaluation reflecting shared findings and primary care actions from the cardiology, pulmonary, and psychiatric reviews.
                        </p>
                      </div>

                      <div className="space-y-3.5 border-t border-slate-800/80 pt-4">
                        {formatDiagnosisList(results.final_diagnosis)}
                      </div>
                    </div>
                  )}

                  {activeTab === 'cardio' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div>
                        <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                          <Heart className="h-5 w-5 shrink-0" />
                          <span>Cardiology Evaluation Report</span>
                        </h3>
                        <p className="text-slate-500 text-xs mt-0.5">
                          Assessment focusing on cardiovascular stress, ECG abnormalities, and risk factors.
                        </p>
                      </div>
                      <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-850 space-y-2 mt-3 leading-relaxed shadow-inner">
                        {formatReportText(results.cardiologist_report)}
                      </div>
                    </div>
                  )}

                  {activeTab === 'psych' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div>
                        <h3 className="text-lg font-bold text-purple-400 flex items-center gap-2">
                          <Brain className="h-5 w-5 shrink-0" />
                          <span>Psychological Assessment Report</span>
                        </h3>
                        <p className="text-slate-500 text-xs mt-0.5">
                          Evaluation focusing on depressive indicators, cognitive distress, and counseling recommendation paths.
                        </p>
                      </div>
                      <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-850 space-y-2 mt-3 leading-relaxed shadow-inner">
                        {formatReportText(results.psychologist_report)}
                      </div>
                    </div>
                  )}

                  {activeTab === 'pulm' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <div>
                        <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                          <Wind className="h-5 w-5 shrink-0" />
                          <span>Pulmonology Assessment Report</span>
                        </h3>
                        <p className="text-slate-500 text-xs mt-0.5">
                          Review investigating respiratory capacity, smoking effects, and lung airway status.
                        </p>
                      </div>
                      <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-850 space-y-2 mt-3 leading-relaxed shadow-inner">
                        {formatReportText(results.pulmonologist_report)}
                      </div>
                    </div>
                  )}

                  {/* Disclaimer Footer */}
                  <div className="mt-8 pt-4 border-t border-slate-800/60 text-[10px] text-slate-500 leading-normal flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-500/60 mt-0.5" />
                    <span>
                      Disclaimer: This AI assessment is based on automatic analysis of the clinical text file and does not replace medical consultation. Always verify with a board-certified physician before changing medication doses.
                    </span>
                  </div>

                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
