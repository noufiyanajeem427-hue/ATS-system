import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, FaSearch, FaEdit, FaTrash, FaEye, 
  FaArchive, FaMapMarkerAlt, FaUsers, FaSpinner,
  FaFilter 
} from 'react-icons/fa';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import axios from '../../../api/axiosConfig';
import JobForm from './JobForm';

const JobManagement = () => {
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: 'all', department: 'all' });
  const [jobs, setJobs] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status !== 'all') params.append('status', filters.status);
      if (filters.department !== 'all') params.append('department', filters.department);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await axios.get(`/jobs?${params.toString()}`);
      setJobs(response.data.data);
      const depts = [...new Set(response.data.data.map(job => job.department))];
      setDepartments(depts);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await axios.delete(`/jobs/${id}`);
        toast.success('Job deleted successfully');
        fetchJobs();
      } catch (error) {
        toast.error('Failed to delete job');
      }
    }
  };

  const handleArchive = async (id) => {
    try {
      await axios.patch(`/jobs/${id}/archive`);
      toast.success('Job status updated');
      fetchJobs();
    } catch (error) {
      toast.error('Failed to update job status');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'badge-active',
      archived: 'badge-archived',
      draft: 'badge-draft',
      filled: 'badge-active'
    };
    return badges[status] || 'badge-archived';
  };

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
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Job Management</h2>
          <p className="text-sm text-[var(--text-secondary)]">Create and manage job postings</p>
        </div>
        <button
          onClick={() => {
            setEditingJob(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
        >
          <FaPlus className="w-4 h-4" />
          Post New Job
        </button>
      </div>

      {/* Search & Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search jobs by title or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchJobs()}
              className="form-input pl-10"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="form-input"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="draft">Draft</option>
            </select>
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              className="form-input"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <button
              onClick={fetchJobs}
              className="btn-primary"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Job List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--text-secondary)]">{jobs.length} jobs found</p>
        </div>

        <AnimatePresence>
          {jobs.map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
              className="card p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 text-white text-lg font-bold">
                      {job.title.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-[var(--text-primary)] truncate">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-xs bg-[var(--bg-hover)] text-[var(--text-secondary)] px-2 py-0.5 rounded-full">
                          {job.department}
                        </span>
                        <span className="text-xs bg-[var(--bg-hover)] text-[var(--text-secondary)] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <FaMapMarkerAlt className="w-3 h-3" />
                          {job.location}
                        </span>
                        <span className="text-xs bg-[var(--bg-hover)] text-[var(--text-secondary)] px-2 py-0.5 rounded-full">
                          {job.type}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(job.status)}`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Experience</p>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{job.experience || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Salary</p>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {job.salary ? `$${job.salary.min} - $${job.salary.max}` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Applicants</p>
                      <p className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-1">
                        <FaUsers className="w-4 h-4 text-indigo-500" />
                        {job.applicantsCount || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Posted</p>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {format(new Date(job.postedDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingJob(job);
                      setShowForm(true);
                    }}
                    className="p-2 text-[var(--text-muted)] hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleArchive(job._id)}
                    className="p-2 text-[var(--text-muted)] hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-all"
                  >
                    <FaArchive className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="p-2 text-[var(--text-muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-[var(--text-muted)] hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all">
                    <FaEye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {jobs.length === 0 && (
          <div className="text-center py-12 card">
            <div className="w-20 h-20 bg-[var(--bg-hover)] rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">No jobs found</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {showForm && (
        <JobForm
          job={editingJob}
          onClose={() => {
            setShowForm(false);
            setEditingJob(null);
          }}
          onSave={() => {
            setShowForm(false);
            setEditingJob(null);
            fetchJobs();
          }}
        />
      )}
    </div>
  );
};

export default JobManagement;
