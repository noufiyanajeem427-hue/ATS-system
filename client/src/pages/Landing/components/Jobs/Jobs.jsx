import "./Jobs.css";
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaMoneyBillWave,
} from "react-icons/fa";

function Jobs() {

  const jobs = [
    {
      title: "Python Developer",
      location: "Calicut",
      type: "Full-Time",
      salary: "₹5–7 LPA",
      skills: "Python • Django • REST API",
    },
    {
      title: "React Developer",
      location: "Remote",
      type: "Full-Time",
      salary: "₹6–8 LPA",
      skills: "React • Node.js • MongoDB",
    },
    {
      title: "Software Tester",
      location: "Kochi",
      type: "Full-Time",
      salary: "₹4–6 LPA",
      skills: "Manual Testing • Selenium",
    },
    {
      title: "UI/UX Designer",
      location: "Bangalore",
      type: "Hybrid",
      salary: "₹5–8 LPA",
      skills: "Figma • Adobe XD",
    },
    {
      title: "Java Developer",
      location: "Chennai",
      type: "Full-Time",
      salary: "₹6–9 LPA",
      skills: "Java • Spring Boot",
    },
    {
      title: "Data Analyst",
      location: "Remote",
      type: "Full-Time",
      salary: "₹5–7 LPA",
      skills: "SQL • Python • Power BI",
    },
  ];

  return (
    <section className="jobs" id="jobs">

      <div className="jobs-header">

        <span>Latest Jobs</span>

        <h2>Explore Career Opportunities</h2>

        <p>
          Browse the latest openings from companies looking for
          talented professionals.
        </p>

      </div>

      <div className="job-search">

        <input
          type="text"
          placeholder="Search jobs..."
        />

        <select>
          <option>Location</option>
          <option>Remote</option>
          <option>Calicut</option>
          <option>Kochi</option>
          <option>Bangalore</option>
        </select>

        <select>
          <option>Job Type</option>
          <option>Full-Time</option>
          <option>Part-Time</option>
          <option>Hybrid</option>
        </select>

      </div>

      <div className="jobs-grid">

        {jobs.map((job, index) => (

          <div className="job-card" key={index}>

            <h3>{job.title}</h3>

            <p>
              <FaMapMarkerAlt /> {job.location}
            </p>

            <p>
              <FaBriefcase /> {job.type}
            </p>

            <p>
              <FaMoneyBillWave /> {job.salary}
            </p>

            <div className="skills">
              {job.skills}
            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Jobs;