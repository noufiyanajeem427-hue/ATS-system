import React, { useState } from 'react';
import {
  PlusCircle, MapPin, Briefcase, Users, Edit3, Trash2, MoreVertical
} from 'lucide-react';
import HRTopbar from '../../components/HRTopbar';
import { Page } from '../../App';
import { getJobs, deleteJob, JobStatus } from '../../data/hrData';

interface JobPostingsProps {
  onMenuClick?: () => void;
  onNavigate?: (p: Page, payload?: any) => void;
}

const statusStyle: Record<JobStatus, string> = {
  Active: 'bg-[#00c853]/10 text-[#00c853]',
  Draft: 'bg-[#f59e0b]/10 text-[#f59e0b]',
  Closed: 'bg-[#8890a4]/10 text-[#8890a4]',
};

const JobPostings: React.FC<JobPostingsProps> = ({ onMenuClick, onNavigate }) => {
  const [filter, setFilter] = useState<'All' | JobStatus>('All');
  const [jobs, setJobs] = useState(getJobs());
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  const filtered = filter === 'All' ? jobs : jobs.filter(j => j.status === filter);

  const handleDelete = (id: number) => {
    deleteJob(id);
    setJobs(getJobs());
    setMenuOpenId(null);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 lg:ml-[220px]">
      <HRTopbar onMenuClick={onMenuClick} onNavigate={onNavigate} />

      <div className="flex-1 p-4 sm:p-6 lg:p-7 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1a1a2e]">Job Postings</h1>
            <p className="text-xs sm:text-sm text-[#8890a4]">Manage every role you're hiring for, from draft to close.</p>
          </div>
          <button
            onClick={() => onNavigate?.('hr-jobform')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-[13px] font-bold text-white border-none cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95 self-start"
            style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: '0 4px 14px rgba(108,99,255,0.4)' }}
          >
            <PlusCircle size={16} /> Post a New Job
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-5">
          {(['All', 'Active', 'Draft', 'Closed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                filter === f
                  ? 'bg-[#6c63ff] text-white border-[#6c63ff]'
                  : 'bg-white text-[#4a5068] border-[#e4e8f0] hover:border-[#6c63ff]/40'
              }`}
            >
              {f} {f !== 'All' ? `(${jobs.filter(j => j.status === f).length})` : `(${jobs.length})`}
            </button>
          ))}
        </div>

        {/* Job cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((job) => (
            <div key={job.id} className="relative bg-white rounded-2xl p-5 border border-[#e4e8f0] shadow-sm hover:shadow-md hover:border-[#6c63ff]/30 transition-all">
              <div className="flex items-start justify-between mb-3">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusStyle[job.status]}`}>{job.status}</span>
                <div className="relative">
                  <button
                    onClick={() => setMenuOpenId(menuOpenId === job.id ? null : job.id)}
                    className="p-1 text-[#8890a4] hover:text-[#6c63ff] bg-transparent border-none cursor-pointer"
                  >
                    <MoreVertical size={16} />
                  </button>
                  {menuOpenId === job.id && (
                    <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-xl border border-[#e4e8f0] py-1.5 z-20">
                      <button
                        onClick={() => { setMenuOpenId(null); onNavigate?.('hr-jobform', job); }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-[12px] font-semibold text-[#4a5068] hover:bg-[#6c63ff]/5 hover:text-[#6c63ff] border-none bg-transparent cursor-pointer"
                      >
                        <Edit3 size={13} /> Edit Job
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-[12px] font-semibold text-[#ff4d6d] hover:bg-[#ff4d6d]/5 border-none bg-transparent cursor-pointer"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-[15px] font-extrabold text-[#1a1a2e] mb-1.5 leading-snug">{job.title}</h3>
              <div className="flex items-center gap-1.5 text-xs text-[#8890a4] mb-1">
                <Briefcase size={12} /> {job.department} · {job.type}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#8890a4] mb-4">
                <MapPin size={12} /> {job.location}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#f0f2f8]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#6c63ff]">
                  <Users size={13} /> {job.applicantsCount} Applicants
                </div>
                <button
                  onClick={() => onNavigate?.('hr-applicants', job.id)}
                  className="text-[11px] font-bold text-[#6c63ff] bg-transparent border-none cursor-pointer hover:underline"
                >
                  View Applicants →
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-sm text-[#8890a4]">No jobs in this category yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobPostings;
