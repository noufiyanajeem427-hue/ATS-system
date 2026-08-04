import React, { useState, useEffect } from 'react';
import Topbar from '../components/Topbar';
import {
  Bell, Check, CheckCheck, Trash2, Sparkles,
  Calendar, Briefcase, MessageSquare, Zap,
  ChevronRight, X, Settings, Volume2,
  Mail, Smartphone, Monitor
} from 'lucide-react';
import { Page } from '../App';
import { fetchNotificationsApi } from '../services/api';

interface NotificationsProps {
  onMenuClick?: () => void;
  onNavigate?: (p: Page, job?: any) => void;
}

export type NotificationCategory = 'all' | 'unread' | 'interview' | 'jobs' | 'messages' | 'system';

export interface NotificationItem {
  id: number | string;
  title: string;
  message: string;
  time: string;
  date: string;
  category: 'interview' | 'jobs' | 'messages' | 'system';
  read: boolean;
  actionText?: string;
  targetPage?: Page;
  jobPayload?: any;
  avatarBg?: string;
  iconBg?: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    title: 'Interview Scheduled Tomorrow',
    message: 'Your Technical Round with Sarah Chen (Engineering Manager at Netflix) is scheduled for Oct 24 at 10:00 AM PST.',
    time: '10m ago',
    date: 'Today',
    category: 'interview',
    read: false,
    actionText: 'View Interview Details',
    targetPage: 'interview',
    iconBg: '#6c63ff15',
  },
  {
    id: 2,
    title: 'New High AI Match Job Posted',
    message: 'Cognitive Systems just posted "Senior Product Designer (AI/ML)" with a 98% Match to your profile.',
    time: '2h ago',
    date: 'Today',
    category: 'jobs',
    read: false,
    actionText: 'View Job Details',
    targetPage: 'jobdetails',
    jobPayload: { title: 'Staff UI Designer', company: 'Airbnb', location: 'San Francisco (Hybrid)', match: 98, salary: '$180k - $240k', type: 'Full-time', logo: 'A' },
    iconBg: '#00c85315',
  },
  {
    id: 3,
    title: 'Direct Recruiter Message',
    message: 'Marcus Vance from Stripe sent you a direct recruiter inquiry regarding Design Systems Architect.',
    time: 'Yesterday',
    date: 'Yesterday',
    category: 'messages',
    read: true,
    actionText: 'Open Chat',
    targetPage: 'messages',
    iconBg: '#f59e0b15',
  },
  {
    id: 4,
    title: 'AI Resume Score Updated',
    message: 'Your resume compatibility index increased from 84% to 92% after adding key UI design keywords.',
    time: '2 days ago',
    date: 'Oct 20',
    category: 'system',
    read: true,
    actionText: 'View AI Resume',
    targetPage: 'airesume',
    iconBg: '#8b5cf615',
  },
];

