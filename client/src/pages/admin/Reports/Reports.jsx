import { useEffect, useState } from "react";
import axios from "axios";

import "./Reports.css";

import Header from "../components/Header/Header";
import AdminSidebar from "../components/Sidebar/AdminSidebar";

import ReportsCards from "./components/ReportsCards";
import DownloadReports from "./components/DownloadReports";
import MonthlySummary from "./components/MonthlySummary";
import ReportsTable from "./components/ReportsTable";

function Reports() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [reportsData, setReportsData] = useState({
    cards: [],
    monthlySummary: [],
    jobReports: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH REPORTS
  // ==========================================

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:5001/api/reports"
      );

      console.log("REPORTS RESPONSE:", response.data);

      if (response.data.success) {
        setReportsData({
          cards: Array.isArray(response.data.cards)
            ? response.data.cards
            : [],

          monthlySummary: Array.isArray(
            response.data.monthlySummary
          )
            ? response.data.monthlySummary
            : [],

          jobReports: Array.isArray(
            response.data.jobReports
          )
            ? response.data.jobReports
            : [],
        });
      } else {
        setError("Failed to load reports.");
      }
    } catch (err) {
      console.error("Reports Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load reports."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD REPORTS
  // ==========================================

  useEffect(() => {
    fetchReports();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="admin-dashboard">

        <AdminSidebar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />

        <div className="admin-main">

          <Header
            openSidebar={() => setSidebarOpen(true)}
          />

          <section className="reports-page">

            <div className="reports-header">
              <h1>Reports</h1>

              <p>
                Generate and download recruitment reports.
              </p>
            </div>

            <div className="reports-loading">
              Loading reports...
            </div>

          </section>

        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="admin-dashboard">

        <AdminSidebar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />

        <div className="admin-main">

          <Header
            openSidebar={() => setSidebarOpen(true)}
          />

          <section className="reports-page">

            <div className="reports-header">
              <h1>Reports</h1>

              <p>
                Generate and download recruitment reports.
              </p>
            </div>

            <div className="reports-error">

              <p>{error}</p>

              <button onClick={fetchReports}>
                Try Again
              </button>

            </div>

          </section>

        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}

      <AdminSidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      {/* MAIN */}

      <div className="admin-main">

        <Header
          openSidebar={() => setSidebarOpen(true)}
        />

        <section className="reports-page">

          {/* HEADER */}

          <div className="reports-header">

            <h1>Reports</h1>

            <p>
              Generate and download recruitment reports.
            </p>

          </div>

          {/* REPORT CARDS */}

          <ReportsCards
            data={reportsData.cards}
          />

          {/* DOWNLOAD */}

          <DownloadReports />

          {/* MONTHLY SUMMARY */}

          <MonthlySummary
            data={reportsData.monthlySummary}
          />

          {/* JOB REPORTS */}

          <ReportsTable
            data={reportsData.jobReports}
          />

        </section>

      </div>

    </div>
  );
}

export default Reports;