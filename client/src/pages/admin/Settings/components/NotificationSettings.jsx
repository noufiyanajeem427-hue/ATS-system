import "./NotificationSettings.css";
import { useEffect, useState } from "react";
import axios from "axios";

function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    email: true,
    jobs: true,
    candidates: false,
    reports: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // LOAD SETTINGS
  // ==========================================

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("You are not logged in.");
          return;
        }

        const response = await axios.get(
          "http://localhost:5001/api/settings/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          setNotifications(
            response.data.notifications
          );
        }
      } catch (err) {
        console.error(
          "Notification Settings Load Error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load notification settings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // ==========================================
  // TOGGLE
  // ==========================================

  const handleToggle = (field) => {
    setNotifications((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));

    // Clear old messages
    setMessage("");
    setError("");
  };

  // ==========================================
  // SAVE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

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
        "http://localhost:5001/api/settings/notifications",
        notifications,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setNotifications(
          response.data.notifications
        );

        setMessage(
          "Notification preferences saved successfully."
        );
      }
    } catch (err) {
      console.error(
        "Notification Settings Save Error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to save notification settings."
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
        <h2>Notification Settings</h2>

        <p>Loading notification settings...</p>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="settings-card">

      <h2>Notification Settings</h2>

      <form
        className="notification-form"
        onSubmit={handleSubmit}
      >

        <div className="notification-list">

          {/* Email */}

          <div className="notification-item">

            <span>
              Email Notifications
            </span>

            <input
              type="checkbox"
              checked={notifications.email}
              onChange={() =>
                handleToggle("email")
              }
            />

          </div>

          {/* Jobs */}

          <div className="notification-item">

            <span>
              Job Alerts
            </span>

            <input
              type="checkbox"
              checked={notifications.jobs}
              onChange={() =>
                handleToggle("jobs")
              }
            />

          </div>

          {/* Candidates */}

          <div className="notification-item">

            <span>
              Candidate Alerts
            </span>

            <input
              type="checkbox"
              checked={notifications.candidates}
              onChange={() =>
                handleToggle("candidates")
              }
            />

          </div>

          {/* Reports */}

          <div className="notification-item">

            <span>
              Weekly Reports
            </span>

            <input
              type="checkbox"
              checked={notifications.reports}
              onChange={() =>
                handleToggle("reports")
              }
            />

          </div>

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

        {/* Save */}

        <button
          type="submit"
          className="save-btn"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save Preferences"}
        </button>

      </form>

    </div>
  );
}

export default NotificationSettings;