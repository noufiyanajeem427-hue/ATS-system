const express = require("express");
const {
  applyJob,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply for a job (candidates)
router.post("/", protect, applyJob);

// Get all applications
router.get("/", protect, getApplications);

// Get application by ID
router.get("/:id", protect, getApplicationById);

// Update application status - Shortlist/Reject (HR only)
router.put("/:id", protect, requireRole("hr"), updateApplicationStatus);

module.exports = router;