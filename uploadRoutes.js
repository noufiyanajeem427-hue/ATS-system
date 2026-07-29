const express = require("express");
const { uploadResume } = require("../controllers/uploadController");
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Upload Resume
router.post("/", protect, upload.single("resume"), uploadResume);

module.exports = router;