const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const savedJobRoutes = require("./routes/savedJobRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const userProfileRoutes = require("./routes/userProfileRoutes");
const resumeAnalysisRoutes = require("./routes/resumeAnalysisRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const companyRoutes = require("./routes/companyRoutes");
const path = require("path");

const app = express();
connectDB();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/interviews", interviewRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/user-profile", userProfileRoutes);
app.use("/api/resume-analysis", resumeAnalysisRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
console.log("Auth routes loaded successfully");

app.get("/", (req, res) => {
  res.send("THISIS MY SERVER");
});

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});