import {
  FaUsers,
  FaUserPlus,
  FaUserCheck,
  FaFileSignature,
} from "react-icons/fa";

import "./ApplicantStats.css";

function ApplicantStats() {
  const stats = [
    {
      title: "Total Applications",
      value: "1,248",
      icon: <FaUsers />,
    },
    {
      title: "New Today",
      value: "42",
      icon: <FaUserPlus />,
    },
    {
      title: "Shortlisted",
      value: "186",
      icon: <FaUserCheck />,
    },
    {
      title: "Offers Made",
      value: "12",
      icon: <FaFileSignature />,
    },
  ];

  return (
    <>
      {stats.map((item, index) => (
        <div className="stat-card" key={index}>

          <div className="stat-icon">
            {item.icon}
          </div>

          <div>
            <h4>{item.title}</h4>
            <h2>{item.value}</h2>
          </div>

        </div>
      ))}
    </>
  );
}

export default ApplicantStats;