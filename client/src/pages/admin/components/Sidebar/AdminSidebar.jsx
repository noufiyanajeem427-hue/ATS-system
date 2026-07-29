import { Link } from "react-router-dom";
import {
  FaChartPie,
  FaUsers,
  FaUserTie,
  FaUserGraduate,
  FaBriefcase,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

import "./AdminSidebar.css";

function AdminSidebar({ isOpen, closeSidebar }) {
  return (
  <>
    {/* Overlay */}
    <div
      className={`admin-overlay ${isOpen ? "show" : ""}`}
      onClick={closeSidebar}
    ></div>

    {/* Sidebar */}
    <aside className={`admin-sidebar ${isOpen ? "active" : ""}`}>

      <div className="admin-sidebar-logo">
        <h2>NexHire</h2>
        <p>AI Recruitment Platform</p>
      </div>

      <nav>
        <ul>

          <li className="active">
            <FaChartPie />
            <span>Dashboard</span>
          </li>

          <li>
            <Link to="/admin/users">
              <FaUsers />
              <span>Users</span>
            </Link>
          </li>

          <li>
            <FaUserTie />
            <span>Recruiters</span>
          </li>

          <li>
            <FaUserGraduate />
            <span>Candidates</span>
          </li>

          <li>
            <FaBriefcase />
            <span>Jobs</span>
          </li>

          <li>
            <FaChartLine />
            <span>Analytics</span>
          </li>

          <li>
            <FaCog />
            <span>Settings</span>
          </li>

        </ul>
      </nav>

      <div className="admin-logout">
        <FaSignOutAlt />
        <span>Logout</span>
      </div>

    </aside>
  </>
);
}

export default AdminSidebar;