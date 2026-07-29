import "./Hero.css";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import heroImage from "../../../../assets/images/hero/hero-illustration.png";

function Hero() {
  const navigate = useNavigate();
  return (
    <section className="hero">

      <div className="hero-left">

        <h2> AI Recruitment <span>Platform</span></h2>

        <h1>
          Hire Smarter with <span>NexHire</span>
        </h1>

        <p>
          Simplify recruitment with intelligent resume screening,
          smart candidate matching, and seamless hiring workflows.
        </p>

        <div className="hero-list">
          <p><FaCheckCircle /> AI Resume Screening</p>
          <p><FaCheckCircle /> Smart Candidate Matching</p>
          <p><FaCheckCircle /> Faster Hiring Process</p>
        </div>

        <div className="hero-buttons">
          <button
            className="primary-btn"
            onClick={() => navigate("/login")} >
            Get Started
          </button>

            <a href="#jobs" className="secondary-btn">
            Browse Jobs</a>
        </div>

      </div>

      <div className="hero-right">

        <img src={heroImage} alt="AI Recruitment Platform" className="hero-image" />

      </div>

    </section>
  );
}

export default Hero;