import React, { useState, useRef, useCallback } from 'react';
import Topbar from '../components/Topbar';
import {
  Star, Upload, Eye, Download, Trash2, Plus,
  ChevronDown, Shield, CloudUpload, X, Sparkles,
  FileText, Info, Check, AlertCircle
} from 'lucide-react';
import { Page } from '../App';

interface ResumeProps {
  onMenuClick?: () => void;
  onNavigate?: (p: Page, job?: any) => void;
}

interface HistoryFile {
  id: string;
  name: string;
  date: string;
  size: string;
  score: number;
  type: string;
  color: string;
  url: string | null;  // blob URL for real uploaded files
  isUploaded?: boolean;
}

const Resume: React.FC<ResumeProps> = ({ onMenuClick, onNavigate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'error'>('success');
  const [sortBy, setSortBy] = useState('Latest Upload');
  const [showSort, setShowSort] = useState(false);
  const [previewFile, setPreviewFile] = useState<HistoryFile | null>(null);
  const [activeResume, setActiveResume] = useState<HistoryFile | null>(null);
  const [historyFiles, setHistoryFiles] = useState<HistoryFile[]>([
    { id: '1', name: 'Alex_Rivers_Design_V4.pdf',     date: 'Oct 12, 2023', size: '1.2 MB', score: 90, type: 'pdf',  color: '#ff4d6d', url: null },
    { id: '2', name: 'Rivers_Portfolio_Resume.docx',  date: 'Sep 28, 2023', size: '840 KB', score: 68, type: 'docx', color: '#4facfe', url: null },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastType(type);
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const processFile = (file: File) => {
    const isPdf = file.name.endsWith('.pdf');
    const isDocx = file.name.endsWith('.docx') || file.name.endsWith('.doc');
    if (!isPdf && !isDocx) {
      showToast('Only PDF and DOCX files are supported.', 'error');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const ext = isPdf ? 'pdf' : 'docx';
    const color = isPdf ? '#ff4d6d' : '#4facfe';
    const score = Math.floor(Math.random() * 21) + 75; // 75–95

    const newFile: HistoryFile = {
      id: String(Date.now()),
      name: file.name,
      date: 'Just now',
      size: formatSize(file.size),
      score,
      type: ext,
      color,
      url: objectUrl,
      isUploaded: true,
    };

    setHistoryFiles(prev => [newFile, ...prev]);
    setActiveResume(newFile);
    showToast(`"${file.name}" uploaded successfully! AI score: ${score}%`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
    e.target.value = '';
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) processFile(f);
  }, []);

  const handleDelete = (id: string) => {
    setHistoryFiles(prev => prev.filter(f => f.id !== id));
    showToast('Resume removed from history.', 'info');
  };

  const handleSetActive = (file: HistoryFile) => {
    setActiveResume(file);
    showToast(`Set "${file.name}" as your active resume.`);
  };

  const handlePreview = (file: HistoryFile) => {
    if (file.url) {
      setPreviewFile(file);
    } else {
      showToast(`Demo preview: "${file.name}". Upload a real file to preview!`, 'info');
    }
  };

  const sortedFiles = [...historyFiles].sort((a, b) => {
    if (sortBy === 'Highest Score') return b.score - a.score;
    if (sortBy === 'Oldest First') return Number(a.id) - Number(b.id);
    return Number(b.id) - Number(a.id);
  });

  const active = activeResume || historyFiles[0] || { name: 'Sarah_Jones_Resume.pdf' };
  const skills = ['Figma', 'UI Design', 'Design Systems', 'ProtoPie', 'React', 'User Research', '+12 more'];

  return (
    <div className="flex flex-col min-h-screen w-full lg:w-[calc(100vw-220px)] lg:ml-[220px] bg-[#f4f6fb] dark:bg-[#0b0f19] text-[#1a1a2e] dark:text-[#f8fafc] overflow-x-hidden transition-colors duration-200">
      <Topbar onMenuClick={onMenuClick} onNavigate={onNavigate} />

      {/* ───── Toast Notification ───── */}
      {toastMessage && (
        <div className={`fixed top-20 right-6 z-50 flex items-center gap-3 text-white px-4 py-3 rounded-xl shadow-2xl border animate-bounce ${
          toastType === 'error' ? 'bg-[#ff4d6d] border-[#ff4d6d]' : 'bg-[#1a1a2e] border-[#6c63ff]/40'
        }`}>
          {toastType === 'success' && <Check size={16} className="text-[#00c853]" />}
          {toastType === 'info' && <Info size={16} className="text-[#4facfe]" />}
          {toastType === 'error' && <AlertCircle size={16} className="text-white" />}
          <span className="text-xs font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-[#8890a4] hover:text-white bg-transparent border-none cursor-pointer">
            <X size={13} />
          </button>
        </div>
      )}

      {/* ───── PDF / Document Preview Modal ───── */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#111827] border border-[#e4e8f0] dark:border-[#1f2d42] rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e4e8f0] dark:border-[#1f2d42] bg-white dark:bg-[#111827]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${previewFile.color}18` }}>
                  <FileText size={16} style={{ color: previewFile.color }} />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#1a1a2e] dark:text-[#f8fafc] truncate max-w-xs sm:max-w-md">{previewFile.name}</p>
                  <p className="text-[11px] text-[#8890a4] dark:text-[#94a3b8]">{previewFile.size} · AI Score: {previewFile.score}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={previewFile.url || '#'}
                  download={previewFile.name}
                  onClick={e => !previewFile.url && e.preventDefault()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#f4f6fb] dark:bg-[#161e2e] text-[12px] font-semibold text-[#4a5068] dark:text-[#cbd5e1] hover:text-[#6c63ff] hover:bg-[#6c63ff]/8 transition-all no-underline"
                >
                  <Download size={13} /> Download
                </a>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="w-8 h-8 rounded-xl bg-[#f4f6fb] dark:bg-[#161e2e] hover:bg-[#ff4d6d]/10 hover:text-[#ff4d6d] text-[#8890a4] dark:text-[#94a3b8] flex items-center justify-center border-none cursor-pointer transition-all"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Modal Body — PDF embed */}
            <div className="flex-1 overflow-auto bg-[#f4f6fb] dark:bg-[#0b0f19] p-2 min-h-[500px]">
              {previewFile.type === 'pdf' && previewFile.url ? (
                <iframe
                  src={previewFile.url}
                  className="w-full h-full min-h-[600px] rounded-xl border border-[#e4e8f0] dark:border-[#1f2d42]"
                  title={previewFile.name}
                />
              ) : previewFile.type === 'docx' && previewFile.url ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: `${previewFile.color}18` }}>
                    <FileText size={32} style={{ color: previewFile.color }} />
                  </div>
                  <div className="text-center">
                    <p className="text-[15px] font-bold text-[#1a1a2e] dark:text-[#f8fafc] mb-1">{previewFile.name}</p>
                    <p className="text-[12px] text-[#8890a4] dark:text-[#94a3b8] mb-4">DOCX files cannot be previewed directly in browser.</p>
                  </div>
                  <a
                    href={previewFile.url}
                    download={previewFile.name}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white no-underline transition-all hover:-translate-y-0.5 active:scale-95"
                    style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: '0 4px 14px rgba(108,99,255,0.4)' }}
                  >
                    <Download size={15} /> Download to View
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* ───── Main Content ───── */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[26px] sm:text-[30px] font-black text-[#1a1a2e] dark:text-[#f8fafc] tracking-tight">Resume Management</h1>
            <p className="text-sm text-[#8890a4] dark:text-[#94a3b8] mt-1">Optimize and manage your application documents with AI insights.</p>
          </div>
          <button
            onClick={() => uploadInputRef.current?.click()}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white border-none cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: '0 4px 14px rgba(108,99,255,0.4)' }}
          >
            <Upload size={15} /> Upload New Resume
          </button>
          <input ref={uploadInputRef} type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileChange} />
          <input ref={fileInputRef}   type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileChange} />
        </div>

        {/* Main 2-column Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6 mb-8">

          {/* Active Resume Card */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 shadow-sm border border-[#e4e8f0]/60 dark:border-[#1f2d42]">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#6c63ff]/10 flex items-center justify-center">
                  <Star size={18} className="text-[#6c63ff]" fill="#6c63ff" />
                </div>
                <div>
                  <h2 className="text-[16px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc]">Active Resume</h2>
                  <p className="text-[12px] text-[#8890a4] dark:text-[#94a3b8]">Main profile document for quick applications</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-[#00c853]/10 text-[#00a843] text-[10px] font-bold px-3 py-1.5 rounded-full border border-[#00c853]/20">
                <Shield size={11} fill="currentColor" /> AI VERIFIED
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-5">
              {/* Resume Preview Thumbnail */}
              <div className="flex-shrink-0">
                <div className="w-full sm:w-[170px] bg-[#f8f9fc] dark:bg-[#161e2e] rounded-xl border border-[#e4e8f0] dark:border-[#1f2d42] overflow-hidden">
                  <div className="bg-[#1a1a2e] px-3 py-2">
                    <div className="text-[7px] text-white/70 font-semibold truncate">Resume-Management – Candidate Portal</div>
                  </div>
                  <div className="p-3 flex flex-col gap-1.5">
                    <div className="text-[8px] font-bold text-[#4a5068] dark:text-[#cbd5e1] truncate">{active.name}</div>
                    <div className="flex gap-2 mt-1">
                      <div className="w-14 h-16 bg-[#e4e8f0] dark:bg-[#26334d] rounded flex items-center justify-center flex-shrink-0">
                        <div className="w-10 h-12 bg-[#d1d5db] dark:bg-[#374151] rounded-sm relative overflow-hidden">
                          <div className="absolute inset-0 flex flex-col gap-1 p-1">
                            <div className="h-1 bg-[#9ca3af] rounded" />
                            <div className="h-1 bg-[#9ca3af] rounded w-3/4" />
                            <div className="h-1 bg-[#9ca3af] rounded w-1/2" />
                            <div className="h-0.5 bg-[#6c63ff]/40 rounded mt-0.5" />
                            {[100,80,90,70,85].map((w, i) => (
                              <div key={i} className="h-0.5 rounded bg-[#c4c9d4]" style={{ width: `${w}%` }} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                        <div className="text-[6px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc]">SARAH JONES</div>
                        <div className="text-[5px] text-[#8890a4] dark:text-[#94a3b8]">UX Designer · SF</div>
                        <div className="h-0.5 bg-[#e4e8f0] dark:bg-[#1f2d42] rounded my-0.5"/>
                        <div className="text-[5px] text-[#8890a4] dark:text-[#94a3b8] leading-tight">3+ yrs product design</div>
                        <div className="flex gap-0.5 flex-wrap mt-0.5">
                          {['Figma','React','UX'].map(s => (
                            <span key={s} className="text-[4.5px] bg-[#6c63ff]/10 text-[#6c63ff] dark:text-[#a78bfa] px-1 py-0.5 rounded font-bold">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (activeResume?.url) {
                      setPreviewFile(activeResume);
                    } else {
                      showToast('Upload a real PDF to preview it here!', 'info');
                    }
                  }}
                  className="w-full flex items-center justify-center gap-1.5 mt-2 text-[11px] font-semibold text-[#6c63ff] dark:text-[#a78bfa] hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer"
                >
                  <Eye size={12} /> Preview Full View
                </button>
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col gap-4">
                <div>
                  <span className="block text-[9px] font-bold text-[#b0b8cc] dark:text-[#64748b] tracking-widest uppercase mb-2">Experience Highlights</span>
                  <ul className="flex flex-col gap-1.5">
                    {['Senior UX Designer at Nexus Solutions (3+ Years)', 'Led design system implementation for 5 global apps'].map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px] text-[#4a5068] dark:text-[#cbd5e1]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6c63ff] flex-shrink-0 mt-1.5" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-[#b0b8cc] dark:text-[#64748b] tracking-widest uppercase mb-2">Education</span>
                  <div className="text-[13px] font-bold text-[#1a1a2e] dark:text-[#f8fafc]">M.S. in Human-Computer Interaction</div>
                  <div className="text-[11px] text-[#8890a4] dark:text-[#94a3b8]">Stanford University · 2018 – 2020</div>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-[#b0b8cc] dark:text-[#64748b] tracking-widest uppercase mb-2">Skills AI-Parsed</span>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s) => (
                      <span key={s} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                        s === '+12 more'
                          ? 'bg-[#f0f2f8] dark:bg-[#161e2e] text-[#8890a4] dark:text-[#94a3b8] border-[#e4e8f0] dark:border-[#1f2d42]'
                          : 'bg-[#6c63ff]/8 text-[#6c63ff] dark:text-[#a78bfa] border-[#6c63ff]/20'
                      }`}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            {/* Quick Upload */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60 dark:border-[#1f2d42]">
              <h3 className="text-[15px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc] mb-4">Quick Upload</h3>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center gap-3 cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[#6c63ff] bg-[#6c63ff]/5 scale-[1.02]'
                    : 'border-[#d1d5db] dark:border-[#374151] hover:border-[#6c63ff] hover:bg-[#6c63ff]/3'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isDragging ? 'bg-[#6c63ff]/15' : 'bg-[#f4f6fb] dark:bg-[#161e2e]'}`}>
                  <CloudUpload size={24} className={isDragging ? 'text-[#6c63ff]' : 'text-[#8890a4] dark:text-[#94a3b8]'} />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-bold text-[#1a1a2e] dark:text-[#f8fafc]">Drag &amp; drop your file</p>
                  <p className="text-[11px] text-[#8890a4] dark:text-[#94a3b8] mt-0.5">Supports PDF, DOCX<br />(Max 10MB)</p>
                </div>
                <button
                  className="text-[12px] font-bold text-[#6c63ff] dark:text-[#a78bfa] bg-transparent border-none cursor-pointer hover:underline"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                >
                  Browse locally
                </button>
              </div>
              <div className="flex items-start gap-2.5 mt-4 p-3 bg-[#f8f9fc] dark:bg-[#161e2e] rounded-xl border border-[#e4e8f0] dark:border-[#1f2d42]">
                <Info size={14} className="text-[#6c63ff] dark:text-[#a78bfa] flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#4a5068] dark:text-[#cbd5e1] leading-relaxed">
                  AI will automatically parse and score your new upload against top industry standards.
                </p>
              </div>
            </div>

            {/* AI Resume Score */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60 dark:border-[#1f2d42]">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={15} className="text-[#6c63ff]" />
                <span className="text-[13px] font-bold text-[#1a1a2e] dark:text-[#f8fafc]">AI Resume Score</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path strokeWidth="3" stroke="#f0f2f8" className="dark:stroke-[#1f2d42]" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path strokeWidth="3" strokeDasharray="90, 100" strokeLinecap="round" stroke="#6c63ff" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[15px] font-black text-[#1a1a2e] dark:text-[#f8fafc]">90</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-[12px] font-bold text-[#00c853] mb-1 flex items-center gap-1"><Check size={12} strokeWidth={3} /> Excellent Match</p>
                  <p className="text-[11px] text-[#8890a4] dark:text-[#94a3b8] leading-relaxed">Your resume ranks in the top 10% of profiles for UX roles.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resume History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc]">Resume History</h2>
              <span className="text-[11px] font-bold text-white bg-[#6c63ff] px-2 py-0.5 rounded-full">{historyFiles.length}</span>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-1.5 text-[12px] font-semibold text-[#4a5068] dark:text-[#cbd5e1] bg-white dark:bg-[#111827] border border-[#e4e8f0] dark:border-[#1f2d42] rounded-xl px-3 py-2 cursor-pointer hover:border-[#6c63ff] transition-colors"
              >
                <span className="text-[#8890a4] dark:text-[#94a3b8]">Sort by:</span>
                <span className="text-[#6c63ff] dark:text-[#a78bfa] font-bold">{sortBy}</span>
                <ChevronDown size={13} className="text-[#6c63ff] dark:text-[#a78bfa]" />
              </button>
              {showSort && (
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-[#111827] border border-[#e4e8f0] dark:border-[#1f2d42] rounded-xl shadow-lg z-10 min-w-[160px] overflow-hidden">
                  {['Latest Upload', 'Highest Score', 'Oldest First'].map((opt) => (
                    <button key={opt} onClick={() => { setSortBy(opt); setShowSort(false); }}
                      className={`w-full text-left px-4 py-2.5 text-[12px] font-semibold hover:bg-[#f4f6fb] dark:hover:bg-[#161e2e] transition-colors border-none cursor-pointer ${sortBy === opt ? 'text-[#6c63ff] dark:text-[#a78bfa] bg-[#f4f6fb] dark:bg-[#161e2e]' : 'text-[#4a5068] dark:text-[#cbd5e1] bg-white dark:bg-[#111827]'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedFiles.map((file) => (
              <div key={file.id} className={`bg-white dark:bg-[#111827] rounded-2xl p-4 shadow-sm border transition-all hover:shadow-md ${
                file.isUploaded ? 'border-[#6c63ff]/25 hover:border-[#6c63ff]/40' : 'border-[#e4e8f0]/60 dark:border-[#1f2d42]'
              }`}>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${file.color}18` }}>
                    <FileText size={18} style={{ color: file.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-[#1a1a2e] dark:text-[#f8fafc] truncate" title={file.name}>{file.name}</p>
                    <p className="text-[10px] text-[#b0b8cc] dark:text-[#64748b] mt-0.5">{file.date} · {file.size}</p>
                  </div>
                  {file.isUploaded && (
                    <span className="text-[8px] font-bold bg-[#6c63ff]/10 text-[#6c63ff] dark:text-[#a78bfa] px-1.5 py-0.5 rounded-full flex-shrink-0">NEW</span>
                  )}
                </div>

                {/* Score bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-[#b0b8cc] dark:text-[#64748b] uppercase tracking-wider">AI Score</span>
                    <span className="text-[12px] font-black" style={{ color: file.score >= 80 ? '#00c853' : '#f59e0b' }}>{file.score}%</span>
                  </div>
                  <div className="h-1.5 bg-[#f0f2f8] dark:bg-[#26334d] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{
                      width: `${file.score}%`,
                      background: file.score >= 80 ? 'linear-gradient(90deg,#00c853,#69f0ae)' : 'linear-gradient(90deg,#f59e0b,#fcd34d)'
                    }} />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={() => handlePreview(file)}
                    className="flex-1 py-2 rounded-xl bg-[#f4f6fb] dark:bg-[#161e2e] text-[12px] font-bold text-[#4a5068] dark:text-[#cbd5e1] border-none cursor-pointer hover:bg-[#6c63ff]/10 hover:text-[#6c63ff] transition-all active:scale-95 flex items-center justify-center gap-1"
                  >
                    <Eye size={12} /> View
                  </button>
                  <a
                    href={file.url || '#'}
                    download={file.name}
                    onClick={e => { if (!file.url) { e.preventDefault(); showToast('Download not available for demo files.', 'info'); } }}
                    className="w-8 h-8 rounded-xl bg-[#f4f6fb] dark:bg-[#161e2e] flex items-center justify-center text-[#8890a4] dark:text-[#94a3b8] hover:bg-[#6c63ff]/10 hover:text-[#6c63ff] transition-all active:scale-95 no-underline"
                  >
                    <Download size={13} />
                  </a>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="w-8 h-8 rounded-xl bg-[#f4f6fb] dark:bg-[#161e2e] flex items-center justify-center border-none cursor-pointer text-[#8890a4] dark:text-[#94a3b8] hover:bg-[#ff4d6d]/10 hover:text-[#ff4d6d] transition-all active:scale-95"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Set as active */}
                <button
                  onClick={() => handleSetActive(file)}
                  className="w-full py-1.5 rounded-xl border border-[#e4e8f0] dark:border-[#1f2d42] text-[11px] font-semibold text-[#8890a4] dark:text-[#94a3b8] bg-transparent cursor-pointer hover:border-[#6c63ff] hover:text-[#6c63ff] transition-all active:scale-95"
                >
                  Set as Active
                </button>
              </div>
            ))}

            {/* Add Archive card */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white dark:bg-[#111827] rounded-2xl p-4 shadow-sm border-2 border-dashed border-[#e4e8f0] dark:border-[#1f2d42] hover:border-[#6c63ff] hover:bg-[#6c63ff]/3 transition-all flex flex-col items-center justify-center gap-3 min-h-[200px] cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#f4f6fb] dark:bg-[#161e2e] group-hover:bg-[#6c63ff]/10 flex items-center justify-center transition-colors">
                <Plus size={20} className="text-[#b0b8cc] dark:text-[#64748b] group-hover:text-[#6c63ff] transition-colors" />
              </div>
              <span className="text-[12px] font-bold text-[#b0b8cc] dark:text-[#64748b] group-hover:text-[#6c63ff] transition-colors">Add Archive</span>
            </button>
          </div>
        </div>

        {/* AI Tips */}
        <div className="mt-6 bg-gradient-to-r from-[#6c63ff]/8 to-[#8b5cf6]/8 dark:from-[#111827] dark:to-[#1a2234] rounded-2xl p-5 border border-[#6c63ff]/15 dark:border-[#1f2d42]">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={15} className="text-[#6c63ff]" />
            <span className="text-[13px] font-bold text-[#1a1a2e] dark:text-[#f8fafc]">AI Improvement Tips</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {['Add quantifiable metrics to your bullet points', 'Include a skills summary section at the top', 'Tailor your resume keywords for ATS systems'].map((tip, i) => (
              <div key={i} className="flex items-start gap-2 bg-white/70 dark:bg-[#161e2e] rounded-xl px-3 py-2 flex-1 min-w-[200px] border border-[#6c63ff]/10 dark:border-[#1f2d42]">
                <span className="w-4 h-4 rounded-full bg-[#6c63ff] text-white text-[9px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <span className="text-[11px] text-[#4a5068] dark:text-[#cbd5e1] leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;
