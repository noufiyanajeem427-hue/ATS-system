import { Link } from "react-router-dom";
import "./Sidebar.css";
import {
  FaTimes,
  FaHome,
  FaBriefcase,
  FaInfoCircle,
  FaEnvelope,
  FaChevronRight,
} from "react-icons/fa";

function Sidebar({ isOpen, closeSidebar }) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`overlay ${isOpen ? "show" : ""}`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <aside
        className={`landing-sidebar ${isOpen ? "landing-active" : ""}`}
      >
        <div className="landing-sidebar-header">
          <div>
            <h2>NexHire</h2>
            <p>AI Recruitment Platform</p>
          </div>

          <FaTimes
            className="landing-close-btn"
            onClick={closeSidebar}
          />
        </div>

        <ul className="landing-sidebar-menu">

          <li className="landing-active">
            <a href="#hero" onClick={closeSidebar}>
              <span>
                <FaHome />
                Home
              </span>
              <FaChevronRight />
            </a>
          </li>

          <li className="landing-active">
            <a href="#about" onClick={closeSidebar}>
              <span>
                <FaInfoCircle />
                About Us
              </span>
              <FaChevronRight />
            </a>
          </li>

          <li className="landing-active">
            <a href="#jobs" onClick={closeSidebar}>
              <span>
                <FaBriefcase />
                Jobs
              </span>
              <FaChevronRight />
            </a>
          </li>

          <li className="landing-active">
            <a href="#contact" onClick={closeSidebar}>
              <span>
                <FaEnvelope />
                Contact
              </span>
              <FaChevronRight />
            </a>
          </li>

          <li className="landing-active">
            <Link to="/login" onClick={closeSidebar}>
              <span>Login</span>
              <FaChevronRight />
            </Link>
          </li>

          <li className="landing-active">
            <Link to="/register" onClick={closeSidebar}>
              <span>Register</span>
              <FaChevronRight />
            </Link>
          </li>

        </ul>
      </aside>
    </>
  );
}

export default Sidebar;