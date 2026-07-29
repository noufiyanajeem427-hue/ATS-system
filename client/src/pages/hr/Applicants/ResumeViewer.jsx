import { Link } from "react-router-dom";
import "./ResumeViewer.css";

import {
  FaArrowLeft,
  FaDownload,
  FaFilePdf,
  FaUserTie,
} from "react-icons/fa";

function ResumeViewer() {
  return (
    <div className="resume-page">

      <div className="resume-top">

        <div className="resume-left">

          <Link to="/hr/applicants" className="back-btn">
            <FaArrowLeft />
          </Link>

          <div className="resume-title">

            <h1>Resume Viewer</h1>

            <p>
              Candidate Resume • AI Recruitment Platform
            </p>

          </div>

        </div>

        <button className="download-btn">
          <FaDownload />
          Download Resume
        </button>

      </div>

      <div className="resume-card">

        <div className="resume-info">

          <div className="resume-icon">
            <FaFilePdf />
          </div>

          <div>

            <h2>Candidate Resume</h2>

            <p>
              Sarah Jenkins • Senior UX Designer
            </p>

          </div>

        </div>

        <div className="resume-score">

          <FaUserTie />

          <div>

            <small>AI Match</small>

            <h3>95%</h3>

          </div>

        </div>

      </div>

      <div className="resume-preview-card">

        <div className="preview-header">

          <h3>Resume Preview</h3>

          <span>PDF Document</span>

        </div>

        <div className="resume-placeholder">

          <FaFilePdf />

          <h2>Resume Preview</h2>

          <p>
            PDF Viewer will appear here after backend integration.
          </p>

        </div>

      </div>

    </div>
  );
}

export default ResumeViewer;