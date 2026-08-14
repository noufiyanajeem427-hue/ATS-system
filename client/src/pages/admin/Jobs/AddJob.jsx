import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddJob.css";

function AddJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    experience: "",
    salary: "",
    description: "",
    status: "Open",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5001/api/jobs",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Create Job Response:", res.data);

      setMessage("Job created successfully!");

      setTimeout(() => {
        navigate("/admin/jobs");
      }, 1000);

    } catch (error) {
      console.error("Create Job Error:", error);

      setMessage(
        error.response?.data?.message ||
        "Failed to create job."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-job-page">

      <div className="add-job-card">

        <div className="add-job-header">
          <h2>Add New Job</h2>
          <p>Create a new job posting</p>
        </div>

        {message && (
          <div className="job-message">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-row">

            <div className="form-group">
              <label>Job Title</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter job title"
                required
              />
            </div>

            <div className="form-group">
              <label>Company</label>

              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter company name"
                required
              />
            </div>

          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Location</label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Kozhikode, Kerala"
                required
              />
            </div>

            <div className="form-group">
              <label>Job Type</label>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">Select job type</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Experience</label>

              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g. 0-2 years"
                required
              />
            </div>

            <div className="form-group">
              <label>Salary</label>

              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. ₹3-5 LPA"
              />
            </div>

          </div>

          <div className="form-group">

            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter job description"
              rows="6"
              required
            />

          </div>

          <div className="form-group">

            <label>Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>

          </div>

          <div className="form-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/admin/jobs")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Job"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddJob;