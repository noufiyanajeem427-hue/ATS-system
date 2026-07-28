const express = require("express");
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a job
router.post("/", protect, createJob);

// Get all jobs (Public View)
router.get("/", getAllJobs);

// Get a job by ID
router.get("/:id", protect, getJobById);

// Update a job
router.put("/:id", protect, updateJob);

// Delete a job
router.delete("/:id", protect, deleteJob);

module.exports = router;