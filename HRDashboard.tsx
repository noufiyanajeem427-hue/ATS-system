import React from 'react';
import {
  Briefcase, Users, CalendarClock, Award, ChevronRight, PlusCircle, TrendingUp
} from 'lucide-react';
import HRTopbar from '../../components/HRTopbar';
import { Page } from '../../App';
import { getStoredUser } from '../../config';
import { getJobs, getApplicants, getInterviews, getHRStats } from '../../data/hrData';

interface HRDashboardProps {
  onMenuClick?: () => void;
  onNavigate?: (p: Page, payload?: any) => void;
}

const statusColor: Record<string, string> = {
  Pending: 'bg-[#f59e0b]/10 text-[#f59e0b]',
  Shortlisted: 'bg-[#6c63ff]/10 text-[#6c63ff]',
  Interview: 'bg-[#0ea5e9]/10 text-[#0ea5e9]',
  Hired: 'bg-[#00c853]/10 text-[#00c853]',
  Rejected: 'bg-[#ff4d6d]/10 text-[#ff4d6d]',
};

const HRDashboard: React.FC<HRDashboardProps> = ({ onMenuClick, onNavigate }) => {
  const user = getStoredUser();
  const stats = getHRStats();
  const jobs = getJobs();
  const applicants = getApplicants().slice(0, 5);
  const interviews = getInterviews().filter(i => i.status === 'Scheduled').slice(0, 3);

  const pipeline = [
    { label: 'Applied', count: applicants.length ? getApplicants().length : 0, color: '#8890a4' },
    { label: 'Shortlisted', count: getApplicants().filter(a => a.status === 'Shortlisted').length, color: '#6c63ff' },
    { label: 'Interview', count: getApplicants().filter(a => a.status === 'Interview').length, color: '#0ea5e9' },
    { label: 'Hired', count: getApplicants().filter(a => a.status === 'Hired').length, color: '#00c853' },
  ];
  const maxPipeline = Math.max(...pipeline.map(p => p.count), 1);

  return (
    <div className="flex-1 flex flex-col min-w-0 lg:ml-[220px]">
      <HRTopbar onMenuClick={onMenuClick} onNavigate={onNavigate} />

      <div className="flex-1 p-4 sm:p-6 lg:p-7 overflow-y-auto">
        {/* Welcome header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1a1a2e]">Welcome back, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
            <p className="text-xs sm:text-sm text-[#8890a4]">Here's what's happening with your hiring pipeline at {user?.company || 'your company'}.</p>
          </div>
          <button
            onClick={() => onNavigate?.('hr-jobform')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-[13px] font-bold text-white border-none cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95 self-start"
            style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: '0 4px 14px rgba(108,99,255,0.4)' }}
          >
            <PlusCircle size={16} /> Post a New Job
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Active Job Postings', value: stats.activeJobs, icon: <Briefcase size={16} />, color: '#6c63ff', page: 'hr-jobs' },
            { label: 'Total Applicants', value: stats.totalApplicants, icon: <Users size={16} />, color: '#0ea5e9', page: 'hr-applicants' },
            { label: 'Interviews Scheduled', value: stats.scheduledInterviews, icon: <CalendarClock size={16} />, color: '#f59e0b', page: 'hr-interviews' },
            { label: 'Hired This Month', value: stats.hired, icon: <Award size={16} />, color: '#00c853', page: 'hr-applicants' },
          ].map((s) => (
            <div
              key={s.label}
              onClick={() => onNavigate?.(s.page as Page)}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e4e8f0] shadow-sm hover:shadow-md hover:border-[#6c63ff]/40 cursor-pointer transition-all"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2.5" style={{ background: `${s.color}1a`, color: s.color }}>
                {s.icon}
              </div>
              <span className="block text-2xl sm:text-3xl font-black text-[#1a1a2e] mb-1">{s.value}</span>
              <span className="block text-[11px] font-bold text-[#8890a4]">{s.label}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
          {/* Left: Recent applicants + pipeline */}
          <div className="flex flex-col gap-5">
            {/* Pipeline */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e4e8f0] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold text-[#1a1a2e] flex items-center gap-2">
                  <TrendingUp size={16} className="text-[#6c63ff]" /> Hiring Pipeline
                </h3>
                <button
                  onClick={() => onNavigate?.('hr-applicants')}
                  className="text-xs font-bold text-[#6c63ff] bg-transparent border-none cursor-pointer hover:underline"
                >
                  View All →
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {pipeline.map((p) => (
                  <div key={p.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#4a5068]">{p.label}</span>
                      <span className="text-xs font-bold text-[#1a1a2e]">{p.count}</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#f4f6fb] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${(p.count / maxPipeline) * 100}%`, background: p.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent applicants */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e4e8f0] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold text-[#1a1a2e]">Recent Applicants</h3>
                <button
                  onClick={() => onNavigate?.('hr-applicants')}
                  className="text-xs font-bold text-[#6c63ff] bg-transparent border-none cursor-pointer hover:underline"
                >
                  View All →
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {applicants.map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-3.5 bg-[#f8f9fc] rounded-xl border border-[#e4e8f0] hover:border-[#6c63ff]/30 transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-bold text-[13px] shadow-sm border border-[#e4e8f0] text-[#1a1a2e] flex-shrink-0">
                        {a.name[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-[#1a1a2e] truncate">{a.name}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[a.status]}`}>{a.status}</span>
                        </div>
                        <span className="text-xs text-[#8890a4] truncate">{a.jobTitle}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="hidden sm:inline text-xs font-bold text-[#00c853]">{a.matchScore}%</span>
                      <button
                        onClick={() => onNavigate?.('hr-applicants')}
                        className="p-1.5 text-[#8890a4] hover:text-[#6c63ff] bg-transparent border-none cursor-pointer"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Upcoming interviews + active jobs */}
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e4e8f0] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold text-[#1a1a2e]">Upcoming Interviews</h3>
                <button
                  onClick={() => onNavigate?.('hr-interviews')}
                  className="text-xs font-bold text-[#6c63ff] bg-transparent border-none cursor-pointer hover:underline"
                >
                  Manage →
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {interviews.length === 0 && (
                  <p className="text-xs text-[#8890a4]">No interviews scheduled yet.</p>
                )}
                {interviews.map((i) => (
                  <div key={i.id} className="p-3.5 bg-[#f8f9fc] rounded-xl border border-[#e4e8f0]">
                    <span className="block text-sm font-bold text-[#1a1a2e]">{i.applicantName}</span>
                    <span className="block text-xs text-[#8890a4] mb-1.5">{i.jobTitle}</span>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#6c63ff]">{i.date} · {i.time}</span>
                      <span className="text-[10px] font-bold text-[#4a5068] bg-white px-2 py-0.5 rounded border border-[#e4e8f0]">{i.mode}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e4e8f0] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold text-[#1a1a2e]">Active Job Postings</h3>
                <button
                  onClick={() => onNavigate?.('hr-jobs')}
                  className="text-xs font-bold text-[#6c63ff] bg-transparent border-none cursor-pointer hover:underline"
                >
                  View All →
                </button>
              </div>
              <div className="flex flex-col gap-2.5">
                {jobs.filter(j => j.status === 'Active').slice(0, 4).map((j) => (
                  <div key={j.id} className="flex items-center justify-between p-3 rounded-xl bg-[#f8f9fc] border border-[#e4e8f0]">
                    <div className="min-w-0">
                      <span className="block text-xs font-bold text-[#1a1a2e] truncate">{j.title}</span>
                      <span className="block text-[10px] text-[#8890a4]">{j.department}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white bg-[#00c853] flex-shrink-0">{j.applicantsCount} applied</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
