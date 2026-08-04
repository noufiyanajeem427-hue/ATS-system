import React, { useState } from 'react';
import Topbar from '../components/Topbar';
import {
  Video, Calendar, Clock, MapPin, ExternalLink,
  CheckCircle2, ChevronRight, ChevronLeft,
  Sparkles, Star, AlertCircle, Mic, BookOpen,
  Play, X, Check, User, Building2, Zap, TrendingUp,
  Bell, MoreHorizontal, Phone
} from 'lucide-react';
import { Page } from '../App';

interface InterviewProps {
  onMenuClick?: () => void;
  onNavigate?: (p: Page, job?: any) => void;
}

type TabType = 'upcoming' | 'past';

interface InterviewItem {
  id: number | string;
  role: string;
  company: string;
  companyLogo: string;
  logoBg: string;
  type: string;
  typeColor: string;
  typeBg: string;
  date: string;
  day: string;
  time: string;
  duration: string;
  interviewer: string;
  interviewerTitle: string;
  round: string;
  roundNum: number;
  totalRounds: number;
  mode: 'video' | 'phone' | 'onsite';
  link?: string;
  location?: string;
  status?: 'scheduled' | 'completed' | 'cancelled';
  result?: 'passed' | 'failed' | 'pending';
  feedback?: string;
  score?: number;
}

const upcomingInterviews: InterviewItem[] = [
  {
    id: 1,
    role: 'Senior Product Designer',
    company: 'Netflix',
    companyLogo: 'NF',
    logoBg: 'linear-gradient(135deg,#e50914,#831010)',
    type: 'Technical Round',
    typeColor: '#6c63ff',
    typeBg: 'rgba(108,99,255,0.12)',
    date: 'Oct 24, 2023',
    day: 'Tomorrow',
    time: '10:00 AM',
    duration: '60 min',
    interviewer: 'Sarah Chen',
    interviewerTitle: 'Engineering Manager',
    round: 'Round 2',
    roundNum: 2,
    totalRounds: 4,
    mode: 'video',
    link: 'https://meet.google.com/abc-defg-hij',
    status: 'scheduled',
  },
  {
    id: 2,
    role: 'Design Systems Architect',
    company: 'Nova AI',
    companyLogo: 'NA',
    logoBg: 'linear-gradient(135deg,#8b5cf6,#6366f1)',
    type: 'Portfolio Review',
    typeColor: '#00c853',
    typeBg: 'rgba(0,200,83,0.12)',
    date: 'Oct 27, 2023',
    day: 'Friday',
    time: '2:30 PM',
    duration: '45 min',
    interviewer: 'Marcus Vance',
    interviewerTitle: 'Head of Product',
    round: 'Round 3',
    roundNum: 3,
    totalRounds: 4,
    mode: 'video',
    link: 'https://zoom.us/j/123456789',
    status: 'scheduled',
  },
];

const pastInterviews: InterviewItem[] = [
  {
    id: 3,
    role: 'Lead UI/UX Designer',
    company: 'Verdant Labs',
    companyLogo: 'VL',
    logoBg: 'linear-gradient(135deg,#10b981,#047857)',
    type: 'Final Executive Screen',
    typeColor: '#00c853',
    typeBg: 'rgba(0,200,83,0.12)',
    date: 'Oct 18, 2023',
    day: 'Wed',
    time: '11:00 AM',
    duration: '45 min',
    interviewer: 'Elena Rostova',
    interviewerTitle: 'VP of Product',
    round: 'Round 4',
    roundNum: 4,
    totalRounds: 4,
    mode: 'video',
    status: 'completed',
    result: 'passed',
    feedback: 'Outstanding system thinking and communication skills. Offer extended.',
    score: 96,
  },
  {
    id: 4,
    role: 'Principal Product Designer',
    company: 'Stripe',
    companyLogo: 'ST',
    logoBg: 'linear-gradient(135deg,#635bff,#0a2540)',
    type: 'Screening Call',
    typeColor: '#6c63ff',
    typeBg: 'rgba(108,99,255,0.12)',
    date: 'Oct 12, 2023',
    day: 'Thu',
    time: '3:00 PM',
    duration: '30 min',
    interviewer: 'David Miller',
    interviewerTitle: 'Senior Recruiter',
    round: 'Round 1',
    roundNum: 1,
    totalRounds: 4,
    mode: 'phone',
    status: 'completed',
    result: 'passed',
    feedback: 'Clear articulation of career achievements. Advanced to portfolio review.',
    score: 92,
  },
];

