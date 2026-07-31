const express = require("express");
const {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/userProfileController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Create Profile
router.post("/", protect, createProfile);

// Get My Profile
router.get("/", protect, getProfile);

// Update Profile
router.put("/", protect, updateProfile);

// Delete Profile
router.delete("/", protect, deleteProfile);

module.exports = router;