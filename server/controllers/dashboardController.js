const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const mongoose = require("mongoose");

const isMongoConnected = () => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

const getDashboardStats = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const totalUsers = await User.countDocuments();
      const totalJobs = await Job.countDocuments();
      const totalApplications = await Application.countDocuments();
      const pendingApplications = await Application.countDocuments({
        status: "Pending",
      });

      return res.status(200).json({
        totalUsers,
        totalJobs,
        totalApplications,
        pendingApplications,
      });
    }

    return res.status(200).json({
      totalUsers: 1,
      totalJobs: 5,
      totalApplications: 12,
      pendingApplications: 3,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { getDashboardStats };