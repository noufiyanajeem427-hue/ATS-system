import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaBars,
  FaSearch,
  FaBell,
  FaUserCircle,
  FaChevronDown,
  FaTimes,
} from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ sidebarOpen, setSidebarOpen, isMobile }) => {
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.includes('/company')) return 'Company Profile';
    if (path.includes('/jobs')) return 'Job Management';
    if (path.includes('/applicants')) return 'Applicants';
    if (path.includes('/ranking')) return 'AI Candidate Ranking';
    if (path.includes('/interviews')) return 'Interview Management';
    if (path.includes('/messages')) return 'Messages';
    if (path.includes('/analytics')) return 'Hiring Analytics';
    return 'HR Module';
  };

  const notifications = [
    { id: 1, title: 'New applicant applied', time: '5 min ago', read: false },
    { id: 2, title: 'Interview scheduled', time: '1 hour ago', read: false },
    { id: 3, title: 'Candidate ranking updated', time: '2 hours ago', read: true },
    { id: 4, title: 'Job posting expired', time: '1 day ago', read: true },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-all duration-200 text-[var(--text-primary)]"
          >
            {isMobile ? (
              sidebarOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />
            ) : (
              <FaBars className="w-5 h-5" />
            )}
          </button>
          
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)] hidden md:block">{getPageTitle()}</h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Search */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 bg-[var(--bg-hover)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)]"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
          </div>

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-all duration-200 md:hidden text-[var(--text-primary)]"
          >
            <FaSearch className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-all duration-200 relative text-[var(--text-primary)]"
            >
              <FaBell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-[var(--bg-secondary)] rounded-xl shadow-2xl border border-[var(--border-color)] overflow-hidden z-50"
              >
                <div className="p-4 border-b border-[var(--border-color)]">
                  <h3 className="font-semibold text-[var(--text-primary)]">Notifications</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 hover:bg-[var(--bg-hover)] cursor-pointer transition-colors ${
                        !notif.read ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                      }`}
                    >
                      <p className="text-sm font-medium text-[var(--text-primary)]">{notif.title}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-[var(--border-color)] text-center">
                  <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700 dark:text-indigo-400">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2 pl-2 border-l border-[var(--border-color)]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
              HR
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-[var(--text-primary)]">HR Admin</p>
              <p className="text-xs text-[var(--text-muted)]">Administrator</p>
            </div>
            <FaChevronDown className="w-4 h-4 text-[var(--text-muted)] hidden sm:block" />
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="px-4 pb-3 md:hidden"
        >
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-hover)] border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)]"
          />
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
