import "./InterviewCard.css";
import {
  FaUserCircle,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";

function InterviewCard({
  name,
  role,
  team,
  time,
  status,
  aiMatch,
}) {
  return (
    <div className="interview-card">

      <div className="card-left">

        <div className="candidate-image">
          <FaUserCircle />
        </div>

        <div className="candidate-details">

          <h3>{name}</h3>

          <p>{role}</p>

          <span>{team}</span>

        </div>

      </div>

      <div className="card-center">

        <small>Interview</small>

        <h4>{time}</h4>

        <span>{status}</span>

      </div>

      <div className="card-right">

        <div className="ai-match">

          <span>AI Match</span>

          <h3>{aiMatch}</h3>

        </div>

        <button>
          <FaArrowRight />
        </button>

      </div>

    </div>
  );
}

export default InterviewCard;