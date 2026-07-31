const Company = require("../models/Company");

// Create Company
const createCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);

    res.status(201).json({
      message: "Company created successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Companies
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });

    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Company By ID
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Company
const updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    res.status(200).json({
      message: "Company updated successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Company
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    res.status(200).json({
      message: "Company deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};