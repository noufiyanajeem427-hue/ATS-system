import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHome,
  FaBuilding,
  FaBriefcase,
  FaUsers,
  FaChartBar,
  FaCalendarCheck,
  FaEnvelope,
  FaCog,
  FaRobot,
  FaBell,
} from 'react-icons/fa';

const Sidebar = ({ isOpen, setIsOpen, isMobile }) => {
  const navItems = [
    { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/company', icon: FaBuilding, label: 'Company Profile' },
    { path: '/jobs', icon: FaBriefcase, label: 'Job Management' },
    { path: '/applicants', icon: FaUsers, label: 'Applicants' },
    { path: '/ranking', icon: FaRobot, label: 'AI Ranking' },
    { path: '/interviews', icon: FaCalendarCheck, label: 'Interviews' },
    { path: '/messages', icon: FaEnvelope, label: 'Messages' },
    { path: '/analytics', icon: FaChartBar, label: 'Analytics' },
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    closed: {
      x: -280,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={isMobile ? 'closed' : 'open'}
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className="fixed top-0 left-0 h-full w-64 bg-[var(--bg-secondary)] shadow-xl z-50 flex flex-col border-r border-[var(--border-color)]"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-[var(--border-color)]">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <span className="text-white text-xl font-bold">HR</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">HR Module</h1>
            <p className="text-xs text-[var(--text-muted)]">Recruitment Platform</p>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
              HR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">HR Admin</p>
              <p className="text-xs text-[var(--text-muted)] truncate">admin@hrplatform.com</p>
            </div>
            <button className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors relative">
              <FaBell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 px-3">
            Main Menu
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm dark:bg-indigo-900/30 dark:text-indigo-400'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                }`
              }
            >
              <item.icon className={`w-5 h-5 transition-colors ${
                ({ isActive }) => isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-[var(--text-muted)] group-hover:text-[var(--text-primary)]'
              }`} />
              <span className="text-sm font-medium">{item.label}</span>
              {item.label === 'AI Ranking' && (
                <span className="ml-auto text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full animate-pulse dark:bg-indigo-900/50 dark:text-indigo-400">
                  AI
                </span>
              )}
              {item.label === 'Messages' && (
                <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full animate-pulse dark:bg-red-900/50 dark:text-red-400">
                  3
                </span>
              )}
            </NavLink>
          ))}

          <div className="h-px bg-[var(--border-color)] my-4" />

          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3 px-3">
            Administrative
          </p>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm dark:bg-indigo-900/30 dark:text-indigo-400'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
              }`
            }
          >
            <FaCog className="w-5 h-5" />
            <span className="text-sm font-medium">Settings</span>
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-color)]">
          <div className="text-xs text-[var(--text-muted)] text-center">
            <p>HR Module v1.0.0</p>
            <p className="mt-1">© 2024 All rights reserved</p>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
