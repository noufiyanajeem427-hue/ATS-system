import { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

import {
  FaUsers,
  FaUserTie,
  FaUserGraduate,
  FaBriefcase,
} from "react-icons/fa";

import Header from "../components/Header/Header";
import AdminSidebar from "../components/Sidebar/AdminSidebar";
import StatCard from "../components/StatCard/StatCard";
import RecentActivity from "../components/RecentActivity/RecentActivity";
import JobsTable from "../components/Table/JobsTable";
import RecentUsers from "../components/RecentUsers/RecentUsers";
import QuickActions from "../components/QuickActions/QuickActions";

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState({
    totalUsers: 0,
    recruiters: 0,
    candidates: 0,
    activeJobs: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("========== DASHBOARD ==========");
      console.log("Token:", token);

      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      const res = await axios.get(
        "http://localhost:5001/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Dashboard API response:", res.data);

      setStats({
        totalUsers: Number(res.data.totalUsers) || 0,
        recruiters: Number(res.data.recruiters) || 0,
        candidates: Number(res.data.candidates) || 0,
        activeJobs: Number(res.data.activeJobs) || 0,
      });

      console.log("Dashboard stats updated.");

    } catch (error) {
      console.error("========== DASHBOARD ERROR ==========");
      console.error(error);
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);
    }
  };

  return (
    <>
      <Header
        openSidebar={() => setSidebarOpen(true)}
        onSearch={(value) => {
          console.log("Admin Search:", value);
        }}
      />
      <AdminSidebar
        isOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      <main className="admin-main">

        <section className="dashboard-content">

          <h1>Welcome back, Admin 👋</h1>

          <p>
            Here's what's happening today.
          </p>

          <div className="stats-grid">

            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<FaUsers />}
            />

            <StatCard
              title="Recruiters"
              value={stats.recruiters}
              icon={<FaUserTie />}
            />

            <StatCard
              title="Candidates"
              value={stats.candidates}
              icon={<FaUserGraduate />}
            />

            <StatCard
              title="Active Jobs"
              value={stats.activeJobs}
              icon={<FaBriefcase />}
            />

          </div>

            <RecentActivity />

          <JobsTable />

          <RecentUsers />

          <QuickActions />

        </section>

      </main>
    </>
  );
}

export default AdminDashboard;