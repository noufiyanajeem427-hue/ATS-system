import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaRobot, FaStar, FaStarHalf, FaSearch, FaDownload, 
  FaEye, FaCalendarCheck, FaCheckCircle, FaTimesCircle,
  FaSpinner, FaFilter
} from 'react-icons/fa';
import { format } from 'date-fns';  // <-- ADD THIS IMPORT
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import toast from 'react-hot-toast';
import axios from '../../../api/axiosConfig';

const CandidateRanking = () => {
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('score');

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/applications');
      const data = response.data.data || [];
      setCandidates(data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast.error('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      top: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      strong: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      potential: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      review: 'bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-400',
    };
    return colors[status] || colors.review;
  };

  const getStatusLabel = (status) => {
    const labels = {
      top: 'Top Match',
      strong: 'Strong Match',
      potential: 'Potential',
      review: 'Needs Review',
    };
    return labels[status] || status;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#22c55e';
    if (score >= 70) return '#3b82f6';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const filteredCandidates = candidates
    .filter(c => 
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.position?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'score') return (b.matchScore || 0) - (a.matchScore || 0);
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });

  const chartData = candidates.map(c => ({
    name: c.name?.split(' ')[0] || 'Unknown',
    score: c.matchScore || 0,
  }));

  const stats = {
    total: candidates.length,
    topMatches: candidates.filter(c => c.matchScore >= 90).length,
    strongMatches: candidates.filter(c => c.matchScore >= 70 && c.matchScore < 90).length,
    avgScore: candidates.length > 0 
      ? Math.round(candidates.reduce((acc, c) => acc + (c.matchScore || 0), 0) / candidates.length)
      : 0
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
          <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <FaRobot className="text-indigo-600" />
            AI Candidate Ranking
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">AI-powered candidate evaluation and ranking</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--bg-hover)] transition-all flex items-center gap-2">
            <FaDownload className="w-4 h-4" />
            Export Report
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
            <FaRobot className="w-4 h-4" />
            Run AI Analysis
          </button>
        </div>
      </div>

      {/* AI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="stat-value">{stats.total}</p>
          <p className="stat-label">Total Candidates</p>
        </div>
        <div className="stat-card">
          <p className="stat-value text-green-600 dark:text-green-400">{stats.avgScore}%</p>
          <p className="stat-label">Average Match Score</p>
        </div>
        <div className="stat-card">
          <p className="stat-value text-blue-600 dark:text-blue-400">{stats.topMatches}</p>
          <p className="stat-label">Top Matches (90%+)</p>
        </div>
        <div className="stat-card">
          <p className="stat-value text-purple-600 dark:text-purple-400">{stats.strongMatches}</p>
          <p className="stat-label">Strong Matches (70%+)</p>
        </div>
      </div>

      {/* Score Distribution Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="chart-container"
      >
        <h3 className="chart-title">Match Score Distribution</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="name" stroke="var(--text-secondary)" />
            <YAxis stroke="var(--text-secondary)" />
            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Search & Filters */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search candidates by name or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input"
            >
              <option value="score">Sort by Score</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidates List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--text-secondary)]">{filteredCandidates.length} candidates found</p>
        </div>

        <AnimatePresence>
          {filteredCandidates.map((candidate, index) => (
            <motion.div
              key={candidate._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
              className="card p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {candidate.name?.split(' ').map(n => n[0]).join('') || 'A'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                          {candidate.name || 'Unknown'}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                          {getStatusLabel(candidate.status)}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">{candidate.position || 'No position'}</p>
                      <div className="flex gap-4 mt-2 text-xs text-[var(--text-muted)]">
                        <span>{candidate.experience || 'N/A'}</span>
                        <span>• {candidate.education || 'N/A'}</span>
                        <span>• Applied {candidate.appliedDate ? format(new Date(candidate.appliedDate), 'MMM d, yyyy') : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="relative">
                      <svg className="w-16 h-16">
                        <circle
                          className="text-[var(--border-color)]"
                          strokeWidth="5"
                          stroke="currentColor"
                          fill="transparent"
                          r="28"
                          cx="32"
                          cy="32"
                        />
                        <circle
                          className="text-indigo-600"
                          strokeWidth="5"
                          strokeDasharray={176}
                          strokeDashoffset={176 - (176 * (candidate.matchScore || 0)) / 100}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="28"
                          cx="32"
                          cy="32"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-[var(--text-primary)]">
                          {candidate.matchScore || 0}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-2 text-[var(--text-muted)] hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all">
                      <FaEye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-[var(--text-muted)] hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-all">
                      <FaCalendarCheck className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-[var(--text-muted)] hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-all">
                      <FaCheckCircle className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-[var(--text-muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all">
                      <FaTimesCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredCandidates.length === 0 && (
          <div className="text-center py-12 card">
            <div className="w-20 h-20 bg-[var(--bg-hover)] rounded-full flex items-center justify-center mx-auto mb-4">
              <FaRobot className="w-8 h-8 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">No candidates found</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateRanking;
