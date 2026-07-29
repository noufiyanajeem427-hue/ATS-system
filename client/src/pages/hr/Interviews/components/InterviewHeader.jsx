import "./InterviewHeader.css";
import { Link } from "react-router-dom";

import {
  FaCalendarAlt,
  FaListUl,
  FaCalendarWeek,
  FaPlus,
} from "react-icons/fa";

function InterviewHeader() {
  return (
    <div className="interview-header">

      <div className="header-left">

        <h1>Interview Management</h1>

        <div className="header-meta">

          <span>
            <FaCalendarAlt />
            October 24, 2023
          </span>

          <span className="dot">•</span>

          <span className="scheduled-count">
            12 Scheduled Today
          </span>

        </div>

      </div>

      <div className="header-right">

        <div className="view-toggle">

          <button className="active">
            <FaListUl />
            List
          </button>

          <button>
            <FaCalendarWeek />
            Calendar
          </button>

        </div>

        <Link to="/hr/interviews/schedule" className="schedule-btn">
            <FaPlus />
            Schedule New Interview
        </Link>
      </div>

    </div>
  );
}

export default InterviewHeader;