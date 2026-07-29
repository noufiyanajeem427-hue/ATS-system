import "./CandidateProfileCard.css";
import { Link } from "react-router-dom";

import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaRobot,
  FaDownload,
  FaCalendarAlt,
} from "react-icons/fa";

function CandidateProfileCard() {
  const candidate = {
    name: "Sarah Jenkins",
    role: "Senior UX Designer",
    email: "sarah.jenkins@gmail.com",
    phone: "+91 9876543210",
    location: "Kochi, Kerala",
    aiScore: "95%",
    status: "Shortlisted",
    applied: "12 Oct 2023",
  };

  return (
    <div className="candidate-card">

      <div className="candidate-left">

        <div className="candidate-avatar">
          <FaUserCircle />
        </div>

        <div className="candidate-info">

          <span className="verified">
            AI Verified Candidate
          </span>

          <h2>{candidate.name}</h2>

          <p className="job-role">
            {candidate.role}
          </p>

          <div className="contact-info">

            <span>
              <FaEnvelope />
              {candidate.email}
            </span>

            <span>
              <FaPhone />
              {candidate.phone}
            </span>

            <span>
              <FaMapMarkerAlt />
              {candidate.location}
            </span>

          </div>

        </div>

      </div>

      <div className="candidate-right">

        <div className="badge score">
          <FaRobot />

          <div>
            <small>AI Match</small>
            <h3>{candidate.aiScore}</h3>
          </div>
        </div>

        <div className="badge applied">
          <FaCalendarAlt />

          <div>
            <small>Applied</small>
            <h3>{candidate.applied}</h3>
          </div>
        </div>

        <div className="status">
          {candidate.status}
        </div>

        <div className="resume-actions">

          <Link
            to="/hr/resume/1"
            className="view-resume-btn"
          >
            View Resume
          </Link>

          <button className="download-resume-btn">
            <FaDownload />
            Download PDF
          </button>

        </div>

      </div>
    </div>
  );
}

export default CandidateProfileCard;