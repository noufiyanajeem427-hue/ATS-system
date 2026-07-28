const SavedJob = require("../models/SavedJob");

// Save a job
const saveJob = async (req, res) => {
  try {
    const { job } = req.body;

    const savedJob = await SavedJob.create({
      user: req.user,
      job,
    });

    res.status(201).json({
      message: "Job saved successfully",
      savedJob,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all saved jobs
const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.user })
      .populate("job");

    res.status(200).json(savedJobs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete a saved job
const deleteSavedJob = async (req, res) => {
  try {
    const savedJob = await SavedJob.findById(req.params.id);

    if (!savedJob) {
      return res.status(404).json({
        message: "Saved job not found",
      });
    }

    await SavedJob.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Saved job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  saveJob,
  getSavedJobs,
  deleteSavedJob,
};