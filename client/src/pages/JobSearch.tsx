import React, { useState } from 'react';
import Topbar from '../components/Topbar';
import {
  Search, MapPin, Heart, Building2,
  ChevronDown, ChevronLeft, ChevronRight, SlidersHorizontal, Sparkles, X
} from 'lucide-react';
import { Page } from '../App';

interface JobSearchProps {
  onMenuClick?: () => void;
  onNavigate?: (p: Page) => void;
}

interface Job {
  id: number; title: string; company: string; location: string;
  match: number; salary: string; type: string; tag?: string;
  tagType?: 'urgent' | 'posted'; logo: string;
}

const initialJobs: Job[] = [
  { id: 1, title: 'Senior Product Designer (AI/ML)', company: 'Cognitive Systems', location: 'San Francisco, CA (Remote)', match: 98, salary: '$180k - $240k', type: 'Full-time', logo: 'CS' },
  { id: 2, title: 'Principal UX Engineer',            company: 'Lumina Core',      location: 'New York, NY',              match: 85, salary: '$210k - $280k', type: 'Hybrid',    logo: 'LC', tag: 'Posted 2 hours ago', tagType: 'posted' },
  { id: 3, title: 'Staff Infrastructure Engineer',    company: 'GridSphere',       location: 'Austin, TX (Remote)',       match: 72, salary: '$195k - $225k', type: 'Full-time', logo: 'GS', tag: 'Urgent Hiring',     tagType: 'urgent' },
];

const logoBg: Record<string, string> = {
  CS: 'linear-gradient(135deg,#667eea,#764ba2)',
  LC: 'linear-gradient(135deg,#f093fb,#f5576c)',
  GS: 'linear-gradient(135deg,#4facfe,#00f2fe)',
};

const matchColor = (m: number) => m >= 90 ? '#00c853' : m >= 80 ? '#6c63ff' : '#ff9800';

