const express = require("express");

const router = express.Router();

const {
  getDashboard,
  getAnalytics,
  getAllUsers,
  deleteUser,
  updateUser,
  getRecentUsers,
  getLatestJobs,
  getRecentActivities,
  addRecruiter,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// ==========================================
// ADMIN DASHBOARD
// ==========================================

router.get(
  "/dashboard",
  protect,
  adminOnly,
  getDashboard
);

// ==========================================
// ANALYTICS
// ==========================================

router.get(
  "/analytics",
  protect,
  adminOnly,
  getAnalytics
);

// ==========================================
// USERS
// ==========================================

router.get(
  "/users",
  protect,
  adminOnly,
  getAllUsers
);

router.put(
  "/users/:id",
  protect,
  adminOnly,
  updateUser
);

router.delete(
  "/users/:id",
  protect,
  adminOnly,
  deleteUser
);

// ==========================================
// RECENT USERS
// ==========================================

router.get(
  "/recent-users",
  protect,
  adminOnly,
  getRecentUsers
);

// ==========================================
// LATEST JOBS
// ==========================================

router.get(
  "/latest-jobs",
  protect,
  adminOnly,
  getLatestJobs
);

// ==========================================
// RECENT ACTIVITIES
// ==========================================

router.get(
  "/recent-activities",
  protect,
  adminOnly,
  getRecentActivities
);

router.post(
  "/recruiters",
  protect,
  adminOnly,
  addRecruiter
);

module.exports = router;