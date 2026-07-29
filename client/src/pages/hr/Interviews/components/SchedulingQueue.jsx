import "./SchedulingQueue.css";
import {
  FaUserCircle,
  FaCalendarPlus,
  FaClock,
} from "react-icons/fa";

function SchedulingQueue() {

  const queue = [

    {
      name: "James Wilson",
      role: "Backend Developer",
      stage: "Technical Round",
    },

    {
      name: "Sophia Carter",
      role: "Product Designer",
      stage: "HR Interview",
    },

    {
      name: "Daniel Lee",
      role: "QA Engineer",
      stage: "Final Round",
    },

  ];

  return (

    <div className="queue-card">

      <div className="queue-header">

        <h3>Scheduling Queue</h3>

        <span>3 Waiting</span>

      </div>

      {queue.map((candidate, index) => (

        <div className="queue-item" key={index}>

          <div className="queue-left">

            <div className="queue-avatar">
              <FaUserCircle />
            </div>

            <div>

              <h4>{candidate.name}</h4>

              <p>{candidate.role}</p>

              <small>{candidate.stage}</small>

            </div>

          </div>

          <button className="schedule-now">

            <FaCalendarPlus />

            Schedule

          </button>

        </div>

      ))}

      <button className="find-time-btn">

        <FaClock />

        Find Best Time

      </button>

    </div>

  );

}

export default SchedulingQueue;