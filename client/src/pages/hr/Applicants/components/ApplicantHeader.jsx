import "./ApplicantHeader.css";
import {
  FaBell,
  FaQuestionCircle,
  FaUserCircle,
  FaSearch,
} from "react-icons/fa";

function ApplicantHeader() {
  return (
    <div className="topbar">

      <div className="search-box">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search candidates, jobs or analytics..."
        />
      </div>

      <div className="top-icons">
        <FaBell />
        <FaQuestionCircle />

        <div className="profile">
          <FaUserCircle />
          <span>Sarah Jenkins</span>
        </div>
      </div>

    </div>
  );
}

export default ApplicantHeader;