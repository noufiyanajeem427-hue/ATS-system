const express = require("express");
const {
  applyJob,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply for a job
router.post("/", protect, applyJob);

// Get all applications
router.get("/", protect, getApplications);

// Get application by ID
router.get("/:id", protect, getApplicationById);

// Update application status
router.put("/:id", protect, updateApplicationStatus);

module.exports = router;