import React, { useState } from 'react';
import {
  Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, Check, Zap, Users, Briefcase
} from 'lucide-react';
import { Page } from '../App';
import { API_BASE, saveAuth, Role } from '../config';

interface LoginProps {
  onNavigate?: (p: Page) => void;
  onLoginSuccess?: (role: Role) => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate, onLoginSuccess }) => {
  const [portal, setPortal] = useState<Role>('candidate');
  const [email, setEmail] = useState('alex.rivera@email.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handlePortalSwitch = (p: Role) => {
    setPortal(p);
    // Swap in the matching demo credentials so the "Sign In" button
    // always works out of the box for whichever portal is selected.
    if (p === 'hr') {
      setEmail('hr@nexhire.com');
    } else {
      setEmail('alex.rivera@email.com');
    }
    setPassword('password123');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }
      if (data.token && data.user) {
        saveAuth(data.token, data.user);
      }
      const actualRole: Role = data.user?.role === 'hr' ? 'hr' : 'candidate';
      if (actualRole !== portal) {
        showToast(`This account is registered as ${actualRole === 'hr' ? 'HR' : 'Candidate'}. Redirecting you there...`);
      } else {
        showToast('Login successful! Welcome back.');
      }
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(actualRole);
        if (onNavigate) onNavigate(actualRole === 'hr' ? 'hr-dashboard' : 'dashboard');
      }, 600);
    } catch (err: any) {
      showToast(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    showToast(`Connecting with ${provider}...`);
    setTimeout(() => {
      if (onNavigate) onNavigate('dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0f172a] text-white font-sans overflow-hidden">
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-[#1a1a2e] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#6c63ff]/40 animate-bounce">
          <Sparkles size={16} className="text-[#6c63ff]" />
          <span className="text-xs font-semibold">{toast}</span>
        </div>
      )}

      {/* ── LEFT HERO PANEL ── */}
      <div
        className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #311042 100%)',
        }}
      >
        {/* Glow ambient shapes */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#6c63ff]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#ec4899]/15 blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6c63ff] to-[#a855f7] flex items-center justify-center shadow-lg shadow-[#6c63ff]/30">
            <Zap size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-[20px] font-black tracking-tight text-white leading-none">NexHire</h1>
            <p className="text-[10px] text-[#a78bfa] tracking-widest font-bold uppercase mt-1">AI Career Intelligence</p>
          </div>
        </div>

        {/* Middle Hero Content */}
        <div className="relative z-10 max-w-lg my-auto py-12">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-[11px] font-bold text-[#c084fc] mb-6">
            <Sparkles size={13} /> NEXT-GEN RECRUITMENT MATCHING
          </div>

          <h2 className="text-[38px] font-black text-white leading-tight tracking-tight mb-6">
            Accelerate your career with <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#a855f7] via-[#6c63ff] to-[#38bdf8]">Precision AI</span>.
          </h2>

          <p className="text-[14px] text-[#cbd5e1] leading-relaxed mb-8">
            Analyze your resume against 5,000+ top-tier job requirements, get instant ATS optimization scores, and land 3x more interviews.
          </p>

          {/* Key Feature Badges */}
          <div className="flex flex-col gap-3">
            {[
              '98% ATS Keyword Optimization Rate',
              'Real-time Salary & Market Insights',
              'Direct Recruiter Match Notifications',
            ].map((feat, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/10">
                <div className="w-6 h-6 rounded-full bg-[#00c853]/20 flex items-center justify-center text-[#00c853]">
                  <Check size={13} strokeWidth={3} />
                </div>
                <span className="text-[13px] font-semibold text-slate-200">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Candidate Quote */}
        <div className="relative z-10 bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10">
          <p className="text-[12.5px] text-slate-300 italic leading-relaxed">
            "Nexus ATS helped me rewrite my resume for Meta. Within 2 weeks, I received 4 interview calls!"
          </p>
          <div className="flex items-center gap-3 mt-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6c63ff] to-[#a855f7] flex items-center justify-center text-[11px] font-bold">AR</div>
            <div>
              <p className="text-[12px] font-bold text-white leading-none">Alex Rivera</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Staff Product Designer at Meta</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-[#0f172a] relative overflow-y-auto">
        
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#6c63ff] flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-[16px] font-black text-white">NexHire</span>
          </div>

          <div className="ml-auto text-[13px] text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate?.('register')}
              className="text-[#a78bfa] font-bold hover:underline bg-transparent border-none cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-md w-full mx-auto my-auto py-4">
          <div className="mb-6">
            <h2 className="text-[28px] font-black text-white tracking-tight">Welcome back</h2>
            <p className="text-[13px] text-slate-400 mt-1">
              {portal === 'hr'
                ? 'Sign in to manage jobs, applicants & interviews.'
                : 'Enter your credentials to access your candidate dashboard.'}
            </p>
          </div>

          {/* Portal Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 border border-slate-700/80 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => handlePortalSwitch('candidate')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12.5px] font-bold border-none cursor-pointer transition-all ${
                portal === 'candidate' ? 'bg-[#6c63ff] text-white shadow-lg shadow-[#6c63ff]/30' : 'bg-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users size={14} /> Candidate
            </button>
            <button
              type="button"
              onClick={() => handlePortalSwitch('hr')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12.5px] font-bold border-none cursor-pointer transition-all ${
                portal === 'hr' ? 'bg-[#6c63ff] text-white shadow-lg shadow-[#6c63ff]/30' : 'bg-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase size={14} /> HR / Recruiter
            </button>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => handleSocialLogin('Google')}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-[13px] font-bold text-slate-200 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Google
            </button>

            <button
              onClick={() => handleSocialLogin('LinkedIn')}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-[13px] font-bold text-slate-200 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
              LinkedIn
            </button>
          </div>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-[#0f172a] px-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest absolute">or email</span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-700/80 text-[13.5px] text-white outline-none focus:border-[#6c63ff] transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">Password</label>
                <button
                  type="button"
                  onClick={() => showToast('Password reset link sent to your email.')}
                  className="text-[11px] font-bold text-[#a78bfa] hover:underline bg-transparent border-none cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-2xl bg-slate-900 border border-slate-700/80 text-[13.5px] text-white outline-none focus:border-[#6c63ff] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 text-[#6c63ff] focus:ring-[#6c63ff] accent-[#6c63ff]"
                />
                <span className="text-[12px] text-slate-400 font-medium">Keep me signed in for 30 days</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl font-extrabold text-[14px] text-white flex items-center justify-center gap-2 border-none cursor-pointer transition-all hover:opacity-90 active:scale-98 mt-2"
              style={{
                background: 'linear-gradient(135deg, #6c63ff 0%, #a855f7 100%)',
                boxShadow: '0 4px 20px rgba(108, 99, 255, 0.4)',
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : (
                <>
                  Sign In to {portal === 'hr' ? 'HR Portal' : 'Dashboard'} <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[11px] text-slate-500 mt-4">
            Demo account pre-filled — just hit Sign In to explore the {portal === 'hr' ? 'HR' : 'candidate'} portal.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-500 py-2">
          By signing in, you agree to Nexus ATS <a href="#" className="text-slate-400 underline">Terms of Service</a> and <a href="#" className="text-slate-400 underline">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
};

export default Login;
