const express = require("express");
const {
  sendMessage,
  getMessages,
  markMessageAsRead,
} = require("../controllers/messageController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/:conversationId", protect, getMessages);
router.put("/:id/read", protect, markMessageAsRead);

module.exports = router;