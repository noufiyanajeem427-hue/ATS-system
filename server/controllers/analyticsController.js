const User = require("../models/user");
const Job = require("../models/job");
const Application = require("../models/application");
const Interview = require("../models/interview");

// ==========================================
// ANALYTICS DASHBOARD
// ==========================================

const getAnalytics = async (req, res) => {
  try {
    // --------------------------------------
    // 1. CARDS
    // --------------------------------------

    const totalUsers = await User.countDocuments();

    const activeJobs = await Job.countDocuments({
      status: "Open",
    });

    const totalApplications = await Application.countDocuments();

    const totalHired = await Application.countDocuments({
      status: "Hired",
    });

    // --------------------------------------
    // 2. APPLICATIONS PER MONTH
    // --------------------------------------

    const applicationsPerMonth = await Application.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          applications: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const applicationsChart = applicationsPerMonth.map((item) => ({
      month: monthNames[item._id.month - 1],
      applications: item.applications,
    }));

    // --------------------------------------
    // 3. CANDIDATE / APPLICATION STATUS
    // --------------------------------------

    const statusData = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          value: {
            $sum: 1,
          },
        },
      },
    ]);

    const statusOrder = [
      "Pending",
      "Shortlisted",
      "Interview",
      "Hired",
      "Rejected",
    ];

    const candidateStatus = statusOrder.map((status) => {
      const found = statusData.find(
        (item) => item._id === status
      );

      return {
        name: status,
        value: found ? found.value : 0,
      };
    });

    // --------------------------------------
    // 4. RECRUITMENT / HIRED TREND
    // --------------------------------------

    const hiredPerMonth = await Application.aggregate([
      {
        $match: {
          status: "Hired",
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          hired: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const recruitmentTrend = hiredPerMonth.map((item) => ({
      month: monthNames[item._id.month - 1],
      hired: item.hired,
    }));

    // --------------------------------------
    // 5. JOB PERFORMANCE
    // --------------------------------------

    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .lean();

    const jobPerformance = await Promise.all(
      jobs.map(async (job) => {
        const applications = await Application.countDocuments({
          job: job._id,
        });

        const interviews = await Application.countDocuments({
          job: job._id,
          status: "Interview",
        });

        const hired = await Application.countDocuments({
          job: job._id,
          status: "Hired",
        });

        return {
          _id: job._id,
          title: job.title,
          applications,
          interviews,
          hired,
          status: job.status,
        };
      })
    );

    // --------------------------------------
    // RESPONSE
    // --------------------------------------

    res.status(200).json({
  success: true,

  cards: [
    {
      title: "Total Users",
      value: totalUsers,
      color: "blue",
    },

    {
      title: "Active Jobs",
      value: activeJobs,
      color: "purple",
    },

    {
      title: "Applications",
      value: totalApplications,
      color: "orange",
    },

    {
      title: "Hired",
      value: totalHired,
      color: "green",
    },
  ],

  applicationsChart,

  candidateStatus,

  recruitmentTrend,

  jobPerformance,
});
  } catch (error) {
    console.error("Analytics Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load analytics data.",
      error: error.message,
    });
  }
};

module.exports = {
  getAnalytics,
};