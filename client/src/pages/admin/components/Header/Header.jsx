import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "./Header.css";

import {
  FaBars,
  FaSearch,
  FaUserCircle,
  FaTimes,
} from "react-icons/fa";

function Header({ openSidebar }) {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "Admin",
    jobTitle: "Administrator",
  });

  const [search, setSearch] = useState("");

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No authentication token found");
        return;
      }

      const response = await axios.get(
        "http://localhost:5001/api/settings/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setProfile({
          name: response.data.profile.name || "Admin",
          jobTitle:
            response.data.profile.jobTitle || "Administrator",
        });
      }
    } catch (error) {
      console.error(
        "Header Profile Error:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchProfile();

    const handleProfileUpdate = () => {
      fetchProfile();
    };

    window.addEventListener(
      "profileUpdated",
      handleProfileUpdate
    );

    return () => {
      window.removeEventListener(
        "profileUpdated",
        handleProfileUpdate
      );
    };
  }, []);

  // SEARCH
  const handleSearch = (e) => {
    e.preventDefault();

    const value = search.trim();

    if (!value) {
      return;
    }

    const lowerValue = value.toLowerCase();

    /*
      For now, send the admin to the most relevant page.
      The actual filtering of records can be connected next.
    */

    if (
      lowerValue.includes("user") ||
      lowerValue.includes("candidate") ||
      lowerValue.includes("recruiter")
    ) {
      navigate(`/admin/users?search=${encodeURIComponent(value)}`);
    } else if (
      lowerValue.includes("job") ||
      lowerValue.includes("jobs")
    ) {
      navigate(`/admin/jobs?search=${encodeURIComponent(value)}`);
    } else if (
      lowerValue.includes("analytic") ||
      lowerValue.includes("analytics")
    ) {
      navigate("/admin/analytics");
    } else if (
      lowerValue.includes("report") ||
      lowerValue.includes("reports")
    ) {
      navigate("/admin/reports");
    } else if (
      lowerValue.includes("setting") ||
      lowerValue.includes("settings")
    ) {
      navigate("/admin/settings");
    } else {
      // Default search location
      navigate(
        `/admin/users?search=${encodeURIComponent(value)}`
      );
    }
  };

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <header className="admin-header">

      {/* LEFT */}
      <div className="header-left">

        <button
          className="menu-btn"
          onClick={openSidebar}
          type="button"
        >
          <FaBars />
        </button>

        <div className="admin-logo">
          <h2>NexHire</h2>
          <span>Admin</span>
        </div>

      </div>


      {/* CENTER */}
      <div className="header-center">

        <form
          className="search-box"
          onSubmit={handleSearch}
        >

          <FaSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search users, jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              type="button"
              className="clear-search"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}

        </form>

      </div>


      {/* RIGHT */}
      <div className="header-right">

        <div
          className="admin-profile"
          onClick={() => navigate("/admin/profile")}
        >

          <FaUserCircle className="profile-icon" />

          <div>
            <h4>{profile.name}</h4>
            <p>{profile.jobTitle}</p>
          </div>

        </div>

      </div>

    </header>
  );
}

export default Header;