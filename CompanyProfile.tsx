import React, { useState } from 'react';
import { Building2, Globe, MapPin, Users, Check } from 'lucide-react';
import HRTopbar from '../../components/HRTopbar';
import { Page } from '../../App';
import { getStoredUser } from '../../config';
import { getHRStats } from '../../data/hrData';

interface CompanyProfileProps {
  onMenuClick?: () => void;
  onNavigate?: (p: Page, payload?: any) => void;
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({ onMenuClick, onNavigate }) => {
  const user = getStoredUser();
  const stats = getHRStats();
  const [companyName, setCompanyName] = useState(user?.company || 'Your Company');
  const [website, setWebsite] = useState('https://www.nexhire.com');
  const [industry, setIndustry] = useState('Software / SaaS');
  const [size, setSize] = useState('51-200 employees');
  const [hq, setHq] = useState('San Francisco, CA');
  const [about, setAbout] = useState('We build AI-powered tools that help great candidates find great teams, faster.');
  const [toast, setToast] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setToast('Company profile saved!');
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 lg:ml-[220px]">
      <HRTopbar onMenuClick={onMenuClick} onNavigate={onNavigate} />

      {toast && (
        <div className="fixed top-16 right-6 z-50 flex items-center gap-2.5 bg-[#1a1a2e] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-[#6c63ff]/30 text-xs font-semibold">
          <Check size={14} className="text-[#00c853]" />
          {toast}
        </div>
      )}

      <div className="flex-1 p-4 sm:p-6 lg:p-7 overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-black text-[#1a1a2e]">Company Profile</h1>
          <p className="text-xs sm:text-sm text-[#8890a4]">This information appears on all your job postings.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
          <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#e4e8f0] shadow-sm p-5 sm:p-7 flex flex-col gap-5">
            <div className="flex items-center gap-4 pb-4 border-b border-[#f0f2f8]">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6c63ff] to-[#a78bfa] flex items-center justify-center text-2xl font-black text-white flex-shrink-0">
                {companyName[0]?.toUpperCase() || 'C'}
              </div>
              <div>
                <p className="text-sm font-extrabold text-[#1a1a2e]">{companyName}</p>
                <p className="text-xs text-[#8890a4]">Verified employer on NexHire</p>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1.5">Company Name</label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8890a4]" />
                <input value={companyName} onChange={e => setCompanyName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#f8f9fc] border border-[#e4e8f0] text-[13.5px] text-[#1a1a2e] outline-none focus:border-[#6c63ff]" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1.5">Website</label>
              <div className="relative">
                <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8890a4]" />
                <input value={website} onChange={e => setWebsite(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#f8f9fc] border border-[#e4e8f0] text-[13.5px] text-[#1a1a2e] outline-none focus:border-[#6c63ff]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1.5">Industry</label>
                <input value={industry} onChange={e => setIndustry(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#f8f9fc] border border-[#e4e8f0] text-[13.5px] text-[#1a1a2e] outline-none focus:border-[#6c63ff]" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1.5">Company Size</label>
                <div className="relative">
                  <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8890a4]" />
                  <input value={size} onChange={e => setSize(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#f8f9fc] border border-[#e4e8f0] text-[13.5px] text-[#1a1a2e] outline-none focus:border-[#6c63ff]" />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1.5">Headquarters</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8890a4]" />
                <input value={hq} onChange={e => setHq(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#f8f9fc] border border-[#e4e8f0] text-[13.5px] text-[#1a1a2e] outline-none focus:border-[#6c63ff]" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1.5">About the Company</label>
              <textarea value={about} onChange={e => setAbout(e.target.value)} rows={4}
                className="w-full px-4 py-3 rounded-xl bg-[#f8f9fc] border border-[#e4e8f0] text-[13.5px] text-[#1a1a2e] outline-none focus:border-[#6c63ff] resize-none" />
            </div>

            <button
              type="submit"
              className="self-start px-6 py-3 rounded-xl font-extrabold text-[13.5px] text-white border-none cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #6c63ff 0%, #a855f7 100%)' }}
            >
              Save Changes
            </button>
          </form>

          {/* Right: quick stats */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl p-5 border border-[#e4e8f0] shadow-sm">
              <h3 className="text-sm font-extrabold text-[#1a1a2e] mb-4">Hiring Snapshot</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Active Jobs', value: stats.activeJobs },
                  { label: 'Total Applicants', value: stats.totalApplicants },
                  { label: 'Interviews Scheduled', value: stats.scheduledInterviews },
                  { label: 'Hired', value: stats.hired },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-xs text-[#8890a4] font-semibold">{s.label}</span>
                    <span className="text-sm font-black text-[#1a1a2e]">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0f0f1a] rounded-2xl p-5 text-white">
              <p className="text-xs font-bold text-[#a78bfa] mb-1">NEED HELP HIRING?</p>
              <p className="text-[13px] font-semibold mb-3">Our AI matching finds top candidates for you automatically.</p>
              <button
                onClick={() => onNavigate?.('hr-jobform')}
                className="text-xs font-bold text-white bg-[#6c63ff] px-4 py-2 rounded-lg border-none cursor-pointer"
              >
                Post a Job →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
