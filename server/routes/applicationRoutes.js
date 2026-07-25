const express = require("express");
const {
  applyJob,
  getApplications,
} = require("../controllers/applicationController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply for a job
router.post("/", protect, applyJob);

// Get all applications
router.get("/", protect, getApplications);

module.exports = router;