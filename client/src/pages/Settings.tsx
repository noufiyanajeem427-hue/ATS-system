import React, { useState } from 'react';
import Topbar from '../components/Topbar';
import {
  User, Bell, Shield, CreditCard, Sparkles,
  Save, Check, X, Smartphone, Laptop
} from 'lucide-react';
import { Page } from '../App';

interface SettingsProps {
  onMenuClick?: () => void;
  onNavigate?: (p: Page, job?: any) => void;
}

type TabType = 'account' | 'job' | 'security' | 'notifications' | 'billing';

const Settings: React.FC<SettingsProps> = ({ onMenuClick, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const [toast, setToast] = useState<string | null>(null);

  // Form states
  const [accountForm, setAccountForm] = useState({
    fullName: 'Alex Rivera',
    email: 'alex.rivera@email.com',
    phone: '+1 (415) 555-0192',
    location: 'San Francisco, CA',
    bio: 'Senior Product Designer with 8+ years experience in fintech and AI tools.',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [aiSettings, setAiSettings] = useState({
    matchThreshold: 85,
    autoTailorResume: true,
    recruiterDirectMsg: true,
    smartSalaryFilter: true,
    minSalary: 180000,
  });

  const [notificationsSettings, setNotificationsSettings] = useState({
    emailJobAlerts: true,
    emailInterviews: true,
    emailMarketing: false,
    pushMatches: true,
    pushMessages: true,
    smsInterviews: false,
  });

  const [twoFactor, setTwoFactor] = useState(true);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Account details updated successfully!');
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      showToast('Please enter your current password.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match!');
      return;
    }
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showToast('Password changed successfully!');
  };

  const handleSaveAISettings = () => {
    showToast('AI Match & Job Search preferences saved!');
  };

  return (
    <div className="flex flex-col min-h-screen w-full lg:w-[calc(100vw-220px)] lg:ml-[220px] bg-[#f4f6fb] overflow-x-hidden">
      <Topbar onMenuClick={onMenuClick} onNavigate={onNavigate} />

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-[#1a1a2e] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#6c63ff]/30">
          <Check size={14} className="text-[#00c853]" />
          <span className="text-xs font-medium">{toast}</span>
          <button onClick={() => setToast(null)} className="text-[#8890a4] hover:text-white bg-transparent border-none cursor-pointer"><X size={12} /></button>
        </div>
      )}

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Page Header */}
        <div className="flex items-start justify-between mb-7 flex-wrap gap-3">
          <div>
            <h1 className="text-[26px] sm:text-[32px] font-black text-[#1a1a2e] tracking-tight">Account Settings</h1>
            <p className="text-sm text-[#8890a4] mt-1">Manage your account preferences, AI matching thresholds, and security.</p>
          </div>
          <button
            onClick={() => showToast('All settings saved to cloud.')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer transition-all hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: '0 4px 14px rgba(108,99,255,0.35)' }}
          >
            <Save size={14} /> Save All Changes
          </button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">

          {/* Left Sub-nav */}
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-[#e4e8f0]/60 h-fit flex flex-row lg:flex-col overflow-x-auto">
            {[
              { id: 'account', label: 'Account Profile', icon: <User size={15} /> },
              { id: 'job', label: 'Job & AI Matching', icon: <Sparkles size={15} /> },
              { id: 'security', label: 'Security & Privacy', icon: <Shield size={15} /> },
              { id: 'notifications', label: 'Notifications', icon: <Bell size={15} /> },
              { id: 'billing', label: 'Billing & Plan', icon: <CreditCard size={15} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-all border-none cursor-pointer text-left whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-[#6c63ff] bg-[#6c63ff]/8'
                    : 'text-[#8890a4] bg-transparent hover:text-[#1a1a2e] hover:bg-[#f4f6fb]'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right Main Content Panel */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#e4e8f0]/60">

            {/* ── 1. ACCOUNT PROFILE ── */}
            {activeTab === 'account' && (
              <form onSubmit={handleSaveAccount} className="flex flex-col gap-6 max-w-2xl">
                <div>
                  <h2 className="text-[18px] font-extrabold text-[#1a1a2e]">Personal Information</h2>
                  <p className="text-[12px] text-[#8890a4] mt-0.5">Update your basic profile details shown to recruiters.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={accountForm.fullName}
                      onChange={e => setAccountForm({ ...accountForm, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#e4e8f0] text-[13px] text-[#1a1a2e] outline-none focus:border-[#6c63ff]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={accountForm.email}
                      onChange={e => setAccountForm({ ...accountForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#e4e8f0] text-[13px] text-[#1a1a2e] outline-none focus:border-[#6c63ff]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      value={accountForm.phone}
                      onChange={e => setAccountForm({ ...accountForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#e4e8f0] text-[13px] text-[#1a1a2e] outline-none focus:border-[#6c63ff]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1.5">Location</label>
                    <input
                      type="text"
                      value={accountForm.location}
                      onChange={e => setAccountForm({ ...accountForm, location: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#e4e8f0] text-[13px] text-[#1a1a2e] outline-none focus:border-[#6c63ff]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1.5">Professional Summary</label>
                  <textarea
                    rows={3}
                    value={accountForm.bio}
                    onChange={e => setAccountForm({ ...accountForm, bio: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#e4e8f0] text-[13px] text-[#1a1a2e] outline-none focus:border-[#6c63ff] resize-none"
                  />
                </div>

                <div className="pt-3 border-t border-[#f0f2f8] flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-[13px] font-bold text-white border-none cursor-pointer"
                    style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}
                  >
                    <Save size={14} /> Save Profile
                  </button>
                </div>
              </form>
            )}

            {/* ── 2. JOB & AI MATCHING ── */}
            {activeTab === 'job' && (
              <div className="flex flex-col gap-6 max-w-2xl">
                <div>
                  <h2 className="text-[18px] font-extrabold text-[#1a1a2e]">AI Matching & Job Preferences</h2>
                  <p className="text-[12px] text-[#8890a4] mt-0.5">Customize how Nexus AI evaluates job opportunities for your profile.</p>
                </div>

                {/* Slider */}
                <div className="bg-[#f8f9fc] rounded-2xl p-5 border border-[#e4e8f0]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-bold text-[#1a1a2e]">Minimum AI Match Score Threshold</span>
                    <span className="text-[14px] font-black text-[#6c63ff] bg-[#6c63ff]/10 px-3 py-1 rounded-full">{aiSettings.matchThreshold}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="98"
                    value={aiSettings.matchThreshold}
                    onChange={e => setAiSettings({ ...aiSettings, matchThreshold: Number(e.target.value) })}
                    className="w-full h-2 bg-[#e4e8f0] rounded-lg appearance-none cursor-pointer accent-[#6c63ff]"
                  />
                  <p className="text-[11px] text-[#8890a4] mt-2">Only jobs with a match score above {aiSettings.matchThreshold}% will trigger push alerts.</p>
                </div>

                {/* Salary filter */}
                <div className="bg-[#f8f9fc] rounded-2xl p-5 border border-[#e4e8f0]">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[13px] font-bold text-[#1a1a2e]">Minimum Expected Salary</p>
                      <p className="text-[11px] text-[#8890a4]">Filter out job recommendations below this threshold</p>
                    </div>
                    <span className="text-[14px] font-extrabold text-[#00c853]">${(aiSettings.minSalary / 1000).toFixed(0)}k / year</span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="350000"
                    step="10000"
                    value={aiSettings.minSalary}
                    onChange={e => setAiSettings({ ...aiSettings, minSalary: Number(e.target.value) })}
                    className="w-full h-2 bg-[#e4e8f0] rounded-lg appearance-none cursor-pointer accent-[#00c853]"
                  />
                </div>

                {/* Toggles */}
                <div className="flex flex-col gap-4">
                  {[
                    { key: 'autoTailorResume', title: 'Auto-Tailor Resume Suggestions', desc: 'AI suggests dynamic keyword additions based on job descriptions.' },
                    { key: 'recruiterDirectMsg', title: 'Allow Direct Recruiter Inquiries', desc: 'Permit recruiters from 90%+ match roles to message you directly.' },
                    { key: 'smartSalaryFilter', title: 'Hide Salary Undisclosed Jobs', desc: 'Exclude listings that do not provide compensation details.' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-2 border-b border-[#f0f2f8]">
                      <div>
                        <p className="text-[13px] font-bold text-[#1a1a2e]">{item.title}</p>
                        <p className="text-[11px] text-[#8890a4]">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => {
                          const k = item.key as keyof typeof aiSettings;
                          setAiSettings(prev => ({ ...prev, [k]: !prev[k] }));
                        }}
                        className={`w-10 h-5.5 rounded-full transition-all cursor-pointer border-none relative flex-shrink-0 ${
                          aiSettings[item.key as keyof typeof aiSettings] ? 'bg-[#6c63ff]' : 'bg-[#e4e8f0]'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full absolute top-0.75 transition-all shadow-sm ${
                            aiSettings[item.key as keyof typeof aiSettings] ? 'left-5' : 'left-0.75'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#f0f2f8] flex justify-end">
                  <button
                    onClick={handleSaveAISettings}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-[13px] font-bold text-white border-none cursor-pointer"
                    style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}
                  >
                    <Save size={14} /> Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* ── 3. SECURITY & PRIVACY ── */}
            {activeTab === 'security' && (
              <div className="flex flex-col gap-6 max-w-2xl">
                <div>
                  <h2 className="text-[18px] font-extrabold text-[#1a1a2e]">Security & Password</h2>
                  <p className="text-[12px] text-[#8890a4] mt-0.5">Manage your credentials, 2-factor authentication, and login sessions.</p>
                </div>

                {/* Password form */}
                <form onSubmit={handleSavePassword} className="flex flex-col gap-4 bg-[#f8f9fc] rounded-2xl p-5 border border-[#e4e8f0]">
                  <h3 className="text-[13px] font-bold text-[#1a1a2e]">Change Password</h3>

                  <div>
                    <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1">Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 rounded-xl border border-[#e4e8f0] text-[13px] outline-none focus:border-[#6c63ff] bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1">New Password</label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        placeholder="Min 8 characters"
                        className="w-full px-4 py-2 rounded-xl border border-[#e4e8f0] text-[13px] outline-none focus:border-[#6c63ff] bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#4a5068] uppercase tracking-wider block mb-1">Confirm Password</label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-2 rounded-xl border border-[#e4e8f0] text-[13px] outline-none focus:border-[#6c63ff] bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="self-end px-5 py-2 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer"
                    style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' }}
                  >
                    Update Password
                  </button>
                </form>

                {/* 2FA */}
                <div className="flex items-center justify-between p-5 bg-[#f8f9fc] rounded-2xl border border-[#e4e8f0]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#00c853]/10 flex items-center justify-center text-[#00c853]">
                      <Shield size={20} />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#1a1a2e]">Two-Factor Authentication (2FA)</p>
                      <p className="text-[11px] text-[#8890a4]">Secure your account with authenticator app (Google Authenticator / Authy).</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setTwoFactor(!twoFactor); showToast(`2FA ${!twoFactor ? 'Enabled' : 'Disabled'}`); }}
                    className={`w-10 h-5.5 rounded-full transition-all cursor-pointer border-none relative flex-shrink-0 ${twoFactor ? 'bg-[#00c853]' : 'bg-[#e4e8f0]'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-0.75 transition-all shadow-sm ${twoFactor ? 'left-5' : 'left-0.75'}`} />
                  </button>
                </div>

                {/* Active Sessions */}
                <div>
                  <h3 className="text-[13px] font-bold text-[#1a1a2e] mb-3">Active Login Sessions</h3>
                  <div className="flex flex-col gap-2">
                    {[
                      { device: 'Chrome on macOS', loc: 'San Francisco, CA', time: 'Active Now', current: true, icon: <Laptop size={15} /> },
                      { device: 'Nexus App on iPhone 15', loc: 'San Francisco, CA', time: '2 hours ago', current: false, icon: <Smartphone size={15} /> },
                    ].map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 bg-[#f8f9fc] rounded-xl border border-[#e4e8f0]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#6c63ff] shadow-sm">{s.icon}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[12px] font-bold text-[#1a1a2e]">{s.device}</span>
                              {s.current && <span className="text-[9px] font-bold bg-[#00c853]/10 text-[#00a843] px-2 py-0.5 rounded-full">Current</span>}
                            </div>
                            <span className="text-[10px] text-[#8890a4]">{s.loc} · {s.time}</span>
                          </div>
                        </div>
                        {!s.current && (
                          <button onClick={() => showToast('Session logged out.')} className="text-[11px] font-bold text-[#ff4d6d] bg-transparent border-none cursor-pointer hover:underline">
                            Revoke
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── 4. NOTIFICATIONS ── */}
            {activeTab === 'notifications' && (
              <div className="flex flex-col gap-6 max-w-2xl">
                <div>
                  <h2 className="text-[18px] font-extrabold text-[#1a1a2e]">Notification Channels</h2>
                  <p className="text-[12px] text-[#8890a4] mt-0.5">Control how and when Nexus sends you alerts.</p>
                </div>

                <div className="flex flex-col gap-4">
                  {[
                    { key: 'emailJobAlerts', title: 'Email Job Match Alerts', desc: 'Receive instant emails for 90%+ match roles.' },
                    { key: 'emailInterviews', title: 'Interview Reminder Emails', desc: 'Get confirmation & 24h reminder emails for scheduled calls.' },
                    { key: 'pushMatches', title: 'Browser Push Notifications', desc: 'Real-time desktop popups when recruiters view your profile.' },
                    { key: 'pushMessages', title: 'Chat Message Notifications', desc: 'Instant alerts when recruiters reply to your messages.' },
                    { key: 'smsInterviews', title: 'SMS Interview Reminders', desc: 'Text alert 1 hour before an interview begins.' },
                    { key: 'emailMarketing', title: 'Career Insights & Newsletter', desc: 'Weekly roundup of hiring trends and salary benchmarks.' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-[#f0f2f8]">
                      <div>
                        <p className="text-[13px] font-bold text-[#1a1a2e]">{item.title}</p>
                        <p className="text-[11px] text-[#8890a4]">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => {
                          const k = item.key as keyof typeof notificationsSettings;
                          setNotificationsSettings(prev => ({ ...prev, [k]: !prev[k] }));
                          showToast('Notification preference updated.');
                        }}
                        className={`w-10 h-5.5 rounded-full transition-all cursor-pointer border-none relative flex-shrink-0 ${
                          notificationsSettings[item.key as keyof typeof notificationsSettings] ? 'bg-[#6c63ff]' : 'bg-[#e4e8f0]'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full absolute top-0.75 transition-all shadow-sm ${
                            notificationsSettings[item.key as keyof typeof notificationsSettings] ? 'left-5' : 'left-0.75'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── 5. BILLING & PLAN ── */}
            {activeTab === 'billing' && (
              <div className="flex flex-col gap-6 max-w-2xl">
                <div>
                  <h2 className="text-[18px] font-extrabold text-[#1a1a2e]">Current Subscription</h2>
                  <p className="text-[12px] text-[#8890a4] mt-0.5">Manage your plan, billing details, and invoice history.</p>
                </div>

                {/* Plan card */}
                <div
                  className="rounded-2xl p-6 text-white relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  style={{ background: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)', boxShadow: '0 8px 24px rgba(108,99,255,0.25)' }}
                >
                  <div>
                    <span className="text-[10px] font-bold text-[#a78bfa] tracking-widest uppercase">Active Plan</span>
                    <h3 className="text-[22px] font-black text-white mt-1">Nexus AI Plus (Pro)</h3>
                    <p className="text-[12px] text-[#b0b8cc] mt-1">Includes unlimited AI Resume scoring, priority recruiter messaging, & 1-on-1 mock interviews.</p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end flex-shrink-0">
                    <span className="text-[26px] font-black text-white">$29<span className="text-[12px] text-[#b0b8cc] font-normal">/mo</span></span>
                    <span className="text-[10px] text-[#00c853] bg-[#00c853]/20 px-2 py-0.5 rounded-full font-bold mt-1">Renews Nov 15</span>
                  </div>
                </div>

                {/* Invoice History */}
                <div>
                  <h3 className="text-[14px] font-extrabold text-[#1a1a2e] mb-3">Billing History</h3>
                  <div className="divide-y divide-[#f0f2f8] bg-[#f8f9fc] rounded-2xl border border-[#e4e8f0] overflow-hidden">
                    {[
                      { date: 'Oct 15, 2023', amount: '$29.00', status: 'Paid', inv: 'INV-2023-010' },
                      { date: 'Sep 15, 2023', amount: '$29.00', status: 'Paid', inv: 'INV-2023-009' },
                      { date: 'Aug 15, 2023', amount: '$29.00', status: 'Paid', inv: 'INV-2023-008' },
                    ].map(inv => (
                      <div key={inv.inv} className="flex items-center justify-between p-4 text-[12px]">
                        <div>
                          <p className="font-bold text-[#1a1a2e]">{inv.inv}</p>
                          <p className="text-[10px] text-[#8890a4]">{inv.date}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-[#1a1a2e]">{inv.amount}</span>
                          <span className="text-[10px] font-bold text-[#00a843] bg-[#00c853]/10 px-2 py-0.5 rounded-full">{inv.status}</span>
                          <button onClick={() => showToast(`Downloading ${inv.inv}...`)} className="text-[11px] font-bold text-[#6c63ff] bg-transparent border-none cursor-pointer hover:underline">
                            PDF
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
