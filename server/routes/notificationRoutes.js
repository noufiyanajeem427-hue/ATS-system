const express = require("express");
const {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Create Notification
router.post("/", protect, createNotification);

// Get All Notifications
router.get("/", protect, getNotifications);

// Mark Notification as Read
router.put("/:id", protect, markAsRead);

// Delete Notification
router.delete("/:id", protect, deleteNotification);

module.exports = router;