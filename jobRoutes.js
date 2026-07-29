const express = require("express");
const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a job (HR only - candidates shouldn't be able to post jobs)
router.post("/", protect, requireRole("hr"), createJob);

// Get all jobs
router.get("/", protect, getAllJobs);

// Get a job by ID
router.get("/:id", protect, getJobById);

// Update a job (HR only)
router.put("/:id", protect, requireRole("hr"), updateJob);

// Delete a job (HR only)
router.delete("/:id", protect, requireRole("hr"), deleteJob);

module.exports = router;