import "./ReportsCards.css";

import {
  FaFileAlt,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

function ReportsCards({ data = [] }) {
  const icons = {
    blue: FaFileAlt,
    purple: FaUsers,
    green: FaCheckCircle,
    red: FaTimesCircle,
  };

  if (!Array.isArray(data)) {
    return null;
  }

  return (
    <div className="reports-cards">

      {data.map((card, index) => {
        const Icon =
          icons[card.color] || FaFileAlt;

        return (
          <div
            className="report-card"
            key={index}
          >

            <div
              className={`report-icon ${card.color}`}
            >
              <Icon />
            </div>

            <div className="report-card-info">

              <h2>{card.value}</h2>

              <p>{card.title}</p>

            </div>

          </div>
        );
      })}

    </div>
  );
}

export default ReportsCards;