const Notifications: React.FC<NotificationsProps> = ({ onMenuClick, onNavigate }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<NotificationCategory>('all');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchNotificationsApi().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const mapped: NotificationItem[] = data.map((n: any, idx: number) => ({
          id: n._id || idx + 1,
          title: n.title || 'Notification Update',
          message: n.message || 'You have a new update in your account.',
          time: n.time || 'Recently',
          date: n.date || 'Today',
          category: n.category || 'system',
          read: !!n.read,
          actionText: n.actionText || 'View Details',
          targetPage: n.targetPage || 'dashboard',
          iconBg: n.iconBg || '#6c63ff15',
        }));
        setNotifications(mapped);
      }
    });
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  const markSingleRead = (id: number | string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: number | string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast('Notification removed.');
  };

  const clearAll = () => {
    setNotifications([]);
    showToast('Cleared all notifications.');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'interview') return n.category === 'interview';
    if (filter === 'jobs') return n.category === 'jobs';
    if (filter === 'messages') return n.category === 'messages';
    if (filter === 'system') return n.category === 'system';
    return true;
  });

  const categoryIcon = (cat: NotificationItem['category']) => {
    if (cat === 'interview') return <Calendar size={16} className="text-[#6c63ff]" />;
    if (cat === 'jobs') return <Briefcase size={16} className="text-[#00c853]" />;
    if (cat === 'messages') return <MessageSquare size={16} className="text-[#f59e0b]" />;
    return <Zap size={16} className="text-[#8b5cf6]" />;
  };

  return (
    <div className="flex flex-col min-h-screen w-full lg:w-[calc(100vw-220px)] lg:ml-[220px] bg-[#f4f6fb] dark:bg-[#0b0f19] text-[#1a1a2e] dark:text-[#f8fafc] overflow-x-hidden transition-colors duration-200">
      <Topbar onMenuClick={onMenuClick} onNavigate={onNavigate} />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 bg-[#1a1a2e] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#6c63ff]/30">
          <Sparkles size={14} className="text-[#6c63ff]" />
          <span className="text-xs font-medium">{toast}</span>
          <button onClick={() => setToast(null)} className="text-[#8890a4] hover:text-white bg-transparent border-none cursor-pointer"><X size={12} /></button>
        </div>
      )}

      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-7 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[26px] sm:text-[32px] font-black text-[#1a1a2e] dark:text-[#f8fafc] tracking-tight">Notifications</h1>
              {unreadCount > 0 && (
                <span className="bg-[#6c63ff] text-white text-[12px] font-black px-2.5 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              )}
            </div>
            <p className="text-sm text-[#8890a4] dark:text-[#94a3b8] mt-1">Stay updated with your job applications, interviews, and AI matches.</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-bold text-[#4a5068] dark:text-[#cbd5e1] bg-white dark:bg-[#111827] border border-[#e4e8f0] dark:border-[#1f2d42] cursor-pointer hover:border-[#6c63ff] hover:text-[#6c63ff] transition-all"
              >
                <CheckCheck size={14} /> Mark All Read
              </button>
            )}
            <button
              onClick={() => onNavigate?.('settings')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer transition-all hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)', boxShadow: '0 4px 14px rgba(108,99,255,0.35)' }}
            >
              <Settings size={14} /> Preferences
            </button>
          </div>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">

          {/* Left Column: Filter + List */}
          <div className="flex flex-col gap-5">

            {/* Filter Tabs */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl p-2 shadow-sm border border-[#e4e8f0]/60 dark:border-[#1f2d42] flex items-center gap-1 overflow-x-auto">
              {[
                { id: 'all', label: 'All' },
                { id: 'unread', label: `Unread (${unreadCount})` },
                { id: 'interview', label: 'Interviews' },
                { id: 'jobs', label: 'Jobs & Match' },
                { id: 'messages', label: 'Messages' },
                { id: 'system', label: 'System' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setFilter(t.id as NotificationCategory)}
                  className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all border-none cursor-pointer whitespace-nowrap ${
                    filter === t.id
                      ? 'text-white'
                      : 'text-[#8890a4] dark:text-[#94a3b8] bg-transparent hover:text-[#1a1a2e] dark:hover:text-[#f8fafc] hover:bg-[#f4f6fb] dark:hover:bg-[#161e2e]'
                  }`}
                  style={filter === t.id ? { background: 'linear-gradient(135deg,#6c63ff,#8b5cf6)' } : {}}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-sm border border-[#e4e8f0]/60 dark:border-[#1f2d42] overflow-hidden">
              <div className="divide-y divide-[#f0f2f8] dark:divide-[#1f2d42]">
                {filtered.map(item => (
                  <div
                    key={item.id}
                    className={`p-5 flex items-start gap-4 transition-all relative group ${
                      !item.read ? 'bg-[#6c63ff]/4 border-l-4 border-[#6c63ff]' : 'hover:bg-[#f8f9fc] dark:hover:bg-[#161e2e]'
                    }`}
                  >
                    {/* Category Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: item.iconBg || '#f4f6fb' }}
                    >
                      {categoryIcon(item.category)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-[14px] font-extrabold ${!item.read ? 'text-[#1a1a2e] dark:text-[#f8fafc]' : 'text-[#4a5068] dark:text-[#cbd5e1]'}`}>
                            {item.title}
                          </h3>
                          {!item.read && (
                            <span className="w-2 h-2 rounded-full bg-[#6c63ff] flex-shrink-0" />
                          )}
                        </div>
                        <span className="text-[11px] text-[#b0b8cc] dark:text-[#64748b] flex-shrink-0">{item.time}</span>
                      </div>

                      <p className="text-[12.5px] text-[#4a5068] dark:text-[#cbd5e1] leading-relaxed mt-1 mb-3">
                        {item.message}
                      </p>

                      {/* Action buttons */}
                      <div className="flex items-center gap-3">
                        {item.actionText && (
                          <button
                            onClick={() => {
                              markSingleRead(item.id);
                              if (item.targetPage) onNavigate?.(item.targetPage, item.jobPayload);
                            }}
                            className="flex items-center gap-1 text-[11px] font-bold text-[#6c63ff] dark:text-[#a78bfa] hover:underline bg-transparent border-none cursor-pointer"
                          >
                            {item.actionText} <ChevronRight size={13} />
                          </button>
                        )}
                        <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!item.read && (
                            <button
                              onClick={() => markSingleRead(item.id)}
                              className="p-1 rounded text-[#8890a4] hover:text-[#6c63ff] bg-transparent border-none cursor-pointer"
                              title="Mark as Read"
                            >
                              <Check size={14} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(item.id)}
                            className="p-1 rounded text-[#8890a4] hover:text-[#ff4d6d] bg-transparent border-none cursor-pointer"
                            title="Delete Notification"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filtered.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                    <div className="w-14 h-14 rounded-2xl bg-[#f4f6fb] dark:bg-[#161e2e] flex items-center justify-center mb-3 text-[#b0b8cc]">
                      <Bell size={26} />
                    </div>
                    <h3 className="text-[15px] font-bold text-[#1a1a2e] dark:text-[#f8fafc]">No Notifications</h3>
                    <p className="text-[12px] text-[#8890a4] dark:text-[#94a3b8] mt-1 max-w-xs">You're all caught up! There are no notifications under this filter.</p>
                  </div>
                )}
              </div>

              {filtered.length > 0 && (
                <div className="px-5 py-3.5 bg-[#f8f9fc] dark:bg-[#161e2e] border-t border-[#f0f2f8] dark:border-[#1f2d42] flex items-center justify-between text-[12px] text-[#8890a4] dark:text-[#94a3b8]">
                  <span>Showing {filtered.length} notification{filtered.length > 1 ? 's' : ''}</span>
                  <button onClick={clearAll} className="text-[#ff4d6d] font-bold bg-transparent border-none cursor-pointer hover:underline">
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Notification Settings Quick Card */}
          <div className="flex flex-col gap-5">

            {/* Delivery Channels */}
            <div className="bg-white dark:bg-[#111827] rounded-2xl p-5 shadow-sm border border-[#e4e8f0]/60 dark:border-[#1f2d42]">
              <div className="flex items-center gap-2 mb-4">
                <Volume2 size={16} className="text-[#6c63ff]" />
                <h3 className="text-[14px] font-extrabold text-[#1a1a2e] dark:text-[#f8fafc]">Delivery Channels</h3>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { label: 'Email Alerts', sub: 'Daily summary & instant interview invites', icon: <Mail size={14} className="text-[#6c63ff]" />, init: true },
                  { label: 'Push Notifications', sub: 'Browser popups for real-time updates', icon: <Monitor size={14} className="text-[#00c853]" />, init: true },
                  { label: 'SMS Reminders', sub: 'Text message 1h before interviews', icon: <Smartphone size={14} className="text-[#f59e0b]" />, init: false },
                ].map(ch => (
                  <ChannelToggleItem key={ch.label} ch={ch} onToast={showToast} />
                ))}
              </div>
            </div>

            {/* Priority Alerts Card */}
            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-2xl p-5 text-white relative overflow-hidden border border-[#1f2d42]">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-20 blur-2xl" style={{ background: '#6c63ff' }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#a78bfa] tracking-widest mb-3">
                  <Zap size={12} /> AI PRIORITY FILTER
                </div>
                <h4 className="text-[15px] font-extrabold mb-2">Smart Alert Filtering</h4>
                <p className="text-[11.5px] text-[#b0b8cc] leading-relaxed mb-4">
                  Nexus AI automatically filters out spam recruiter messages and prioritizes 90%+ match roles.
                </p>
                <button
                  onClick={() => onNavigate?.('settings')}
                  className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white border border-white/20 bg-white/10 hover:bg-white/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Configure AI Filter <ChevronRight size={13} />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

const ChannelToggleItem: React.FC<{
  ch: { label: string; sub: string; icon: React.ReactNode; init: boolean };
  onToast: (msg: string) => void;
}> = ({ ch, onToast }) => {
  const [active, setActive] = useState(ch.init);
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#f0f2f8] dark:border-[#1f2d42] last:border-0">
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-[#f4f6fb] dark:bg-[#161e2e] flex items-center justify-center mt-0.5">{ch.icon}</div>
        <div>
          <p className="text-[12px] font-bold text-[#1a1a2e] dark:text-[#f8fafc]">{ch.label}</p>
          <p className="text-[10px] text-[#8890a4] dark:text-[#94a3b8]">{ch.sub}</p>
        </div>
      </div>
      <button
        onClick={() => { setActive(!active); onToast(`${ch.label}: ${!active ? 'Enabled' : 'Disabled'}`); }}
        className={`w-9 h-5 rounded-full transition-all cursor-pointer border-none relative flex-shrink-0 ${active ? 'bg-[#6c63ff]' : 'bg-[#e4e8f0] dark:bg-[#26334d]'}`}
      >
        <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.75 transition-all shadow-sm ${active ? 'left-4.5' : 'left-0.75'}`} />
      </button>
    </div>
  );
};

export default Notifications;
