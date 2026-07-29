import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaSpinner, FaCalendarAlt, FaClock, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from '../../../api/axiosConfig';

const ScheduleForm = ({ interview, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    candidate: { name: '', email: '', position: '' },
    interviewer: { name: '', email: '' },
    date: '',
    duration: 60,
    type: 'video',
    location: '',
    notes: '',
    status: 'scheduled'
  });

  useEffect(() => {
    if (interview) {
      setFormData({
        candidate: interview.candidate || { name: '', email: '', position: '' },
        interviewer: interview.interviewer || { name: '', email: '' },
        date: new Date(interview.date).toISOString().slice(0, 16),
        duration: interview.duration || 60,
        type: interview.type || 'video',
        location: interview.location || '',
        notes: interview.notes || '',
        status: interview.status || 'scheduled'
      });
    }
  }, [interview]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: { ...formData[parent], [child]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.candidate.name || !formData.date || !formData.interviewer.name) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        applicationId: interview?._id || 'temp',
        jobId: interview?.jobId || 'temp'
      };
      
      if (interview) {
        await axios.put(`/interviews/${interview._id}`, payload);
        toast.success('Interview updated successfully');
      } else {
        await axios.post('/interviews', payload);
        toast.success('Interview scheduled successfully');
      }
      onSave();
    } catch (error) {
      console.error('Error saving interview:', error);
      toast.error('Failed to save interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {interview ? 'Edit Interview' : 'Schedule Interview'}
            </h3>
            <p className="text-sm text-gray-500">
              {interview ? 'Update interview details' : 'Schedule a new interview with a candidate'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Candidate Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <FaUser className="text-indigo-500" />
              Candidate Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Candidate Name *
                </label>
                <input
                  type="text"
                  name="candidate.name"
                  value={formData.candidate.name}
                  onChange={handleInputChange}
                  placeholder="e.g., John Doe"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Candidate Email
                </label>
                <input
                  type="email"
                  name="candidate.email"
                  value={formData.candidate.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position
                </label>
                <input
                  type="text"
                  name="candidate.position"
                  value={formData.candidate.position}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior Developer"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Interview Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <FaCalendarAlt className="text-indigo-500" />
              Interview Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="120">120 minutes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interview Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="video">Video Call</option>
                  <option value="in-person">In-Person</option>
                  <option value="phone">Phone Call</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location / Link
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Google Meet link or Office address"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Interviewer Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <FaUser className="text-indigo-500" />
              Interviewer
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interviewer Name *
                </label>
                <input
                  type="text"
                  name="interviewer.name"
                  value={formData.interviewer.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Sarah Smith"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interviewer Email
                </label>
                <input
                  type="email"
                  name="interviewer.email"
                  value={formData.interviewer.email}
                  onChange={handleInputChange}
                  placeholder="sarah@company.com"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              placeholder="Add any additional notes or instructions..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <FaSpinner className="w-5 h-5 animate-spin" /> : (
                interview ? 'Update Interview' : 'Schedule Interview'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ScheduleForm;