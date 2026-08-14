const express = require("express");

const router = express.Router();

const {
  downloadPDF,
  downloadExcel,
  downloadCSV,
} = require("../controllers/reportExportController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// PDF
router.get(
  "/pdf",
  protect,
  adminOnly,
  downloadPDF
);

// Excel
router.get(
  "/excel",
  protect,
  adminOnly,
  downloadExcel
);

// CSV
router.get(
  "/csv",
  protect,
  adminOnly,
  downloadCSV
);

module.exports = router;