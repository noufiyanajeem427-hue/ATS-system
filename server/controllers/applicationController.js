const Application = require("../models/Application");

// Apply for a job
const applyJob = async (req, res) => {
  try {
    const { job } = req.body;

    const application = await Application.create({
      user: req.user,
      job,
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all applications
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("user", "name email")
      .populate("job", "title company");

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  applyJob,
  getApplications,
};