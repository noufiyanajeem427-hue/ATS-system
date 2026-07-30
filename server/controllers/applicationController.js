const mongoose = require("mongoose");
const Application = require("../models/Application");

// Apply for a job
const applyJob = async (req, res) => {
  try {
    const { job, role, company, location, title } = req.body;

    const isValidObjectId = job && mongoose.Types.ObjectId.isValid(job);

    const applicationData = {
      user: req.user,
      job: isValidObjectId ? job : undefined,
      role: role || title || (req.body.jobTitle) || undefined,
      company: company || undefined,
      location: location || undefined,
      status: "Applied",
    };

    const application = await Application.create(applicationData);
    const populated = await Application.findById(application._id)
      .populate("job")
      .populate("user", "name email");

    res.status(201).json({
      message: "Application submitted successfully",
      application: populated || application,
    });
  } catch (error) {
    console.error("Apply Job Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all applications for the logged in user
const getApplications = async (req, res) => {
  try {
    const query = req.user ? { user: req.user } : {};
    const applications = await Application.find(query)
      .populate("user", "name email")
      .populate("job");

    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get application by ID
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("user", "name email")
      .populate("job", "title company");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update application status
const updateApplicationStatus = async (req, res) => {
  console.log("updateApplicationStatus called");

  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (req.body.status) {
      application.status = req.body.status;
    }

    const updatedApplication = await application.save();

    res.status(200).json({
      message: "Application status updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Update Application Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  applyJob,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
};