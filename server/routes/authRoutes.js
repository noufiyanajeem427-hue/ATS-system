const express = require("express");
const { registerUser,loginUser,getUserProfile,uploadResume,updateProfile,getAllUsers} = require("../controllers/authController");
const {protect} = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", getAllUsers);
router.get("/profile", protect, getUserProfile);
router.post("/upload-resume", protect, upload.single("resume"), uploadResume);
router.put("/profile", protect, updateProfile);

module.exports = router;