const express = require("express");
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  uploadResume,
  updateProfile,
  getAllUsers,
  changePassword,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Authentication
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.put("/change-password", protect, changePassword);

// Users
router.get("/users", getAllUsers);

// Profile
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateProfile);
router.post("/upload-resume", protect, upload.single("resume"), uploadResume);

module.exports = router;