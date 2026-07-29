import "./JobsTable.css";

function JobsTable() {

  const jobs = [
    {
      title: "Frontend Developer",
      company: "TechNova",
      applications: 42,
      status: "Open",
    },
    {
      title: "Software Tester",
      company: "Bluegen",
      applications: 28,
      status: "Open",
    },
    {
      title: "Python Developer",
      company: "Infotech",
      applications: 35,
      status: "Closed",
    },
    {
      title: "UI/UX Designer",
      company: "Creative Labs",
      applications: 19,
      status: "Open",
    },
  ];

  return (

    <div className="jobs-table-card">

      <div className="table-header">

        <h3>Latest Jobs</h3>

        <button>View All</button>

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

          {jobs.map((job,index)=>(

            <tr key={index}>

              <td>{job.title}</td>

              <td>{job.company}</td>

              <td>{job.applications}</td>

              <td>

                <span
                  className={
                    job.status==="Open"
                    ? "status open"
                    : "status closed"
                  }
                >
                  {job.status}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}

export default JobsTable;