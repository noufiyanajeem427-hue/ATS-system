import "./Footer.css";

import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Company */}
        <div className="footer-column">

          <h3>NexHire</h3>

          <p>
            AI-powered recruitment platform connecting recruiters
            and candidates through intelligent hiring solutions.
          </p>

        </div>

        {/* Company Links */}
        <div className="footer-column">

          <h4>Company</h4>

          <a href="#about">About Us</a>

          <a href="#jobs">Jobs</a>

          <a href="#contact">Contact</a>

        </div>

        {/* Recruiters */}
        <div className="footer-column">

          <h4>Recruiters</h4>

          <a href="#">Post a Job</a>

          <a href="#">Manage Jobs</a>

          <a href="#">Dashboard</a>

        </div>

        {/* Candidates */}
        <div className="footer-column">

          <h4>Candidates</h4>

          <a href="#">Browse Jobs</a>

          <a href="#">My Applications</a>

          <a href="#">Profile</a>

        </div>

      </div>

      <div className="footer-bottom">

        <div className="social-icons">

          <a href="#">
            <FaLinkedin />
          </a>

          <a href="#">
            <FaGithub />
          </a>

          <a href="#">
            <FaInstagram />
          </a>

        </div>

        <p>
          © 2026 NexHire. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;