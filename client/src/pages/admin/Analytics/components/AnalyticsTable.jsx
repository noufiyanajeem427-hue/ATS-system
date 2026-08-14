import "./AnalyticsTable.css";

function AnalyticsTable({ jobs = [] }) {

  return (
    <div className="analytics-table-card">

      <h2>Job Performance</h2>

      <table className="analytics-table">

        <thead>
          <tr>
            <th>Job</th>
            <th>Applications</th>
            <th>Interviews</th>
            <th>Hired</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {Array.isArray(jobs) &&
          jobs.length > 0 ? (

            jobs.map((job, index) => (

              <tr key={job._id || index}>

                <td>
                  {job.title}
                </td>

                <td>
                  {job.applications}
                </td>

                <td>
                  {job.interviews}
                </td>

                <td>
                  {job.hired}
                </td>

                <td>

                  <span
                    className={
                      job.status === "Open"
                        ? "status-open"
                        : "status-closed"
                    }
                  >
                    {job.status}
                  </span>

                </td>

              </tr>

            ))

          ) : (

            <tr>
              <td
                colSpan="5"
                style={{
                  textAlign: "center",
                  padding: "30px",
                }}
              >
                No job data available.
              </td>
            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
}

export default AnalyticsTable;