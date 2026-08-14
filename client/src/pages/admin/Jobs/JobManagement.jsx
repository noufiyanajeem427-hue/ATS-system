import "./JobManagement.css";

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header/Header";
import AdminSidebar from "../components/Sidebar/AdminSidebar";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
} from "react-icons/fa";

function JobManagement() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  // ==========================================
  // FETCH JOBS
  // ==========================================

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5001/api/jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Jobs Response:", response.data);

      setJobs(response.data.jobs || []);

    } catch (error) {
      console.error("Failed to load jobs:", error);

      if (error.response?.status === 401) {
        alert("Your session has expired. Please login again.");
      }

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD JOBS WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    fetchJobs();
  }, []);

  // ==========================================
  // DELETE JOB
  // ==========================================

  const handleDeleteJob = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5001/api/jobs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Job deleted successfully!");

      await fetchJobs();

    } catch (error) {
      console.error("Failed to delete job:", error);

      alert(
        error.response?.data?.message ||
        "Failed to delete job"
      );
    }
  };

  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  const filteredJobs = jobs.filter((job) => {

    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !search ||
      job.title?.toLowerCase().includes(search) ||
      job.company?.toLowerCase().includes(search) ||
      job.location?.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "All" ||
      job.status === statusFilter;

    const matchesType =
      typeFilter === "All" ||
      job.type === typeFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesType
    );
  });

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setTypeFilter("All");
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <>
      {/* ADMIN SIDEBAR */}

      <AdminSidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      {/* MAIN AREA */}

      <div className="admin-main">

        {/* HEADER */}

        <Header
          openSidebar={() => setSidebarOpen(true)}
        />

        {/* JOB MANAGEMENT */}

        <section className="job-management">

          {/* ==========================================
              PAGE HEADER
          ========================================== */}

          <div className="job-header">

            <div className="job-title">

              <h1>Job Management</h1>

              <p>
                Manage all recruitment jobs from one place.
              </p>

            </div>

            {/* ADD NEW JOB */}

            <button
              className="add-job-btn"
              onClick={() => navigate("/admin/jobs/add")}
            >
              <FaPlus />
              Add New Job
            </button>

          </div>


          {/* ==========================================
              TOOLBAR
          ========================================== */}

          <div className="job-toolbar">

            {/* SEARCH */}

            <div className="search-box-job">

              <FaSearch />

              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />

            </div>


            {/* FILTERS */}

            <div className="job-filters">

              {/* STATUS */}

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
              >

                <option value="All">
                  All Status
                </option>

                <option value="Open">
                  Open
                </option>

                <option value="Closed">
                  Closed
                </option>

              </select>


              {/* TYPE */}

              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value)
                }
              >

                <option value="All">
                  All Types
                </option>

                <option value="Full Time">
                  Full Time
                </option>

                <option value="Part Time">
                  Part Time
                </option>

                <option value="Internship">
                  Internship
                </option>

                <option value="Remote">
                  Remote
                </option>

              </select>


              {/* CLEAR */}

              {(searchTerm ||
                statusFilter !== "All" ||
                typeFilter !== "All") && (

                <button
                  type="button"
                  onClick={clearFilters}
                  className="clear-filter-btn"
                >
                  Clear
                </button>

              )}

            </div>

          </div>


          {/* ==========================================
              JOB TABLE
          ========================================== */}

          <div className="job-table-card">

            {loading ? (

              <div className="loading-message">
                Loading jobs...
              </div>

            ) : (

              <table className="jobs-table">

                <thead>

                  <tr>

                    <th>Job Title</th>

                    <th>Company</th>

                    <th>Location</th>

                    <th>Type</th>

                    <th>Applicants</th>

                    <th>Status</th>

                    <th>Actions</th>

                  </tr>

                </thead>


                <tbody>

                  {filteredJobs.length > 0 ? (

                    filteredJobs.map((job) => (

                      <tr key={job._id}>

                        {/* JOB TITLE */}

                        <td>
                          {job.title}
                        </td>


                        {/* COMPANY */}

                        <td>
                          {job.company}
                        </td>


                        {/* LOCATION */}

                        <td>
                          {job.location}
                        </td>


                        {/* TYPE */}

                        <td>
                          {job.type || "Full Time"}
                        </td>


                        {/* APPLICANTS */}

                        <td>
                          {job.applicants || 0}
                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`status ${
                              job.status === "Open"
                                ? "active"
                                : "closed"
                            }`}
                          >
                            {job.status || "Open"}
                          </span>

                        </td>


                        {/* ACTIONS */}

                        <td>

                          {/* EDIT */}

                          <button
                            type="button"
                            title="Edit Job"
                            onClick={() => {
                              alert(
                                "Edit functionality will be connected next."
                              );
                            }}
                          >
                            <FaEdit />
                          </button>


                          {/* DELETE */}

                          <button
                            type="button"
                            title="Delete Job"
                            onClick={() =>
                              handleDeleteJob(job._id)
                            }
                          >
                            <FaTrash />
                          </button>

                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>

                      <td
                        colSpan="7"
                        style={{
                          textAlign: "center",
                          padding: "30px",
                        }}
                      >

                        {jobs.length === 0
                          ? "No jobs found."
                          : "No jobs match your search or filters."}

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            )}

          </div>

        </section>

      </div>
    </>
  );
}

export default JobManagement;