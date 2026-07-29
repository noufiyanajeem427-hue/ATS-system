import "./RecentActivity.css";
import {
  FaUserPlus,
  FaBriefcase,
  FaCheckCircle,
  FaUserTie,
} from "react-icons/fa";

function RecentActivity() {

  const activities = [
    {
      icon: <FaUserPlus />,
      title: "New Candidate Registered",
      time: "5 mins ago",
    },
    {
      icon: <FaBriefcase />,
      title: "Software Tester Job Posted",
      time: "20 mins ago",
    },
    {
      icon: <FaCheckCircle />,
      title: "Interview Scheduled",
      time: "1 hour ago",
    },
    {
      icon: <FaUserTie />,
      title: "New Recruiter Joined",
      time: "Today",
    },
  ];

  return (

    <div className="activity-card">

      <h3>Recent Activity</h3>

      {activities.map((activity, index) => (

        <div className="activity-item" key={index}>

          <div className="activity-icon">
            {activity.icon}
          </div>

          <div>

            <h4>{activity.title}</h4>

            <p>{activity.time}</p>

          </div>

        </div>

      ))}

    </div>

  );
}

export default RecentActivity;