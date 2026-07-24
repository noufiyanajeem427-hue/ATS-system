const express = require("express");
const {
  createJob,
  getAllJobs,
  getJobById,
} = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new job
router.post("/", protect, createJob);

// Get all jobs
router.get("/", protect, getAllJobs);

// Get job by ID
router.get("/:id", protect, getJobById);

module.exports = router;