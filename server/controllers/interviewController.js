const Interview = require("../models/Interview");

// Schedule Interview
const scheduleInterview = async (req, res) => {
  try {
    const { application, role, company, type, interviewDate, interviewTime, meetingLink } = req.body;

    const interview = await Interview.create({
      application: application || null,
      recruiter: req.user,
      role: role || undefined,
      company: company || undefined,
      type: type || undefined,
      interviewDate: interviewDate || new Date(),
      interviewTime: interviewTime || "10:00 AM",
      meetingLink: meetingLink || "https://meet.google.com",
    });

    res.status(201).json({
      message: "Interview scheduled successfully",
      interview,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Interviews for the logged in user
const getAllInterviews = async (req, res) => {
  try {
    let query = {};
    if (req.user) {
      const userApps = await Application.find({ user: req.user }).select("_id");
      const userAppIds = userApps.map((a) => a._id);
      query = {
        $or: [
          { recruiter: req.user },
          { application: { $in: userAppIds } }
        ]
      };
    }

    const interviews = await Interview.find(query)
      .populate({
        path: "application",
        populate: [
          { path: "job" },
          { path: "user", select: "name email" }
        ]
      })
      .populate("recruiter", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Interview Status
const updateInterviewStatus = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: req.body.status,
        },
      },
      {
        new: true,
        runValidators: false,
      }
    );

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    res.status(200).json({
      message: "Interview status updated successfully",
      interview,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Interview
const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    res.status(200).json({
      message: "Interview deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  scheduleInterview,
  getAllInterviews,
  updateInterviewStatus,
  deleteInterview,
};