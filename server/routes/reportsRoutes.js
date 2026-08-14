const express = require("express");

const router = express.Router();

const {
  getReports,
  downloadPDF,
  downloadExcel,
  downloadCSV,
} = require("../controllers/reportsController");

// ==========================================
// REPORT DATA
// ==========================================

router.get("/", getReports);

// ==========================================
// DOWNLOAD PDF
// ==========================================

router.get(
  "/download/pdf",
  downloadPDF
);

// ==========================================
// DOWNLOAD EXCEL
// ==========================================

router.get(
  "/download/excel",
  downloadExcel
);

// ==========================================
// DOWNLOAD CSV
// ==========================================

router.get(
  "/download/csv",
  downloadCSV
);

module.exports = router;