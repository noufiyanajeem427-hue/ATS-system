import "./ProfessionalJourney.css";

import {
  FaBriefcase,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

function ProfessionalJourney() {

  const experiences = [

    {
      company: "TechNova Solutions",
      role: "Senior Python Developer",
      period: "2024 - Present",
      location: "Bangalore, India",
      description:
        "Developed scalable web applications using Python, Django, REST APIs, and PostgreSQL while mentoring junior developers.",
      skills: [
        "Python",
        "Django",
        "REST API",
        "PostgreSQL",
      ],
    },

    {
      company: "InnoTech Labs",
      role: "Software Developer",
      period: "2022 - 2024",
      location: "Kochi, India",
      description:
        "Worked on full-stack development, bug fixing, API integration, and collaborated with UI/UX designers.",
      skills: [
        "React",
        "Node.js",
        "MongoDB",
        "Git",
      ],
    },

  ];

  return (

    <div className="journey-card">

      <div className="section-header">

        <h2>Professional Journey</h2>

        <p>
          Candidate's work experience and career growth
        </p>

      </div>

      {experiences.map((job, index) => (

        <div
          className="journey-item"
          key={index}
        >

          <div className="company-logo">
            <FaBriefcase />
          </div>

          <div className="journey-content">

            <div className="journey-top">

              <div>

                <h3>{job.role}</h3>

                <h4>{job.company}</h4>

              </div>

              <div className="journey-date">

                <span>
                  <FaCalendarAlt />
                  {job.period}
                </span>

                <span>
                  <FaMapMarkerAlt />
                  {job.location}
                </span>

              </div>

            </div>

            <p>{job.description}</p>

            <div className="skill-tags">

              {job.skills.map((skill, i) => (

                <span key={i}>
                  {skill}
                </span>

              ))}

            </div>

          </div>

        </div>

      ))}

    </div>

  );
}

export default ProfessionalJourney;