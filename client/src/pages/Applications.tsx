import React, { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import {
  Send, Star, Calendar, Gift, SlidersHorizontal,
  ChevronLeft, ChevronRight, TrendingUp, Sparkles,
  Eye, Zap, Check
} from 'lucide-react';
import { Page } from '../App';
import { StatusType, ApplicationRecord } from '../data/applicationData';
import { fetchApplications } from '../services/api';

interface ApplicationsProps {
  onMenuClick?: () => void;
  onNavigate?: (p: Page, job?: any) => void;
}

type TabType = 'all' | 'active' | 'completed';

const Applications: React.FC<ApplicationsProps> = ({ onMenuClick, onNavigate }) => {
  const [appsList, setAppsList] = useState<ApplicationRecord[]>([]);
  const [tab, setTab] = useState<TabType>('all');
  const [sortBy, setSortBy] = useState('Newest');
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications().then(data => {
      if (Array.isArray(data)) {
        const mapped: ApplicationRecord[] = data.map((a: any, idx: number) => {
          let st = (a.status ? a.status.toUpperCase() : 'APPLIED');
          if (st === 'PENDING') st = 'APPLIED';
          if (!['IN REVIEW', 'INTERVIEWING', 'OFFER RECEIVED', 'WITHDRAWN', 'APPLIED'].includes(st)) {
            st = 'APPLIED';
          }
          const comp = a.company || a.job?.company || 'Company';
          const r = a.role || a.jobTitle || a.job?.title || 'Software Engineer';
          const loc = a.location || a.job?.location || 'Remote';
          return {
            id: a._id || idx + 1,
            role: r,
            company: comp,
            location: loc,
            date: a.date || a.appliedDate || (a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'Today'),
            ago: a.ago || 'Recently',
            status: st as StatusType,
            match: a.match || a.job?.match || 92,
            logo: comp.substring(0, 2).toUpperCase(),
            logoBg: 'linear-gradient(135deg,#6c63ff,#3b82f6)',
          };
        });
        setAppsList(mapped);
      }
    });
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = appsList.filter(a => {
    if (tab === 'active')    return ['IN REVIEW','INTERVIEWING','APPLIED'].includes(a.status);
    if (tab === 'completed') return ['OFFER RECEIVED','WITHDRAWN'].includes(a.status);
    return true;
  });
  const pageSize = 4;
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const appliedCount = appsList.length;
  const shortlistedCount = appsList.filter(a => a.status === 'IN REVIEW').length;
  const interviewsCount = appsList.filter(a => a.status === 'INTERVIEWING').length;
  const offersCount = appsList.filter(a => a.status === 'OFFER RECEIVED').length;

  const stats = [
    { icon: <Send size={18} className="text-[#6c63ff]" />, label: 'APPLIED',     value: appliedCount,     badge: 'Real-time',    badgeColor: '#00c853', bg: 'linear-gradient(135deg,#6c63ff22,#6c63ff08)', ghost: <Send size={48} className="text-[#6c63ff]" opacity={0.07} /> },
    { icon: <Star size={18} className="text-[#f59e0b]" />, label: 'SHORTLISTED', value: shortlistedCount,  badge: 'Active',     badgeColor: '#00c853', bg: 'linear-gradient(135deg,#f59e0b22,#f59e0b08)', ghost: <Star size={48} className="text-[#f59e0b]" opacity={0.07} /> },
    { icon: <Calendar size={18} className="text-[#6c63ff]" />, label: 'INTERVIEWS', value: interviewsCount, badge: 'Scheduled', badgeColor: '#ff4d6d', bg: 'linear-gradient(135deg,#6c63ff22,#6c63ff08)', ghost: <Calendar size={48} className="text-[#6c63ff]" opacity={0.07} />, highlight: true },
    { icon: <Gift size={18} className="text-[#00c853]" />,  label: 'OFFERS',      value: offersCount,       badge: 'Received',    badgeColor: '#00c853', bg: 'linear-gradient(135deg,#00c85322,#00c85308)', ghost: <Gift size={48} className="text-[#00c853]" opacity={0.07} /> },
  ];

  const getStatusStyle = (s: StatusType) => {
    const map: Record<StatusType, { bg: string; color: string }> = {
      'IN REVIEW':      { bg: '#e0f7fa', color: '#0891b2' },
      'INTERVIEWING':   { bg: '#fef3c7', color: '#d97706' },
      'OFFER RECEIVED': { bg: '#dcfce7', color: '#00a843' },
      'WITHDRAWN':      { bg: '#f0f2f8', color: '#8890a4' },
      'APPLIED':        { bg: '#ede9fe', color: '#6c63ff' },
    };
    return map[s];
  };

  const getMatchColor = (m: number) => m >= 90 ? '#6c63ff' : m >= 80 ? '#4facfe' : '#f59e0b';

  return (
    <div className="flex flex-col min-h-screen w-full lg:w-[calc(100vw-220px)] lg:ml-[220px] bg-[#f4f6fb] overflow-x-hidden">
      <Topbar onMenuClick={onMenuClick} onNavigate={onNavigate} />

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-[#1a1a2e] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#6c63ff]/30 animate-bounce">
          <Check size={15} className="text-[#00c853]" />
          <span className="text-xs font-medium">{toast}</span>
        </div>
      )}

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`relative bg-white rounded-2xl p-5 shadow-sm border overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 ${
                s.highlight ? 'border-[#6c63ff]/30' : 'border-[#e4e8f0]/60'
              }`}
            >
              {/* Ghost icon */}
              <div className="absolute bottom-1 right-2 pointer-events-none select-none">{s.ghost}</div>

              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                  {s.icon}
                </div>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ color: s.badgeColor, background: `${s.badgeColor}18` }}
                >
                  {s.badge}
                </span>
              </div>
              <div className="text-[11px] font-bold text-[#b0b8cc] tracking-widest uppercase mb-1">{s.label}</div>
              <div className="text-[32px] font-black text-[#1a1a2e] leading-none">{s.value}</div>
            </div>
          ))}
        </div>

        {/* ── Applications Table Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e4e8f0]/60 mb-6 overflow-hidden">

          {/* Tab bar */}
          <div className="flex items-center justify-between px-5 pt-4 pb-0 border-b border-[#e4e8f0]">
            <div className="flex gap-1">
              {(['all','active','completed'] as TabType[]).map(t => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setPage(1); }}
                  className={`px-4 py-2 text-[13px] font-bold rounded-t-xl transition-all border-b-2 capitalize border-none cursor-pointer ${
                    tab === t
                      ? 'text-[#6c63ff] border-b-[#6c63ff] bg-[#6c63ff]/5'
                      : 'text-[#8890a4] border-b-transparent hover:text-[#4a5068] bg-transparent'
                  }`}
                  style={{ borderBottom: tab === t ? '2px solid #6c63ff' : '2px solid transparent' }}
                >
                  {t === 'all' ? 'All Applications' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 pb-2">
              <span className="text-[12px] text-[#8890a4]">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="text-[12px] font-bold text-[#4a5068] bg-transparent border-none outline-none cursor-pointer"
              >
                <option>Newest</option>
                <option>Oldest</option>
                <option>Match %</option>
              </select>
              <button className="w-7 h-7 rounded-lg bg-[#f4f6fb] flex items-center justify-center border-none cursor-pointer hover:bg-[#6c63ff]/10 transition-colors">
                <SlidersHorizontal size={13} className="text-[#8890a4]" />
              </button>
            </div>
          </div>

          {/* Table header */}
          <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-[#f8f9fc] border-b border-[#e4e8f0]">
            {['COMPANY & POSITION', 'APPLIED DATE', 'STATUS', 'AI MATCH', 'ACTION'].map(h => (
              <div key={h} className="text-[10px] font-bold text-[#b0b8cc] tracking-widest">{h}</div>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-[#f0f2f8]">
            {paginated.map((app) => {
              const st = getStatusStyle(app.status);
              const mc = getMatchColor(app.match);
              return (
                <div
                  key={app.id}
                  className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 items-center hover:bg-[#f8f9fc] transition-colors"
                >
                  {/* Company & Position */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black text-white flex-shrink-0"
                      style={{ background: app.logoBg }}
                    >
                      {app.logo}
                    </div>
                    <div>
                      <p className="text-[14px] font-extrabold text-[#1a1a2e]">{app.role}</p>
                      <p className="text-[11px] text-[#8890a4]">{app.company} · {app.location}</p>
                    </div>
                  </div>

                  {/* Applied Date */}
                  <div className="sm:block">
                    <p className="text-[13px] font-semibold text-[#4a5068]">{app.date}</p>
                    <p className="text-[11px] text-[#b0b8cc]">{app.ago}</p>
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className="inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full"
                      style={{ background: st.bg, color: st.color }}
                    >
                      {app.status}
                    </span>
                  </div>

                  {/* AI Match */}
                  <div className="flex items-center gap-2.5 min-w-[90px]">
                    <div className="flex-1 h-1.5 bg-[#f0f2f8] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${app.match}%`, background: `linear-gradient(90deg, ${mc}, ${mc}bb)` }}
                      />
                    </div>
                    <span className="text-[12px] font-black flex-shrink-0" style={{ color: mc }}>{app.match}%</span>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => onNavigate?.('jobdetails')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
                    style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: '0 3px 10px rgba(108,99,255,0.35)' }}
                  >
                    <Eye size={12} /> View Details
                  </button>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-[#e4e8f0]">
            <span className="text-[12px] text-[#8890a4]">
              Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} applications
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#f4f6fb] border-none cursor-pointer hover:bg-[#6c63ff]/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-[#4a5068]"
              >
                <ChevronLeft size={13} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-7 h-7 rounded-lg text-[12px] font-bold border-none cursor-pointer transition-all ${
                    page === n
                      ? 'text-white'
                      : 'bg-[#f4f6fb] text-[#4a5068] hover:bg-[#6c63ff]/10 hover:text-[#6c63ff]'
                  }`}
                  style={page === n ? { background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' } : {}}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#f4f6fb] border-none cursor-pointer hover:bg-[#6c63ff]/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-[#4a5068]"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Bottom 2-column ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">

          {/* AI Application Insight */}
          <div className="relative bg-gradient-to-br from-[#f0efff] to-[#e8f4ff] rounded-2xl p-6 border border-[#6c63ff]/15 overflow-hidden">
            {/* Decorative sparkles */}
            <div className="absolute top-4 right-8 opacity-20">
              <Sparkles size={60} className="text-[#6c63ff]" />
            </div>
            <div className="absolute bottom-4 right-4 opacity-10">
              <Sparkles size={40} className="text-[#8b5cf6]" />
            </div>

            <div className="flex items-center gap-2 mb-3 relative z-10">
              <div className="w-8 h-8 rounded-xl bg-[#6c63ff]/15 flex items-center justify-center">
                <TrendingUp size={16} className="text-[#6c63ff]" />
              </div>
              <h3 className="text-[16px] font-extrabold text-[#1a1a2e]">AI Application Insights</h3>
            </div>

            <p className="text-[13px] text-[#4a5068] leading-relaxed mb-4 max-w-lg relative z-10">
              Based on your recent 5 interviews, your "Technical Communication" score has improved by{' '}
              <span className="font-bold text-[#6c63ff]">15%</span>. Companies in the Fintech sector are
              currently highly engaged with your profile.
            </p>

            <div className="flex flex-wrap gap-3 relative z-10">
              {['Fintech Preference', 'Product Strategy Expert', 'Fast-growing Startups'].map((tag, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px] font-bold text-[#4a5068]">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: ['#6c63ff','#f59e0b','#00c853'][i] }}
                  />
                  {tag}
                </div>
              ))}
            </div>
          </div>

          {/* Nexus AI Plus upgrade card */}
          <div
            className="rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(145deg,#1a1a2e,#16213e)' }}
          >
            {/* Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20 blur-2xl" style={{ background: '#6c63ff' }} />

            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}>
                <Zap size={18} className="text-white" />
              </div>
              <div>
                <p className="text-[15px] font-extrabold text-white">Next AI Plus</p>
                <p className="text-[11px] text-[#b0b8cc]">Unlock premium insights</p>
              </div>
            </div>

            <p className="text-[12px] text-[#8890a4] leading-relaxed relative z-10">
              Get 10x faster responses with AI-automated follow-ups and direct recruiter messaging priority.
            </p>

            <div className="flex flex-col gap-1.5 relative z-10">
              {['Automated follow-ups', 'Direct recruiter messaging', 'Premium AI insights'].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] text-[#b0b8cc]">
                  <Check size={11} className="text-[#6c63ff]" strokeWidth={3} /> {f}
                </div>
              ))}
            </div>

            <button
              onClick={() => showToast('Redirecting to Nexus AI Plus upgrade...')}
              className="w-full py-3 rounded-xl text-[13px] font-extrabold text-[#1a1a2e] border-none cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95 relative z-10"
              style={{ background: 'linear-gradient(135deg,#ffffff,#f0efff)', boxShadow: '0 4px 14px rgba(108,99,255,0.25)' }}
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applications;
