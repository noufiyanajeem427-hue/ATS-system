const express = require("express");

const router = express.Router();

const {
  getProfileSettings,
  updateProfileSettings,
  updatePassword,
  getNotificationSettings,
  updateNotificationSettings,
} = require("../controllers/settingsController");

const {
  protect,
} = require("../middleware/authMiddleware");

router.get(
  "/profile",
  protect,
  getProfileSettings
);

router.put(
  "/profile",
  protect,
  updateProfileSettings
);

router.put(
  "/password",
  protect,
  updatePassword
);

router.get(
  "/notifications",
  protect,
  getNotificationSettings
);

router.put(
  "/notifications",
  protect,
  updateNotificationSettings
);

module.exports = router;