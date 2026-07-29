import { Routes, Route } from "react-router-dom";

import Home from "./pages/Landing/Home";
import Login from "./pages/Landing/Login";
import Register from "./pages/Landing/Register";
import ForgotPassword from "./pages/Landing/ForgotPassword";
import ResetPassword from "./pages/Landing/ResetPassword";
import AboutPage from "./pages/Landing/AboutPage";
import HRDashboard from "./pages/hr/HRDashboard";
import CandidateDashboard from "./pages/candidate/Dashboard/CandidateDashboard";
import AdminDashboard from "./pages/admin/Dashboard/AdminDashboard";
import UserManagement from "./pages/admin/Users/UserManagement";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password"element={<ForgotPassword />} />   
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/hr/dashboard" element={<HRDashboard />} />
      <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<UserManagement />} />
    </Routes>
  );
}

export default App;