import "./ReportsTable.css";

function ReportsTable({ data = [] }) {
  if (!Array.isArray(data)) {
    return null;
  }

  return (
    <div className="reports-table-section">

      <h2>Job Reports</h2>

      <div className="reports-table-wrapper">

        <table className="reports-table">

          <thead>
            <tr>
              <th>Job</th>
              <th>Company</th>
              <th>Applications</th>
              <th>Shortlisted</th>
              <th>Interviews</th>
              <th>Hired</th>
              <th>Rejected</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {data.length === 0 ? (

              <tr>
                <td colSpan="8" className="empty-table">
                  No job report data available.
                </td>
              </tr>

            ) : (

              data.map((job) => (

                <tr key={job._id}>

                  <td>{job.title}</td>

                  <td>{job.company || "-"}</td>

                  <td>{job.applications || 0}</td>

                  <td>{job.shortlisted || 0}</td>

                  <td>{job.interviews || 0}</td>

                  <td>{job.hired || 0}</td>

                  <td>{job.rejected || 0}</td>

                  <td>
                    <span
                      className={`job-status ${
                        job.status === "Open"
                          ? "open"
                          : "closed"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ReportsTable;