import "./About.css";
import {
  FaBullseye,
  FaEye,
  FaHandshake,
} from "react-icons/fa";

import aboutImage from "../../../../assets/images/about/about.png";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();
  
  return (
    <>
      {/* About Section */}
      <section className="about" id="about">

        <div className="about-left">
          <img
            src={aboutImage}
            alt="About NexHire AI"
          />
        </div>

        <div className="about-right">

          <span className="about-tag">
            About Us
          </span>

          <h2> Smarter Hiring with <span>AI</span> </h2>

          <p>
            NexHire is an intelligent Applicant Tracking System designed
            to simplify recruitment for recruiters and job seekers. Our
            platform combines AI-powered resume screening, smart candidate
            matching, and recruitment management to make hiring faster,
            smarter, and more efficient.
          </p>

          <ul className="about-list">
            <li>✓ AI Resume Screening</li>
            <li>✓ Smart Candidate Matching</li>
            <li>✓ Secure Recruitment Platform</li>
            <li>✓ Faster Hiring Process</li>
          </ul>

          <button
  className="about-btn"
  onClick={() => navigate("/about")}
>
  Learn More
</button>

        </div>

      </section>

      {/* Mission Vision Values */}
      <section className="about-values">

        <div className="about-card">

          <FaBullseye />

          <h3>Mission</h3>

          <p>
            To simplify recruitment by providing fast, intelligent,
            and AI-powered hiring solutions.
          </p>

        </div>

        <div className="about-card">

          <FaEye />

          <h3>Vision</h3>

          <p>
            To become a trusted AI recruitment platform that connects
            talented people with the right opportunities.
          </p>

        </div>

        <div className="about-card">

          <FaHandshake />

          <h3>Values</h3>

          <p>
            Innovation, transparency, collaboration, security,
            and excellence in every hiring journey.
          </p>

        </div>

      </section>
    </>
  );
}

export default About;