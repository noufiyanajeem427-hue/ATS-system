import React, { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import {
  Briefcase, MapPin, DollarSign, ArrowRight,
  BrainCircuit, CheckCircle2, ChevronRight, Info, ExternalLink,
  Sparkles, Check, Bookmark, Target, X
} from 'lucide-react';
import { Page } from '../App';
import { fetchJobById, saveJobApi, deleteSavedJobApi } from '../services/api';

interface JobDetailsProps {
  job?: {
    id?: number | string;
    _id?: number | string;
    title: string;
    company: string;
    location: string;
    match: number;
    salary: string;
    type: string;
    logo: string;
    description?: string;
    about?: string;
    responsibilities?: string[];
    requirements?: string[];
    skills?: string[];
    growth?: string[];
    industry?: string;
  };
  onMenuClick?: () => void;
  onNavigate?: (p: Page) => void;
}

const logoBgs: Record<string, string> = {
  CS: 'linear-gradient(135deg,#667eea,#764ba2)',
  LC: 'linear-gradient(135deg,#f093fb,#f5576c)',
  GS: 'linear-gradient(135deg,#4facfe,#00f2fe)',
  NX: 'linear-gradient(135deg,#1a1a2e,#0f3460)',
  G: 'linear-gradient(135deg,#4285f4,#34a853)',
  A: 'linear-gradient(135deg,#ff5a5f,#ff7e82)'
};

const JobDetails: React.FC<JobDetailsProps> = ({ job, onMenuClick, onNavigate }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [dbJob, setDbJob] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const targetJobId = job?._id || job?.id;

  useEffect(() => {
    if (targetJobId) {
      fetchJobById(targetJobId).then(data => {
        if (data && (data._id || data.title)) {
          setDbJob(data);
        }
      });
    }
  }, [targetJobId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const activeJob = {
    id: dbJob?._id || job?.id || job?._id || 1,
    title: dbJob?.title || job?.title || 'Software Engineer',
    company: dbJob?.company || job?.company || 'Tech Company',
    location: dbJob?.location || job?.location || 'Remote',
    match: dbJob?.match || job?.match || 90,
    salary: dbJob?.salary || job?.salary || '$120k - $180k',
    type: dbJob?.type || job?.type || 'Full-time',
    logo: (dbJob?.company || job?.company || 'TC').substring(0, 2).toUpperCase(),
    description: dbJob?.description,
  };

  const jobId = activeJob.id || activeJob.title;

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nexus_saved_jobs');
      const list = stored ? JSON.parse(stored) : [];
      setIsSaved(list.includes(jobId));
    } catch (e) {}
  }, [jobId]);

  const handleSaveToggle = async () => {
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    showToast(nextSaved ? 'Job saved to your bookmarks!' : 'Job removed from saved items');

    try {
      const stored = localStorage.getItem('nexus_saved_jobs');
      let list: any[] = stored ? JSON.parse(stored) : [];
      if (nextSaved) {
        if (!list.includes(jobId)) list.push(jobId);
        await saveJobApi(jobId);
      } else {
        list = list.filter((x: any) => x !== jobId);
        await deleteSavedJobApi(jobId);
      }
      localStorage.setItem('nexus_saved_jobs', JSON.stringify(list));
    } catch (e) {}
  };

  const handleApply = () => {
    showToast('Redirecting to application portal...');
  };

  const jobResp = job?.responsibilities;
  const jobReq = job?.requirements;
  const jobSkills = job?.skills;
  const jobGrowth = job?.growth;

  const extendedData = {
    about: dbJob?.about || dbJob?.description || job?.about || job?.description || '',
    responsibilities: Array.isArray(dbJob?.responsibilities) && dbJob.responsibilities.length > 0 ? dbJob.responsibilities : (Array.isArray(jobResp) ? jobResp : []),
    requirements: Array.isArray(dbJob?.requirements) && dbJob.requirements.length > 0 ? dbJob.requirements : (Array.isArray(jobReq) ? jobReq : []),
    skills: Array.isArray(dbJob?.skills) && dbJob.skills.length > 0 ? dbJob.skills : (Array.isArray(jobSkills) ? jobSkills : []),
    growth: Array.isArray(dbJob?.growth) ? dbJob.growth : (Array.isArray(jobGrowth) ? jobGrowth : []),
    industry: dbJob?.industry || job?.industry || 'Technology & Innovation',
  };

  const logoBg = logoBgs[activeJob.logo] || 'linear-gradient(135deg,#6c63ff,#8b5cf6)';

  return (
    <div className="flex flex-col min-h-screen w-full lg:w-[calc(100vw-220px)] lg:ml-[220px] bg-[#f4f6fb] overflow-x-hidden relative">
      <Topbar onMenuClick={onMenuClick} onNavigate={onNavigate} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 bg-[#1a1a2e] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#6c63ff]/30 z-50 flex items-center gap-3 animate-bounce">
          <Sparkles className="text-[#6c63ff]" size={18} />
          <span className="text-xs font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-[#8890a4] hover:text-white ml-2">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1.5 text-xs text-[#8890a4] mb-6 font-medium">
          <button onClick={() => onNavigate?.('jobsearch')} className="hover:text-[#6c63ff] transition-colors">
            Job Search
          </button>
          <ChevronRight size={12} />
          <span className="text-[#1a1a2e] font-semibold">{activeJob.title}</span>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">
          
          {/* Left Main Column */}
          <div className="flex flex-col gap-6">
            
            {/* Header Details Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e4e8f0]/60 relative">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                
                {/* Logo & Info */}
                <div className="flex gap-4 items-start">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0 border border-[#e4e8f0]"
                    style={{ background: logoBg }}
                  >
                    {activeJob.logo}
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#1a1a2e] tracking-tight leading-snug">
                      {activeJob.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-[13px] text-[#5a6080]">
                      <span className="flex items-center gap-1"><Briefcase size={14} className="text-[#8890a4]" /> {activeJob.company}</span>
                      <span className="flex items-center gap-1"><MapPin size={14} className="text-[#8890a4]" /> {activeJob.location}</span>
                      {activeJob.salary && <span className="flex items-center gap-1"><DollarSign size={14} className="text-[#8890a4]" /> {activeJob.salary}</span>}
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex sm:flex-col gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={handleApply}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
                    style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: '0 4px 14px rgba(108,99,255,0.4)' }}
                  >
                    Apply Now <ArrowRight size={15} />
                  </button>
                  <button
                    onClick={handleSaveToggle}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border transition-all active:scale-95 whitespace-nowrap
                      ${isSaved ? 'bg-[#ff4d6d]/10 border-[#ff4d6d] text-[#ff4d6d]' : 'bg-white border-[#e4e8f0] text-[#4a5068] hover:border-[#6c63ff] hover:text-[#6c63ff]'}`}
                  >
                    {isSaved ? <Bookmark size={15} fill="currentColor" /> : <Bookmark size={15} />}
                    {isSaved ? 'Saved' : 'Save Job'}
                  </button>
                </div>
              </div>

              {/* Tag Badges */}
              {(activeJob.type || activeJob.location) && (
                <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-[#f0f2f8]">
                  {activeJob.type && (
                    <span className="text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-lg bg-[#f4f6fb] text-[#5a6080] uppercase">
                      {activeJob.type}
                    </span>
                  )}
                  {activeJob.location && (
                    <span className="text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-lg bg-[#f4f6fb] text-[#5a6080] uppercase">
                      {activeJob.location}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* AI Reasoning Match Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e4e8f0]/60 flex flex-col md:flex-row items-center gap-6">
              
              {/* Score Circular Indicator */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-[#f0f2f8]" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-[#6c63ff]" strokeDasharray={`${activeJob.match}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-[22px] font-black text-[#1a1a2e] leading-none">{activeJob.match}%</span>
                    <span className="text-[8px] font-bold text-[#8890a4] tracking-widest uppercase mt-0.5">Match</span>
                  </div>
                </div>
                {activeJob.match >= 85 && (
                  <div className="mt-3 bg-gradient-to-r from-[#6c63ff] to-[#8b5cf6] text-white text-[9px] font-bold tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Sparkles size={9} /> HIGHLY RECOMMENDED
                  </div>
                )}
              </div>

              {/* Details & Match Logic */}
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm font-bold text-[#1a1a2e] mb-2">
                  <BrainCircuit size={16} className="text-[#6c63ff]" />
                  <span>AI Reasoning</span>
                </div>
                <p className="text-[13px] text-[#4a5068] leading-relaxed mb-4">
                  This role match is based on your active profile analysis and skills matching <strong className="text-[#1a1a2e]">{activeJob.company}</strong>'s requirements.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#00c853] font-semibold">
                  <span className="flex items-center gap-1 bg-[#00c853]/8 px-2.5 py-1 rounded-full">
                    <CheckCircle2 size={13} /> {activeJob.match}% Profile Match
                  </span>
                </div>
              </div>
            </div>

            {/* About the Role & Responsibilities (Rendered ONLY if present) */}
            {(extendedData.about || extendedData.responsibilities.length > 0 || extendedData.requirements.length > 0) && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#e4e8f0]/60 flex flex-col gap-6">
                
                {/* About */}
                {extendedData.about && (
                  <div>
                    <h3 className="text-[16px] font-extrabold text-[#1a1a2e] mb-3">About the Role</h3>
                    <p className="text-[13px] text-[#4a5068] leading-relaxed mb-4">
                      {extendedData.about}
                    </p>
                  </div>
                )}

                {/* Responsibilities */}
                {extendedData.responsibilities.length > 0 && (
                  <div>
                    <h3 className="text-[16px] font-extrabold text-[#1a1a2e] mb-4">Responsibilities</h3>
                    <div className="flex flex-col gap-3">
                      {extendedData.responsibilities.map((res: string, i: number) => (
                        <div key={i} className="flex gap-3 items-start">
                          <div className="w-5 h-5 rounded-full bg-[#6c63ff]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Target size={11} className="text-[#6c63ff]" />
                          </div>
                          <span className="text-[13px] text-[#4a5068] leading-relaxed">{res}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {extendedData.requirements.length > 0 && (
                  <div>
                    <h3 className="text-[16px] font-extrabold text-[#1a1a2e] mb-4">Requirements</h3>
                    <div className="flex flex-col gap-3">
                      {extendedData.requirements.map((req: string, i: number) => (
                        <div key={i} className="flex gap-3 items-start">
                          <Check size={14} className="text-[#6c63ff] flex-shrink-0 mt-1" />
                          <span className="text-[13px] text-[#4a5068] leading-relaxed">{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar Column */}
          <div className="flex flex-col gap-6">
            
            {/* Skill Analysis Card (Rendered ONLY if skills exist) */}
            {(extendedData.skills.length > 0 || extendedData.growth.length > 0) && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60">
                <h3 className="text-[15px] font-extrabold text-[#1a1a2e] mb-4">Skill Analysis</h3>
                
                {/* Matching Skills */}
                {extendedData.skills.length > 0 && (
                  <div className="mb-5">
                    <span className="block text-[10px] font-bold text-[#b0b8cc] tracking-widest mb-2.5 uppercase">Matching Skills</span>
                    <div className="flex flex-col gap-1.5">
                      {extendedData.skills.map((skill: string) => (
                        <div key={skill} className="flex items-center justify-between px-3 py-2 bg-[#00c853]/6 rounded-lg text-xs font-semibold text-[#00a843]">
                          <span>{skill}</span>
                          <Check size={12} strokeWidth={3} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Growth Areas */}
                {extendedData.growth.length > 0 && (
                  <div className="mb-4">
                    <span className="block text-[10px] font-bold text-[#b0b8cc] tracking-widest mb-2.5 uppercase">Growth Areas</span>
                    <div className="flex flex-col gap-1.5">
                      {extendedData.growth.map((skill: string) => (
                        <div key={skill} className="flex items-center gap-2 px-3 py-2 bg-[#8b5cf6]/8 rounded-lg text-xs font-semibold text-[#6c63ff]">
                          <Info size={12} />
                          <span>{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Company Overview Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60 flex flex-col gap-4">
              <h3 className="text-[15px] font-extrabold text-[#1a1a2e]">Company Overview</h3>
              
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 border border-[#e4e8f0]"
                  style={{ background: logoBg }}
                >
                  {activeJob.logo}
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#1a1a2e]">{activeJob.company}</h4>
                  <span className="text-[11px] text-[#8890a4]">{extendedData.industry}</span>
                </div>
              </div>

              <p className="text-[12px] text-[#4a5068] leading-relaxed">
                {activeJob.company} is a leading provider of innovative enterprise solutions, delivering high performance systems and driving digital transformation.
              </p>

              {/* Stat Grid */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-[#f8f9fc] rounded-lg p-2.5 border border-[#e4e8f0]/40">
                  <span className="block text-[8px] font-bold text-[#b0b8cc] uppercase mb-1">Team Size</span>
                  <span className="text-xs font-bold text-[#1a1a2e]">500 - 1,000</span>
                </div>
                <div className="bg-[#f8f9fc] rounded-lg p-2.5 border border-[#e4e8f0]/40">
                  <span className="block text-[8px] font-bold text-[#b0b8cc] uppercase mb-1">Funding</span>
                  <span className="text-xs font-bold text-[#1a1a2e]">Series D ($420M)</span>
                </div>
              </div>

              <button
                onClick={() => showToast('Opening company website...')}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-[#e4e8f0] rounded-xl text-xs font-semibold text-[#4a5068] hover:border-[#6c63ff] hover:text-[#6c63ff] transition-all bg-white active:scale-95"
              >
                View Company Profile <ExternalLink size={12} />
              </button>
            </div>

            {/* Application Info Footer Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[
                    'bg-[#6c63ff]', 'bg-[#8b5cf6]', 'bg-[#00c853]'
                  ].map((bg, idx) => (
                    <div key={idx} className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white ${bg}`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-[#8890a4] font-medium">42 applicants</span>
              </div>

              <button
                onClick={handleApply}
                className="w-full py-3 rounded-xl text-sm font-bold text-white border-none cursor-pointer transition-all hover:bg-[#5a52e0] active:scale-95 text-center"
                style={{ background: '#6c63ff', boxShadow: '0 4px 14px rgba(108,99,255,0.3)' }}
              >
                Apply for this position
              </button>
              
              <span className="text-[11px] text-[#b0b8cc] text-center block">
                Deadline: Sep 30, 2024
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default JobDetails;
