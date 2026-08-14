const User = require("../models/user");
const Job = require("../models/job");
const Application = require("../models/application");
const bcrypt = require("bcryptjs");

// ==========================================
// ADMIN DASHBOARD
// ==========================================

const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const recruiters = await User.countDocuments({
      role: "hr",
    });

    const candidates = await User.countDocuments({
      role: "candidate",
    });

    const activeJobs = await Job.countDocuments({
      status: "Open",
    });

    res.status(200).json({
      success: true,
      totalUsers,
      recruiters,
      candidates,
      activeJobs,
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data.",
      error: error.message,
    });
  }
};

// ==========================================
// COMPLETE ANALYTICS
// ==========================================

const getAnalytics = async (req, res) => {
  try {
    // ==========================================
    // 1. CARDS
    // ==========================================

    const totalUsers = await User.countDocuments();

    const activeJobs = await Job.countDocuments({
      status: "Open",
    });

    const totalApplications = await Application.countDocuments();

    const hired = await Application.countDocuments({
      status: "Hired",
    });

    // ==========================================
    // 2. APPLICATIONS PER MONTH
    // ==========================================

    const applications = await Application.aggregate([
      {
        $match: {
          createdAt: { $exists: true },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
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

    const applicationsPerMonth = applications.map((item) => ({
      month: monthNames[item._id.month - 1],
      year: item._id.year,
      applications: item.applications,
    }));

    // ==========================================
    // 3. CANDIDATE STATUS
    // ==========================================

    const statusDataRaw = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const statusData = statusDataRaw.map((item) => ({
      name: item._id || "Pending",
      value: item.count,
    }));

    // ==========================================
    // 4. RECRUITMENT TREND
    // ==========================================

    const recruitmentRaw = await Application.aggregate([
      {
        $match: {
          status: "Hired",
          updatedAt: { $exists: true },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$updatedAt" },
            month: { $month: "$updatedAt" },
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

    const recruitmentTrend = recruitmentRaw.map((item) => ({
      month: monthNames[item._id.month - 1],
      year: item._id.year,
      hired: item.hired,
    }));

    // ==========================================
    // 5. JOB PERFORMANCE
    // ==========================================

    const jobs = await Job.find().lean();

    const jobPerformance = await Promise.all(
      jobs.map(async (job) => {
        const applicationsCount =
          await Application.countDocuments({
            job: job._id,
          });

        const interviewsCount =
          await Application.countDocuments({
            job: job._id,
            status: "Interview",
          });

        const hiredCount =
          await Application.countDocuments({
            job: job._id,
            status: "Hired",
          });

        return {
          _id: job._id,
          title: job.title || "Untitled Job",
          company: job.company || "Unknown Company",
          applications: applicationsCount,
          interviews: interviewsCount,
          hired: hiredCount,
          status: job.status || "Open",
        };
      })
    );

    // ==========================================
    // 6. FINAL RESPONSE
    // ==========================================

    const cards = [
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
        value: hired,
        color: "green",
      },
    ];

    res.status(200).json({
      success: true,
      cards,
      applicationsPerMonth,
      statusData,
      recruitmentTrend,
      jobPerformance,
    });
  } catch (error) {
    console.error("Complete Analytics Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load analytics data.",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL USERS
// ==========================================

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get Users Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// DELETE USER
// ==========================================

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE USER
// ==========================================

const updateUser = async (req, res) => {
  try {
    const { name, email, role, isVerified } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        role,
        isVerified,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Update User Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ==========================================
// GET RECENT USERS
// ==========================================

const getRecentUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Recent Users Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load recent users.",
      error: error.message,
    });
  }
};


const getLatestJobs = async (req, res) => {
  try {
    // Get the 5 newest jobs
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // Add real application count for every job
    const jobsWithApplications = await Promise.all(
      jobs.map(async (job) => {
        const applicationCount =
          await Application.countDocuments({
            job: job._id,
          });

        return {
          _id: job._id,
          title: job.title || "Untitled Job",
          company: job.company || "Unknown Company",
          applicationCount,
          status: job.status || "Open",
          createdAt: job.createdAt,
        };
      })
    );

    res.status(200).json({
      success: true,
      jobs: jobsWithApplications,
    });

  } catch (error) {
    console.error("Latest Jobs Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load latest jobs.",
      error: error.message,
    });
  }
};

const getRecentActivities = async (req, res) => {
  try {
    const activities = [];

    // ==============================
    // RECENT USERS
    // ==============================

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email role createdAt");

    recentUsers.forEach((user) => {
      activities.push({
        _id: `user-${user._id}`,
        type:
          user.role === "candidate"
            ? "candidate"
            : "recruiter",
        message:
          user.role === "candidate"
            ? `${user.name} registered as a candidate`
            : `${user.name} registered as a recruiter`,
        createdAt: user.createdAt,
      });
    });

    // ==============================
    // RECENT JOBS
    // ==============================

    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title company createdAt");

    recentJobs.forEach((job) => {
      activities.push({
        _id: `job-${job._id}`,
        type: "job",
        message: `New job posted: ${job.title}`,
        createdAt: job.createdAt,
      });
    });

    // ==============================
    // RECENT APPLICATIONS
    // ==============================

    const recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name")
      .populate("job", "title")
      .select("user job status createdAt");

    recentApplications.forEach((application) => {
      if (!application.user || !application.job) {
        return;
      }

      activities.push({
        _id: `application-${application._id}`,

        type:
          application.status === "Interview"
            ? "interview"
            : "candidate",

        message:
          application.status === "Interview"
            ? `${application.user.name} has an interview for ${application.job.title}`
            : `${application.user.name} applied for ${application.job.title}`,

        createdAt: application.createdAt,
      });
    });

    // ==============================
    // SORT ALL ACTIVITIES
    // ==============================

    activities.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

    // Only latest 5
    const latestActivities = activities.slice(0, 5);

    res.status(200).json({
      success: true,
      activities: latestActivities,
    });

  } catch (error) {
    console.error("Recent Activities Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch recent activities",
      error: error.message,
    });
  }
};

// ==========================================
// ADD RECRUITER
// ==========================================

const addRecruiter = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create recruiter
    const recruiter = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "hr",
    });

    res.status(201).json({
      success: true,
      message: "Recruiter added successfully.",
      recruiter: {
        _id: recruiter._id,
        name: recruiter.name,
        email: recruiter.email,
        role: recruiter.role,
      },
    });
  } catch (error) {
    console.error("Add Recruiter Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add recruiter.",
      error: error.message,
    });
  }
};
// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  getDashboard,
  getAnalytics,
  getAllUsers,
  deleteUser,
  updateUser,
  getRecentUsers,
  getLatestJobs,
  getRecentActivities,
  addRecruiter,
};