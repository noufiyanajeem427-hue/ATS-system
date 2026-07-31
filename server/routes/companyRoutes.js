const express = require("express");
const {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} = require("../controllers/companyController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Create Company
router.post("/", protect, createCompany);

// Get All Companies
router.get("/", protect, getCompanies);

// Get Company By ID
router.get("/:id", protect, getCompanyById);

// Update Company
router.put("/:id", protect, updateCompany);

// Delete Company
router.delete("/:id", protect, deleteCompany);

module.exports = router;