const JobSearch: React.FC<JobSearchProps> = ({ onMenuClick, onNavigate }) => {
  const [loc, setLoc] = useState('remote');
  const [exp, setExp] = useState<string[]>(['Senior']);
  const [jt, setJt] = useState('fulltime');
  const [aim, setAim] = useState(80);
  const [saved, setSaved] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleExp = (e: string) => setExp(p => p.includes(e) ? p.filter(x => x !== e) : [...p, e]);
  const toggleSave = (id: number) => {
    const isSaved = saved.includes(id);
    setSaved(p => isSaved ? p.filter(x => x !== id) : [...p, id]);
    showToast(isSaved ? 'Job removed from saved items' : 'Job saved to your bookmarks!');
  };

  const handleSearch = () => {
    showToast(`Searching for "${searchQuery || 'All Jobs'}" in "${locationQuery || 'Any Location'}"...`);
  };

  const resetFilters = () => {
    setLoc('remote');
    setExp(['Senior']);
    setJt('fulltime');
    setAim(80);
    showToast('All filters have been reset.');
  };

  const filteredJobs = initialJobs.filter(j => j.match >= aim);

  const FilterSidebar = () => (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <span className="text-[16px] font-bold text-[#1a1a2e]">Filters</span>
        <button
          onClick={resetFilters}
          className="text-[12px] font-medium text-[#6c63ff] bg-transparent border-none cursor-pointer hover:opacity-70 transition-opacity"
        >
          Clear All
        </button>
      </div>

      {/* Location */}
      <div className="mb-5 pb-5 border-b border-[#f0f2f8]">
        <span className="block text-[10px] font-bold text-[#b0b8cc] tracking-widest mb-3">LOCATION</span>
        {[{ id: 'remote', label: 'Remote Only' }, { id: 'sf', label: 'San Francisco, CA' }, { id: 'ny', label: 'New York, NY' }].map(({ id, label }) => (
          <label key={id} className="flex items-center gap-2.5 cursor-pointer mb-2.5 select-none">
            <div onClick={() => setLoc(id)} className={`w-[17px] h-[17px] rounded-[5px] border-2 flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${loc === id ? 'bg-[#6c63ff] border-[#6c63ff]' : 'border-[#d0d5e8]'}`}>
              {loc === id && <svg viewBox="0 0 12 12" fill="none" width="10" height="10"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>}
            </div>
            <span className="text-[13px] text-[#4a5068]">{label}</span>
          </label>
        ))}
      </div>

      {/* AI Match */}
      <div className="mb-5 pb-5 border-b border-[#f0f2f8]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold text-[#b0b8cc] tracking-widest">AI MATCH %</span>
          <span className="text-[12px] font-semibold text-[#6c63ff] bg-[#6c63ff]/10 px-2 py-0.5 rounded-full">{aim}% +</span>
        </div>
        <input type="range" min={0} max={100} value={aim} onChange={e => setAim(+e.target.value)}
          className="w-full h-1 rounded cursor-pointer accent-[#6c63ff]"/>
      </div>

      {/* Salary */}
      <div className="mb-5 pb-5 border-b border-[#f0f2f8]">
        <span className="block text-[10px] font-bold text-[#b0b8cc] tracking-widest mb-3">SALARY RANGE</span>
        <div className="relative">
          <select className="w-full py-2.5 pl-3 pr-8 border border-[#e4e8f0] rounded-[9px] text-[13px] text-[#1a1a2e] bg-[#f8f9fc] outline-none appearance-none cursor-pointer font-sans">
            <option>$100k - $150k</option><option>$150k - $200k</option><option>$200k+</option>
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8890a4] pointer-events-none"/>
        </div>
      </div>

      {/* Experience */}
      <div className="mb-5 pb-5 border-b border-[#f0f2f8]">
        <span className="block text-[10px] font-bold text-[#b0b8cc] tracking-widest mb-3">EXPERIENCE</span>
        <div className="flex flex-wrap gap-2">
          {['Senior', 'Lead', 'Staff'].map((e) => (
            <button key={e} onClick={() => toggleExp(e)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium border-[1.5px] cursor-pointer transition-all font-sans ${exp.includes(e) ? 'bg-[#6c63ff]/12 border-[#6c63ff] text-[#6c63ff] font-semibold' : 'bg-[#f0f2f8] border-[#e4e8f0] text-[#6a7090] hover:border-[#6c63ff] hover:text-[#6c63ff]'}`}>
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Job Type */}
      <div className="mb-5 pb-5 border-b border-[#f0f2f8]">
        <span className="block text-[10px] font-bold text-[#b0b8cc] tracking-widest mb-3">JOB TYPE</span>
        {[{ id: 'fulltime', label: 'Full-time' }, { id: 'contract', label: 'Contract' }].map(({ id, label }) => (
          <label key={id} className="flex items-center gap-2.5 cursor-pointer mb-2.5 select-none">
            <div onClick={() => setJt(id)} className={`w-[17px] h-[17px] rounded-full border-2 flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${jt === id ? 'border-[#6c63ff]' : 'border-[#d0d5e8]'}`}>
              {jt === id && <span className="w-[7px] h-[7px] rounded-full bg-[#6c63ff] block"/>}
            </div>
            <span className="text-[13px] text-[#4a5068]">{label}</span>
          </label>
        ))}
      </div>

      {/* Boost Card */}
      <div className="relative rounded-2xl p-4 overflow-hidden" style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}>
        <div className="absolute top-[-20px] right-[-20px] w-24 h-24 rounded-full bg-white/5"/>
        <span className="block text-[15px] font-bold text-white mb-1.5 relative">Resume Boost</span>
        <p className="text-[12px] text-white/80 leading-relaxed mb-3.5 relative">Let our AI optimize your profile for higher match scores.</p>
        <button
          onClick={() => onNavigate?.('airesume')}
          className="bg-white text-[#6c63ff] border-none rounded-lg px-4 py-2 text-[12px] font-bold cursor-pointer hover:-translate-y-px hover:shadow-lg transition-all font-sans relative active:scale-95"
        >
          Upgrade Pro
        </button>
      </div>
    </div>
  );

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

      {/* Hero Search */}
      <div className="px-4 sm:px-7 pt-4 sm:pt-6 pb-0 w-full box-border">
        <div className="flex flex-col md:flex-row items-stretch md:items-center bg-white border-2 border-dashed border-[#c5ccde] rounded-2xl p-3 md:px-4 md:py-3 gap-3 md:gap-0 w-full focus-within:border-solid focus-within:border-[#6c63ff] transition-all">
          <div className="flex items-center gap-2.5 flex-1 px-1 sm:px-3">
            <Search size={18} className="text-[#b0b8cc] flex-shrink-0"/>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="border-none outline-none text-[14px] text-[#1a1a2e] w-full bg-transparent placeholder:text-[#b0b8cc] font-sans"
              placeholder="Job title, keywords, or company"
            />
          </div>
          <div className="hidden md:block w-px h-8 bg-[#e4e8f0] flex-shrink-0"/>
          <div className="flex items-center gap-2.5 flex-1 px-1 sm:px-3">
            <MapPin size={18} className="text-[#6c63ff] flex-shrink-0"/>
            <input
              value={locationQuery}
              onChange={e => setLocationQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="border-none outline-none text-[14px] text-[#1a1a2e] w-full bg-transparent placeholder:text-[#b0b8cc] font-sans"
              placeholder="City, state, or remote"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-7 py-3 rounded-xl text-[14px] font-semibold text-white border-none cursor-pointer whitespace-nowrap transition-all hover:-translate-y-px active:scale-95 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: '0 4px 14px rgba(108,99,255,0.35)' }}
          >
            Find Jobs
          </button>
        </div>
      </div>

      {/* Filter toggle button on mobile */}
      <div className="px-4 sm:px-7 pt-4 lg:hidden">
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#e4e8f0] text-xs font-semibold text-[#1a1a2e] active:scale-95"
        >
          <SlidersHorizontal size={16} /> Filter Results
        </button>
      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden flex justify-end">
          <div className="w-80 bg-[#f4f6fb] h-full p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-lg">Filters</span>
              <button onClick={() => setMobileFilterOpen(false)} className="text-sm font-semibold text-[#6c63ff]">Done</button>
            </div>
            <FilterSidebar />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex gap-5 px-4 sm:px-7 py-5 w-full box-border flex-1">
        {/* Filters Desktop */}
        <aside className="hidden lg:block w-60 min-w-[240px] self-start sticky top-[68px]">
          <FilterSidebar />
        </aside>

        {/* Job Listings */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 px-1">
            <span className="text-[15px] text-[#4a5068]"><strong className="text-[#1a1a2e]">{filteredJobs.length * 47}</strong> Jobs matches for your profile</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#b0b8cc] tracking-wider">SORT BY:</span>
              <div className="flex items-center gap-1">
                <select
                  onChange={e => showToast(`Sorted jobs by ${e.target.value}`)}
                  className="border-none outline-none text-[13px] font-semibold text-[#6c63ff] bg-transparent cursor-pointer font-sans appearance-none pr-4"
                >
                  <option>Highest Match</option><option>Latest</option><option>Salary</option>
                </select>
                <ChevronDown size={13} className="text-[#6c63ff] -ml-3 pointer-events-none"/>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="flex flex-col gap-3">
            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-[#8890a4]">
                <p className="font-bold text-base mb-1">No jobs match your AI filter threshold</p>
                <p className="text-xs mb-4">Try lowering the AI Match slider to see more opportunities.</p>
                <button onClick={resetFilters} className="px-4 py-2 bg-[#6c63ff] text-white rounded-xl text-xs font-semibold">Reset Filters</button>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const mc = matchColor(job.match);
                return (
                  <div key={job.id} className={`bg-white rounded-2xl p-4 sm:p-5 shadow-sm border-[1.5px] transition-all hover:-translate-y-0.5 hover:shadow-md relative overflow-hidden ${job.id === 1 ? 'border-[#dddaff]' : 'border-transparent hover:border-[#e0ddff]'}`}>
                    {job.id === 1 && <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l" style={{ background: 'linear-gradient(180deg,#6c63ff,#a78bfa)' }}/>}

                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0" style={{ background: logoBg[job.logo] }}>
                        {job.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          onClick={() => onNavigate?.('jobdetails')}
                          className="text-sm sm:text-[16px] font-bold text-[#1a1a2e] mb-1.5 truncate cursor-pointer hover:text-[#6c63ff] transition-colors"
                        >
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3.5 mb-2.5">
                          <span className="flex items-center gap-1 text-[12px] text-[#8890a4]"><Building2 size={12}/>{job.company}</span>
                          <span className="flex items-center gap-1 text-[12px] text-[#8890a4]"><MapPin size={12}/>{job.location}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full" style={{ color: mc, background: `${mc}18` }}>✦ {job.match}% Match</span>
                          <span className="text-[12px] font-medium px-2.5 py-1 rounded-full bg-[#f0f2f8] text-[#4a5068]">{job.salary}</span>
                          <span className="text-[12px] font-medium px-2.5 py-1 rounded-full bg-[#f0f2f8] text-[#4a5068]">{job.type}</span>
                        </div>
                      </div>
                      <button onClick={() => toggleSave(job.id)} className="bg-transparent border-none cursor-pointer p-1 rounded-lg hover:scale-125 transition-transform flex-shrink-0">
                        <Heart size={18} fill={saved.includes(job.id) ? '#ff4d6d' : 'none'} stroke={saved.includes(job.id) ? '#ff4d6d' : '#b0b8cc'}/>
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3.5 border-t border-[#f0f2f8]">
                      <div className="flex items-center gap-2">
                        {job.id === 1 && (
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="flex">
                              {[{ l: 'C', c: '#6c63ff' }, { l: 'B', c: '#f093fb' }, { l: 'A', c: '#4facfe' }].map((a, i) => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ background: a.c, marginLeft: i ? '-8px' : 0, zIndex: 3 - i }}>{a.l}</div>
                              ))}
                            </div>
                            <span className="text-[11px] text-[#8890a4] font-medium ml-1">+1.4k applied</span>
                          </div>
                        )}
                        {job.tag && (
                          <span className={`text-[12px] font-medium px-2.5 py-1 rounded-full ${job.tagType === 'urgent' ? 'bg-[#ff4d6d]/10 text-[#ff4d6d]' : 'text-[#8890a4]'}`}>{job.tag}</span>
                        )}
                      </div>
                      <div className="flex gap-2.5 w-full sm:w-auto">
                        <button
                          onClick={() => onNavigate?.('jobdetails')}
                          className="flex-1 sm:flex-none px-5 py-2 border-[1.5px] border-[#e4e8f0] rounded-[9px] bg-white text-[13px] font-semibold text-[#4a5068] cursor-pointer hover:border-[#6c63ff] hover:text-[#6c63ff] transition-all font-sans active:scale-95"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onNavigate?.('applications')}
                          className="flex-1 sm:flex-none px-5 py-2 border-none rounded-[9px] text-[13px] font-semibold text-white cursor-pointer transition-all hover:-translate-y-px font-sans active:scale-95"
                          style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: '0 3px 10px rgba(108,99,255,0.3)' }}
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-1.5 mt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="w-9 h-9 rounded-[9px] border-[1.5px] border-[#e4e8f0] bg-white flex items-center justify-center cursor-pointer text-[#8890a4] hover:border-[#6c63ff] hover:text-[#6c63ff] transition-all active:scale-95"
            >
              <ChevronLeft size={14}/>
            </button>
            {[1, 2, 3].map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-[9px] border-[1.5px] text-[13px] font-medium cursor-pointer transition-all font-sans active:scale-95 ${page === p ? 'bg-[#6c63ff] border-[#6c63ff] text-white font-bold' : 'bg-white border-[#e4e8f0] text-[#4a5068] hover:border-[#6c63ff] hover:text-[#6c63ff]'}`}>{p}</button>
            ))}
            <span className="text-[14px] text-[#b0b8cc] px-1">...</span>
            <button onClick={() => setPage(14)} className={`w-9 h-9 rounded-[9px] border-[1.5px] text-[13px] font-medium cursor-pointer transition-all font-sans active:scale-95 ${page === 14 ? 'bg-[#6c63ff] border-[#6c63ff] text-white font-bold' : 'bg-white border-[#e4e8f0] text-[#4a5068] hover:border-[#6c63ff] hover:text-[#6c63ff]'}`}>14</button>
            <button
              onClick={() => setPage(p => Math.min(14, p + 1))}
              className="w-9 h-9 rounded-[9px] border-[1.5px] border-[#e4e8f0] bg-white flex items-center justify-center cursor-pointer text-[#8890a4] hover:border-[#6c63ff] hover:text-[#6c63ff] transition-all active:scale-95"
            >
              <ChevronRight size={14}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearch;
