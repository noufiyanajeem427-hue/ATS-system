import React from 'react';
import {
  LayoutDashboard, Search, FileEdit, Bot,
  Folder, Mic2, User, MessageCircle, Bell, Settings, X
} from 'lucide-react';
import { Page } from '../App';

interface NavItem { icon: React.ReactNode; label: string; page: Page; }

const navItems: NavItem[] = [
  { icon: <LayoutDashboard size={17} />, label: 'Dashboard',          page: 'dashboard' },
  { icon: <Search size={17} />,          label: 'Job Search',          page: 'jobsearch' },
  { icon: <FileEdit size={17} />,        label: 'Resume',              page: 'resume' },
  { icon: <Bot size={17} />,             label: 'AI Resume Analyzer',  page: 'airesume' },
  { icon: <Folder size={17} />,          label: 'Applications',        page: 'applications' },
  { icon: <Mic2 size={17} />,            label: 'Interview',           page: 'interview' },
  { icon: <User size={17} />,            label: 'Profile',             page: 'profile' },
  { icon: <MessageCircle size={17} />,   label: 'Messages',            page: 'messages' },
  { icon: <Bell size={17} />,            label: 'Notifications',       page: 'notifications' },
  { icon: <Settings size={17} />,        label: 'Settings',            page: 'settings' },
];

interface SidebarProps {
  activePage: Page;
  onNavigate: (p: Page) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-[220px] flex flex-col bg-[#0f0f1a] z-50 overflow-hidden transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#6c63ff]/20 flex items-center justify-center flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="8" height="8" rx="2" fill="#6c63ff"/>
                <rect x="13" y="3" width="8" height="8" rx="2" fill="#6c63ff" opacity=".6"/>
                <rect x="3" y="13" width="8" height="8" rx="2" fill="#6c63ff" opacity=".6"/>
                <rect x="13" y="13" width="8" height="8" rx="2" fill="#6c63ff" opacity=".3"/>
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-white font-bold text-base tracking-wider">NexHire</span>
              <span className="text-[9px] text-[#4a5068] leading-tight mt-0.5">AI-powered ATS</span>
            </div>
          </div>

          {/* Close Button on Mobile */}
          <button
            onClick={onClose}
            className="lg:hidden text-[#8890a4] hover:text-white p-1 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-2 overflow-y-auto">
          {navItems.map((item) => {
            const active = item.page === activePage;
            return (
              <div
                key={item.label}
                onClick={() => {
                  onNavigate(item.page);
                  onClose();
                }}
                className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer mb-0.5 transition-all duration-200
                  ${active ? 'bg-[#6c63ff]/20' : 'hover:bg-[#6c63ff]/10'}`}
              >
                <span className={active ? 'text-white' : 'text-[#5a6080]'}>{item.icon}</span>
                <span className={`text-[13px] font-medium truncate ${active ? 'text-white font-semibold' : 'text-[#7a80a0]'}`}>
                  {item.label}
                </span>
                {active && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#6c63ff] rounded-l" />
                )}
              </div>
            );
          })}
        </nav>

        {/* User Card */}
        <div
          onClick={() => {
            onNavigate('profile');
            onClose();
          }}
          className="mx-2.5 mb-4 p-3 bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/[0.06] rounded-xl flex items-center gap-2.5 cursor-pointer"
        >
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6c63ff] to-[#a78bfa] flex items-center justify-center text-[11px] font-bold text-white">
              AR
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0f0f1a]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-semibold text-[#e0e4f0] truncate">Alex Rivera</span>
            <span className="text-[9px] font-bold text-[#6c63ff] tracking-wider">PREMIUM MEMBER</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
