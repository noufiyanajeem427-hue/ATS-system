import "./MonthlySummary.css";

import {
  FaFileAlt,
  FaUserCheck,
  FaHandshake,
  FaBriefcase,
} from "react-icons/fa";

function MonthlySummary({ data = [] }) {

  if (!Array.isArray(data)) {
    return null;
  }

  return (
    <div className="monthly-summary">

      <h2>Monthly Recruitment Summary</h2>

      {data.length === 0 ? (
        <p className="empty-summary">
          No monthly recruitment data available.
        </p>
      ) : (
        data.map((month, index) => (

          <div
            className="monthly-summary-row"
            key={`${month.year}-${month.month}-${index}`}
          >

            <h3>
              {month.month} {month.year}
            </h3>

            <div className="summary-grid">

              <div className="summary-card">

                <div className="summary-icon">
                  <FaFileAlt />
                </div>

                <h3>
                  {month.applications}
                </h3>

                <p>
                  Applications
                </p>

              </div>

              <div className="summary-card">

                <div className="summary-icon">
                  <FaUserCheck />
                </div>

                <h3>
                  {month.shortlisted}
                </h3>

                <p>
                  Shortlisted
                </p>

              </div>

              <div className="summary-card">

                <div className="summary-icon">
                  <FaHandshake />
                </div>

                <h3>
                  {month.interviews}
                </h3>

                <p>
                  Interviews
                </p>

              </div>

              <div className="summary-card">

                <div className="summary-icon">
                  <FaBriefcase />
                </div>

                <h3>
                  {month.hired}
                </h3>

                <p>
                  Hired
                </p>

              </div>

            </div>

          </div>

        ))
      )}

    </div>
  );
}

export default MonthlySummary;