import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaUsers,
  FaBriefcase,
  FaCalendarCheck,
  FaChartLine,
  FaUserPlus,
  FaClock,
  FaCheckCircle,
  FaStar,
  FaSpinner,
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import axios from '../../../api/axiosConfig';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444'];

const HRDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [applicationsData, setApplicationsData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const analyticsRes = await axios.get('/analytics');
      const data = analyticsRes.data.data;
      
      setStats([
        { 
          label: 'Total Applicants', 
          value: data.metrics?.totalApplications || 0, 
          icon: FaUsers, 
          color: 'primary',
          change: '+12%'
        },
        { 
          label: 'Active Jobs', 
          value: data.metrics?.activeJobs || 0, 
          icon: FaBriefcase, 
          color: 'secondary',
          change: '+5%'
        },
        { 
          label: 'Interviews Scheduled', 
          value: data.metrics?.interviewing || 0, 
          icon: FaCalendarCheck, 
          color: 'purple',
          change: '+8%'
        },
        { 
          label: 'Hiring Rate', 
          value: data.metrics?.hired || 0, 
          icon: FaChartLine, 
          color: 'orange',
          change: '+3.2%'
        },
      ]);

      setApplicationsData(data.monthlyData || []);
      setDepartmentData(data.departmentData || []);
      setMetrics(data.metrics || {});
      setRecentActivities([
        { 
          user: 'Sarah Johnson', 
          action: 'Applied for Senior Developer', 
          time: '5 min ago', 
          type: 'apply' 
        },
        { 
          user: 'Michael Chen', 
          action: 'Interview scheduled for PM role', 
          time: '1 hour ago', 
          type: 'interview' 
        },
        { 
          user: 'Emily Rodriguez', 
          action: 'New application received', 
          time: '2 hours ago', 
          type: 'apply' 
        },
      ]);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-indigo-500 text-indigo-600',
      secondary: 'bg-purple-500 text-purple-600',
      purple: 'bg-purple-500 text-purple-600',
      orange: 'bg-amber-500 text-amber-600',
    };
    return colors[color] || colors.primary;
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
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h2>
          <p className="text-sm text-[var(--text-secondary)]">Overview of your recruitment activities</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2">
            <FaUserPlus className="w-4 h-4" />
            New Job Post
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
                <p className="stat-change">↑ {stat.change} from last month</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Applications Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="chart-container lg:col-span-2"
        >
          <h3 className="chart-title">Applications Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={applicationsData}>
              <defs>
                <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ color: 'var(--text-secondary)' }} />
              <Line 
                type="monotone" 
                dataKey="applications" 
                stroke="#6366f1" 
                strokeWidth={2} 
                dot={{ fill: '#6366f1' }} 
              />
              <Line 
                type="monotone" 
                dataKey="hires" 
                stroke="#22c55e" 
                strokeWidth={2} 
                dot={{ fill: '#22c55e' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Department Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="chart-container"
        >
          <h3 className="chart-title">Departments</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ color: 'var(--text-secondary)' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Recent Activity</h3>
          <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium dark:text-indigo-400">
            View All
          </button>
        </div>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="activity-item flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                  {activity.user.charAt(0)}
                </div>
                <div>
                  <p className="activity-user">{activity.user}</p>
                  <p className="activity-action text-sm">{activity.action}</p>
                </div>
              </div>
              <span className="activity-time">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HRDashboard;
