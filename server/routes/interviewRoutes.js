import express from "express";

import {
  getAllInterviews,
  getInterviewById,
  createInterview,
  updateInterview,
  deleteInterview,
  updateInterviewStatus,
  addFeedback,
} from "../controllers/interviewController.js";

const router = express.Router();

// Get all interviews
router.get("/", getAllInterviews);

// Get interview by ID
router.get("/:id", getInterviewById);

// Schedule interview
router.post("/", createInterview);

// Update interview
router.put("/:id", updateInterview);

// Delete interview
router.delete("/:id", deleteInterview);

// Update interview status
router.patch("/:id/status", updateInterviewStatus);

// Add interview feedback
router.patch("/:id/feedback", addFeedback);

export default router;