const prepChecklist = [
  { id: 1, task: 'Review job requirements & matching score analysis', done: true },
  { id: 2, task: 'Prepare 3 STAR-method story examples of past projects', done: true },
  { id: 3, task: 'Test webcam, microphone, and internet connection', done: true },
  { id: 4, task: 'Research interviewer background & company news', done: false },
  { id: 5, task: 'Prepare 3 thoughtful questions to ask the interviewer', done: false },
];

const aiTips = [
  { icon: <Sparkles size={14} className="text-[#6c63ff]" />, tip: "Focus on quantified impacts: mention how your design system reduced sprint dev time by 25%." },
  { icon: <Zap size={14} className="text-[#00c853]" />, tip: "Use the STAR method: Situation, Task, Action, Result for behavioral questions." },
  { icon: <TrendingUp size={14} className="text-[#f59e0b]" />, tip: "Netflix values high autonomy and candor: emphasize independent decision making." },
];

const calendarDays = [
  { date: 20, day: 'Fri', hasInterview: false },
  { date: 21, day: 'Sat', hasInterview: false },
  { date: 22, day: 'Sun', hasInterview: false },
  { date: 23, day: 'Mon', hasInterview: false },
  { date: 24, day: 'Tue', hasInterview: true, company: 'Netflix' },
  { date: 25, day: 'Wed', hasInterview: false },
  { date: 26, day: 'Thu', hasInterview: false },
  { date: 27, day: 'Fri', hasInterview: true, company: 'Nova' },
];

