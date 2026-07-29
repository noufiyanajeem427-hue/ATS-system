import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, FaSearch, FaCalendarAlt, FaClock, FaVideo, 
  FaMapMarkerAlt, FaUser, FaCheckCircle, FaTimesCircle, 
  FaClock as FaClockIcon, FaSpinner, FaEdit, FaTrash,
  FaPhone, FaFilter
} from 'react-icons/fa';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from '../../../api/axiosConfig';
import ScheduleForm from './ScheduleForm';

const InterviewList = () => {
  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);

  useEffect(() => {
    fetchInterviews();
  }, [filterType, filterStatus]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterType !== 'all') params.append('type', filterType);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      
      const response = await axios.get(`/interviews?${params.toString()}`);
      setInterviews(response.data.data || []);
    } catch (error) {
      console.error('Error fetching interviews:', error);
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelInterview = async (id) => {
    if (window.confirm('Are you sure you want to cancel this interview?')) {
      try {
        await axios.patch(`/interviews/${id}/cancel`);
        toast.success('Interview cancelled successfully');
        fetchInterviews();
      } catch (error) {
        toast.error('Failed to cancel interview');
      }
    }
  };

  const handleDeleteInterview = async (id) => {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      try {
        await axios.delete(`/interviews/${id}`);
        toast.success('Interview deleted successfully');
        fetchInterviews();
      } catch (error) {
        toast.error('Failed to delete interview');
      }
    }
  };

  const getStatusBadge = (status) => {
    const configs = {
      scheduled: { label: 'Scheduled', color: 'badge-interview', icon: FaClockIcon },
      completed: { label: 'Completed', color: 'badge-active', icon: FaCheckCircle },
      cancelled: { label: 'Cancelled', color: 'badge-rejected', icon: FaTimesCircle },
      rescheduled: { label: 'Rescheduled', color: 'badge-reviewing', icon: FaClockIcon },
    };
    return configs[status] || configs.scheduled;
  };

  const getTypeIcon = (type) => {
    return type === 'video' ? FaVideo : type === 'phone' ? FaPhone : FaMapMarkerAlt;
  };

  const getTypeLabel = (type) => {
    const labels = {
      video: 'Video Call',
      'in-person': 'In-Person',
      phone: 'Phone Call'
    };
    return labels[type] || type;
  };

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = interview.candidate?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.candidate?.position?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    total: interviews.length,
    scheduled: interviews.filter(i => i.status === 'scheduled').length,
    completed: interviews.filter(i => i.status === 'completed').length,
    cancelled: interviews.filter(i => i.status === 'cancelled').length
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
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Interview Management</h2>
          <p className="text-sm text-[var(--text-secondary)]">Schedule and manage candidate interviews</p>
        </div>
        <button
          onClick={() => {
            setEditingInterview(null);
            setShowScheduleForm(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
        >
          <FaPlus className="w-4 h-4" />
          Schedule Interview
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="stat-value">{stats.total}</p>
          <p className="stat-label">Total Interviews</p>
        </div>
        <div className="stat-card">
          <p className="stat-value text-blue-600 dark:text-blue-400">{stats.scheduled}</p>
          <p className="stat-label">Scheduled</p>
        </div>
        <div className="stat-card">
          <p className="stat-value text-green-600 dark:text-green-400">{stats.completed}</p>
          <p className="stat-label">Completed</p>
        </div>
        <div className="stat-card">
          <p className="stat-value text-red-600 dark:text-red-400">{stats.cancelled}</p>
          <p className="stat-label">Cancelled</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search by candidate or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="form-input"
            >
              <option value="all">All Types</option>
              <option value="video">Video</option>
              <option value="in-person">In-Person</option>
              <option value="phone">Phone</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-input"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rescheduled">Rescheduled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interviews List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--text-secondary)]">{filteredInterviews.length} interviews found</p>
        </div>

        <AnimatePresence>
          {filteredInterviews.map((interview, index) => {
            const StatusIcon = getStatusBadge(interview.status).icon;
            const TypeIcon = getTypeIcon(interview.type);
            const isUpcoming = interview.status === 'scheduled' || interview.status === 'rescheduled';
            
            return (
              <motion.div
                key={interview._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                className="card p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isUpcoming ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'bg-[var(--bg-hover)]'
                    }`}>
                      <FaUser className={`w-6 h-6 ${isUpcoming ? 'text-indigo-600' : 'text-[var(--text-muted)]'}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                          {interview.candidate?.name || 'Unknown Candidate'}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(interview.status).color} flex items-center gap-1`}>
                          <StatusIcon className="w-3 h-3" />
                          {getStatusBadge(interview.status).label}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">{interview.candidate?.position || 'No position'}</p>
                      <div className="flex flex-wrap gap-3 mt-1">
                        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                          <FaCalendarAlt className="w-3 h-3 text-indigo-400" />
                          {format(new Date(interview.date), 'MMM d, yyyy')}
                        </span>
                        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                          <FaClock className="w-3 h-3 text-indigo-400" />
                          {format(new Date(interview.date), 'h:mm a')} ({interview.duration || 60} min)
                        </span>
                        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                          <TypeIcon className="w-3 h-3 text-indigo-400" />
                          {getTypeLabel(interview.type)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{interview.interviewer?.name || 'Not assigned'}</p>
                      <p className="text-xs text-[var(--text-muted)]">{interview.location || 'No location'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingInterview(interview);
                          setShowScheduleForm(true);
                        }}
                        className="p-2 text-[var(--text-muted)] hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      {isUpcoming && (
                        <button
                          onClick={() => handleCancelInterview(interview._id)}
                          className="p-2 text-[var(--text-muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                        >
                          <FaTimesCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteInterview(interview._id)}
                        className="p-2 text-[var(--text-muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredInterviews.length === 0 && (
          <div className="text-center py-12 card">
            <div className="w-20 h-20 bg-[var(--bg-hover)] rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCalendarAlt className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">No interviews found</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Schedule your first interview</p>
            <button
              onClick={() => {
                setEditingInterview(null);
                setShowScheduleForm(true);
              }}
              className="mt-4 btn-primary"
            >
              <FaPlus className="w-4 h-4 inline mr-2" />
              Schedule Interview
            </button>
          </div>
        )}
      </div>

      {showScheduleForm && (
        <ScheduleForm
          interview={editingInterview}
          onClose={() => {
            setShowScheduleForm(false);
            setEditingInterview(null);
          }}
          onSave={() => {
            setShowScheduleForm(false);
            setEditingInterview(null);
            fetchInterviews();
          }}
        />
      )}
    </div>
  );
};

export default InterviewList;
