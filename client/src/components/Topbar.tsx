import React from 'react';
import { HelpCircle, Moon, Bell, ChevronDown, Menu } from 'lucide-react';
import { Page } from '../App';

interface TopbarProps {
  onMenuClick?: () => void;
  onNavigate?: (p: Page) => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick, onNavigate }) => (
  <header className="flex items-center justify-between px-4 sm:px-7 h-[60px] min-h-[60px] bg-white border-b border-[#e8edf5] sticky top-0 z-30 w-full box-border flex-shrink-0">
    <div className="flex items-center gap-3">
      {/* Mobile Menu Hamburger Button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl bg-[#f4f6fb] text-[#1a1a2e] hover:bg-[#e8edf5] transition-colors"
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

    {/* Actions */}
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
        title="Toggle Theme"
      >
        <Moon size={18}/>
      </button>

      {/* Notification */}
      <button
        onClick={() => onNavigate?.('notifications')}
        className="relative w-9 h-9 flex items-center justify-center bg-[#f4f6fb] border-none rounded-[9px] cursor-pointer text-[#8890a4] hover:bg-[#e8edf5] hover:text-[#6c63ff] transition-all"
        title="Notifications"
      >
        <Bell size={18}/>
        <span className="absolute top-[7px] right-[7px] w-[7px] h-[7px] bg-[#ff4d6d] rounded-full border-2 border-white"/>
      </button>

      {/* User chip */}
      <div
        onClick={() => onNavigate?.('profile')}
        className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-[#f4f6fb] border border-[#e4e8f0] rounded-xl cursor-pointer ml-1 hover:border-[#6c63ff] transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6c63ff] to-[#a78bfa] flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">
          AR
        </div>
        <span className="hidden md:inline text-[13px] font-medium text-[#1a1a2e] whitespace-nowrap">Alex Rivera</span>
        <ChevronDown size={13} className="text-[#8890a4]"/>
      </div>
    </div>
  </header>
);

export default Topbar;
