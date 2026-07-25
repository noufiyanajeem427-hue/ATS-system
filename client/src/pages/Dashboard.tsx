import React, { useState } from 'react';
import Topbar from '../components/Topbar';
import jsPDF from 'jspdf';
import {
  Zap, TrendingUp, CheckCircle2, ChevronRight,
  Sparkles, X, BarChart2, Eye, Download, Award,
  Users, Target, ShieldCheck
} from 'lucide-react';
import { Page } from '../App';
import { appStats } from '../data/applicationData';

interface DashboardProps {
  onMenuClick?: () => void;
  onNavigate?: (p: Page, job?: any) => void;
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
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Export Analytics PDF
  const downloadAnalyticsPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFillColor(26, 26, 46);
      doc.rect(0, 0, 210, 35, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Nexus ATS - Detailed Career Analytics Report', 15, 18);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(167, 139, 250);
      doc.text('Candidate: Alex Rivera  |  Generated: Oct 2023', 15, 27);

      let y = 45;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(108, 99, 255);
      doc.text('KEY PERFORMANCE METRICS', 15, y);

      y += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 50, 70);
      doc.text(`• Profile Impressions: 187 views (+12% growth)`, 15, y);
      doc.text(`• Recruiter Search Appearances: 42 appearances`, 15, y + 6);
      doc.text(`• AI Match Accuracy Index: 98%`, 15, y + 12);
      doc.text(`• Interview Response Rate: 58.3%`, 15, y + 18);

      y += 30;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(108, 99, 255);
      doc.text('KEYWORD & SKILL ATS MATCH BREAKDOWN', 15, y);

      y += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('• Figma & UI Prototyping: 98% Match', 15, y);
      doc.text('• Design Systems Architecture: 95% Match', 15, y + 6);
      doc.text('• User Research & Usability: 88% Match', 15, y + 12);
      doc.text('• React & Component Systems: 75% Match', 15, y + 18);

