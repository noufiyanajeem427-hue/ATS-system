import { useEffect, useState } from "react";
import axios from "axios";

import "./Profile.css";

import Header from "../components/Header/Header";
import AdminSidebar from "../components/Sidebar/AdminSidebar";

function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        } else {
          setError("Failed to load profile.");
        }
      } catch (err) {
        console.error("Profile Error:", err);

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

  if (loading) {
    return (
      <>
        <AdminSidebar
          isOpen={sidebarOpen}
          closeSidebar={() =>
            setSidebarOpen(false)
          }
        />

        <div className="admin-main">
          <Header
            openSidebar={() =>
              setSidebarOpen(true)
            }
          />

          <section className="profile-page">
            <div className="profile-loading">
              Loading profile...
            </div>
          </section>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AdminSidebar
          isOpen={sidebarOpen}
          closeSidebar={() =>
            setSidebarOpen(false)
          }
        />

        <div className="admin-main">
          <Header
            openSidebar={() =>
              setSidebarOpen(true)
            }
          />

          <section className="profile-page">
            <div className="profile-error">
              {error}
            </div>
          </section>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminSidebar
        isOpen={sidebarOpen}
        closeSidebar={() =>
          setSidebarOpen(false)
        }
      />

      <div className="admin-main">
        <Header
          openSidebar={() =>
            setSidebarOpen(true)
          }
        />

        <section className="profile-page">

          <div className="profile-header">
            <h1>My Profile</h1>

            <p>
              View your account and professional
              information.
            </p>
          </div>

          <div className="profile-card">

            <div className="profile-avatar">
              {profile?.name
                ? profile.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <div className="profile-name">
              <h2>{profile?.name}</h2>

              <span>
                {profile?.jobTitle ||
                  "HR Professional"}
              </span>
            </div>

            <div className="profile-details">

              <div className="profile-detail">
                <label>Full Name</label>
                <p>
                  {profile?.name || "-"}
                </p>
              </div>

              <div className="profile-detail">
                <label>Email</label>
                <p>
                  {profile?.email || "-"}
                </p>
              </div>

              <div className="profile-detail">
                <label>Mobile Number</label>
                <p>
                  {profile?.phone || "-"}
                </p>
              </div>

              <div className="profile-detail">
                <label>Company</label>
                <p>
                  {profile?.company || "-"}
                </p>
              </div>

              <div className="profile-detail">
                <label>Designation</label>
                <p>
                  {profile?.jobTitle || "-"}
                </p>
              </div>

            </div>

          </div>

        </section>
      </div>
    </>
  );
}

export default Profile;