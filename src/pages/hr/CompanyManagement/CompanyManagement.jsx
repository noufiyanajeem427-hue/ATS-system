
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaBuilding, FaEdit, FaSave, FaTimes, FaUpload, 
  FaMapMarkerAlt, FaGlobe, FaPhone, FaEnvelope,
  FaSpinner, FaCheckCircle 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from '../../../api/axiosConfig';

const CompanyManagement = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [company, setCompany] = useState({
    name: '',
    industry: '',
    size: '',
    founded: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    mission: '',
    vision: '',
    values: [],
    social: { linkedin: '', twitter: '' }
  });
  const [formData, setFormData] = useState(company);

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/companies/profile');
      const data = response.data.data;
      setCompany(data);
      setFormData(data);
    } catch (error) {
      console.error('Error fetching company data:', error);
      toast.error('Failed to load company data');
    } finally {
      setLoading(false);
    }
  };

  // FIX: Handle nested fields properly
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested social fields (social.linkedin, social.twitter)
    if (name.startsWith('social.')) {
      const socialField = name.split('.')[1];
      setFormData({
        ...formData,
        social: {
          ...formData.social,
          [socialField]: value
        }
      });
    } else {
      // Handle regular fields
      setFormData({ 
        ...formData, 
        [name]: value 
      });
    }
  };

  // FIX: Handle array fields (values)
  const handleValueAdd = () => {
    const newValue = prompt('Enter new value:');
    if (newValue && newValue.trim()) {
      setFormData({
        ...formData,
        values: [...(formData.values || []), newValue.trim()]
      });
    }
  };

  const handleValueRemove = (index) => {
    setFormData({
      ...formData,
      values: (formData.values || []).filter((_, i) => i !== index)
    });
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields (Name, Email, Phone)');
      return;
    }

    try {
      setLoading(true);
      // Send complete formData to backend
      const response = await axios.put('/companies/profile', formData);
      setCompany(response.data.data);
      setIsEditing(false);
      toast.success('Company profile updated successfully!');
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error(error.response?.data?.message || 'Failed to update company profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(company);
    setIsEditing(false);
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
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Company Profile</h2>
          <p className="text-sm text-[var(--text-secondary)]">Manage your company information</p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--bg-hover)] transition-all flex items-center gap-2"
              >
                <FaTimes className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
              >
                {loading ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaSave className="w-4 h-4" />}
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
            >
              <FaEdit className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Company Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Company Logo & Basic Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <div className="card p-6">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center overflow-hidden">
                  {formData.logo ? (
                    <img src={formData.logo} alt="Company Logo" className="w-full h-full object-cover" />
                  ) : (
                    <FaBuilding className="w-16 h-16 text-indigo-500" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full cursor-pointer hover:bg-indigo-700 transition-all shadow-lg">
                    <FaUpload className="w-4 h-4 text-white" />
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                )}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="w-full text-center text-xl font-bold text-[var(--text-primary)] border-b-2 border-indigo-500 focus:outline-none bg-transparent py-1"
                  placeholder="Company Name"
                />
              ) : (
                <h3 className="text-xl font-bold text-[var(--text-primary)]">{company.name || 'Your Company'}</h3>
              )}
              
              {isEditing ? (
                <input
                  type="text"
                  name="industry"
                  value={formData.industry || ''}
                  onChange={handleInputChange}
                  className="w-full text-center text-sm text-[var(--text-secondary)] border-b border-[var(--border-color)] focus:outline-none bg-transparent py-1 mt-1"
                  placeholder="Industry"
                />
              ) : (
                <p className="text-sm text-[var(--text-secondary)] mt-1">{company.industry || 'Industry'}</p>
              )}
              
              <div className="flex justify-center gap-4 mt-4">
                {isEditing ? (
                  <>
                    <select
                      name="size"
                      value={formData.size || ''}
                      onChange={handleInputChange}
                      className="text-xs bg-[var(--bg-input)] border border-[var(--border-color)] rounded-full px-3 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select Size</option>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-200">51-200</option>
                      <option value="201-500">201-500</option>
                      <option value="501-1000">501-1000</option>
                      <option value="1000+">1000+</option>
                    </select>
                    <input
                      type="text"
                      name="founded"
                      value={formData.founded || ''}
                      onChange={handleInputChange}
                      className="text-xs bg-[var(--bg-input)] border border-[var(--border-color)] rounded-full px-3 py-1 w-20 text-center focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      placeholder="Year"
                    />
                  </>
                ) : (
                  <>
                    <span className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-full">
                      {company.size || 'Size'}
                    </span>
                    <span className="text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full">
                      Founded {company.founded || 'Year'}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {/* Email */}
              <div className="flex items-center gap-3 text-sm">
                <FaEnvelope className="text-[var(--text-muted)] w-4 h-4" />
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="flex-1 bg-transparent border-b border-[var(--border-color)] focus:border-indigo-500 focus:outline-none text-[var(--text-primary)] py-1"
                    placeholder="Email"
                  />
                ) : (
                  <span className="text-[var(--text-secondary)]">{company.email || 'Not set'}</span>
                )}
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 text-sm">
                <FaPhone className="text-[var(--text-muted)] w-4 h-4" />
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    className="flex-1 bg-transparent border-b border-[var(--border-color)] focus:border-indigo-500 focus:outline-none text-[var(--text-primary)] py-1"
                    placeholder="Phone"
                  />
                ) : (
                  <span className="text-[var(--text-secondary)]">{company.phone || 'Not set'}</span>
                )}
              </div>

              {/* Website */}
              <div className="flex items-center gap-3 text-sm">
                <FaGlobe className="text-[var(--text-muted)] w-4 h-4" />
                {isEditing ? (
                  <input
                    type="text"
                    name="website"
                    value={formData.website || ''}
                    onChange={handleInputChange}
                    className="flex-1 bg-transparent border-b border-[var(--border-color)] focus:border-indigo-500 focus:outline-none text-[var(--text-primary)] py-1"
                    placeholder="Website"
                  />
                ) : (
                  <span className="text-[var(--text-secondary)]">{company.website || 'Not set'}</span>
                )}
              </div>

              {/* Address */}
              <div className="flex items-center gap-3 text-sm">
                <FaMapMarkerAlt className="text-[var(--text-muted)] w-4 h-4" />
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    className="flex-1 bg-transparent border-b border-[var(--border-color)] focus:border-indigo-500 focus:outline-none text-[var(--text-primary)] py-1"
                    placeholder="Address"
                  />
                ) : (
                  <span className="text-[var(--text-secondary)]">{company.address || 'Not set'}</span>
                )}
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="card p-6 mt-6">
            <h4 className="font-semibold text-[var(--text-primary)] mb-3">Social Links</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-[var(--text-muted)]">🔗 LinkedIn</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="social.linkedin"
                    value={formData.social?.linkedin || ''}
                    onChange={handleInputChange}
                    className="flex-1 bg-transparent border-b border-[var(--border-color)] focus:border-indigo-500 focus:outline-none text-[var(--text-primary)] py-1"
                    placeholder="LinkedIn URL"
                  />
                ) : (
                  <span className="text-[var(--text-secondary)]">{company.social?.linkedin || 'Not set'}</span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-[var(--text-muted)]">🐦 Twitter</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="social.twitter"
                    value={formData.social?.twitter || ''}
                    onChange={handleInputChange}
                    className="flex-1 bg-transparent border-b border-[var(--border-color)] focus:border-indigo-500 focus:outline-none text-[var(--text-primary)] py-1"
                    placeholder="Twitter URL"
                  />
                ) : (
                  <span className="text-[var(--text-secondary)]">{company.social?.twitter || 'Not set'}</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right - Company Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* About */}
          <div className="card p-6">
            <h4 className="font-semibold text-[var(--text-primary)] mb-3">About Company</h4>
            {isEditing ? (
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none bg-[var(--bg-input)] text-[var(--text-primary)]"
                placeholder="Describe your company..."
              />
            ) : (
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                {company.description || 'No description provided'}
              </p>
            )}
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h4 className="font-semibold text-[var(--text-primary)] mb-3">🎯 Mission</h4>
              {isEditing ? (
                <textarea
                  name="mission"
                  value={formData.mission || ''}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none bg-[var(--bg-input)] text-[var(--text-primary)]"
                  placeholder="Company mission..."
                />
              ) : (
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  {company.mission || 'No mission statement provided'}
                </p>
              )}
            </div>
            <div className="card p-6">
              <h4 className="font-semibold text-[var(--text-primary)] mb-3">👁️ Vision</h4>
              {isEditing ? (
                <textarea
                  name="vision"
                  value={formData.vision || ''}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-[var(--border-color)] rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none bg-[var(--bg-input)] text-[var(--text-primary)]"
                  placeholder="Company vision..."
                />
              ) : (
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                  {company.vision || 'No vision statement provided'}
                </p>
              )}
            </div>
          </div>

          {/* Values */}
          <div className="card p-6">
            <h4 className="font-semibold text-[var(--text-primary)] mb-3">⭐ Core Values</h4>
            {isEditing ? (
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(formData.values || []).map((value, index) => (
                    <span key={index} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-sm flex items-center gap-2 border border-indigo-200 dark:border-indigo-800">
                      {value}
                      <button
                        type="button"
                        onClick={() => handleValueRemove(index)}
                        className="text-indigo-400 hover:text-red-500"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleValueAdd}
                  className="px-3 py-1 border border-dashed border-[var(--border-color)] rounded-full text-sm text-[var(--text-secondary)] hover:border-indigo-500 hover:text-indigo-500 transition-all"
                >
                  + Add Value
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(company.values || []).length > 0 ? (
                  company.values.map((value, index) => (
                    <span key={index} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-sm border border-indigo-200 dark:border-indigo-800">
                      {value}
                    </span>
                  ))
                ) : (
                  <p className="text-[var(--text-secondary)] text-sm">No values defined</p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyManagement;
