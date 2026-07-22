import React, { useState, useRef } from 'react';
import Topbar from '../components/Topbar';
import jsPDF from 'jspdf';
import {
  Sparkles, CheckCircle2, AlertTriangle, TrendingUp,
  Download, Upload, X, Check, Zap,
  FileText, Target, BookOpen, AlertCircle
} from 'lucide-react';
import { Page } from '../App';

interface AIResumeProps {
  onMenuClick?: () => void;
  onNavigate?: (p: Page, job?: any) => void;
}

const AIResume: React.FC<AIResumeProps> = ({ onMenuClick, onNavigate }) => {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);
  const [applyingFixes, setApplyingFixes] = useState(false);
  const [fixesApplied, setFixesApplied] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleApplyFixes = () => {
    setApplyingFixes(true);
    setTimeout(() => {
      setApplyingFixes(false);
      setFixesApplied(true);
      showToast('✓ All AI fixes applied successfully!');
    }, 2200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
      setFixesApplied(false);
      setAnimating(true);
      showToast(`Re-analyzing "${file.name}"...`);
      setTimeout(() => setAnimating(false), 1500);
    }
    e.target.value = '';
  };

  const generatePDF = () => {
    setGeneratingPDF(true);
    showToast('Generating PDF report...');

    setTimeout(() => {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 18;
      const contentW = pageW - margin * 2;
      let y = 0;

      const hex2rgb = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
      };
      const setColor = (hex: string) => {
        const { r, g, b } = hex2rgb(hex);
        doc.setTextColor(r, g, b);
      };
      const setFill = (hex: string) => {
        const { r, g, b } = hex2rgb(hex);
        doc.setFillColor(r, g, b);
      };
      const setStroke = (hex: string) => {
        const { r, g, b } = hex2rgb(hex);
        doc.setDrawColor(r, g, b);
      };

      // ── Header gradient bar ──
      setFill('#6c63ff');
      doc.rect(0, 0, pageW, 14, 'F');
      setFill('#8b5cf6');
      doc.rect(pageW * 0.5, 0, pageW * 0.5, 14, 'F');

      // ── Branding ──
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text('TalentStream AI', margin, 9);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('AI-Powered Resume Analysis Report', pageW - margin, 9, { align: 'right' });

      y = 24;

      // ── Title ──
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      setColor('#1a1a2e');
      doc.text('AI Resume Analysis Report', margin, y);
      y += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      setColor('#8890a4');
      doc.text(`Optimized for: Senior Product Designer at Google  •  Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, margin, y);
      y += 3;

      // Divider
      setStroke('#e4e8f0');
      doc.setLineWidth(0.4);
      doc.line(margin, y, pageW - margin, y);
      y += 10;

      // ── Score section ──
      setFill('#f4f6fb');
      doc.roundedRect(margin, y, contentW, 36, 3, 3, 'F');

      // Score circle (fake via rect)
      setFill('#6c63ff');
      doc.circle(margin + 18, y + 18, 12, 'S');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      setColor('#6c63ff');
      doc.text(`${score}`, margin + 18, y + 21, { align: 'center' });

      doc.setFontSize(20);
      setColor('#1a1a2e');
      doc.text('Elite Match Stability', margin + 36, y + 13);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      setColor('#4a5068');
      doc.text('Your resume is highly optimized for the target job description.', margin + 36, y + 21);
      doc.text("We've identified a few minor refinements to reach a 98% match.", margin + 36, y + 27);

      // Green badges
      const badges = ['Clean Formatting', 'Keyword Rich', 'Action Verbs'];
      let bx = margin + 36;
      badges.forEach(badge => {
        setFill('#00c853');
        doc.roundedRect(bx, y + 30, doc.getTextWidth(badge) + 8, 5, 1.5, 1.5, 'F');
        doc.setFontSize(7);
        doc.setTextColor(255, 255, 255);
        doc.text(badge, bx + 4, y + 34);
        bx += doc.getTextWidth(badge) + 14;
      });
      y += 44;

      // ── Matching Skills ──
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      setColor('#1a1a2e');
      doc.text('Matching Skills', margin, y);
      setFill('#00c853');
      doc.roundedRect(pageW - margin - 26, y - 5, 26, 6, 2, 2, 'F');
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text('6 FOUND', pageW - margin - 22, y - 0.5);
      y += 5;

      const skills = ['Product Strategy', 'UI/UX Design', 'Figma', 'Prototyping', 'User Research', 'Design Systems'];
      let sx = margin;
      skills.forEach((skill, i) => {
        const tw = doc.getTextWidth(skill) + 10;
        if (sx + tw > pageW - margin) { sx = margin; y += 9; }
        setFill('#f0f2f8');
        doc.roundedRect(sx, y - 4, tw, 7, 2, 2, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        setColor('#4a5068');
        doc.text(skill, sx + 5, y + 1);
        sx += tw + 4;
      });
      y += 14;

      // ── Missing Keywords ──
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      setColor('#1a1a2e');
      doc.text('Missing Keywords', margin, y);
      setFill('#ff4d6d');
      doc.roundedRect(pageW - margin - 32, y - 5, 32, 6, 2, 2, 'F');
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text('3 CRITICAL', pageW - margin - 28, y - 0.5);
      y += 6;

      ['A/B Testing', 'Data Visualization', 'Stakeholder Mgmt'].forEach(kw => {
        setFill('#ff4d6d');
        doc.circle(margin + 2, y - 1, 1.5, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        setColor('#1a1a2e');
        doc.text(kw, margin + 7, y + 0.5);
        y += 7;
      });
      y += 4;

      // ── Skill Gap Analysis ──
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      setColor('#1a1a2e');
      doc.text('Skill Gap Analysis', margin, y);
      y += 6;

      const gaps = [
        { label: 'Visual Design',       level: 'Mastery',       pct: 97, color: '#6c63ff' },
        { label: 'Interaction Design',  level: 'Advanced',      pct: 72, color: '#6c63ff' },
        { label: 'Analytical Thinking', level: 'Gap Identified', pct: 28, color: '#f59e0b' },
      ];
      gaps.forEach(({ label, level, pct, color }) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        setColor('#1a1a2e');
        doc.text(label, margin, y);
        const { r, g, b } = hex2rgb(color);
        doc.setTextColor(r, g, b);
        doc.setFont('helvetica', 'bold');
        doc.text(level, pageW - margin, y, { align: 'right' });
        y += 4;
        // Bar background
        setFill('#f0f2f8');
        doc.roundedRect(margin, y, contentW, 3, 1, 1, 'F');
        // Bar fill
        const { r: fr, g: fg, b: fb } = hex2rgb(color);
        doc.setFillColor(fr, fg, fb);
        doc.roundedRect(margin, y, contentW * pct / 100, 3, 1, 1, 'F');
        y += 9;
      });
      y += 4;

      // ── AI Recommendations ──
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      setColor('#1a1a2e');
      doc.text('AI Recommendations', margin, y);
      y += 6;

      const recs = [
        { tag: 'CRITICAL REVISION', tagColor: '#ff4d6d', title: 'Strengthen "Data Visualization" keywords.', body: 'Update your "Lead Designer" bullets to mention "data-driven visualization" or "Tableau/PowerBI integration".' },
        { tag: 'FORMATTING TIP',    tagColor: '#f59e0b', title: 'Resume Length Optimization', body: 'For Google, a concise 1-page resume is preferred for candidates with < 8 years experience.' },
        { tag: 'ACTION VERBS',      tagColor: '#6c63ff', title: 'Diversify Starting Words', body: 'Consider "Spearheaded", "Orchestrated", or "Architected" for variety.' },
      ];
      recs.forEach(rec => {
        // Card
        setFill('#f8f9fc');
        setStroke('#e4e8f0');
        doc.setLineWidth(0.3);
        doc.roundedRect(margin, y, contentW, 22, 2, 2, 'FD');
        // Tag
        const { r, g, b } = hex2rgb(rec.tagColor);
        doc.setFillColor(r, g, b);
        doc.roundedRect(margin + 4, y + 4, doc.getTextWidth(rec.tag) * 0.7 + 6, 4.5, 1, 1, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6);
        doc.setTextColor(255, 255, 255);
        doc.text(rec.tag, margin + 7, y + 7.5);
        // Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        setColor('#1a1a2e');
        doc.text(rec.title, margin + 4, y + 14);
        // Body
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        setColor('#4a5068');
        const lines = doc.splitTextToSize(rec.body, contentW - 10);
        doc.text(lines[0] || '', margin + 4, y + 19.5);
        y += 26;
      });

      // ── Grammar & Tone ──
      y += 2;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      setColor('#1a1a2e');
      doc.text('Grammar & Tone', margin, y);
      y += 6;

      setFill('#f8f9fc');
      setStroke('#e4e8f0');
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentW, 18, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      setColor('#8890a4');
      doc.text('TONE SCORE', margin + 4, y + 8);
      setColor('#6c63ff');
      doc.text('Professional', pageW - margin - 4, y + 8, { align: 'right' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      setColor('#4a5068');
      doc.text('Your resume uses strong active voice. No significant spelling errors found.', margin + 4, y + 14);
      y += 22;

      // ── Analysis Summary ──
      y += 2;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      setColor('#1a1a2e');
      doc.text('Analysis Summary', margin, y);
      y += 6;

      const stats = [
        { label: 'ATS Compatibility', value: '94%',   color: '#00c853' },
        { label: 'Keyword Density',   value: '87%',   color: '#6c63ff' },
        { label: 'Readability Score', value: 'A+',    color: '#6c63ff' },
        { label: 'Formatting Quality',value: 'Clean', color: '#00c853' },
      ];
      const statColW = contentW / 4;
      stats.forEach(({ label, value, color }, i) => {
        const sx2 = margin + i * statColW;
        setFill('#f4f6fb');
        doc.roundedRect(sx2, y, statColW - 4, 18, 2, 2, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        setColor('#8890a4');
        doc.text(label, sx2 + (statColW - 4) / 2, y + 6, { align: 'center' });
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        const { r, g, b } = hex2rgb(color);
        doc.setTextColor(r, g, b);
        doc.text(value, sx2 + (statColW - 4) / 2, y + 15, { align: 'center' });
      });
      y += 24;

      // ── Footer ──
      setFill('#6c63ff');
      doc.rect(0, pageH - 12, pageW, 12, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('© 2024 TalentStream AI. All rights reserved.', margin, pageH - 5);
      doc.text('Confidential — For Internal Use Only', pageW - margin, pageH - 5, { align: 'right' });

      // Save
      doc.save(`AI_Resume_Analysis_${new Date().toISOString().slice(0, 10)}.pdf`);
      setGeneratingPDF(false);
      showToast('✓ PDF downloaded successfully!');
    }, 800);
  };

  const score = fixesApplied ? 98 : 92;
  const scoreColor = score >= 95 ? '#00c853' : score >= 80 ? '#6c63ff' : '#f59e0b';

  const matchingSkills = ['Product Strategy', 'UI/UX Design', 'Figma', 'Prototyping', 'User Research', 'Design Systems'];
  const missingKeywords = ['A/B Testing', 'Data Visualization', 'Stakeholder Mgmt'];
  const skillGaps = [
    { label: 'Visual Design',       level: 'Mastery',        pct: 97, color: '#6c63ff' },
    { label: 'Interaction Design',  level: 'Advanced',       pct: 72, color: '#6c63ff' },
    { label: 'Analytical Thinking', level: 'Gap Identified', pct: 28, color: '#f59e0b' },
  ];
  const recommendations = [
    {
      tag: 'CRITICAL REVISION',
      tagColor: '#ff4d6d',
      tagBg: '#ff4d6d18',
      title: 'Strengthen "Data Visualization" keywords.',
      body: 'The Google role emphasizes analytical dashboards. Update your "Lead Designer" bullets to mention "data-driven visualization" or "Tableau/PowerBI integration".',
    },
    {
      tag: 'FORMATTING TIP',
      tagColor: '#f59e0b',
      tagBg: '#f59e0b18',
      title: 'Resume Length Optimization',
      body: 'Your resume is currently 1.5 pages. For Google, a concise 1-page resume is preferred for candidates with < 8 years experience.',
    },
    {
      tag: 'ACTION VERBS',
      tagColor: '#6c63ff',
      tagBg: '#6c63ff18',
      title: 'Diversify Starting Words',
      body: 'You use "Led" five times. Consider "Spearheaded", "Orchestrated", or "Architected" for variety.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full lg:w-[calc(100vw-220px)] lg:ml-[220px] bg-[#f4f6fb] overflow-x-hidden">
      <Topbar onMenuClick={onMenuClick} onNavigate={onNavigate} />

      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-[#1a1a2e] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#6c63ff]/30 animate-bounce">
          <Sparkles size={15} className="text-[#6c63ff]" />
          <span className="text-xs font-medium">{toastMsg}</span>
          <button onClick={() => setToastMsg(null)} className="text-[#8890a4] hover:text-white ml-1 border-none bg-transparent cursor-pointer">
            <X size={13} />
          </button>
        </div>
      )}

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Page Header */}
        <div className="mb-7">
          <h1 className="text-[26px] sm:text-[32px] font-black text-[#1a1a2e] tracking-tight">AI Resume Analyzer</h1>
          <p className="text-sm text-[#4a5068] mt-1.5">
            Optimize your resume for the{' '}
            <button
              onClick={() => onNavigate?.('jobdetails')}
              className="text-[#6c63ff] font-semibold bg-transparent border-none cursor-pointer hover:underline p-0"
            >
              Senior Product Designer
            </button>
            {' '}role at Google.
          </p>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-5">

            {/* Score Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e4e8f0]/60 overflow-hidden">
              {/* Purple gradient top band */}
              <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg,#6c63ff,#8b5cf6,#a78bfa)' }} />
              <div className="p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start">

                {/* Big Score */}
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="relative w-28 h-28">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path strokeWidth="3" stroke="#f0f2f8" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path
                        strokeWidth="3"
                        strokeDasharray={`${score}, 100`}
                        strokeLinecap="round"
                        stroke={scoreColor}
                        fill="none"
                        className="transition-all duration-700"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[32px] font-black leading-none" style={{ color: scoreColor }}>{score}</span>
                      <span className="text-[9px] font-bold text-[#b0b8cc] tracking-widest">SCORE</span>
                    </div>
                  </div>
                </div>

                {/* Score info */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[10px] font-bold text-[#6c63ff] tracking-widest uppercase mb-2">
                    <Sparkles size={12} /> NEXUS AI ANALYSIS
                  </div>
                  <h2 className="text-[22px] sm:text-[26px] font-black text-[#1a1a2e] leading-tight mb-3">
                    {fixesApplied ? 'Perfect Optimization!' : 'Elite Match Stability'}
                  </h2>
                  <p className="text-[13px] text-[#4a5068] leading-relaxed mb-4 max-w-md">
                    {fixesApplied
                      ? 'All fixes applied. Your resume now scores 98% and is fully optimized for the Senior Product Designer role at Google.'
                      : 'Your resume is highly optimized for the target job description. We\'ve identified a few minor refinements to reach a 98% match.'}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    {[
                      { icon: <Check size={11} strokeWidth={3}/>, label: 'Clean Formatting' },
                      { icon: <Check size={11} strokeWidth={3}/>, label: 'Keyword Rich' },
                      { icon: <Check size={11} strokeWidth={3}/>, label: 'Action Verbs' },
                    ].map(({ icon, label }) => (
                      <span key={label} className="flex items-center gap-1.5 text-[11px] font-bold text-[#00a843] bg-[#00c853]/10 px-3 py-1.5 rounded-full border border-[#00c853]/20">
                        {icon} {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Matching Skills */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#00c853]" />
                    <span className="text-[14px] font-extrabold text-[#1a1a2e]">Matching Skills</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#00a843] bg-[#00c853]/10 px-2.5 py-1 rounded-full border border-[#00c853]/20">
                    {matchingSkills.length} FOUND
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {matchingSkills.map((skill) => (
                    <span key={skill} className="text-[12px] font-semibold px-3 py-1.5 rounded-lg bg-[#f4f6fb] text-[#4a5068] border border-[#e4e8f0] hover:border-[#6c63ff] hover:text-[#6c63ff] transition-colors cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-[#f59e0b]" />
                    <span className="text-[14px] font-extrabold text-[#1a1a2e]">Missing Keywords</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#ff4d6d] bg-[#ff4d6d]/10 px-2.5 py-1 rounded-full border border-[#ff4d6d]/20">
                    {missingKeywords.length} CRITICAL
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {missingKeywords.map((kw) => (
                    <div key={kw} className="flex items-center gap-2.5 px-3 py-2 bg-[#ff4d6d]/5 border border-[#ff4d6d]/15 rounded-lg">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ff4d6d] flex-shrink-0" />
                      <span className="text-[12px] font-semibold text-[#1a1a2e]">{kw}</span>
                    </div>
                  ))}
                  <button
                    onClick={() => showToast('Opening keyword suggestions...')}
                    className="text-[11px] font-bold text-[#6c63ff] bg-transparent border-none cursor-pointer hover:underline mt-1 self-start p-0"
                  >
                    + Add suggested keywords →
                  </button>
                </div>
              </div>
            </div>

            {/* Skill Gap Analysis */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp size={16} className="text-[#6c63ff]" />
                <h3 className="text-[15px] font-extrabold text-[#1a1a2e]">Skill Gap Analysis</h3>
              </div>
              <div className="flex flex-col gap-4">
                {skillGaps.map(({ label, level, pct, color }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[13px] font-bold text-[#1a1a2e]">{label}</span>
                      <span className="text-[11px] font-bold" style={{ color }}>
                        {level}
                      </span>
                    </div>
                    <div className="h-2 bg-[#f0f2f8] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}99)` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Achievements + Grammar & Tone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Key Achievements */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60">
                <div className="flex items-center gap-2 mb-4">
                  <Target size={15} className="text-[#6c63ff]" />
                  <h3 className="text-[14px] font-extrabold text-[#1a1a2e]">Key Achievements</h3>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-[#00c853] flex-shrink-0 mt-0.5" />
                    <p className="text-[12px] text-[#4a5068] leading-relaxed">
                      Successfully quantified the impact of "Design System" implementation (+40% speed).
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-[#f59e0b] flex-shrink-0 mt-0.5" />
                    <p className="text-[12px] text-[#4a5068] leading-relaxed">
                      Consider adding metrics for your work at Meta to further strengthen the Experience section.
                    </p>
                  </div>
                </div>
              </div>

              {/* Grammar & Tone */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen size={15} className="text-[#6c63ff]" />
                  <h3 className="text-[14px] font-extrabold text-[#1a1a2e]">Grammar &amp; Tone</h3>
                </div>
                <div className="bg-[#f8f9fc] rounded-xl p-3.5 border border-[#e4e8f0]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-bold text-[#b0b8cc] tracking-widest uppercase">Tone Score</span>
                    <span className="text-[11px] font-bold text-[#6c63ff]">Professional</span>
                  </div>
                  <p className="text-[12px] text-[#4a5068] leading-relaxed">
                    Your resume uses strong active voice. No significant spelling errors found.
                  </p>
                  <div className="flex gap-1.5 mt-3">
                    {[
                      { label: 'Active Voice', ok: true },
                      { label: 'No Errors', ok: true },
                      { label: 'Concise', ok: true },
                    ].map(({ label, ok }) => (
                      <span key={label} className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${ok ? 'bg-[#00c853]/10 text-[#00a843]' : 'bg-[#ff4d6d]/10 text-[#ff4d6d]'}`}>
                        {ok ? '✓' : '✗'} {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right sidebar ── */}
          <div className="flex flex-col gap-4">

            {/* AI Recommendations */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg bg-[#6c63ff]/10 flex items-center justify-center">
                  <Zap size={13} className="text-[#6c63ff]" />
                </div>
                <h3 className="text-[14px] font-extrabold text-[#1a1a2e]">AI Recommendations</h3>
              </div>

              <div className="flex flex-col gap-3">
                {recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl border border-[#e4e8f0] hover:border-[#6c63ff]/30 hover:shadow-sm transition-all cursor-default"
                  >
                    <span
                      className="inline-block text-[8px] font-black tracking-widest px-2 py-0.5 rounded mb-2"
                      style={{ color: rec.tagColor, background: rec.tagBg }}
                    >
                      {rec.tag}
                    </span>
                    <p className="text-[12px] font-bold text-[#1a1a2e] mb-1">{rec.title}</p>
                    <p className="text-[11px] text-[#8890a4] leading-relaxed">{rec.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Apply All Fixes */}
            <button
              onClick={handleApplyFixes}
              disabled={applyingFixes || fixesApplied}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white border-none cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
              style={{ background: fixesApplied ? '#00c853' : 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: fixesApplied ? '0 4px 14px rgba(0,200,83,0.35)' : '0 4px 14px rgba(108,99,255,0.4)' }}
            >
              {applyingFixes ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Applying Fixes...
                </>
              ) : fixesApplied ? (
                <><Check size={15} /> All Fixes Applied!</>
              ) : (
                <><Sparkles size={15} /> Apply All Fixes via AI</>
              )}
            </button>

            {/* Download Analysis */}
            <button
              onClick={generatePDF}
              disabled={generatingPDF}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold text-[#4a5068] bg-white border border-[#e4e8f0] cursor-pointer hover:border-[#6c63ff] hover:text-[#6c63ff] transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {generatingPDF ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#6c63ff]/30 border-t-[#6c63ff] rounded-full animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <><Download size={14} /> Download Analysis PDF</>
              )}
            </button>

            {/* Re-upload for re-analysis */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-10 h-10 rounded-xl bg-[#f4f6fb] flex items-center justify-center">
                  <FileText size={18} className="text-[#8890a4]" />
                </div>
                <div>
                  {uploadedFile ? (
                    <p className="text-[11px] text-[#6c63ff] font-semibold">"{uploadedFile}" loaded</p>
                  ) : (
                    <p className="text-[12px] text-[#8890a4]">Upload a new version to re-analyze</p>
                  )}
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="text-[12px] font-bold text-[#6c63ff] bg-transparent border-none cursor-pointer hover:underline"
                >
                  Select File
                </button>
                <input ref={fileRef} type="file" accept=".pdf,.docx" className="hidden" onChange={handleFileUpload} />
              </div>
            </div>

            {/* Quick stats */}
            <div className="bg-gradient-to-br from-[#6c63ff]/8 to-[#8b5cf6]/8 rounded-2xl p-4 border border-[#6c63ff]/15">
              <span className="block text-[9px] font-bold text-[#b0b8cc] tracking-widest uppercase mb-3">Analysis Summary</span>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'ATS Compatibility',   value: '94%',   color: '#00c853' },
                  { label: 'Keyword Density',      value: '87%',   color: '#6c63ff' },
                  { label: 'Readability Score',    value: 'A+',    color: '#6c63ff' },
                  { label: 'Formatting Quality',   value: 'Clean', color: '#00c853' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-[11px] text-[#4a5068]">{label}</span>
                    <span className="text-[12px] font-bold" style={{ color }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#e4e8f0] mt-4 px-8 py-4 flex items-center justify-between flex-wrap gap-3">
        <span className="text-[11px] text-[#b0b8cc]">© 2024 TalentStream AI. All rights reserved.</span>
        <div className="flex items-center gap-4">
          {['Privacy Policy', 'Terms of Service', 'Support'].map((link) => (
            <button
              key={link}
              onClick={() => showToast(`Opening ${link}...`)}
              className="text-[11px] text-[#8890a4] hover:text-[#6c63ff] transition-colors bg-transparent border-none cursor-pointer"
            >
              {link}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default AIResume;
