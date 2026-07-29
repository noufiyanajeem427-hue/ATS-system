import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, FaUserCheck, FaUserClock, FaUserTimes, 
  FaEye, FaCalendarCheck, FaEnvelope, FaDownload,
  FaSpinner, FaUsers, FaFilter
} from 'react-icons/fa';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from '../../../api/axiosConfig';

const ApplicantsList = () => {
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchApplicants();
  }, [statusFilter]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await axios.get(`/applications?${params.toString()}`);
      setApplicants(response.data.data || []);
    } catch (error) {
      console.error('Error fetching applicants:', error);
      toast.error('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const configs = {
      applied: { label: 'Applied', color: 'badge-applied', icon: FaUserClock },
      reviewing: { label: 'Reviewing', color: 'badge-reviewing', icon: FaUserCheck },
      interview: { label: 'Interview', color: 'badge-interview', icon: FaCalendarCheck },
      offered: { label: 'Offered', color: 'badge-offered', icon: FaUserCheck },
      rejected: { label: 'Rejected', color: 'badge-rejected', icon: FaUserTimes },
      hired: { label: 'Hired', color: 'badge-active', icon: FaUserCheck },
    };
    return configs[status] || configs.applied;
  };

  const stats = [
    { label: 'Total Applicants', value: applicants.length, color: 'primary' },
    { label: 'In Review', value: applicants.filter(a => a.status === 'reviewing').length, color: 'yellow' },
    { label: 'Interview Stage', value: applicants.filter(a => a.status === 'interview').length, color: 'purple' },
    { label: 'Offers Sent', value: applicants.filter(a => a.status === 'offered').length, color: 'green' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Applicants</h2>
          <p className="text-sm text-[var(--text-secondary)]">Review and manage all applicants</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--bg-hover)] transition-all flex items-center gap-2">
            <FaDownload className="w-4 h-4" />
            Export
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
            <FaEnvelope className="w-4 h-4" />
            Email All
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="stat-card"
          >
            <p className="stat-value">{stat.value}</p>
            <p className="stat-label">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search applicants by name, position, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchApplicants()}
              className="form-input pl-10"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input"
            >
              <option value="all">All Status</option>
              <option value="applied">Applied</option>
              <option value="reviewing">Reviewing</option>
              <option value="interview">Interview</option>
              <option value="offered">Offered</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>
            <button onClick={fetchApplicants} className="btn-primary">
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Applicants List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--text-secondary)]">{applicants.length} applicants found</p>
        </div>

        <AnimatePresence>
          {applicants.map((applicant, index) => {
            const statusConfig = getStatusBadge(applicant.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <motion.div
                key={applicant._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className="card p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {applicant.name?.charAt(0) || 'A'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                          {applicant.name || 'Unknown'}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color} flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">{applicant.position || 'No position'}</p>
                      <div className="flex flex-wrap gap-3 mt-1">
                        <span className="text-xs text-[var(--text-muted)]">{applicant.location || 'N/A'}</span>
                        <span className="text-xs text-[var(--text-muted)]">• {applicant.experience || 'N/A'}</span>
                        <span className="text-xs text-[var(--text-muted)]">• Applied {format(new Date(applicant.appliedDate), 'MMM d, yyyy')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {applicant.matchScore || 0}%
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">Match Score</div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/applicants/${applicant._id}`}
                        className="p-2 text-[var(--text-muted)] hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
                      >
                        <FaEye className="w-4 h-4" />
                      </Link>
                      <button className="p-2 text-[var(--text-muted)] hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-all">
                        <FaCalendarCheck className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-[var(--text-muted)] hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all">
                        <FaEnvelope className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {applicants.length === 0 && (
          <div className="text-center py-12 card">
            <div className="w-20 h-20 bg-[var(--bg-hover)] rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">No applicants found</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantsList;
