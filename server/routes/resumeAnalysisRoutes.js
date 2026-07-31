const express = require("express");
const {
  createResumeAnalysis,
  getResumeAnalyses,
  getResumeAnalysisById,
  deleteResumeAnalysis,
} = require("../controllers/resumeAnalysisController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createResumeAnalysis);
router.get("/", protect, getResumeAnalyses);
router.get("/:id", protect, getResumeAnalysisById);
router.delete("/:id", protect, deleteResumeAnalysis);

module.exports = router;