import React, { useState, useRef, useEffect } from 'react';
import {
  HelpCircle, Moon, Bell, ChevronDown, Menu, User,
  Settings, LogOut, Sparkles, Briefcase, Lock, Check
} from 'lucide-react';
import { Page } from '../App';

interface TopbarProps {
  onMenuClick?: () => void;
  onNavigate?: (p: Page) => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick, onNavigate }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const storedUser = (() => {
    try {
      const st = localStorage.getItem('user');
      return st ? JSON.parse(st) : null;
    } catch { return null; }
  })();

  const userName = storedUser?.name || 'Candidate User';
  const userEmail = storedUser?.email || 'user@nexhire.ai';
  const userInitials = userName.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase() || 'CU';

  const handleMenuSelect = (page: Page) => {
    setShowDropdown(false);
    if (onNavigate) onNavigate(page);
  };

  const handleLogout = () => {
    setShowDropdown(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToast('Logged out successfully!');
    setTimeout(() => {
      if (onNavigate) onNavigate('login');
    }, 600);
  };

  return (
    <header className="flex items-center justify-between px-4 sm:px-7 h-[60px] min-h-[60px] bg-white border-b border-[#e8edf5] sticky top-0 z-30 w-full box-border flex-shrink-0">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-16 right-6 z-50 flex items-center gap-2.5 bg-[#1a1a2e] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-[#6c63ff]/30 text-xs font-semibold">
          <Check size={14} className="text-[#00c853]" />
          {toast}
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Mobile Menu Hamburger Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl bg-[#f4f6fb] text-[#1a1a2e] hover:bg-[#e8edf5] transition-colors border-none cursor-pointer"
          aria-label="Open Sidebar Menu"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="flex items-center gap-2.5 bg-[#f4f6fb] border border-[#e4e8f0] rounded-xl px-3.5 w-48 sm:w-72 md:w-80 h-[38px] focus-within:border-[#6c63ff] transition-colors">
          <svg className="text-[#b0b8cc] w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="border-none outline-none bg-transparent text-[13px] text-[#1a1a2e] w-full font-sans placeholder:text-[#b0b8cc]"
            placeholder="Search jobs, skills..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onNavigate?.('jobsearch');
              }
            }}
          />
        </div>
      </div>

      {/* Actions & Profile Dropdown */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => onNavigate?.('settings')}
          className="hidden sm:flex w-9 h-9 items-center justify-center bg-[#f4f6fb] border-none rounded-[9px] cursor-pointer text-[#8890a4] hover:bg-[#e8edf5] hover:text-[#6c63ff] transition-all"
          title="Help & Support"
        >
          <HelpCircle size={18}/>
        </button>

        <button
          onClick={() => onNavigate?.('settings')}
          className="hidden sm:flex w-9 h-9 items-center justify-center bg-[#f4f6fb] border-none rounded-[9px] cursor-pointer text-[#8890a4] hover:bg-[#e8edf5] hover:text-[#6c63ff] transition-all"
          title="Settings"
        >
          <Moon size={18}/>
        </button>

        {/* Notification */}
        <button
          onClick={() => onNavigate?.('notifications')}
          className="relative flex w-9 h-9 items-center justify-center bg-[#f4f6fb] border-none rounded-[9px] cursor-pointer text-[#8890a4] hover:bg-[#e8edf5] hover:text-[#6c63ff] transition-all"
          title="Notifications"
        >
          <Bell size={18}/>
          <span className="absolute top-[7px] right-[7px] w-[7px] h-[7px] bg-[#ff4d6d] rounded-full border-2 border-white"/>
        </button>

        {/* ── User Chip & Dropdown Container ── */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl cursor-pointer ml-1 transition-all ${
              showDropdown
                ? 'bg-[#6c63ff]/10 border-2 border-[#6c63ff]'
                : 'bg-[#f4f6fb] border border-[#e4e8f0] hover:border-[#6c63ff]'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6c63ff] to-[#a78bfa] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 shadow-sm">
              {userInitials}
            </div>
            <span className="hidden md:inline text-[13px] font-semibold text-[#1a1a2e] whitespace-nowrap">{userName}</span>
            <ChevronDown
              size={13}
              className={`text-[#8890a4] transition-transform duration-200 ${showDropdown ? 'rotate-180 text-[#6c63ff]' : ''}`}
            />
          </div>

          {/* ── Profile Dropdown Menu Popup ── */}
          {showDropdown && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-[#e4e8f0] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* User Summary Header */}
              <div className="px-4 py-3 border-b border-[#f0f2f8]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6c63ff] to-[#a78bfa] flex items-center justify-center text-[13px] font-black text-white shadow-md">
                    {userInitials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-extrabold text-[#1a1a2e] truncate">{userName}</p>
                    <p className="text-[11px] text-[#8890a4] truncate">{userEmail}</p>
                  </div>
                </div>
                <span className="inline-block text-[9.5px] font-bold text-[#6c63ff] bg-[#6c63ff]/10 px-2.5 py-0.5 rounded-full">
                  Candidate Account
                </span>
              </div>

              {/* Menu Links */}
              <div className="py-1">
                <button
                  onClick={() => handleMenuSelect('profile')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[12.5px] font-semibold text-[#4a5068] hover:text-[#6c63ff] hover:bg-[#6c63ff]/5 transition-colors border-none bg-transparent cursor-pointer"
                >
                  <User size={15} className="text-[#6c63ff]" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => handleMenuSelect('airesume')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[12.5px] font-semibold text-[#4a5068] hover:text-[#6c63ff] hover:bg-[#6c63ff]/5 transition-colors border-none bg-transparent cursor-pointer"
                >
                  <Sparkles size={15} className="text-[#8b5cf6]" />
                  <span>AI Resume Analyzer</span>
                </button>

                <button
                  onClick={() => handleMenuSelect('applications')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[12.5px] font-semibold text-[#4a5068] hover:text-[#6c63ff] hover:bg-[#6c63ff]/5 transition-colors border-none bg-transparent cursor-pointer"
                >
                  <Briefcase size={15} className="text-[#00c853]" />
                  <span>My Applications</span>
                </button>

                <button
                  onClick={() => handleMenuSelect('settings')}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[12.5px] font-semibold text-[#4a5068] hover:text-[#6c63ff] hover:bg-[#6c63ff]/5 transition-colors border-none bg-transparent cursor-pointer"
                >
                  <Settings size={15} className="text-[#f59e0b]" />
                  <span>Account Settings</span>
                </button>
              </div>

              <div className="border-t border-[#f0f2f8] my-1" />

              {/* Auth / Logout items */}
              <div className="py-1">
                <button
                  onClick={() => handleMenuSelect('login')}
                  className="w-full flex items-center gap-3 px-4 py-2 text-[12.5px] font-semibold text-[#4a5068] hover:text-[#6c63ff] hover:bg-[#6c63ff]/5 transition-colors border-none bg-transparent cursor-pointer"
                >
                  <Lock size={15} className="text-[#8890a4]" />
                  <span>Switch Account</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-[12.5px] font-bold text-[#ff4d6d] hover:bg-[#ff4d6d]/8 transition-colors border-none bg-transparent cursor-pointer"
                >
                  <LogOut size={15} />
                  <span>Log Out</span>
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
