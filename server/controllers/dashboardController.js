const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");
const Interview = require("../models/Interview");

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user;
    const userFilter = userId ? { user: userId } : {};

    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments(userFilter);
    const pendingApplications = await Application.countDocuments({
      ...userFilter,
      status: { $in: ["Pending", "IN REVIEW", "In Review"] },
    });
    const interviewingApplications = await Application.countDocuments({
      ...userFilter,
      status: { $in: ["INTERVIEWING", "Interviewing", "Shortlisted", "SHORTLISTED"] },
    });
    const activeApplications = await Application.countDocuments({
      ...userFilter,
      status: { $in: ["Pending", "IN REVIEW", "In Review", "INTERVIEWING", "Interviewing", "Shortlisted", "SHORTLISTED", "APPLIED", "Applied"] },
    });
    const offersCount = await Application.countDocuments({
      ...userFilter,
      status: { $in: ["Offer Received", "OFFER RECEIVED", "Offer", "OFFER"] },
    });
    const savedJobsCount = await SavedJob.countDocuments(userFilter);

    // Total interviews count
    let interviewFilter = {};
    if (userId) {
      const userApps = await Application.find({ user: userId }).select("_id");
      const userAppIds = userApps.map((a) => a._id);
      interviewFilter = { application: { $in: userAppIds } };
    }
    const scheduledInterviewsCount = await Interview.countDocuments({
      ...interviewFilter,
      status: "Scheduled",
    });
    const totalInterviewsCount = await Interview.countDocuments(interviewFilter);

    // Fetch recent applications
    const recentApplications = await Application.find(userFilter)
      .populate("job")
      .sort({ createdAt: -1 })
      .limit(5);

    // Fetch recommended/recent jobs
    const recommendedJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      totalUsers,
      totalJobs,
      totalApplications,
      activeApplications,
      pendingApplications,
      interviewingApplications,
      offersCount,
      savedJobsCount,
      scheduledInterviewsCount: scheduledInterviewsCount || interviewingApplications,
      totalInterviewsCount: totalInterviewsCount || interviewingApplications,
      recentApplications,
      recommendedJobs,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { getDashboardStats };