const Interview: React.FC<InterviewProps> = ({ onMenuClick, onNavigate }) => {
  const [tab, setTab] = useState<TabType>('upcoming');
  const [checklist, setChecklist] = useState(prepChecklist);
  const [toast, setToast] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | string | null>(1);
  const today = 24;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleCheck = (id: number) => {
    setChecklist(c => c.map(i => i.id === id ? { ...i, done: !i.done } : i));
  };

  const doneCount = checklist.filter(c => c.done).length;
  const prepPct = Math.round((doneCount / checklist.length) * 100);

  const modeIcon = (mode: InterviewItem['mode']) => {
    if (mode === 'video')  return <Video size={13} className="text-[#6c63ff]" />;
    if (mode === 'phone')  return <Phone size={13} className="text-[#f59e0b]" />;
    return <MapPin size={13} className="text-[#00c853]" />;
  };

  const interviews = tab === 'upcoming' ? upcomingInterviews : pastInterviews;

  return (
    <div className="flex flex-col min-h-screen w-full lg:w-[calc(100vw-220px)] lg:ml-[220px] bg-[#f4f6fb] dark:bg-[#0b0f19] text-[#1a1a2e] dark:text-[#f8fafc] overflow-x-hidden transition-colors duration-200">
      <Topbar onMenuClick={onMenuClick} onNavigate={onNavigate} />

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-[#1a1a2e] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#6c63ff]/30">
          <Check size={15} className="text-[#00c853]" />
          <span className="text-xs font-medium">{toast}</span>
          <button onClick={() => setToast(null)} className="text-[#8890a4] hover:text-white ml-1 bg-transparent border-none cursor-pointer"><X size={12} /></button>
        </div>
      )}

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Page Header */}
        <div className="flex items-start justify-between mb-7 flex-wrap gap-3">
          <div>
            <h1 className="text-[26px] sm:text-[32px] font-black text-[#1a1a2e] dark:text-[#f8fafc] tracking-tight">Interviews</h1>
            <p className="text-sm text-[#8890a4] dark:text-[#94a3b8] mt-1">You have <span className="font-bold text-[#6c63ff] dark:text-[#a78bfa]">{upcomingInterviews.length} upcoming</span> interviews this week.</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => showToast('Interview reminder set!')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold text-[#4a5068] dark:text-[#cbd5e1] bg-white dark:bg-[#111827] border border-[#e4e8f0] dark:border-[#1f2d42] hover:border-[#6c63ff] hover:text-[#6c63ff] transition-all cursor-pointer">
              <Bell size={14} /> Set Reminder
            </button>
            <button onClick={() => showToast('Opening calendar sync...')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: '0 4px 14px rgba(108,99,255,0.35)' }}>
              <Calendar size={14} /> Sync Calendar
            </button>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
          {[
            { label: 'Upcoming',  value: upcomingInterviews.length, icon: <Calendar size={16} className="text-[#6c63ff]" />, color: '#6c63ff', bg: 'rgba(108,99,255,0.12)' },
            { label: 'Completed', value: pastInterviews.length,     icon: <CheckCircle2 size={16} className="text-[#00c853]" />, color: '#00c853', bg: 'rgba(0,200,83,0.12)' },
            { label: 'Pass Rate', value: '100%',                    icon: <TrendingUp size={16} className="text-[#f59e0b]" />,   color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
            { label: 'Avg Score', value: '91%',                     icon: <Star size={16} className="text-[#8b5cf6]" />,          color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-[#111827] rounded-2xl p-4 shadow-sm border border-[#e4e8f0]/60 dark:border-[#1f2d42] flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
                {s.icon}
              </div>
              <div>
                <div className="text-[22px] font-black leading-none" style={{ color: s.color }}>{s.value}</div>
                <div className="text-[11px] text-[#8890a4] dark:text-[#94a3b8] font-medium mt-0.5">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">

          {/* ── Left Column ── */}
          <div className="flex flex-col gap-5">

            {/* Mini Calendar Strip */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60 dark:border-[#1f2d42]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[15px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc]">October 2023</h3>
                  <p className="text-[11px] text-[#8890a4] dark:text-[#94a3b8]">This week's schedule</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => showToast('Previous week')} className="w-7 h-7 rounded-lg bg-[#f4f6fb] dark:bg-[#161e2e] flex items-center justify-center border-none cursor-pointer hover:bg-[#6c63ff]/10 text-[#4a5068] dark:text-[#cbd5e1]"><ChevronLeft size={14} /></button>
                  <button onClick={() => showToast('Next week')}     className="w-7 h-7 rounded-lg bg-[#f4f6fb] dark:bg-[#161e2e] flex items-center justify-center border-none cursor-pointer hover:bg-[#6c63ff]/10 text-[#4a5068] dark:text-[#cbd5e1]"><ChevronRight size={14} /></button>
                </div>
              </div>
              <div className="grid grid-cols-8 gap-2">
                {calendarDays.map(d => (
                  <div
                    key={d.date}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl cursor-pointer transition-all ${
                      d.date === today
                        ? 'text-white'
                        : d.hasInterview
                        ? 'bg-[#6c63ff]/8 dark:bg-[#6c63ff]/20 hover:bg-[#6c63ff]/15'
                        : 'hover:bg-[#f4f6fb] dark:hover:bg-[#161e2e]'
                    }`}
                    style={d.date === today ? { background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' } : {}}
                    onClick={() => d.hasInterview && showToast(`Interview: ${d.company}`)}
                  >
                    <span className={`text-[10px] font-bold ${d.date === today ? 'text-white/70' : 'text-[#b0b8cc] dark:text-[#64748b]'}`}>{d.day}</span>
                    <span className={`text-[16px] font-extrabold ${d.date === today ? 'text-white' : d.hasInterview ? 'text-[#6c63ff] dark:text-[#a78bfa]' : 'text-[#1a1a2e] dark:text-[#f8fafc]'}`}>{d.date}</span>
                    {d.hasInterview && d.date !== today && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6c63ff]" />
                    )}
                    {d.date === today && <span className="w-1.5 h-1.5 rounded-full bg-white/60" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Tab Bar */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-sm border border-[#e4e8f0]/60 dark:border-[#1f2d42] overflow-hidden">
              <div className="flex border-b border-[#e4e8f0] dark:border-[#1f2d42]">
                {(['upcoming', 'past'] as TabType[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-3.5 text-[13px] font-bold capitalize transition-all border-none cursor-pointer ${
                      tab === t ? 'text-[#6c63ff] dark:text-[#a78bfa] bg-[#6c63ff]/5' : 'text-[#8890a4] dark:text-[#94a3b8] bg-transparent hover:text-[#4a5068] dark:hover:text-[#cbd5e1]'
                    }`}
                    style={{ borderBottom: tab === t ? '2px solid #6c63ff' : '2px solid transparent' }}
                  >
                    {t === 'upcoming' ? `Upcoming (${upcomingInterviews.length})` : `Past (${pastInterviews.length})`}
                  </button>
                ))}
              </div>

              {/* Interview Cards */}
              <div className="divide-y divide-[#f0f2f8] dark:divide-[#1f2d42]">
                {interviews.map(iv => (
                  <div key={iv.id} className="p-5">
                    {/* Card Header */}
                    <div className="flex items-start gap-4">
                      {/* Logo */}
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[13px] font-black text-white flex-shrink-0 shadow-sm" style={{ background: iv.logoBg }}>
                        {iv.companyLogo}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <h3 className="text-[15px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc]">{iv.role}</h3>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="flex items-center gap-1 text-[12px] text-[#8890a4] dark:text-[#94a3b8]">
                                <Building2 size={11} /> {iv.company}
                              </span>
                              <span className="text-[#e4e8f0] dark:text-[#1f2d42]">•</span>
                              <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                style={{ color: iv.typeColor, background: iv.typeBg }}
                              >
                                {iv.type}
                              </span>
                            </div>
                          </div>

                          {/* Round badge */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[#8890a4] dark:text-[#94a3b8] bg-[#f4f6fb] dark:bg-[#161e2e] px-2.5 py-1 rounded-full">
                              {iv.round} of {iv.totalRounds}
                            </span>
                            {tab === 'past' && iv.result && (
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${iv.result === 'passed' ? 'bg-[#00c853]/10 text-[#00a843]' : 'bg-[#ff4d6d]/10 text-[#ff4d6d]'}`}>
                                {iv.result === 'passed' ? '✓ Passed' : '✗ Failed'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Date/Time/Mode */}
                        <div className="flex flex-wrap gap-4 mt-3">
                          <div className="flex items-center gap-1.5 text-[12px] text-[#4a5068] dark:text-[#cbd5e1]">
                            <Calendar size={13} className="text-[#8890a4] dark:text-[#94a3b8]" />
                            {iv.day}, {iv.date}
                          </div>
                          <div className="flex items-center gap-1.5 text-[12px] text-[#4a5068] dark:text-[#cbd5e1]">
                            <Clock size={13} className="text-[#8890a4] dark:text-[#94a3b8]" />
                            {iv.time} · {iv.duration}
                          </div>
                          <div className="flex items-center gap-1.5 text-[12px] text-[#4a5068] dark:text-[#cbd5e1]">
                            {modeIcon(iv.mode)}
                            {iv.mode === 'video' ? 'Video Call' : iv.mode === 'phone' ? 'Phone Call' : iv.location || 'On-site'}
                          </div>
                        </div>

                        {/* Interviewer */}
                        <div className="flex items-center gap-2 mt-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6c63ff] to-[#8b5cf6] flex items-center justify-center text-[9px] font-black text-white">
                            {iv.interviewer.charAt(0)}
                          </div>
                          <span className="text-[11px] text-[#4a5068] dark:text-[#cbd5e1]">
                            <span className="font-semibold text-[#1a1a2e] dark:text-[#f8fafc]">{iv.interviewer}</span> · {iv.interviewerTitle}
                          </span>
                        </div>

                        {/* Past feedback */}
                        {tab === 'past' && iv.feedback && (
                          <div className="mt-3 px-3 py-2.5 bg-[#f8f9fc] dark:bg-[#161e2e] rounded-xl border border-[#e4e8f0] dark:border-[#1f2d42] text-[11px] text-[#4a5068] dark:text-[#cbd5e1] italic">
                            "{iv.feedback}"
                            {iv.score && (
                              <span className="not-italic font-bold text-[#6c63ff] dark:text-[#a78bfa] ml-2">— Score: {iv.score}/100</span>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-4 flex-wrap">
                          {tab === 'upcoming' && iv.link && (
                            <button
                              onClick={() => showToast(`Joining ${iv.company} interview...`)}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95"
                              style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: '0 3px 10px rgba(108,99,255,0.3)' }}
                            >
                              <Play size={12} /> Join Interview
                            </button>
                          )}
                          {tab === 'upcoming' && (
                            <button
                              onClick={() => setExpandedId(expandedId === iv.id ? null : iv.id)}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-[#4a5068] dark:text-[#cbd5e1] bg-[#f4f6fb] dark:bg-[#161e2e] border-none cursor-pointer hover:border-[#6c63ff] hover:text-[#6c63ff] transition-all"
                            >
                              <BookOpen size={12} /> Prep Guide
                            </button>
                          )}
                          {tab === 'past' && (
                            <button
                              onClick={() => showToast('Opening interview debrief...')}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-[#4a5068] dark:text-[#cbd5e1] bg-[#f4f6fb] dark:bg-[#161e2e] border-none cursor-pointer hover:text-[#6c63ff] transition-all"
                            >
                              <BookOpen size={12} /> View Debrief
                            </button>
                          )}
                          <button onClick={() => showToast('Rescheduling...')} className="w-8 h-8 rounded-xl bg-[#f4f6fb] dark:bg-[#161e2e] flex items-center justify-center border-none cursor-pointer hover:bg-[#6c63ff]/10 hover:text-[#6c63ff] transition-colors text-[#8890a4] dark:text-[#94a3b8]">
                            <MoreHorizontal size={15} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Round progress dots */}
                    <div className="flex items-center gap-1.5 mt-4 ml-16">
                      {Array.from({ length: iv.totalRounds }, (_, i) => i + 1).map(n => (
                        <div
                          key={n}
                          className="h-1.5 rounded-full transition-all"
                          style={{
                            width: n <= iv.roundNum ? '24px' : '8px',
                            background: n < iv.roundNum ? '#00c853' : n === iv.roundNum ? '#6c63ff' : '#e4e8f0',
                          }}
                        />
                      ))}
                      <span className="text-[10px] text-[#b0b8cc] dark:text-[#64748b] ml-1">{iv.roundNum}/{iv.totalRounds} rounds</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="flex flex-col gap-5">

            {/* Next Interview Countdown */}
            <div
              className="rounded-2xl p-5 relative overflow-hidden border border-[#1f2d42]"
              style={{ background: 'linear-gradient(145deg,#1a1a2e,#16213e)' }}
            >
              <div className="absolute top-0 right-0 w-28 h-28 rounded-full opacity-20 blur-2xl" style={{ background: '#6c63ff' }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#a78bfa] tracking-widest mb-3">
                  <Zap size={11} /> NEXT INTERVIEW
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-black text-white" style={{ background: 'linear-gradient(135deg,#e50914,#831010)' }}>NF</div>
                  <div>
                    <p className="text-[13px] font-bold text-white">Senior Product Designer</p>
                    <p className="text-[11px] text-[#b0b8cc]">Netflix · Technical Round</p>
                  </div>
                </div>
                <div className="bg-white/8 rounded-xl p-3 mb-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] text-[#b0b8cc] flex items-center gap-1"><Calendar size={10} /> Oct 24, Wednesday</span>
                    <span className="text-[10px] font-bold text-[#6c63ff] bg-[#6c63ff]/20 px-2 py-0.5 rounded-full">Today</span>
                  </div>
                  <div className="text-[13px] text-white flex items-center gap-1.5"><Clock size={12} className="text-[#b0b8cc]" /> 10:00 AM – 11:30 AM PST</div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[['02', 'Hrs'], ['45', 'Min'], ['30', 'Sec']].map(([v, l]) => (
                    <div key={l} className="bg-white/10 rounded-xl py-2.5 text-center">
                      <div className="text-[22px] font-black text-white leading-none">{v}</div>
                      <div className="text-[9px] text-[#b0b8cc] mt-0.5">{l}</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => showToast('Connecting to Netflix interview room...')}
                  className="w-full py-3 rounded-xl text-[13px] font-bold text-white flex items-center justify-center gap-2 border-none cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95"
                  style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: '0 4px 14px rgba(108,99,255,0.4)' }}
                >
                  <ExternalLink size={14} /> Join Now
                </button>
              </div>
            </div>

            {/* Prep Checklist */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60 dark:border-[#1f2d42]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#6c63ff]/10 flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-[#6c63ff]" />
                  </div>
                  <h3 className="text-[14px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc]">Prep Checklist</h3>
                </div>
                <span className="text-[12px] font-bold text-[#6c63ff] dark:text-[#a78bfa]">{prepPct}%</span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-[#f0f2f8] dark:bg-[#26334d] rounded-full mb-4 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${prepPct}%`, background: 'linear-gradient(90deg,#6c63ff,#8b5cf6)' }} />
              </div>

              <div className="flex flex-col gap-2.5">
                {checklist.map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className="flex items-start gap-3 text-left bg-transparent border-none cursor-pointer p-0 group"
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${item.done ? 'bg-[#00c853]' : 'border-2 border-[#d1d5db] dark:border-[#374151] group-hover:border-[#6c63ff]'}`}>
                      {item.done && <Check size={11} strokeWidth={3} className="text-white" />}
                    </div>
                    <span className={`text-[12px] leading-relaxed transition-colors ${item.done ? 'text-[#b0b8cc] dark:text-[#64748b] line-through' : 'text-[#4a5068] dark:text-[#cbd5e1] group-hover:text-[#1a1a2e] dark:group-hover:text-[#f8fafc]'}`}>
                      {item.task}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Interview Tips */}
            <div className="bg-gradient-to-br from-[#f0efff] to-[#e8f4ff] dark:from-[#111827] dark:to-[#1a2234] rounded-2xl p-5 border border-[#6c63ff]/15 dark:border-[#1f2d42]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-[#6c63ff]/15 flex items-center justify-center">
                  <Sparkles size={13} className="text-[#6c63ff]" />
                </div>
                <h3 className="text-[14px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc]">AI Interview Tips</h3>
              </div>
              <div className="flex flex-col gap-3">
                {aiTips.map((t, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 bg-white/70 dark:bg-[#161e2e] rounded-xl border border-[#6c63ff]/10 dark:border-[#1f2d42]">
                    <div className="flex-shrink-0 mt-0.5">{t.icon}</div>
                    <p className="text-[11px] text-[#4a5068] dark:text-[#cbd5e1] leading-relaxed">{t.tip}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => showToast('Generating personalized interview script...')}
                className="w-full mt-4 py-2.5 rounded-xl text-[12px] font-bold text-[#6c63ff] dark:text-[#a78bfa] bg-white dark:bg-[#111827] border border-[#6c63ff]/30 cursor-pointer hover:bg-[#6c63ff] hover:text-white transition-all"
              >
                Generate Full Prep Script →
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60 dark:border-[#1f2d42]">
              <h3 className="text-[13px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc] mb-3">Quick Actions</h3>
              <div className="flex flex-col gap-2">
                {[
                  { icon: <Mic size={13} className="text-[#6c63ff]" />, label: 'Practice with AI Mock Interview' },
                  { icon: <BookOpen size={13} className="text-[#f59e0b]" />, label: 'Review Common Questions' },
                  { icon: <User size={13} className="text-[#00c853]" />, label: 'Research Your Interviewer' },
                  { icon: <AlertCircle size={13} className="text-[#ff4d6d]" />, label: 'Request Reschedule' },
                ].map((a, i) => (
                  <button
                    key={i}
                    onClick={() => showToast(`Opening: ${a.label}`)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#f8f9fc] dark:bg-[#161e2e] border border-[#e4e8f0] dark:border-[#1f2d42] text-[12px] font-semibold text-[#4a5068] dark:text-[#cbd5e1] hover:border-[#6c63ff] hover:text-[#6c63ff] transition-all cursor-pointer text-left"
                  >
                    {a.icon}
                    {a.label}
                    <ChevronRight size={12} className="ml-auto text-[#c4c9d4] dark:text-[#64748b]" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
