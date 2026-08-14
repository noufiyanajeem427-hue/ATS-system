import { useEffect, useState } from "react";
import axios from "axios";

import "./ProfileSettings.css";

function ProfileSettings() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    jobTitle: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // LOAD PROFILE
  // ==========================================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5001/api/settings/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setProfile(response.data.profile);
        }
      } catch (err) {
        console.error("Profile Load Error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:5001/api/settings/profile",
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
  setMessage(
    "Profile updated successfully."
  );

  // Tell Header to refresh the profile
  window.dispatchEvent(
    new Event("profileUpdated")
  );
}
      
    } catch (err) {
      console.error(
        "Profile Update Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="settings-card">
        <h2>Profile Settings</h2>
        <p>Loading profile...</p>
      </div>
    );
  }

  // ==========================================
  // FORM
  // ==========================================

  return (
    <div className="settings-card">
      <h2>Profile Settings</h2>

      <form
        className="settings-form"
        onSubmit={handleSubmit}
      >
        <div className="form-group">
          <label>Full Name</label>

          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Mobile Number</label>

          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            placeholder="Enter mobile number"
          />
        </div>

        <div className="form-group">
          <label>Company</label>

          <input
            type="text"
            name="company"
            value={profile.company}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Designation</label>

          <input
            type="text"
            name="jobTitle"
            value={profile.jobTitle}
            onChange={handleChange}
          />
        </div>

        {message && (
          <p className="settings-success">
            {message}
          </p>
        )}

        {error && (
          <p className="settings-error">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="save-btn"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default ProfileSettings;