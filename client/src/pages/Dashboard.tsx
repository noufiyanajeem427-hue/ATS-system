import React, { useState } from 'react';
import Topbar from '../components/Topbar';
import {
  Zap, TrendingUp, CheckCircle2, Video,
  Calendar, Clock, ExternalLink, ChevronRight,
  Play, MessageSquare, Sparkles, Plus, X
} from 'lucide-react';
import { Page } from '../App';

interface DashboardProps {
  onMenuClick?: () => void;
  onNavigate?: (p: Page) => void;
}

const pipelineJobs = [
  { company: 'Netflix', badge: 'Technical Round', badgeColor: 'blue', role: 'Senior Product Designer', location: 'California (Remote)', status: 'Scheduled for Oct 24', dotColor: '#6c63ff' },
  { company: 'Meta',    badge: 'Screening Done',  badgeColor: 'green', role: 'Product Lead', location: 'Menlo Park', status: 'Updated 2 days ago', dotColor: '#d1d5db' },
  { company: 'Stripe',  badge: 'Applied',         badgeColor: 'gray',  role: 'Design Systems Architect', location: 'London', status: 'Reviewing', dotColor: '#d1d5db' },
];

const recommended = [
  { initials: 'A', bg: '#1a1a2e', title: 'Staff UI Designer', match: 98, matchColor: '#00c853', company: 'Airbnb', location: 'San Francisco (Hybrid)', tags: ['Design Systems', 'Figma', '$180k-$240k'] },
  { initials: 'A', bg: '#f59e0b', title: 'Design Lead (AI)',  match: 92, matchColor: '#6c63ff', company: 'Amazon',  location: 'Seattle (On-site)',      tags: ['AI/ML', 'Strategy', '$200k+'], tagMatch: true },
];

const badgeClass: Record<string, string> = {
  blue:  'bg-[#6c63ff]/10 text-[#6c63ff]',
  green: 'bg-[#00c853]/10 text-[#00a843]',
  gray:  'bg-[#f0f2f8] text-[#8890a4]',
};

const Dashboard: React.FC<DashboardProps> = ({ onMenuClick, onNavigate }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-[32px] font-extrabold text-[#1a1a2e] tracking-tight mb-1">Welcome back, Alex.</h1>
          <p className="text-xs sm:text-sm text-[#8890a4]">Here's how your career search is progressing today.</p>
        </div>

        {/* Top Row */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5 mb-5">
          {/* AI Insights Card */}
          <div className="relative rounded-2xl overflow-hidden p-5 sm:p-7 grid grid-cols-1 md:grid-cols-[1fr_220px] gap-6"
            style={{ background: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)', boxShadow: '0 8px 32px rgba(108,99,255,0.2)' }}>
            <div className="absolute top-[-60px] right-[-60px] w-48 h-48 rounded-full bg-[#6c63ff]/15 pointer-events-none"/>

            {/* Left */}
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#a78bfa] tracking-widest mb-3">
                <Zap size={13} className="text-[#a78bfa]"/> NEXUS AI INSIGHTS
              </div>
              <h2 className="text-xl sm:text-[24px] font-extrabold text-white leading-snug mb-5">
                Your profile is 85% ready for top-tier roles.
              </h2>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                {[
                  { label: 'Weekly Views', value: '187', change: '+12% from last week', icon: <TrendingUp size={11}/>, valueClass: 'text-white' },
                  { label: 'Match Accuracy', value: '98%', change: 'Highly Optimized', icon: <CheckCircle2 size={11}/>, valueClass: 'text-[#a78bfa]' },
                ].map((s) => (
                  <div key={s.label} className="flex-1 bg-white/[0.07] border border-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
                    <span className="block text-[11px] text-white/50 mb-1">{s.label}</span>
                    <span className={`block text-2xl sm:text-[26px] font-extrabold mb-1 ${s.valueClass}`}>{s.value}</span>
                    <span className="flex items-center gap-1 text-[11px] text-green-400">{s.icon}{s.change}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  onClick={() => onNavigate?.('resume')}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-[14px] font-semibold text-white border-none cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95"
                  style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: '0 4px 14px rgba(108,99,255,0.4)' }}
                >
                  Complete Profile <ChevronRight size={14}/>
                </button>
                <button
                  onClick={() => showToast("Opening Detailed Analytics Report...")}
                  className="bg-transparent border-none text-[14px] font-medium text-white/70 cursor-pointer hover:text-white transition-colors active:scale-95"
                >
                  View Analytics
                </button>
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-3">
              <div className="bg-white/95 rounded-2xl p-4 backdrop-blur-xl">
                <span className="block text-[10px] font-bold text-[#8890a4] tracking-widest mb-3">TOP AI MATCH</span>
                <div className="flex gap-2.5 items-start mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#4285f4] flex items-center justify-center text-white text-base font-bold flex-shrink-0">G</div>
                  <div>
                    <div className="text-[13px] font-bold text-[#1a1a2e]">Senior Product Designer</div>
                    <div className="text-[11px] text-[#8890a4]">Google • Remote</div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2.5 border-t border-[#f0f2f8]">
                  <span className="flex items-center gap-1 text-[12px] font-semibold text-[#00c853] bg-[#00c853]/10 px-2 py-0.5 rounded-full">
                    <Zap size={11}/> 96% Match
                  </span>
                  <button
                    onClick={() => onNavigate?.('jobdetails')}
                    className="text-[12px] font-semibold text-[#6c63ff] bg-transparent border-none cursor-pointer hover:underline"
                  >
                    Details
                  </button>
                </div>
              </div>

              <div
                onClick={() => showToast("Goal Added: AI Recommendation Engine Updated!")}
                className="flex items-center gap-2.5 bg-white/[0.06] border-2 border-dashed border-white/15 rounded-xl p-3.5 cursor-pointer hover:bg-white/10 transition-all active:scale-95"
              >
                <Plus size={22} className="text-[#b0b8cc] flex-shrink-0"/>
                <span className="text-[12px] text-white/50 leading-tight">Add another goal to refine recommendations</span>
              </div>
            </div>
          </div>

          {/* Interview Card */}
          <div className="bg-white rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[16px] font-bold text-[#1a1a2e]">Next Interview</span>
              <button
                onClick={() => onNavigate?.('interview')}
                className="w-8 h-8 flex items-center justify-center bg-[#f4f6fb] rounded-[9px] border-none cursor-pointer text-[#8890a4] hover:text-[#6c63ff] transition-colors"
                title="View Calendar"
              >
                <Calendar size={16}/>
              </button>
            </div>

            <div className="bg-[#f8f9fc] rounded-xl p-5 flex flex-col items-center gap-3 text-center">
              <div className="w-14 h-14 rounded-full bg-[#6c63ff]/10 flex items-center justify-center">
                <Video size={28} className="text-[#6c63ff]"/>
              </div>
              <div>
                <div className="text-[15px] font-bold text-[#1a1a2e]">Technical Round</div>
                <div className="text-[12px] text-[#8890a4] mt-0.5">Netflix • Engineering Team</div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[13px] text-[#4a5068]"><Calendar size={14} className="text-[#8890a4]"/> Wednesday, Oct 24</div>
              <div className="flex items-center gap-2 text-[13px] text-[#4a5068]"><Clock size={14} className="text-[#8890a4]"/> 10:00 AM – 11:30 AM (PST)</div>
            </div>

            <button
              onClick={() => showToast("Connecting to Netflix Technical Interview Room...")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-semibold text-white border-none cursor-pointer transition-all hover:bg-[#1a4a7a] active:scale-95"
              style={{ background: '#0f3460', boxShadow: '0 4px 14px rgba(15,52,96,0.3)' }}
            >
              Join Interview <ExternalLink size={14}/>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {[
            { icon: <Play size={15}/>, label: 'Applied',    count: 24, sub: 'Total Applications', accent: '#6c63ff', bg: 'rgba(108,99,255,0.08)', target: 'applications' as Page },
            { icon: <MessageSquare size={15}/>, label: 'Interviews', count: 8, sub: 'In Progress', accent: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', target: 'interview' as Page },
            { icon: <Sparkles size={15}/>, label: 'Offers', count: 2, sub: 'Active Offers', accent: '#00c853', bg: 'rgba(0,200,83,0.08)', target: 'applications' as Page },
            { icon: null, label: 'Archived', count: 5, sub: 'Rejected / Closed', accent: '#ff4d6d', bg: 'rgba(255,77,109,0.08)', isX: true, target: 'applications' as Page },
          ].map((s) => (
            <div
              key={s.label}
              onClick={() => onNavigate?.(s.target)}
              className="bg-white rounded-2xl p-5 shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer border-l-4"
              style={{ borderColor: s.accent }}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.bg, color: s.accent }}>
                  {s.isX
                    ? <svg viewBox="0 0 24 24" fill="none" stroke={s.accent} strokeWidth="2.5" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                    : s.icon}
                </div>
                <span className="text-[12px] font-semibold text-[#8890a4]">{s.label}</span>
              </div>
              <div className="text-[32px] font-extrabold leading-none mb-1" style={{ color: s.accent }}>{s.count}</div>
              <div className="text-[12px] text-[#b0b8cc]">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          {/* Pipeline */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[16px] font-bold text-[#1a1a2e]">Active Pipeline</span>
              <button
                onClick={() => onNavigate?.('applications')}
                className="text-[13px] font-semibold text-[#8890a4] bg-transparent border-none cursor-pointer hover:text-[#6c63ff] transition-colors"
              >
                View All
              </button>
            </div>
            <div className="flex flex-col">
              {pipelineJobs.map((job, i) => (
                <div
                  key={i}
                  onClick={() => onNavigate?.('applications')}
                  className="flex gap-3.5 items-start pb-5 last:pb-0 cursor-pointer group"
                >
                  <div className="flex flex-col items-center w-2.5 flex-shrink-0 mt-1.5">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: job.dotColor }}/>
                    {i < pipelineJobs.length - 1 && <div className="w-0.5 flex-1 bg-[#e4e8f0] min-h-[24px] mt-1"/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="text-[14px] font-semibold text-[#1a1a2e] group-hover:text-[#6c63ff] transition-colors">{job.company}</span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badgeClass[job.badgeColor]}`}>{job.badge}</span>
                    </div>
                    <div className="text-[12px] text-[#8890a4]">{job.role} • {job.location}</div>
                  </div>
                  <div className="text-[12px] text-[#b0b8cc] whitespace-nowrap flex-shrink-0 mt-1">{job.status}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[16px] font-bold text-[#1a1a2e]">Recommended for You</span>
              <button
                onClick={() => onNavigate?.('jobsearch')}
                className="text-[13px] font-semibold text-[#6c63ff] bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity"
              >
                See Matches
              </button>
            </div>
            <div className="flex flex-col gap-3.5">
              {recommended.map((job, i) => (
                <div
                  key={i}
                  onClick={() => onNavigate?.('jobdetails')}
                  className="flex gap-3 p-3.5 rounded-xl border-[1.5px] border-[#f0f2f8] cursor-pointer hover:border-[#dddaff] hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold text-white flex-shrink-0" style={{ background: job.bg }}>
                    {job.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5 gap-2">
                      <span className="text-[14px] font-bold text-[#1a1a2e] truncate hover:text-[#6c63ff]">{job.title}</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap" style={{ color: job.matchColor, background: `${job.matchColor}18` }}>
                        ✦ {job.match}% Match
                      </span>
                    </div>
                    <div className="text-[12px] text-[#8890a4] mb-2">{job.company} • {job.location}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {job.tags.map((t) => (
                        <span key={t} className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#f0f2f8] text-[#6a7090]">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5 border-t border-[#e8edf5] text-[12px] text-[#b0b8cc]">
          <span>© 2024 TalentStream AI. All rights reserved.</span>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Support'].map((l) => (
              <button
                key={l}
                onClick={() => showToast(`Opening ${l}...`)}
                className="text-[#b0b8cc] bg-transparent border-none cursor-pointer hover:text-[#6c63ff] transition-colors"
              >
                {l}
              </button>
            ))}
          </div>
        </footer>
      </div>

      {/* Chat FAB */}
      <button
        onClick={() => onNavigate?.('messages')}
        className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 w-12 h-12 rounded-full flex items-center justify-center border-none cursor-pointer z-40 transition-all hover:scale-110 hover:-translate-y-0.5 active:scale-95"
        style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: '0 6px 20px rgba(108,99,255,0.4)' }}
        title="Open AI Chat Assistant"
      >
        <MessageSquare size={20} className="text-white"/>
      </button>
    </div>
  );
};

export default Dashboard;
