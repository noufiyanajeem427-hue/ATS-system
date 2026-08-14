import { useState } from "react";
import axios from "axios";

import "./SecuritySettings.css";

function SecuritySettings() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // UPDATE PASSWORD
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = formData;

    // Frontend validation
    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "New password must be at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "New password and confirm password do not match."
      );
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setError(
          "You are not logged in. Please login again."
        );
        return;
      }

      const response = await axios.put(
        "http://localhost:5001/api/settings/password",
        {
          currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setMessage(
          "Password updated successfully."
        );

        // Clear password fields
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      console.error(
        "Password Update Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update password."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-card">

      <h2>Security Settings</h2>

      <form
        className="settings-form"
        onSubmit={handleSubmit}
      >

        {/* Current Password */}

        <div className="form-group">

          <label>
            Current Password
          </label>

          <input
            type="password"
            name="currentPassword"
            placeholder="Enter current password"
            value={formData.currentPassword}
            onChange={handleChange}
          />

        </div>


        {/* New Password */}

        <div className="form-group">

          <label>
            New Password
          </label>

          <input
            type="password"
            name="newPassword"
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={handleChange}
          />

        </div>


        {/* Confirm Password */}

        <div className="form-group">

          <label>
            Confirm Password
          </label>

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

        </div>


        {/* Success */}

        {message && (
          <p className="settings-success">
            {message}
          </p>
        )}


        {/* Error */}

        {error && (
          <p className="settings-error">
            {error}
          </p>
        )}


        {/* Button */}

        <button
          type="submit"
          className="save-btn"
          disabled={saving}
        >
          {saving
            ? "Updating..."
            : "Update Password"}
        </button>

      </form>

    </div>
  );
}

export default SecuritySettings;