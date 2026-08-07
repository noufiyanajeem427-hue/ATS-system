const Application = require("../models/Application");
const mongoose = require("mongoose");

const isMongoConnected = () => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

const inMemoryApplications = [];

// Apply for a job
const applyJob = async (req, res) => {
  try {
    const {
      job,
      role,
      company,
      location,
      resumeUrl,
      coverLetter,
      match,
    } = req.body;

    const applicationData = {
      user: req.user,
      job,
      role,
      company,
      location,
      resumeUrl,
      coverLetter,
      match,
      timeline: [
        {
          status: "APPLIED",
          note: "Application submitted",
        },
      ],
    };

    if (isMongoConnected()) {
      const application = await Application.create(applicationData);
      return res.status(201).json({
        message: "Application submitted successfully",
        application,
      });
    }

    const mockApp = {
      _id: "app_" + Date.now(),
      ...applicationData,
      status: "APPLIED",
      createdAt: new Date(),
    };
    inMemoryApplications.push(mockApp);

    return res.status(201).json({
      message: "Application submitted successfully",
      application: mockApp,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get all applications
const getApplications = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const applications = await Application.find()
        .populate("user", "name email")
        .populate("job", "title company");
      return res.status(200).json(applications);
    }

    return res.status(200).json(inMemoryApplications);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get application by ID
const getApplicationById = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const application = await Application.findById(req.params.id)
        .populate("user", "name email")
        .populate("job", "title company");

      if (!application) {
        return res.status(404).json({
          message: "Application not found",
        });
      }

      return res.status(200).json(application);
    }

    const app = inMemoryApplications.find(a => a._id === req.params.id);
    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }
    return res.status(200).json(app);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Update application status
const updateApplicationStatus = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const application = await Application.findById(req.params.id);

      if (!application) {
        return res.status(404).json({
          message: "Application not found",
        });
      }

      if (req.body.status) {
        application.status = req.body.status;
        application.timeline.push({
          status: req.body.status,
          note: "Status updated",
        });
      }

      const updatedApplication = await application.save();

      return res.status(200).json({
        message: "Application status updated successfully",
        application: updatedApplication,
      });
    }

    const appIndex = inMemoryApplications.findIndex(a => a._id === req.params.id);
    if (appIndex === -1) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (req.body.status) {
      inMemoryApplications[appIndex].status = req.body.status;
      if (!inMemoryApplications[appIndex].timeline) {
        inMemoryApplications[appIndex].timeline = [];
      }
      inMemoryApplications[appIndex].timeline.push({
        status: req.body.status,
        note: "Status updated",
      });
    }

    return res.status(200).json({
      message: "Application status updated successfully",
      application: inMemoryApplications[appIndex],
    });
  } catch (error) {
    console.error("Update Application Error:", error);
    return res.status(500).json({
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