import "./HowItWorks.css";
import {
  FaBriefcase,
  FaFileAlt,
  FaRobot,
  FaClipboardCheck,
  FaCalendarAlt,
  FaAward,
} from "react-icons/fa";

function HowItWorks() {

  const steps = [
    {
      icon: <FaBriefcase />,
      title: "Create Job",
      text: "Recruiters post job openings with role details and requirements."
    },
    {
      icon: <FaFileAlt />,
      title: "Apply for Jobs",
      text: "Candidates submit their applications and resumes."
    },
    {
      icon: <FaRobot />,
      title: "AI Screening",
      text: "AI analyzes resumes and matches candidates to the job."
    },
    {
      icon: <FaClipboardCheck />,
      title: "Shortlisting",
      text: "Recruiters review AI recommendations and shortlist candidates."
    },
    {
      icon: <FaCalendarAlt />,
      title: "Interview",
      text: "Selected candidates are invited for interviews."
    },
    {
      icon: <FaAward />,
      title: "Successful Hiring",
      text: "The best candidate is selected and offered the position."
    },
  ];

  return (
    <section className="how-it-works" id="how-it-works">

      <div className="how-header">

        <span>How It Works</span>

        <h2>Your Hiring Journey in 6 Simple Steps</h2>

        <p>
          NexHire streamlines the recruitment process, making hiring faster,
          smarter, and more efficient for everyone.
        </p>

      </div>

      <div className="steps-container">

        {steps.map((step, index) => (
          <div className="step-card" key={index}>

            <div className="step-icon">
              {step.icon}
            </div>

            <h3>{step.title}</h3>

            <p>{step.text}</p>

          </div>
        ))}

      </div>

    </section>
  );
}

export default HowItWorks;