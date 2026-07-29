import { Link } from "react-router-dom";
import { FaEye, FaFilePdf } from "react-icons/fa";
import "./ApplicantTable.css";

function ApplicantTable() {

  const applicants = [
    {
      id: 1,
      name: "Noufiya Najeem",
      job: "Python Developer",
      date: "21 Jul 2026",
      score: "95%",
      status: "Shortlisted",
    },
    {
      id: 2,
      name: "Ayan Khan",
      job: "Frontend Developer",
      date: "20 Jul 2026",
      score: "88%",
      status: "Interview",
    },
    {
      id: 3,
      name: "Rahul Raj",
      job: "Backend Developer",
      date: "19 Jul 2026",
      score: "72%",
      status: "Applied",
    },
    {
      id: 4,
      name: "Sara Joseph",
      job: "UI/UX Designer",
      date: "18 Jul 2026",
      score: "64%",
      status: "Rejected",
    },
  ];

  return (
    <div className="table-wrapper">
      <table className="applicant-table">

        <thead>
          <tr>
            <th>Candidate</th>
            <th>Job</th>
            <th>Applied</th>
            <th>AI Score</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {applicants.map((applicant) => (

            <tr key={applicant.id}>

              <td>{applicant.name}</td>

              <td>{applicant.job}</td>

              <td>{applicant.date}</td>

              <td>
                <span className="score">
                  {applicant.score}
                </span>
              </td>

              <td>
                <span
                  className={`status ${applicant.status.toLowerCase()}`}
                >
                  {applicant.status}
                </span>
              </td>

              <td className="actions">

                <Link to={`/hr/applicants/${applicant.id}`}>
                  <FaEye />
                </Link>

                <Link to={`/hr/resume/${applicant.id}`}>
                  <FaFilePdf />
                </Link>

              </td>

            </tr>

          ))}

        </tbody>

      </table>
    </div>
  );
}

export default ApplicantTable;