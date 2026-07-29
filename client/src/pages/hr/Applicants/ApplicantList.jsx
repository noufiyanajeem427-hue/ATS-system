import "./ApplicantList.css";

import ApplicantHeader from "./components/ApplicantHeader";
import ApplicantStats from "./components/ApplicantStats";
import ApplicantFilters from "./components/ApplicantFilters";
import ApplicantTable from "./components/ApplicantTable";

function ApplicantList() {
  return (
    <div className="applicant-page">

      <ApplicantHeader />

      <div className="page-title">
        <h1>Applications</h1>
        <p>
          Manage and track candidate progress across all active job openings.
        </p>
      </div>

      <div className="cards">
        <ApplicantStats />
      </div>

      <ApplicantFilters />

      <ApplicantTable />

    </div>
  );
}

export default ApplicantList;