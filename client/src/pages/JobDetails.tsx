import React, { useState } from 'react';
import Topbar from '../components/Topbar';
import {
  Briefcase, MapPin, DollarSign, ArrowRight,
  BrainCircuit, CheckCircle2, ChevronRight, Info, ExternalLink,
  Sparkles, Check, Bookmark, Target, X
} from 'lucide-react';
import { Page } from '../App';

interface JobDetailsProps {
  job?: {
    id?: number;
    title: string;
    company: string;
    location: string;
    match: number;
    salary: string;
    type: string;
    logo: string;
  };
  onMenuClick?: () => void;
  onNavigate?: (p: Page) => void;
}

// Custom data mapping for different job titles to make the page dynamic
const getJobExtendedData = (title: string) => {
  const t = title.toLowerCase();
  
  if (t.includes('ux') || t.includes('ui') || t.includes('designer')) {
    return {
      about: "As a designer in this role, you will be at the forefront of defining how users interact with next-generation applications. You aren't just designing screens; you are designing behaviors, trust-loops, and multi-modal experiences that bridge the gap between complex backend architectures and intuitive workflows.",
      responsibilities: [
        'Lead the end-to-end design lifecycle, focusing on high-fidelity prototyping of user interfaces.',
        'Partner with Product and Engineering to ensure UI outputs are both technically feasible and human-centric.',
        'Develop and maintain reusable design tokens, component libraries, and visual guidelines.',
        'Conduct qualitative user research and translate insights into high-impact user experiences.'
      ],
      requirements: [
        '5+ years of experience in Product/UX/UI Design, with a strong focus on complex web applications.',
        'Deep visual craft and systems thinking demonstrated in your portfolio.',
        'Proficiency in Figma, ProtoPie, and familiarity with front-end technologies like React & Tailwind.',
        'Excellent communication skills to articulate design decisions to stakeholders.'
      ],
      skills: ['Product Design', 'Figma', 'Systems Thinking', 'Prototyping', 'Data Viz'],
      growth: ['Agentic Workflows', 'LLM Integration'],
      industry: 'Design & User Experience'
    };
  }
  
  if (t.includes('infrastructure') || t.includes('engineer') || t.includes('developer')) {
    return {
      about: "In this engineering role, you will be architecting and managing highly scalable cloud systems. You will optimize pipeline throughput, establish resilient deployment infrastructure, and design distributed orchestration protocols to ensure high availability and robust security standards.",
      responsibilities: [
        'Design, build, and maintain our scalable cloud deployment infrastructure.',
        'Build telemetry dashboards, configure alert handlers, and automate failover procedures.',
        'Collaborate with developers to optimize container runtimes and secure network pathways.',
        'Manage continuous integration pipelines and automated container deployments.'
      ],
      requirements: [
        '6+ years of experience in Software Engineering, Infrastructure, or DevOps environments.',
        'Expertise in Kubernetes, Terraform, AWS/GCP, and container orchestration.',
        'Strong programming background in Go, Python, or TypeScript.',
        'Proven track record of maintaining 99.99% uptime SLA environments.'
      ],
      skills: ['Cloud Infrastructure', 'Kubernetes', 'Go / Python', 'Terraform', 'CI/CD Pipelines'],
      growth: ['Distributed Consensus', 'Edge Computing'],
      industry: 'Cloud & Distributed Systems'
    };
  }

  return {
    about: "Join a fast-growing engineering and product team solving mission-critical enterprise problems. In this role, you will directly drive feature delivery, collaborate across functional teams, and define technical standards to scale our core software architecture.",
    responsibilities: [
      'Own end-to-end feature modules from concept through validation and deployment.',
      'Collaborate closely with product managers and architects to establish technical milestones.',
      'Maintain continuous delivery pipelines and adhere to high test-coverage standards.',
      'Mentor junior team members and participate in architectural design reviews.'
    ],
    requirements: [
      '4+ years of professional industry experience in fast-paced software environments.',
      'Solid foundation in modern web frameworks, system architecture, and API design.',
      'Comfortable taking ownership of ambiguous product requirements.',
      'Strong problem-solving ability and analytical mindset.'
    ],
    skills: ['Software Architecture', 'API Integration', 'Testing & CI/CD', 'Problem Solving'],
    growth: ['Technical Leadership', 'System Optimization'],
    industry: 'Enterprise Software'
  };
};

