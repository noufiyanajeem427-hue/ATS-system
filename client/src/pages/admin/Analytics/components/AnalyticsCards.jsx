import "./AnalyticsCards.css";

import {
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaCheckCircle,
} from "react-icons/fa";

function AnalyticsCards({ data = [] }) {
  const icons = {
    blue: FaUsers,
    purple: FaBriefcase,
    orange: FaFileAlt,
    green: FaCheckCircle,
  };

  if (!Array.isArray(data)) {
    return null;
  }

  return (
    <div className="analytics-cards">

      {data.map((card, index) => {
        const Icon = icons[card.color] || FaUsers;

        return (
          <div className="analytics-card" key={index}>

            <div
              className={`analytics-icon ${card.color}`}
            >
              <Icon />
            </div>

            <div className="analytics-info">

              <h3>{card.value}</h3>

              <p>{card.title}</p>

            </div>

          </div>
        );
      })}

    </div>
  );
}

export default AnalyticsCards;