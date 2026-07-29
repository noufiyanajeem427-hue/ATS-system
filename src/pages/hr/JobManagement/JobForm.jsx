import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaPlus, FaMinus, FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "../../../api/axiosConfig";

const JobForm = ({ job, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    experience: "",
    salary: { min: "", max: "" },
    description: "",
    requirements: [],
    status: "active"
  });
  const [newRequirement, setNewRequirement] = useState("");

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || "",
        department: job.department || "",
        location: job.location || "",
        type: job.type || "Full-time",
        experience: job.experience || "",
        salary: job.salary || { min: "", max: "" },
        description: job.description || "",
        requirements: job.requirements || [],
        status: job.status || "active"
      });
    }
  }, [job]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("salary.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        salary: { ...formData.salary, [field]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData({
        ...formData,
        requirements: [...(formData.requirements || []), newRequirement.trim()]
      });
      setNewRequirement("");
    }
  };

  const removeRequirement = (index) => {
    setFormData({
      ...formData,
      requirements: (formData.requirements || []).filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.department || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      if (job) {
        await axios.put(`/jobs/${job._id}`, formData);
        toast.success("Job updated successfully");
      } else {
        await axios.post("/jobs", formData);
        toast.success("Job created successfully");
      }
      onSave();
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Failed to save job");
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
        transition={{ type: "spring", damping: 25 }}
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {job ? "Edit Job" : "Post New Job"}
            </h3>
            <p className="text-sm text-gray-500">
              {job ? "Update the job details" : "Create a new job posting"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
          >
            <FaTimes className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Senior Full Stack Developer"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                required
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., San Francisco, CA or Remote"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience Required
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="e.g., 3+ years"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="salary.min"
                  value={formData.salary.min}
                  onChange={handleInputChange}
                  placeholder="Min"
                  className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
                <input
                  type="number"
                  name="salary.max"
                  value={formData.salary.max}
                  onChange={handleInputChange}
                  placeholder="Max"
                  className="w-1/2 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Describe the role, responsibilities..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requirements
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRequirement())}
                placeholder="Add a requirement..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={addRequirement}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
              >
                <FaPlus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {(formData.requirements || []).map((req, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm flex items-center gap-2 border border-indigo-200"
                >
                  {req}
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="text-indigo-400 hover:text-red-500"
                  >
                    <FaMinus className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

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
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50"
            >
              {loading ? (
                <FaSpinner className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                job ? "Update Job" : "Post Job"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default JobForm;
