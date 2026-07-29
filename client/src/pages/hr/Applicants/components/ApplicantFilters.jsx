import {
  FaBriefcase,
  FaCalendarAlt,
} from "react-icons/fa";

import "./ApplicantFilters.css";

function ApplicantFilters() {
  return (
    <div className="filter-container">

      {/* Job Title */}

      <div className="filter-section">

        <label>Job Title</label>

        <div className="filter-input">
          <FaBriefcase className="icon" />

          <select>
            <option>All Active Jobs</option>
            <option>Frontend Developer</option>
            <option>Backend Developer</option>
            <option>Python Developer</option>
          </select>

        </div>

      </div>

      {/* Status */}

      <div className="filter-section">

        <label>Status</label>

        <div className="status-buttons">

          <button className="active">All</button>
          <button>Applied</button>
          <button>Screened</button>
          <button>Interview</button>
          <button>Rejected</button>

        </div>

      </div>

      {/* Date */}

      <div className="filter-section">

        <label>Date Range</label>

        <div className="filter-input">

          <FaCalendarAlt className="icon" />

          <select>
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>

        </div>

      </div>

    </div>
  );
}

export default ApplicantFilters;