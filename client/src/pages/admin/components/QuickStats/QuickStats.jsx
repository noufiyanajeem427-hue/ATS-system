import "./QuickStats.css";

import {
  FaUsers,
  FaUserTie,
  FaUserGraduate,
  FaBriefcase,
} from "react-icons/fa";

function QuickStats({ stats }) {
  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: <FaUsers />,
    },
    {
      title: "Recruiters",
      value: stats?.recruiters ?? 0,
      icon: <FaUserTie />,
    },
    {
      title: "Candidates",
      value: stats?.candidates ?? 0,
      icon: <FaUserGraduate />,
    },
    {
      title: "Active Jobs",
      value: stats?.activeJobs ?? 0,
      icon: <FaBriefcase />,
    },
  ];

  return (
    <div className="quick-stats">
      {statCards.map((stat, index) => (
        <div className="stat-card" key={index}>
          <div className="stat-icon">
            {stat.icon}
          </div>

          <div className="stat-info">
            <h4>{stat.title}</h4>
            <h2>{stat.value}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}

export default QuickStats;