import React, { useEffect, useState } from 'react';
import api from '../api';
import { FileText, Plus, Trash2, Calendar, Download, ShieldAlert, CheckCircle2, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface EHRRecordItem {
  id: number;
  title: string;
  record_type: string;
  description: string;
  attachment_name: string;
  attachment_data: string;
  created_at: string;
  doctor_name: string | null;
}

export const Records: React.FC = () => {
  const { user } = useAuth();
  
  const [records, setRecords] = useState<EHRRecordItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // New Record Form State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [recordType, setRecordType] = useState('prescription');
  const [description, setDescription] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentContent, setAttachmentContent] = useState('');
  
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/ehr/');
      if (response.data.records) {
        setRecords(response.data.records);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to retrieve medical health records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    setFormSuccess('');

    try {
      const response = await api.post('/ehr/', {
        title,
        record_type: recordType,
        description,
        attachment_name: attachmentName || 'medical_document.txt',
        attachment_data: attachmentContent || 'Simulated health record document data.'
      });
      if (response.data.success) {
        setFormSuccess('Record stored successfully!');
        setTitle('');
        setDescription('');
        setAttachmentName('');
        setAttachmentContent('');
        fetchRecords();
        setTimeout(() => {
          setIsAddOpen(false);
          setFormSuccess('');
        }, 1500);
      }
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Failed to add medical record.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteRecord = async (recordId: number) => {
    if (!window.confirm('Are you sure you want to permanently delete this record?')) return;

    try {
      const response = await api.delete(`/ehr/${recordId}/`);
      if (response.data.success) {
        setRecords(prev => prev.filter(rec => rec.id !== recordId));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete medical record.');
    }
  };

  // Helper for record icon and colors
  const getRecordStyle = (type: string) => {
    switch (type) {
      case 'prescription':
        return { bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', label: 'Prescription' };
      case 'lab_report':
        return { bg: 'bg-sky-500/10 border-sky-500/20 text-sky-400', label: 'Lab Report' };
      case 'scan':
        return { bg: 'bg-purple-500/10 border-purple-500/20 text-purple-400', label: 'Imaging Scan' };
      case 'vaccine':
        return { bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400', label: 'Vaccination' };
      default:
        return { bg: 'bg-slate-500/10 border-slate-500/20 text-slate-400', label: 'General Note' };
    }
  };

  const triggerMockDownload = (record: EHRRecordItem) => {
    // Generate a simple text file download
    const element = document.createElement("a");
    const file = new Blob([`Medical Document: ${record.title}\nType: ${record.record_type}\nCreated: ${record.created_at}\n\nDescription/Details:\n${record.description}\n\nAttachment Content:\n${record.attachment_data}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = record.attachment_name || `${record.title.replace(/\s+/g, '_')}_document.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
              <Layers className="text-sky-400 h-8 w-8" />
              <span>Electronic Health Records (EHR)</span>
            </h1>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">
              Securely store, organize, and view your prescription receipts, diagnostic lab reports, and doctor logs.
            </p>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="w-full sm:w-auto py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-sky-950/20"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Medical Record</span>
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
            <span>Syncing health database...</span>
          </div>
        ) : records.length === 0 ? (
          <div className="py-20 border-2 border-dashed border-slate-800 rounded-3xl text-center text-slate-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-slate-700" />
            <p className="font-semibold text-slate-400 text-sm">No electronic health records found.</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Upload files or type doctor diagnostic logs using the button above to secure your medical history.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {records.map((rec) => {
              const style = getRecordStyle(rec.record_type);
              return (
                <div 
                  key={rec.id} 
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-750 transition-all flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${style.bg}`}>
                        {style.label}
                      </span>
                      <button
                        onClick={() => handleDeleteRecord(rec.id)}
                        className="text-slate-500 hover:text-red-400 p-1 rounded-md transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <h3 className="text-white font-bold text-base leading-snug">{rec.title}</h3>
                    
                    <div className="flex items-center gap-1 text-[10px] text-slate-450 mt-2 font-medium">
                      <Calendar className="h-3 w-3" />
                      <span>Saved: {rec.created_at}</span>
                      {rec.doctor_name && (
                        <>
                          <span className="mx-1">•</span>
                          <span>By Dr. {rec.doctor_name}</span>
                        </>
                      )}
                    </div>

                    <p className="text-slate-400 text-xs mt-3 leading-relaxed border-t border-slate-800/80 pt-3">
                      {rec.description || 'No descriptive logs added.'}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800/50 flex justify-between items-center gap-4 bg-slate-950/40 p-2.5 rounded-xl">
                    <span className="text-[10px] text-slate-500 font-semibold truncate max-w-[200px]" title={rec.attachment_name}>
                      {rec.attachment_name || 'medical_record.txt'}
                    </span>
                    <button
                      onClick={() => triggerMockDownload(rec)}
                      className="text-sky-400 hover:text-sky-300 text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Record Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200 text-slate-200">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>
            <h3 className="text-white font-bold text-xl mb-1">Add Medical Record</h3>
            <p className="text-slate-450 text-xs mb-4">Input document details and save to secure database.</p>

            <form onSubmit={handleAddRecord} className="space-y-4">
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
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dental Checkup Prescription, Vitamin Test Report"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-slate-200 placeholder-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Record Type</label>
                <select
                  value={recordType}
                  onChange={(e) => setRecordType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-slate-300"
                >
                  <option value="prescription">Prescription</option>
                  <option value="lab_report">Lab Report</option>
                  <option value="scan">Imaging / Scan</option>
                  <option value="vaccine">Vaccination Record</option>
                  <option value="general">General Medical Note</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Notes / Description</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Prescribed by Dr. Carter for allergy relief. Take cetirizine once daily..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-slate-250 placeholder-slate-600"
                />
              </div>

              {/* Mock file upload section */}
              <div className="border border-dashed border-slate-800 rounded-xl p-4 space-y-3">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Document Attachment (Mock Upload)</span>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">Filename</label>
                  <input
                    type="text"
                    placeholder="presc_dentist_july.pdf"
                    value={attachmentName}
                    onChange={(e) => setAttachmentName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none placeholder-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">Simulated File Contents (Text/Base64)</label>
                  <textarea
                    rows={2}
                    placeholder="[PDF data or handwritten text logs to download later...]"
                    value={attachmentContent}
                    onChange={(e) => setAttachmentContent(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-350 focus:outline-none placeholder-slate-700"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-1.5"
              >
                {formLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
                <span>Save to EHR Vault</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
