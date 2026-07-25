const express = require("express");
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
} = require("../controllers/jobController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a job
router.post("/", protect, createJob);

// Get all jobs
router.get("/", protect, getAllJobs);

// Get a job by ID
router.get("/:id", protect, getJobById);

// Update a job
router.put("/:id", protect, updateJob);

module.exports = router;