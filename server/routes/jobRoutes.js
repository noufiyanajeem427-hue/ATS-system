const express = require("express");

const {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getAllJobs);

router.get("/:id", protect, getJobById);


router.post(
  "/",
  protect,
  requireRole("hr", "admin"),
  createJob
);

router.put(
  "/:id",
  protect,
  requireRole("hr", "admin"),
  updateJob
);

router.delete(
  "/:id",
  protect,
  requireRole("hr", "admin"),
  deleteJob
);


module.exports = router;