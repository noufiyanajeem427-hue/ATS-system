import "./AboutPage.css";
import { Link } from "react-router-dom";
import {
  FaRobot,
  FaBullseye,
  FaEye,
  FaCheckCircle,
} from "react-icons/fa";

import aboutImage from "../../assets/images/about/about.png";

function AboutPage() {
  return (
    <section className="about-page">

      <div className="about-page-hero">

        <div className="about-page-left">

          <span className="page-tag">
            About NexHire AI
          </span>

          <h1>
            Empowering Recruitment with
            <span> Artificial Intelligence</span>
          </h1>

          <p>
            NexHire AI is an intelligent Applicant Tracking System
            designed to simplify hiring for recruiters and job seekers.
            Our platform combines modern technology with AI-powered
            automation to make recruitment faster, smarter, and more
            efficient.
          </p>

          <div className="about-buttons">
            <Link to="/register" className="primary-btn">
              Get Started
            </Link>

            <Link to="/" className="secondary-btn">
              Back Home
            </Link>
          </div>

        </div>

        <div className="about-page-right">
          <img
            src={aboutImage}
            alt="About NexHire"
          />
        </div>

      </div>

      <div className="about-section">

        <div className="info-box">
          <FaRobot className="info-icon" />
          <h3>What is NexHire?</h3>

          <p>
            NexHire AI is a modern recruitment platform that helps
            organizations identify the right candidates through AI-based
            resume analysis, intelligent matching, and streamlined hiring.
          </p>
        </div>

        <div className="info-box">
          <FaBullseye className="info-icon" />
          <h3>Our Mission</h3>

          <p>
            To simplify recruitment by reducing manual work and enabling
            companies to hire the best talent quickly through intelligent
            automation.
          </p>
        </div>

        <div className="info-box">
          <FaEye className="info-icon" />
          <h3>Our Vision</h3>

          <p>
            To become a trusted AI-powered recruitment platform that
            connects talented individuals with the right career
            opportunities across industries.
          </p>
        </div>

      </div>

      <div className="why-nexhire">

        <h2>Why Choose NexHire?</h2>

        <div className="features">

          <div>
            <FaCheckCircle />
            AI Resume Screening
          </div>

          <div>
            <FaCheckCircle />
            Smart Candidate Matching
          </div>

          <div>
            <FaCheckCircle />
            Faster Hiring Process
          </div>

          <div>
            <FaCheckCircle />
            Recruiter & Candidate Dashboards
          </div>

          <div>
            <FaCheckCircle />
            Secure Recruitment Platform
          </div>

          <div>
            <FaCheckCircle />
            Modern User Experience
          </div>

        </div>

      </div>

    </section>
  );
}

export default AboutPage;