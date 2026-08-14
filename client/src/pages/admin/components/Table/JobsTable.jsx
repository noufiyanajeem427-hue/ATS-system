import "./JobsTable.css";
import { useEffect, useState } from "react";
import axios from "axios";

function JobsTable() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5001/api/admin/latest-jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Latest Jobs Response:", res.data);

      setJobs(res.data.jobs || []);

    } catch (err) {
      console.error("Latest Jobs Error:", err);
      setJobs([]);
    }
  };

  return (
    <div className="jobs-table-card">

      <div className="table-header">
        <h3>Latest Jobs</h3>
      </div>

      <table>

        <thead>
          <tr>
            <th>Job Title</th>
            <th>Company</th>
            <th>Applications</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {jobs.length > 0 ? (

            jobs.map((job) => (
              <tr key={job._id}>

                <td>{job.title}</td>

                <td>{job.company}</td>

                <td>{job.applicationCount}</td>

                <td>
                  <span
                    className={
                      job.status === "Open"
                        ? "status open"
                        : "status closed"
                    }
                  >
                    {job.status}
                  </span>
                </td>

              </tr>
            ))

          ) : (

            <tr>
              <td colSpan="4">
                No jobs available
              </td>
            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
}

export default JobsTable;