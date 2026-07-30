import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import JobSearch from './pages/JobSearch';
import JobDetails from './pages/JobDetails';
import Resume from './pages/Resume';
import AIResume from './pages/AIResume';
import Applications from './pages/Applications';
import Interview from './pages/Interview';
import ProfilePage from './pages/ProfilePage';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import AppLoader, { DashboardSkeleton, JobSearchSkeleton, PageSpinner } from './components/Loading';

export type Page =
  | 'dashboard'
  | 'jobsearch'
  | 'jobdetails'
  | 'resume'
  | 'airesume'
  | 'applications'
  | 'interview'
  | 'profile'
  | 'messages'
  | 'notifications'
  | 'settings'
  | 'login'
  | 'register';

const pageNames: Partial<Record<Page, string>> = {
  jobdetails: 'Job Details',
  resume: 'Resume',
  airesume: 'AI Resume Analyzer',
  applications: 'Applications',
  interview: 'Interview',
  profile: 'Profile',
  messages: 'Messages',
  notifications: 'Notifications',
  settings: 'Settings',
  login: 'Sign In',
  register: 'Create Account',
};

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes in milliseconds

function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  // Helper to check if user is logged in
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return Boolean(token || user);
  };

  // Require Login First: Default to login page if user is not authenticated
  const [activePage, setActivePage] = useState<Page>(() => {
    return isAuthenticated() ? 'dashboard' : 'login';
  });

  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeoutNotice, setTimeoutNotice] = useState<string | null>(null);

  // Initial App Load effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Auth Guard: Redirect unauthenticated user to Login page
  useEffect(() => {
    if (!isAuthenticated() && activePage !== 'login' && activePage !== 'register') {
      setActivePage('login');
    }
  }, [activePage]);

  // 15-Minute Portal Inactivity Timeout
  useEffect(() => {
    const isAuthPage = activePage === 'login' || activePage === 'register';
    if (isAuthPage || !isAuthenticated()) return;

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Clear session data after 15 minutes of inactivity
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setActivePage('login');
        setTimeoutNotice('Portal session expired after 15 minutes of inactivity. Please log in again.');
      }, INACTIVITY_TIMEOUT_MS);
    };

    // User activity listeners
    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    activityEvents.forEach(evt => window.addEventListener(evt, resetTimer));

    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      activityEvents.forEach(evt => window.removeEventListener(evt, resetTimer));
    };
  }, [activePage]);

  // Handle Page Navigation with Loading transition
  const handleNavigate = (page: Page, jobPayload?: any) => {
    // Prevent unauthenticated navigation to portal pages
    if (!isAuthenticated() && page !== 'login' && page !== 'register') {
      setActivePage('login');
      return;
    }

    if (jobPayload) {
      setSelectedJob(jobPayload);
    } else if (page === 'jobdetails' && !selectedJob) {
      // Fallback fallback default job if navigated to details without payload
      setSelectedJob({
        id: 1,
        title: 'Senior AI Product Designer',
        company: 'Nexus AI',
        location: 'San Francisco, CA • Remote',
        match: 98,
        salary: '$180k - $240k',
        type: 'Full-time',
        logo: 'NX'
      });
    }

    if (page === activePage && !jobPayload) return;
    setPageLoading(true);
    setActivePage(page);

    setTimeout(() => {
      setPageLoading(false);
    }, 400);
  };

  const renderPage = () => {
    if (pageLoading) {
      if (activePage === 'dashboard') return <DashboardSkeleton />;
      if (activePage === 'jobsearch') return <JobSearchSkeleton />;
      return <PageSpinner label={`Loading ${pageNames[activePage] || activePage}...`} />;
    }

    if (activePage === 'dashboard') {
      return (
        <Dashboard
          onMenuClick={() => setSidebarOpen(true)}
          onNavigate={handleNavigate}
        />
      );
    }
    if (activePage === 'jobsearch') {
      return (
        <JobSearch
          onMenuClick={() => setSidebarOpen(true)}
          onNavigate={handleNavigate}
        />
      );
    }
    if (activePage === 'jobdetails') {
      return (
        <JobDetails
          job={selectedJob}
          onMenuClick={() => setSidebarOpen(true)}
          onNavigate={handleNavigate}
        />
      );
    }
    if (activePage === 'resume') {
      return (
        <Resume
          onMenuClick={() => setSidebarOpen(true)}
          onNavigate={handleNavigate}
        />
      );
    }
    if (activePage === 'airesume') {
      return (
        <AIResume
          onMenuClick={() => setSidebarOpen(true)}
          onNavigate={handleNavigate}
        />
      );
    }
    if (activePage === 'applications') {
      return (
        <Applications
          onMenuClick={() => setSidebarOpen(true)}
          onNavigate={handleNavigate}
        />
      );
    }
    if (activePage === 'interview') {
      return (
        <Interview
          onMenuClick={() => setSidebarOpen(true)}
          onNavigate={handleNavigate}
        />
      );
    }
    if (activePage === 'profile') {
      return (
        <ProfilePage
          onMenuClick={() => setSidebarOpen(true)}
          onNavigate={handleNavigate}
        />
      );
    }
    if (activePage === 'messages') {
      return (
        <Messages
          onMenuClick={() => setSidebarOpen(true)}
          onNavigate={handleNavigate}
        />
      );
    }
    if (activePage === 'notifications') {
      return (
        <Notifications
          onMenuClick={() => setSidebarOpen(true)}
          onNavigate={handleNavigate}
        />
      );
    }
    if (activePage === 'settings') {
      return (
        <Settings
          onMenuClick={() => setSidebarOpen(true)}
          onNavigate={handleNavigate}
        />
      );
    }
    if (activePage === 'login') {
      return (
        <Login
          onNavigate={handleNavigate}
          onLoginSuccess={() => handleNavigate('dashboard')}
        />
      );
    }
    if (activePage === 'register') {
      return (
        <Register
          onNavigate={handleNavigate}
          onRegisterSuccess={() => handleNavigate('dashboard')}
        />
      );
    }

    return (
      <NotFound
        pageName={pageNames[activePage]}
        onBack={() => handleNavigate('dashboard')}
      />
    );
  };

  if (initialLoading) {
    return <AppLoader />;
  }

  const isAuthPage = activePage === 'login' || activePage === 'register';

  return (
    <div className="flex min-h-screen bg-[#f4f6fb]">
      {/* 15 Minute Timeout Notice Toast */}
      {timeoutNotice && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-[#1a1a2e] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-500/50">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs font-semibold">{timeoutNotice}</span>
          <button onClick={() => setTimeoutNotice(null)} className="ml-2 text-white/60 hover:text-white bg-transparent border-none cursor-pointer">✕</button>
        </div>
      )}

      {!isAuthPage && (
        <Sidebar
          activePage={activePage}
          onNavigate={handleNavigate}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}
      {renderPage()}
    </div>
  );
}

export default App;
