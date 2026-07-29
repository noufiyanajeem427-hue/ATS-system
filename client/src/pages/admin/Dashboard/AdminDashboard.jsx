import { useState } from "react";
import "./AdminDashboard.css";
import {
  FaUsers,
  FaUserTie,
  FaUserGraduate,
  FaBriefcase,
} from "react-icons/fa";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/AdminSidebar";
import StatCard from "../components/StatCard/StatCard";
import RecentActivity from "../components/RecentActivity/RecentActivity";
import QuickStats from "../components/QuickStats/QuickStats";
import JobsTable from "../components/Table/JobsTable";
import RecentUsers from "../components/RecentUsers/RecentUsers";
import QuickActions from "../components/QuickActions/QuickActions";

function AdminDashboard() {

    const [isOpen, setIsOpen] = useState(false);

    return (

        <div className="admin-dashboard">

            <Header
                openSidebar={() => setIsOpen(true)}
            />

            <Sidebar
                isOpen={isOpen}
                closeSidebar={() => setIsOpen(false)}
            />
            <section className="dashboard-content">
                <h1>Welcome back, Admin 👋</h1>

                <p>Here's what's happening today.</p>

                <div className="stats-grid">

                    <StatCard
                        title="Total Users"
                        value="245"
                        icon={<FaUsers />}
                    />

                    <StatCard
                        title="Recruiters"
                        value="32"
                        icon={<FaUserTie />}
                    />

                    <StatCard
                        title="Candidates"
                        value="213"
                        icon={<FaUserGraduate />}
                    />

                    <StatCard
                        title="Active Jobs"
                        value="18"
                        icon={<FaBriefcase />}
                    />

                </div>
            </section>
            <div className="dashboard-grid">
                <RecentActivity />
                <QuickStats />
            </div>
            <JobsTable />
            <RecentUsers />
            <QuickActions />
        </div>

    );
}

export default AdminDashboard;