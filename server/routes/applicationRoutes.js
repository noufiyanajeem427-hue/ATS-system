const express = require("express");
const router = express.Router();
const {
  applyJob,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const { protect, requireRole } = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

// Apply for a job (candidates)
router.post( "/", protect, upload.single("resume"), applyJob );

// Get all applications
router.get("/", protect, getApplications);

// Get application by ID
router.get("/:id", protect, getApplicationById);

// Update application status - Shortlist/Reject (HR only)
router.put("/:id", protect, requireRole("hr"), updateApplicationStatus);

module.exports = router;