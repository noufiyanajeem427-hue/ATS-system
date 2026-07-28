import React from 'react';

/** Reusable inline spinner for buttons & action triggers */
export const ButtonSpinner: React.FC<{ size?: number; className?: string; color?: string }> = ({
  size = 16,
  className = '',
  color = 'currentColor'
}) => (
  <svg
    className={`animate-spin ${className}`}
    style={{ width: size, height: size, color }}
    viewBox="0 0 24 24"
    fill="none"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke={color} strokeWidth="3.5" />
    <path
      className="opacity-75"
      fill={color}
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

/** Modern page transition spinner */
export const PageSpinner: React.FC<{ label?: string }> = ({ label = 'Loading content...' }) => (
  <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 min-h-[400px]">
    <div className="relative w-14 h-14 flex items-center justify-center mb-4">
      <svg className="absolute inset-0 animate-spin" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="24" stroke="url(#pageSpinnerGrad)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="110" strokeDashoffset="35" />
        <defs>
          <linearGradient id="pageSpinnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6c63ff" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
      <div className="w-6 h-6 rounded-full bg-[#6c63ff]/15 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-[#6c63ff] animate-ping" />
      </div>
    </div>
    <p className="text-[13px] font-semibold text-[#4a5068] animate-pulse">{label}</p>
  </div>
);

/** Full-screen initial app loader */
const AppLoader: React.FC = () => (
  <div className="fixed inset-0 bg-[#0f0f1a] flex flex-col items-center justify-center z-[9999]">
    {/* Radial glow */}
    <div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
      style={{ background: 'radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}/>

    {/* Logo + Spinner */}
    <div className="relative flex flex-col items-center gap-8 z-10">
      {/* Animated ring */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Outer spinning ring */}
        <svg className="absolute inset-0 animate-spin" viewBox="0 0 96 96" fill="none">
          <circle cx="48" cy="48" r="44" stroke="url(#ringGrad)" strokeWidth="3" strokeLinecap="round"
            strokeDasharray="200" strokeDashoffset="60"/>
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6c63ff"/>
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
        {/* Inner counter-spinning ring */}
        <svg className="absolute inset-0" style={{ animation: 'spin 2s linear infinite reverse' }} viewBox="0 0 96 96" fill="none">
          <circle cx="48" cy="48" r="34" stroke="rgba(108,99,255,0.25)" strokeWidth="1.5"
            strokeDasharray="8 6" strokeLinecap="round"/>
        </svg>
        {/* Logo icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#6c63ff]/20 border border-[#6c63ff]/30 flex items-center justify-center backdrop-blur-sm">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="8" height="8" rx="2" fill="#6c63ff"/>
            <rect x="13" y="3" width="8" height="8" rx="2" fill="#6c63ff" opacity=".6"/>
            <rect x="3" y="13" width="8" height="8" rx="2" fill="#6c63ff" opacity=".6"/>
            <rect x="13" y="13" width="8" height="8" rx="2" fill="#6c63ff" opacity=".3"/>
          </svg>
        </div>
      </div>

      {/* Brand */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-3xl font-black text-white tracking-wider">NexHire</span>
        <span className="text-[13px] text-[#5a6080] font-medium">AI-powered Applicant Tracking System</span>
      </div>

      {/* Animated dots */}
      <div className="flex items-center gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#6c63ff]"
            style={{ animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite` }}
          />
        ))}
      </div>

      <p className="text-[13px] text-[#3a4060] animate-pulse">Loading your workspace...</p>
    </div>
  </div>
);

/** Skeleton pulse block */
const Sk: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gradient-to-r from-[#eef0f8] via-[#f8f9fc] to-[#eef0f8] bg-[length:400%_100%] rounded-xl ${className}`}
    style={{ backgroundSize: '400% 100%', animation: 'shimmer 1.5s ease-in-out infinite, pulse 2s ease-in-out infinite' }}/>
);

/** Dashboard skeleton */
export const DashboardSkeleton: React.FC = () => (
  <div className="flex-1 px-8 py-7 overflow-y-auto">
    {/* Welcome */}
    <div className="mb-6 flex flex-col gap-2">
      <Sk className="h-8 w-64 rounded-xl"/>
      <Sk className="h-4 w-80 rounded-lg"/>
    </div>

    {/* Top Row */}
    <div className="grid grid-cols-[1fr_300px] gap-5 mb-5">
      {/* AI Card skeleton */}
      <div className="rounded-2xl bg-[#1a1a2e] p-7 h-64 flex flex-col gap-5">
        <Sk className="h-4 w-32 rounded-lg bg-[#2a2a4e]"/>
        <Sk className="h-20 w-3/4 rounded-xl bg-[#2a2a4e]"/>
        <div className="flex gap-4 flex-1">
          <Sk className="flex-1 rounded-xl bg-[#2a2a4e]"/>
          <Sk className="flex-1 rounded-xl bg-[#2a2a4e]"/>
        </div>
      </div>
      {/* Interview card skeleton */}
      <div className="bg-white rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex justify-between"><Sk className="h-5 w-28"/><Sk className="h-8 w-8 rounded-lg"/></div>
        <Sk className="flex-1 rounded-xl min-h-[90px]"/>
        <Sk className="h-4 w-40"/><Sk className="h-4 w-48"/>
        <Sk className="h-11 w-full rounded-xl"/>
      </div>
    </div>

    {/* Stats Row */}
    <div className="grid grid-cols-4 gap-4 mb-5">
      {[1,2,3,4].map(i => (
        <div key={i} className="bg-white rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex justify-between items-center"><Sk className="h-8 w-8 rounded-lg"/><Sk className="h-4 w-20"/></div>
          <Sk className="h-8 w-12"/>
          <Sk className="h-3 w-28"/>
        </div>
      ))}
    </div>

    {/* Bottom Row */}
    <div className="grid grid-cols-2 gap-5">
      {[1,2].map(i => (
        <div key={i} className="bg-white rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex justify-between"><Sk className="h-5 w-32"/><Sk className="h-4 w-14"/></div>
          {[1,2,3].map(j => <div key={j} className="flex gap-3 items-center"><Sk className="h-3 w-3 rounded-full"/><div className="flex-1 flex flex-col gap-1.5"><Sk className="h-3.5 w-3/4"/><Sk className="h-3 w-1/2"/></div></div>)}
        </div>
      ))}
    </div>
  </div>
);

/** Job Search skeleton */
export const JobSearchSkeleton: React.FC = () => (
  <div className="flex gap-5 px-7 py-5 flex-1">
    {/* Filter sidebar skeleton */}
    <div className="w-60 min-w-[240px] bg-white rounded-2xl p-5 flex flex-col gap-4 self-start">
      <div className="flex justify-between"><Sk className="h-5 w-16"/><Sk className="h-4 w-12"/></div>
      {[1,2,3,4,5].map(i => <Sk key={i} className="h-4 w-full"/>)}
      <Sk className="h-28 rounded-2xl"/>
    </div>
    {/* Job cards skeleton */}
    <div className="flex-1 flex flex-col gap-3">
      <div className="flex justify-between items-center mb-1"><Sk className="h-4 w-48"/><Sk className="h-4 w-28"/></div>
      {[1,2,3].map(i => (
        <div key={i} className="bg-white rounded-2xl p-5 flex gap-3.5 items-start">
          <Sk className="w-12 h-12 rounded-xl flex-shrink-0"/>
          <div className="flex-1 flex flex-col gap-2">
            <Sk className="h-5 w-3/4"/>
            <Sk className="h-4 w-1/2"/>
            <div className="flex gap-2 mt-1"><Sk className="h-6 w-20 rounded-full"/><Sk className="h-6 w-24 rounded-full"/><Sk className="h-6 w-16 rounded-full"/></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AppLoader;