const logoBgMap: Record<string, string> = {
  CS: 'linear-gradient(135deg,#667eea,#764ba2)',
  LC: 'linear-gradient(135deg,#f093fb,#f5576c)',
  GS: 'linear-gradient(135deg,#4facfe,#00f2fe)',
  NX: 'linear-gradient(135deg,#6c63ff,#8b5cf6)',
};

const defaultJob = {
  title: 'Senior AI Product Designer',
  company: 'Nexus AI',
  location: 'San Francisco, CA • Remote',
  match: 98,
  salary: '$180k - $240k',
  type: 'Full-time',
  logo: 'NX'
};

const JobDetails: React.FC<JobDetailsProps> = ({ job, onMenuClick, onNavigate }) => {
  const activeJob = job || defaultJob;
  const extendedData = getJobExtendedData(activeJob.title);
  const logoBg = logoBgMap[activeJob.logo] || 'linear-gradient(135deg,#6c63ff,#8b5cf6)';

  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApply = () => {
    showToast(`✓ Application submitted to ${activeJob.company}!`);
    setTimeout(() => {
      onNavigate?.('applications');
    }, 1200);
  };

  const handleSaveToggle = () => {
    setIsSaved(!isSaved);
    showToast(!isSaved ? 'Job saved to your bookmarks!' : 'Job removed from bookmarks.');
  };

  return (
    <div className="flex flex-col min-h-screen w-full lg:w-[calc(100vw-220px)] lg:ml-[220px] bg-[#f4f6fb] dark:bg-[#0b0f19] text-[#1a1a2e] dark:text-[#f8fafc] overflow-x-hidden relative font-sans transition-colors duration-200">
      <Topbar onMenuClick={onMenuClick} onNavigate={onNavigate} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 bg-[#1a1a2e] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#6c63ff]/30 z-50 flex items-center gap-3 animate-bounce">
          <Sparkles className="text-[#6c63ff]" size={18} />
          <span className="text-xs font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-[#8890a4] hover:text-white ml-2 bg-transparent border-none cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Back Button Header Bar */}
      <div className="px-4 sm:px-8 pt-6 pb-2">
        <button
          onClick={() => onNavigate?.('jobsearch')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6c63ff] dark:text-[#a78bfa] hover:underline bg-transparent border-none cursor-pointer"
        >
          ← Back to Job Search
        </button>
      </div>

      <div className="flex-1 px-4 sm:px-8 py-4">
        
        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          
          {/* Left Main Details Column */}
          <div className="flex flex-col gap-6">
            
            {/* Header Hero Card */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 sm:p-8 shadow-sm border border-[#e4e8f0] dark:border-[#1f2d42]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md"
                    style={{ background: logoBg }}
                  >
                    {activeJob.logo}
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-[24px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc] leading-tight mb-1">
                      {activeJob.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#8890a4] dark:text-[#94a3b8] font-medium">
                      <span className="flex items-center gap-1"><Briefcase size={13} /> {activeJob.company}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><MapPin size={13} /> {activeJob.location}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-[#00c853] font-bold"><DollarSign size={13} /> {activeJob.salary}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleApply}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white border-none cursor-pointer transition-all hover:opacity-90 active:scale-95 whitespace-nowrap"
                    style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: '0 4px 14px rgba(108,99,255,0.35)' }}
                  >
                    Apply Now <ArrowRight size={15} />
                  </button>
                  <button
                    onClick={handleSaveToggle}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border transition-all active:scale-95 whitespace-nowrap cursor-pointer
                      ${isSaved ? 'bg-[#ff4d6d]/10 border-[#ff4d6d] text-[#ff4d6d]' : 'bg-white dark:bg-[#111827] border-[#e4e8f0] dark:border-[#1f2d42] text-[#4a5068] dark:text-[#cbd5e1] hover:border-[#6c63ff] hover:text-[#6c63ff]'}`}
                  >
                    {isSaved ? <Bookmark size={15} fill="currentColor" /> : <Bookmark size={15} />}
                    {isSaved ? 'Saved' : 'Save Job'}
                  </button>
                </div>
              </div>

              {/* Tag Badges */}
              <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-[#f0f2f8] dark:border-[#1f2d42]">
                {[(activeJob.type || 'Full-time').toUpperCase(), 'AI INTEGRATION', 'SENIOR LEVEL', 'POSTED 2 DAYS AGO'].map((tag) => (
                  <span key={tag} className="text-[10px] font-bold tracking-wider px-3 py-1.5 rounded-lg bg-[#f4f6fb] dark:bg-[#161e2e] text-[#5a6080] dark:text-[#cbd5e1]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Reasoning Match Card */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 shadow-sm border border-[#e4e8f0] dark:border-[#1f2d42] flex flex-col md:flex-row items-center gap-6">
              
              {/* Score Circular Indicator */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-[#f0f2f8] dark:text-[#1f2d42]" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-[#6c63ff]" strokeDasharray={`${activeJob.match}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-[22px] font-black text-[#1a1a2e] dark:text-[#f8fafc] leading-none">{activeJob.match}%</span>
                    <span className="text-[8px] font-bold text-[#8890a4] dark:text-[#94a3b8] tracking-widest uppercase mt-0.5">Match</span>
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
                <div className="flex items-center gap-2 text-sm font-bold text-[#1a1a2e] dark:text-[#f8fafc] mb-2">
                  <BrainCircuit size={16} className="text-[#6c63ff]" />
                  <span>AI Reasoning</span>
                </div>
                <p className="text-[13px] text-[#4a5068] dark:text-[#cbd5e1] leading-relaxed mb-4">
                  This role is an exceptional match based on your recent profile analysis. Your matching profile metrics and experience aligned perfectly with <strong className="text-[#1a1a2e] dark:text-[#f8fafc]">{activeJob.company}</strong>'s upcoming core business objectives.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#00c853] font-semibold">
                  <span className="flex items-center gap-1 bg-[#00c853]/8 px-2.5 py-1 rounded-full">
                    <CheckCircle2 size={13} /> {activeJob.match >= 85 ? '12/12 Key Skills' : '10/12 Key Skills'}
                  </span>
                  <span className="flex items-center gap-1 bg-[#00c853]/8 px-2.5 py-1 rounded-full">
                    <CheckCircle2 size={13} /> {activeJob.match >= 80 ? '5+ Yrs Experience' : '3+ Yrs Experience'}
                  </span>
                </div>
              </div>
            </div>

            {/* About the Role & Responsibilities */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl p-6 sm:p-8 shadow-sm border border-[#e4e8f0] dark:border-[#1f2d42] flex flex-col gap-6">
              
              {/* About */}
              <div>
                <h3 className="text-[16px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc] mb-3">About the Role</h3>
                <p className="text-[13px] text-[#4a5068] dark:text-[#cbd5e1] leading-relaxed mb-4">
                  {extendedData.about}
                </p>
              </div>

              {/* Responsibilities */}
              <div>
                <h3 className="text-[16px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc] mb-4">Responsibilities</h3>
                <div className="flex flex-col gap-3">
                  {extendedData.responsibilities.map((res, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="w-5 h-5 rounded-full bg-[#6c63ff]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Target size={11} className="text-[#6c63ff]" />
                      </div>
                      <span className="text-[13px] text-[#4a5068] dark:text-[#cbd5e1] leading-relaxed">{res}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-[16px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc] mb-4">Requirements</h3>
                <div className="flex flex-col gap-3">
                  {extendedData.requirements.map((req, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <Check size={14} className="text-[#6c63ff] flex-shrink-0 mt-1" />
                      <span className="text-[13px] text-[#4a5068] dark:text-[#cbd5e1] leading-relaxed">{req}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="flex flex-col gap-6">
            
            {/* Skill Analysis Card */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 shadow-sm border border-[#e4e8f0] dark:border-[#1f2d42]">
              <h3 className="text-[15px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc] mb-4">Skill Analysis</h3>
              
              {/* Matching Skills */}
              <div className="mb-5">
                <span className="block text-[10px] font-bold text-[#b0b8cc] dark:text-[#64748b] tracking-widest mb-2.5 uppercase">Matching Skills</span>
                <div className="flex flex-col gap-1.5">
                  {extendedData.skills.map((skill) => (
                    <div key={skill} className="flex items-center justify-between px-3 py-2 bg-[#00c853]/6 dark:bg-[#00c853]/15 rounded-lg text-xs font-semibold text-[#00a843] dark:text-[#00e676]">
                      <span>{skill}</span>
                      <Check size={12} strokeWidth={3} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Growth Areas */}
              <div className="mb-4">
                <span className="block text-[10px] font-bold text-[#b0b8cc] dark:text-[#64748b] tracking-widest mb-2.5 uppercase">Growth Areas</span>
                <div className="flex flex-col gap-1.5">
                  {extendedData.growth.map((skill) => (
                    <div key={skill} className="flex items-center gap-2 px-3 py-2 bg-[#8b5cf6]/8 dark:bg-[#8b5cf6]/20 rounded-lg text-xs font-semibold text-[#6c63ff] dark:text-[#a78bfa]">
                      <Info size={12} />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-[#8890a4] dark:text-[#94a3b8] leading-relaxed italic border-t border-[#f0f2f8] dark:border-[#1f2d42] pt-3">
                {activeJob.company} offers internal training programs for these specific areas.
              </p>
            </div>

            {/* Company Overview Card */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 shadow-sm border border-[#e4e8f0] dark:border-[#1f2d42] flex flex-col gap-4">
              <h3 className="text-[15px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc]">Company Overview</h3>
              
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 border border-[#e4e8f0] dark:border-[#1f2d42]"
                  style={{ background: logoBg }}
                >
                  {activeJob.logo}
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#1a1a2e] dark:text-[#f8fafc]">{activeJob.company}</h4>
                  <span className="text-[11px] text-[#8890a4] dark:text-[#94a3b8]">{extendedData.industry}</span>
                </div>
              </div>

              <p className="text-[12px] text-[#4a5068] dark:text-[#cbd5e1] leading-relaxed">
                {activeJob.company} is a leading provider of innovative enterprise solutions, delivering high performance systems and driving digital transformation.
              </p>

              {/* Stat Grid */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-[#f8f9fc] dark:bg-[#161e2e] rounded-lg p-2.5 border border-[#e4e8f0]/40 dark:border-[#1f2d42]">
                  <span className="block text-[8px] font-bold text-[#b0b8cc] dark:text-[#64748b] uppercase mb-1">Team Size</span>
                  <span className="text-xs font-bold text-[#1a1a2e] dark:text-[#f8fafc]">500 - 1,000</span>
                </div>
                <div className="bg-[#f8f9fc] dark:bg-[#161e2e] rounded-lg p-2.5 border border-[#e4e8f0]/40 dark:border-[#1f2d42]">
                  <span className="block text-[8px] font-bold text-[#b0b8cc] dark:text-[#64748b] uppercase mb-1">Funding</span>
                  <span className="text-xs font-bold text-[#1a1a2e] dark:text-[#f8fafc]">Series D ($420M)</span>
                </div>
              </div>

              <button
                onClick={() => showToast('Opening company website...')}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-[#e4e8f0] dark:border-[#1f2d42] rounded-xl text-xs font-semibold text-[#4a5068] dark:text-[#cbd5e1] hover:border-[#6c63ff] hover:text-[#6c63ff] transition-all bg-white dark:bg-[#111827] active:scale-95 cursor-pointer"
              >
                View Company Profile <ExternalLink size={12} />
              </button>
            </div>

            {/* Application Info Footer Card */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 shadow-sm border border-[#e4e8f0] dark:border-[#1f2d42] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {[
                    'bg-[#6c63ff]', 'bg-[#8b5cf6]', 'bg-[#00c853]'
                  ].map((bg, idx) => (
                    <div key={idx} className={`w-7 h-7 rounded-full border-2 border-white dark:border-[#111827] flex items-center justify-center text-[8px] font-bold text-white ${bg}`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-[#8890a4] dark:text-[#94a3b8] font-medium">42 applicants</span>
              </div>

              <button
                onClick={handleApply}
                className="w-full py-3 rounded-xl text-sm font-bold text-white border-none cursor-pointer transition-all hover:bg-[#5a52e0] active:scale-95 text-center"
                style={{ background: '#6c63ff', boxShadow: '0 4px 14px rgba(108,99,255,0.3)' }}
              >
                Apply for this position
              </button>
              
              <span className="text-[11px] text-[#b0b8cc] dark:text-[#64748b] text-center block">
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
