const ResumeAnalysis = require("../models/ResumeAnalysis");

// Create Resume Analysis
const createResumeAnalysis = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.create(req.body);

    res.status(201).json({
      message: "Resume analysis created successfully",
      analysis,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Resume Analyses
const getResumeAnalyses = async (req, res) => {
  try {
    const analyses = await ResumeAnalysis.find().populate("resume");

    res.status(200).json(analyses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Resume Analysis By ID
const getResumeAnalysisById = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findById(req.params.id).populate("resume");

    if (!analysis) {
      return res.status(404).json({
        message: "Resume analysis not found",
      });
    }

    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Resume Analysis
const deleteResumeAnalysis = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findByIdAndDelete(req.params.id);

    if (!analysis) {
      return res.status(404).json({
        message: "Resume analysis not found",
      });
    }

    res.status(200).json({
      message: "Resume analysis deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createResumeAnalysis,
  getResumeAnalyses,
  getResumeAnalysisById,
  deleteResumeAnalysis,
};