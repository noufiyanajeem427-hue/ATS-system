import React, { useState } from 'react';
import { Filter, Mail, MapPin, Star, ChevronDown, Download } from 'lucide-react';
import HRTopbar from '../../components/HRTopbar';
import { Page } from '../../App';
import { getApplicants, updateApplicantStatus, getJobs, ApplicantStatus } from '../../data/hrData';

interface ApplicantsProps {
  filterJobId?: number;
  onMenuClick?: () => void;
  onNavigate?: (p: Page, payload?: any) => void;
}

const statuses: ApplicantStatus[] = ['Pending', 'Shortlisted', 'Interview', 'Hired', 'Rejected'];

const statusStyle: Record<ApplicantStatus, string> = {
  Pending: 'bg-[#f59e0b]/10 text-[#f59e0b]',
  Shortlisted: 'bg-[#6c63ff]/10 text-[#6c63ff]',
  Interview: 'bg-[#0ea5e9]/10 text-[#0ea5e9]',
  Hired: 'bg-[#00c853]/10 text-[#00c853]',
  Rejected: 'bg-[#ff4d6d]/10 text-[#ff4d6d]',
};

const Applicants: React.FC<ApplicantsProps> = ({ filterJobId, onMenuClick, onNavigate }) => {
  const jobs = getJobs();
  const [jobFilter, setJobFilter] = useState<number | 'All'>(filterJobId || 'All');
  const [statusFilter, setStatusFilter] = useState<'All' | ApplicantStatus>('All');
  const [applicants, setApplicants] = useState(getApplicants());
  const [openStatusMenu, setOpenStatusMenu] = useState<number | null>(null);

  const filtered = applicants.filter(a =>
    (jobFilter === 'All' || a.jobId === jobFilter) &&
    (statusFilter === 'All' || a.status === statusFilter)
  );

  const handleStatusChange = (id: number, status: ApplicantStatus) => {
    updateApplicantStatus(id, status);
    setApplicants(getApplicants());
    setOpenStatusMenu(null);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 lg:ml-[220px]">
      <HRTopbar onMenuClick={onMenuClick} onNavigate={onNavigate} />

      <div className="flex-1 p-4 sm:p-6 lg:p-7 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-black text-[#1a1a2e]">Applicants</h1>
          <p className="text-xs sm:text-sm text-[#8890a4]">Review candidates and move them through your pipeline.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex items-center gap-2 bg-white border border-[#e4e8f0] rounded-xl px-3 py-2">
            <Filter size={14} className="text-[#8890a4]" />
            <select
              value={jobFilter}
              onChange={e => setJobFilter(e.target.value === 'All' ? 'All' : Number(e.target.value))}
              className="border-none outline-none bg-transparent text-xs font-bold text-[#4a5068] cursor-pointer"
            >
              <option value="All">All Jobs</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            {(['All', ...statuses] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3.5 py-2 rounded-xl text-[11.5px] font-bold border cursor-pointer transition-all ${
                  statusFilter === s
                    ? 'bg-[#6c63ff] text-white border-[#6c63ff]'
                    : 'bg-white text-[#4a5068] border-[#e4e8f0] hover:border-[#6c63ff]/40'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Applicants list */}
        <div className="flex flex-col gap-3">
          {filtered.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e4e8f0] shadow-sm hover:border-[#6c63ff]/30 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#6c63ff] to-[#a78bfa] flex items-center justify-center text-[13px] font-black text-white flex-shrink-0">
                    {a.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-extrabold text-[#1a1a2e]">{a.name}</span>
                      <span className="flex items-center gap-1 text-[10.5px] font-bold text-[#00c853]">
                        <Star size={10} fill="#00c853" /> {a.matchScore}% Match
                      </span>
                    </div>
                    <span className="text-xs text-[#8890a4]">{a.jobTitle} · {a.experience} exp</span>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-[10.5px] text-[#8890a4]"><Mail size={11} /> {a.email}</span>
                      <span className="flex items-center gap-1 text-[10.5px] text-[#8890a4]"><MapPin size={11} /> {a.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => onNavigate?.('hr-interviews', { applicantId: a.id, applicantName: a.name, jobTitle: a.jobTitle })}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold text-[#6c63ff] bg-[#6c63ff]/8 border-none cursor-pointer hover:bg-[#6c63ff]/15"
                  >
                    Schedule Interview
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setOpenStatusMenu(openStatusMenu === a.id ? null : a.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-bold border-none cursor-pointer ${statusStyle[a.status]}`}
                    >
                      {a.status} <ChevronDown size={12} />
                    </button>
                    {openStatusMenu === a.id && (
                      <div className="absolute right-0 top-9 w-40 bg-white rounded-xl shadow-xl border border-[#e4e8f0] py-1.5 z-20">
                        {statuses.map(s => (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(a.id, s)}
                            className="w-full flex items-center gap-2 px-3.5 py-2 text-[12px] font-semibold text-[#4a5068] hover:bg-[#6c63ff]/5 hover:text-[#6c63ff] border-none bg-transparent cursor-pointer text-left"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#f0f2f8]">
                <div className="flex flex-wrap gap-1.5">
                  {a.skills.map((sk, idx) => (
                    <span key={idx} className="text-[9.5px] font-bold text-[#4a5068] bg-[#f8f9fc] px-2 py-0.5 rounded border border-[#e4e8f0]">{sk}</span>
                  ))}
                </div>
                <button className="flex items-center gap-1.5 text-[11px] font-bold text-[#6c63ff] bg-transparent border-none cursor-pointer hover:underline flex-shrink-0">
                  <Download size={12} /> Resume
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-sm text-[#8890a4] bg-white rounded-2xl border border-[#e4e8f0]">No applicants match this filter.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Applicants;
