const express = require("express");
const {
  saveJob,
  getSavedJobs,
  deleteSavedJob,
} = require("../controllers/savedJobController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Save a job
router.post("/", protect, saveJob);

// Get all saved jobs
router.get("/", protect, getSavedJobs);

// Delete a saved job
router.delete("/:id", protect, deleteSavedJob);

module.exports = router;