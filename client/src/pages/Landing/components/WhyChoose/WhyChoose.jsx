import "./WhyChoose.css";

import {
  FaRobot,
  FaUserCheck,
  FaClipboardList,
  FaCalendarCheck,
  FaChartLine,
  FaShieldAlt,
} from "react-icons/fa";

function WhyChoose() {

  const features = [
    {
      icon: <FaRobot />,
      title: "AI Resume Screening",
      text: "Automatically analyze and shortlist resumes based on job requirements."
    },
    {
      icon: <FaUserCheck />,
      title: "Smart Candidate Matching",
      text: "Find the most suitable candidates using AI-powered matching."
    },
    {
      icon: <FaClipboardList />,
      title: "Job Management",
      text: "Create, update, and manage job postings with ease."
    },
    {
      icon: <FaCalendarCheck />,
      title: "Interview Scheduling",
      text: "Organize interviews efficiently and keep everyone informed."
    },
    {
      icon: <FaChartLine />,
      title: "Recruitment Analytics",
      text: "Monitor hiring performance with useful reports and insights."
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure Data Management",
      text: "Protect candidate information with secure document storage."
    }
  ];

  return (

    <section className="whychoose" id="features">

      <div className="why-title">

        <span>Why Choose Us</span>

        <h2>Everything You Need to Hire Smarter</h2>

        <p>
          NexHire AI provides intelligent tools that simplify recruitment,
          improve hiring decisions, and create a better experience for both
          recruiters and candidates.
        </p>

      </div>

      <div className="why-grid">

        {features.map((feature, index) => (

          <div className="why-card" key={index}>

            <div className="why-icon">
              {feature.icon}
            </div>

            <h3>{feature.title}</h3>

            <p>{feature.text}</p>

          </div>

        ))}

      </div>

    </section>

  );
}

export default WhyChoose;