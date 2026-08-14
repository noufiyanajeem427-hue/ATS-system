import { useEffect, useState } from "react";
import axios from "axios";

import "./Analytics.css";

import Header from "../components/Header/Header";
import AdminSidebar from "../components/Sidebar/AdminSidebar";

import AnalyticsCards from "./components/AnalyticsCards";
import ApplicationsChart from "./components/ApplicationsChart";
import CandidatePieChart from "./components/CandidatePieChart";
import RecruitmentTrend from "./components/RecruitmentTrend";
import AnalyticsTable from "./components/AnalyticsTable";

function Analytics() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [analyticsData, setAnalyticsData] = useState({
    cards: [],
    applicationsPerMonth: [],
    statusData: [],
    recruitmentTrend: [],
    jobPerformance: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:5001/api/analytics"
      );

      console.log("ANALYTICS RESPONSE:", response.data);

      if (response.data.success) {
        /*
          Handles these possible backend structures:

          response.data
          response.data.data
          response.data.analytics
        */

        const result =
          response.data.data ||
          response.data.analytics ||
          response.data;

        console.log("ANALYTICS RESULT:", result);

        setAnalyticsData({
          cards: Array.isArray(result.cards)
            ? result.cards
            : [],

          applicationsPerMonth: Array.isArray(
            result.applicationsPerMonth
          )
            ? result.applicationsPerMonth
            : Array.isArray(result.applicationsChart)
            ? result.applicationsChart
            : [],

          statusData: Array.isArray(result.statusData)
            ? result.statusData
            : Array.isArray(result.candidateStatus)
            ? result.candidateStatus
            : [],

          recruitmentTrend: Array.isArray(
            result.recruitmentTrend
          )
            ? result.recruitmentTrend
            : [],

          jobPerformance: Array.isArray(
            result.jobPerformance
          )
            ? result.jobPerformance
            : [],
        });
      } else {
        setError("Failed to load analytics data.");
      }
    } catch (err) {
      console.error("Analytics Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load analytics data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <>
        <AdminSidebar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />

        <div className="admin-main">
          <Header
            openSidebar={() => setSidebarOpen(true)}
          />

          <section className="analytics-page">
            <div className="analytics-header">
              <h1>Analytics Dashboard</h1>

              <p>
                Track recruitment performance and hiring
                insights.
              </p>
            </div>

            <div className="analytics-loading">
              Loading analytics...
            </div>
          </section>
        </div>
      </>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <>
        <AdminSidebar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />

        <div className="admin-main">
          <Header
            openSidebar={() => setSidebarOpen(true)}
          />

          <section className="analytics-page">
            <div className="analytics-header">
              <h1>Analytics Dashboard</h1>

              <p>
                Track recruitment performance and hiring
                insights.
              </p>
            </div>

            <div className="analytics-error">
              <p>{error}</p>

              <button onClick={fetchAnalytics}>
                Try Again
              </button>
            </div>
          </section>
        </div>
      </>
    );
  }

  // =========================
  // MAIN PAGE
  // =========================

  return (
    <>
      <AdminSidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      <div className="admin-main">
        <Header
          openSidebar={() => setSidebarOpen(true)}
        />

        <section className="analytics-page">

          {/* HEADER */}

          <div className="analytics-header">
            <h1>Analytics Dashboard</h1>

            <p>
              Track recruitment performance and hiring
              insights.
            </p>
          </div>


          {/* =========================
              ANALYTICS CARDS
          ========================= */}

          <AnalyticsCards
  data={analyticsData.cards}
/>

          {/* =========================
              CHARTS
          ========================= */}

          <div className="analytics-chart-grid">

            <div className="analytics-chart-card">
              <ApplicationsChart
                data={analyticsData.applicationsPerMonth}
              />
            </div>


            <div className="analytics-chart-card">
              <CandidatePieChart
                data={analyticsData.statusData}
              />
            </div>

          </div>


          {/* =========================
              RECRUITMENT TREND
          ========================= */}

          <div className="analytics-chart-card full-width">

            <RecruitmentTrend
              data={analyticsData.recruitmentTrend}
            />

          </div>


          {/* =========================
              JOB PERFORMANCE
          ========================= */}

          <AnalyticsTable
            jobs={analyticsData.jobPerformance}
          />

        </section>
      </div>
    </>
  );
}

export default Analytics;