const express = require("express");
const {
  scheduleInterview,
  getAllInterviews,
  updateInterviewStatus,
  deleteInterview,
} = require("../controllers/interviewController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Schedule Interview
router.post("/", protect, scheduleInterview);

// Get All Interviews
router.get("/", protect, getAllInterviews);

// Update Interview Status
router.put("/:id", protect, updateInterviewStatus);

// Delete Interview
router.delete("/:id", protect, deleteInterview);

module.exports = router;