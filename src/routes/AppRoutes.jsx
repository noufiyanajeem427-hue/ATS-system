import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/common/Layout';

// HR Pages
import HRDashboard from '../pages/hr/Dashboard/HRDashboard';
import CompanyManagement from '../pages/hr/CompanyManagement/CompanyManagement';
import JobManagement from '../pages/hr/JobManagement/JobManagement';
import ApplicantsList from '../pages/hr/Applicants/ApplicantsList';
import ApplicantDetails from '../pages/hr/Applicants/ApplicantDetails';
import CandidateRanking from '../pages/hr/CandidateRanking/CandidateRanking';
import InterviewList from '../pages/hr/Interviews/InterviewList';
import InterviewSchedule from '../pages/hr/Interviews/InterviewSchedule';
import MessageCenter from '../pages/hr/Messages/MessageCenter';
import HiringAnalytics from '../pages/hr/AnalyticsDashboard/HiringAnalytics';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<HRDashboard />} />
        <Route path="company" element={<CompanyManagement />} />
        <Route path="jobs" element={<JobManagement />} />
        <Route path="applicants" element={<ApplicantsList />} />
        <Route path="applicants/:id" element={<ApplicantDetails />} />
        <Route path="ranking" element={<CandidateRanking />} />
        <Route path="interviews" element={<InterviewList />} />
        <Route path="interviews/schedule" element={<InterviewSchedule />} />
        <Route path="messages" element={<MessageCenter />} />
        <Route path="analytics" element={<HiringAnalytics />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
export default AppRoutes;