      doc.save('Nexus_Career_Analytics_Report.pdf');
      showToast('Analytics PDF downloaded successfully!');
    } catch (err) {
      showToast('Downloading analytics PDF report...');
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full lg:w-[calc(100vw-220px)] lg:ml-[220px] bg-[#f4f6fb] overflow-x-hidden relative">
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

      {/* ── DETAILED ANALYTICS REPORT MODAL ── */}
      {showAnalyticsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-3xl shadow-2xl my-auto animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between mb-6 pb-4 border-b border-[#f0f2f8]">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-[#6c63ff] tracking-widest uppercase mb-1">
                  <BarChart2 size={14} /> DETAILED ANALYTICS REPORT
                </div>
                <h2 className="text-[22px] sm:text-[26px] font-black text-[#1a1a2e]">Candidate Performance Insights</h2>
                <p className="text-[13px] text-[#8890a4]">Real-time engagement, recruiter searches, and ATS match analytics.</p>
              </div>
              <button
                onClick={() => setShowAnalyticsModal(false)}
                className="w-9 h-9 rounded-xl bg-[#f4f6fb] flex items-center justify-center text-[#8890a4] hover:text-[#1a1a2e] hover:bg-[#e4e8f0] transition-colors border-none cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Metrics Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Weekly Profile Views', val: '187', change: '+12%', color: '#6c63ff', icon: <Eye size={14} /> },
                { label: 'Recruiter Searches', val: '42', change: '+8%', color: '#00c853', icon: <Users size={14} /> },
                { label: 'AI Match Index', val: '98%', change: 'Top 2%', color: '#8b5cf6', icon: <Target size={14} /> },
                { label: 'Response Rate', val: '58.3%', change: 'Passed 5/8', color: '#f59e0b', icon: <Award size={14} /> },
              ].map(m => (
                <div key={m.label} className="p-4 bg-[#f8f9fc] rounded-2xl border border-[#e4e8f0]">
                  <div className="flex items-center justify-between text-[#8890a4] mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider">{m.label}</span>
                    <span style={{ color: m.color }}>{m.icon}</span>
                  </div>
                  <p className="text-[22px] font-black text-[#1a1a2e] leading-none mb-1">{m.val}</p>
                  <span className="text-[10px] font-bold text-[#00c853] bg-[#00c853]/10 px-2 py-0.5 rounded-full">{m.change}</span>
                </div>
              ))}
            </div>

            {/* Visual Charts & Skill Distribution */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              
              {/* Weekly Traffic Bar Chart */}
              <div className="p-5 bg-[#f8f9fc] rounded-2xl border border-[#e4e8f0]">
                <h4 className="text-[13px] font-extrabold text-[#1a1a2e] mb-3 flex items-center gap-2">
                  <TrendingUp size={14} className="text-[#6c63ff]" /> Weekly Profile Views Trend
                </h4>
                <div className="flex items-end justify-between h-32 pt-4 px-2">
                  {[
                    { day: 'Mon', count: 18, h: '40%' },
                    { day: 'Tue', count: 32, h: '70%' },
                    { day: 'Wed', count: 45, h: '95%' },
                    { day: 'Thu', count: 38, h: '80%' },
                    { day: 'Fri', count: 28, h: '60%' },
                    { day: 'Sat', count: 14, h: '30%' },
                    { day: 'Sun', count: 12, h: '25%' },
                  ].map(d => (
                    <div key={d.day} className="flex flex-col items-center gap-1.5 flex-1">
                      <div className="w-full max-w-[20px] bg-[#6c63ff]/15 rounded-t-lg relative group flex items-end justify-center h-full">
                        <div
                          className="w-full bg-[#6c63ff] rounded-t-lg transition-all group-hover:bg-[#8b5cf6]"
                          style={{ height: d.h }}
                        />
                      </div>
                      <span className="text-[10px] text-[#8890a4] font-semibold">{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Match Breakdown */}
              <div className="p-5 bg-[#f8f9fc] rounded-2xl border border-[#e4e8f0]">
                <h4 className="text-[13px] font-extrabold text-[#1a1a2e] mb-3 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#00c853]" /> ATS Skill Match Accuracy
                </h4>
                <div className="flex flex-col gap-2.5">
                  {[
                    { skill: 'Figma & UI Design', pct: 98, color: '#00c853' },
                    { skill: 'Design Systems', pct: 95, color: '#6c63ff' },
                    { skill: 'User Research', pct: 88, color: '#8b5cf6' },
                    { skill: 'React & Frontend', pct: 75, color: '#f59e0b' },
                  ].map(s => (
                    <div key={s.skill}>
                      <div className="flex justify-between text-[11px] font-bold mb-1">
                        <span className="text-[#1a1a2e]">{s.skill}</span>
                        <span style={{ color: s.color }}>{s.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-[#e4e8f0] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#f0f2f8] flex-wrap gap-3">
              <button
                onClick={downloadAnalyticsPDF}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold text-[#4a5068] bg-[#f4f6fb] border border-[#e4e8f0] hover:border-[#6c63ff] hover:text-[#6c63ff] cursor-pointer transition-all"
              >
                <Download size={14} className="text-[#6c63ff]" /> Export PDF Report
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAnalyticsModal(false)}
                  className="px-5 py-2.5 rounded-xl text-[12px] font-bold text-[#8890a4] bg-transparent border border-[#e4e8f0] hover:text-[#1a1a2e] cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowAnalyticsModal(false);
                    onNavigate?.('airesume');
                  }}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer"
                  style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}
                >
                  <Sparkles size={13} /> Optimize in AI Resume →
                </button>
              </div>
            </div>

          </div>
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
                  onClick={() => onNavigate?.('profile')}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl text-[14px] font-semibold text-white border-none cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95"
                  style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: '0 4px 14px rgba(108,99,255,0.4)' }}
                >
                  Complete Profile <ChevronRight size={14}/>
                </button>
                <button
                  onClick={() => setShowAnalyticsModal(true)}
                  className="bg-transparent border-none text-[14px] font-semibold text-white/90 hover:text-white underline cursor-pointer transition-colors active:scale-95 flex items-center gap-1.5"
                >
                  <BarChart2 size={15} className="text-[#a78bfa]" /> View Analytics
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
                    <span className="block text-sm font-bold text-[#1a1a2e]">Senior AI Product Designer</span>
                    <span className="block text-xs text-[#8890a4]">Google · Mountain View, CA</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#f0f2f8]">
                  <span className="text-xs font-bold text-[#00c853]">96% Match Rate</span>
                  <button
                    onClick={() => onNavigate?.('jobdetails', { title: 'Senior AI Product Designer', company: 'Google', location: 'Mountain View, CA', match: 96, salary: '$190k - $250k', type: 'Full-time' })}
                    className="text-xs font-bold text-[#6c63ff] bg-transparent border-none cursor-pointer hover:underline"
                  >
                    View Job →
                  </button>
                </div>
              </div>

              <div className="bg-white/10 rounded-2xl p-4 border border-white/10 text-white flex items-center justify-between">
                <div>
                  <span className="block text-[11px] text-[#a78bfa] font-bold">NEXT INTERVIEW</span>
                  <span className="block text-sm font-bold mt-0.5">Netflix · Tomorrow 10:00 AM</span>
                </div>
                <button
                  onClick={() => onNavigate?.('interview')}
                  className="bg-white/15 text-white border border-white/20 text-xs px-3 py-1.5 rounded-lg cursor-pointer hover:bg-white/25 font-semibold"
                >
                  Prepare
                </button>
              </div>
            </div>
          </div>

          {/* Right Column Quick Actions */}
          <div className="flex flex-col gap-3">
            <div className="bg-white rounded-2xl p-5 border border-[#e4e8f0] shadow-sm flex-1">
              <span className="block text-[11px] font-bold text-[#8890a4] tracking-widest uppercase mb-4">Quick Navigation</span>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: 'Job Search & Matches', page: 'jobsearch', color: '#6c63ff', count: '12 new' },
                  { label: 'AI Resume Optimizer', page: 'airesume', color: '#8b5cf6', count: 'Score 92%' },
                  { label: 'Application Tracker', page: 'applications', color: '#00c853', count: `${appStats.applied} active` },
                  { label: 'Scheduled Interviews', page: 'interview', color: '#f59e0b', count: `${appStats.interviews} upcoming` },
                ].map((item) => (
                  <button
                    key={item.page}
                    onClick={() => onNavigate?.(item.page as Page)}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-[#f8f9fc] hover:bg-[#6c63ff]/8 border border-[#e4e8f0] hover:border-[#6c63ff]/30 text-left transition-all cursor-pointer group"
                  >
                    <span className="text-[13px] font-bold text-[#1a1a2e] group-hover:text-[#6c63ff] transition-colors">{item.label}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: item.color }}>{item.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Applications', value: appStats.applied, sub: 'Active tracking', page: 'applications' },
            { label: 'Interviews', value: appStats.interviews, sub: 'Next: Netflix', page: 'interview' },
            { label: 'Offers Received', value: appStats.offers, sub: 'Verdant Labs', page: 'applications' },
            { label: 'Saved Jobs', value: 8, sub: 'In bookmarks', page: 'jobsearch' },
          ].map((s) => (
            <div
              key={s.label}
              onClick={() => onNavigate?.(s.page as Page)}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e4e8f0] shadow-sm hover:shadow-md hover:border-[#6c63ff]/40 cursor-pointer transition-all"
            >
              <span className="block text-[11px] font-bold text-[#8890a4] mb-1">{s.label}</span>
              <span className="block text-3xl font-black text-[#1a1a2e] mb-1">{s.value}</span>
              <span className="block text-[11px] text-[#6c63ff] font-semibold">{s.sub} →</span>
            </div>
          ))}
        </div>

        {/* Bottom Row: Active Applications Pipeline & Recommended Jobs */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">
          
          {/* Left: Active Pipeline */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e4e8f0] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-[#1a1a2e]">Active Application Pipeline</h3>
              <button
                onClick={() => onNavigate?.('applications')}
                className="text-xs font-bold text-[#6c63ff] bg-transparent border-none cursor-pointer hover:underline"
              >
                View All ({appStats.applied}) →
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {pipelineJobs.map((j, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 bg-[#f8f9fc] rounded-xl border border-[#e4e8f0] hover:border-[#6c63ff]/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-bold text-[13px] shadow-sm border border-[#e4e8f0] text-[#1a1a2e]">
                      {j.company[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-[#1a1a2e]">{j.role}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass[j.badgeColor]}`}>
                          {j.badge}
                        </span>
                      </div>
                      <span className="text-xs text-[#8890a4]">{j.company} · {j.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline text-xs text-[#8890a4]">{j.status}</span>
                    <button
                      onClick={() => onNavigate?.('applications')}
                      className="p-1.5 text-[#8890a4] hover:text-[#6c63ff] bg-transparent border-none cursor-pointer"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Top Recommended */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e4e8f0] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold text-[#1a1a2e]">Top Recommended Roles</h3>
                <button
                  onClick={() => onNavigate?.('jobsearch')}
                  className="text-xs font-bold text-[#6c63ff] bg-transparent border-none cursor-pointer hover:underline"
                >
                  Explore →
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {recommended.map((r, i) => (
                  <div key={i} className="p-3.5 bg-[#f8f9fc] rounded-xl border border-[#e4e8f0] hover:border-[#6c63ff]/30 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg text-white font-bold text-xs flex items-center justify-center" style={{ background: r.bg }}>
                          {r.initials}
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-[#1a1a2e]">{r.title}</span>
                          <span className="block text-[10px] text-[#8890a4]">{r.company} · {r.location}</span>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold" style={{ color: r.matchColor }}>{r.match}% Match</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#e4e8f0]">
                      <div className="flex gap-1.5">
                        {r.tags.map((t, idx) => (
                          <span key={idx} className="text-[9px] font-bold text-[#4a5068] bg-white px-2 py-0.5 rounded border border-[#e4e8f0]">{t}</span>
                        ))}
                      </div>
                      <button
                        onClick={() => onNavigate?.('jobdetails', { title: r.title, company: r.company, location: r.location, match: r.match, salary: '$180k - $240k', type: 'Full-time' })}
                        className="text-[11px] font-bold text-[#6c63ff] bg-transparent border-none cursor-pointer hover:underline"
                      >
                        Apply →
                      </button>
                    </div>
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

export default Dashboard;
