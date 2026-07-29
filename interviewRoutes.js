const express = require("express");
const {
  scheduleInterview,
  getAllInterviews,
  updateInterviewStatus,
  deleteInterview,
} = require("../controllers/interviewController");

const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Schedule Interview (HR only)
router.post("/", protect, requireRole("hr"), scheduleInterview);

// Get All Interviews
router.get("/", protect, getAllInterviews);

// Update Interview Status (HR only)
router.put("/:id", protect, requireRole("hr"), updateInterviewStatus);

// Delete Interview (HR only)
router.delete("/:id", protect, requireRole("hr"), deleteInterview);

module.exports = router;