import "./PendingFeedback.css";
import {
  FaUserCircle,
  FaChevronRight,
} from "react-icons/fa";

function PendingFeedback() {

  const feedbacks = [

    {
      name: "Liam Peterson",
      role: "UI Designer",
      interviewer: "Hiring Lead",
      due: "Today"
    },

    {
      name: "Elena Vance",
      role: "Frontend Developer",
      interviewer: "HR Manager",
      due: "1 day ago"
    }

  ];

  return (

    <div className="feedback-card">

      <div className="feedback-header">

        <h3>Pending Feedback</h3>

        <span>2 Overdue</span>

      </div>

      {feedbacks.map((item, index) => (

        <div className="feedback-item" key={index}>

          <div className="feedback-left">

            <div className="feedback-avatar">
              <FaUserCircle />
            </div>

            <div>

              <h4>{item.name}</h4>

              <p>{item.role}</p>

              <small>{item.interviewer}</small>

            </div>

          </div>

          <div className="feedback-right">

            <span>{item.due}</span>

            <FaChevronRight />

          </div>

        </div>

      ))}

    </div>

  );

}

export default PendingFeedback;