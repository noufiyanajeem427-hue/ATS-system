import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import JobSearch from './pages/JobSearch';
import JobDetails from './pages/JobDetails';
import Resume from './pages/Resume';
import AIResume from './pages/AIResume';
import Applications from './pages/Applications';
import NotFound from './pages/NotFound';
import AppLoader, { DashboardSkeleton, JobSearchSkeleton } from './components/Loading';

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
  | 'settings';

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
};

function App() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initial App Load effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Handle Page Navigation with Loading transition
  const handleNavigate = (page: Page, jobPayload?: any) => {
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

  return (
    <div className="flex min-h-screen bg-[#f4f6fb]">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      {renderPage()}
    </div>
  );
}

export default App;
