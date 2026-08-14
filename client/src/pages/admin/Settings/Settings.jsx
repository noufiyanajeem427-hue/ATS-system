import { useState } from "react";
import "./Settings.css";

import Header from "../components/Header/Header";
import AdminSidebar from "../components/Sidebar/AdminSidebar";

import ProfileSettings from "./components/ProfileSettings";
import SecuritySettings from "./components/SecuritySettings";
import NotificationSettings from "./components/NotificationSettings";
import ContactMessages from "./components/ContactMessages";

function Settings() {

    const [sidebarOpen, setSidebarOpen] = useState(false);

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

                <section className="settings-page">

                    <div className="settings-header">

                        <h1>Settings</h1>

                        <p>
                            Manage your profile and platform settings.
                        </p>

                    </div>

                    <ProfileSettings />

                    <SecuritySettings />

                    <NotificationSettings />

                    <ContactMessages />

                </section>

            </div>

        </div>

    );

}

export default Settings;