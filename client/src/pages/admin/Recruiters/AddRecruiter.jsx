import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddRecruiter.css";

function AddRecruiter() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5001/api/admin/recruiters",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "hr",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message || "Recruiter added successfully.");

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

    } catch (err) {
      console.error("Add Recruiter Error:", err);

      setError(
        err.response?.data?.message ||
        "Failed to add recruiter."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-recruiter-page">

      <div className="add-recruiter-card">

        <div className="page-header">
          <h2>Add Recruiter</h2>
          <p>Create a new recruiter account</p>
        </div>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter recruiter name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter recruiter email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
            />
          </div>

          <div className="form-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/admin/dashboard")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="add-btn"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Recruiter"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddRecruiter;