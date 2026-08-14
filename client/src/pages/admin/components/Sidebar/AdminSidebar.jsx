import { Link, useNavigate } from "react-router-dom";

import {
  FaChartPie,
  FaUsers,
  FaBriefcase,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaTimes,
  FaFileAlt,
} from "react-icons/fa";

import "./AdminSidebar.css";

function AdminSidebar({ isOpen, closeSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove authentication token
    localStorage.removeItem("token");

    // Remove any other stored user information if present
    localStorage.removeItem("user");

    // Close sidebar
    closeSidebar();

    // Go back to landing page
    navigate("/");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`admin-overlay ${isOpen ? "show" : ""}`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${isOpen ? "active" : ""}`}
      >

        {/* Logo */}
        <div className="admin-sidebar-logo">

          <div>
            <h2>NexHire</h2>
            <p>AI Recruitment Platform</p>
          </div>

          <FaTimes
            className="sidebar-close"
            onClick={closeSidebar}
          />

        </div>


        {/* Navigation */}
        <nav>
          <ul>

            <li className="active">
              <Link
                to="/admin/dashboard"
                onClick={closeSidebar}
              >
                <FaChartPie />
                <span>Dashboard</span>
              </Link>
            </li>


            <li>
              <Link
                to="/admin/users"
                onClick={closeSidebar}
              >
                <FaUsers />
                <span>Users</span>
              </Link>
            </li>


            <li>
              <Link
                to="/admin/jobs"
                onClick={closeSidebar}
              >
                <FaBriefcase />
                <span>Jobs</span>
              </Link>
            </li>


            <li>
              <Link
                to="/admin/analytics"
                onClick={closeSidebar}
              >
                <FaChartLine />
                <span>Analytics</span>
              </Link>
            </li>


            <li>
              <Link
                to="/admin/reports"
                onClick={closeSidebar}
              >
                <FaFileAlt />
                <span>Reports</span>
              </Link>
            </li>


            <li>
              <Link
                to="/admin/settings"
                onClick={closeSidebar}
              >
                <FaCog />
                <span>Settings</span>
              </Link>
            </li>

          </ul>
        </nav>


        {/* Logout */}
        <button
          className="admin-logout"
          onClick={handleLogout}
          type="button"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>

      </aside>
    </>
  );
}

export default AdminSidebar;