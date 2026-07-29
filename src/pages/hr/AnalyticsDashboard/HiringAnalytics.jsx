import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaChartLine,
  FaUsers,
  FaBriefcase,
  FaCalendarCheck,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaDownload,
  FaSpinner
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
  Area,
  AreaChart,
} from 'recharts';
import toast from 'react-hot-toast';
import axios from '../../../api/axiosConfig';

const COLORS = ['#6366f1', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444'];

const HiringAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    metrics: {},
    monthlyData: [],
    departmentData: [],
    pipelineData: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/analytics');
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const metrics = [
    { 
      label: 'Total Applications', 
      value: data.metrics?.totalApplications || 0, 
      change: '+12%', 
      icon: FaUsers, 
      color: 'primary' 
    },
    { 
      label: 'Hired', 
      value: data.metrics?.hired || 0, 
      change: '+8%', 
      icon: FaCheckCircle, 
      color: 'green' 
    },
    { 
      label: 'Time to Hire', 
      value: data.metrics?.avgTimeToHire || '0d', 
      change: '-2.3d', 
      icon: FaClock, 
      color: 'orange' 
    },
    { 
      label: 'Offer Rate', 
      value: data.metrics?.offered || '0%', 
      change: '+3.2%', 
      icon: FaChartLine, 
      color: 'purple' 
    },
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
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Hiring Analytics</h2>
          <p className="text-sm text-[var(--text-secondary)]">Recruitment metrics and insights</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <FaDownload className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">{metric.label}</p>
                <p className="stat-value">{metric.value}</p>
                <p className="stat-change">↑ {metric.change} from last month</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-${metric.color}-50 flex items-center justify-center`}>
                <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="chart-container lg:col-span-2"
        >
          <h3 className="chart-title">Applications Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.monthlyData}>
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
              <Area
                type="monotone"
                dataKey="applications"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#colorApplications)"
              />
              <Line type="monotone" dataKey="hires" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Department Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="chart-container"
        >
          <h3 className="chart-title">Hires by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.departmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {data.departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ color: 'var(--text-secondary)' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pipeline Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="chart-container"
        >
          <h3 className="chart-title">Recruitment Pipeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              layout="vertical"
              data={data.pipelineData}
              margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" />
              <XAxis type="number" stroke="var(--text-secondary)" />
              <YAxis type="category" dataKey="stage" stroke="var(--text-secondary)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]}>
                {data.pipelineData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
};

export default HiringAnalytics;
