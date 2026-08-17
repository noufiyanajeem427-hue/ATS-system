const Application = require("../models/Application");//application part

// Apply for a job
const applyJob = async (req, res) => {
  console.log("applyJob called");

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

    const application = await Application.create({
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
});
    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error(error);
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

  application.timeline.push({
    status: req.body.status,
    note: "Status updated",
  });
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