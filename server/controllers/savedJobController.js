const SavedJob = require("../models/SavedJob");
const mongoose = require("mongoose");

const isMongoConnected = () => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

const inMemorySavedJobs = [];

// Save a job
const saveJob = async (req, res) => {
  try {
    const { job } = req.body;

    if (isMongoConnected()) {
      const savedJob = await SavedJob.create({
        user: req.user,
        job,
      });

      return res.status(201).json({
        message: "Job saved successfully",
        savedJob,
      });
    }

    const mockSavedJob = {
      _id: "saved_" + Date.now(),
      user: req.user,
      job,
      createdAt: new Date(),
    };
    inMemorySavedJobs.push(mockSavedJob);

    return res.status(201).json({
      message: "Job saved successfully",
      savedJob: mockSavedJob,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get all saved jobs
const getSavedJobs = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const savedJobs = await SavedJob.find({ user: req.user }).populate("job");
      return res.status(200).json(savedJobs);
    }

    const userSavedJobs = inMemorySavedJobs.filter(s => s.user === req.user);
    return res.status(200).json(userSavedJobs);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Delete a saved job
const deleteSavedJob = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const savedJob = await SavedJob.findById(req.params.id);

      if (!savedJob) {
        return res.status(404).json({
          message: "Saved job not found",
        });
      }

      await SavedJob.findByIdAndDelete(req.params.id);

      return res.status(200).json({
        message: "Saved job deleted successfully",
      });
    }

    const idx = inMemorySavedJobs.findIndex(s => s._id === req.params.id);
    if (idx !== -1) {
      inMemorySavedJobs.splice(idx, 1);
    }

    return res.status(200).json({
      message: "Saved job deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  saveJob,
  getSavedJobs,
  deleteSavedJob,
};