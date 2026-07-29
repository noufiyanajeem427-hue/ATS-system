import Interview from "../models/Interview.js";

// ==============================
// Get All Interviews
// ==============================

export const getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find()
      .populate("candidate", "fullName email")
      .populate("recruiter", "fullName email")
      .sort({ date: 1 });

    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching interviews",
      error: error.message,
    });
  }
};

// ==============================
// Get Single Interview
// ==============================

export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate("candidate", "fullName email")
      .populate("recruiter", "fullName email");

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    res.status(200).json(interview);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Create Interview
// ==============================

export const createInterview = async (req, res) => {
  try {
    const interview = await Interview.create(req.body);
    const populatedInterview = await Interview.findById(interview._id)
        .populate("candidate", "fullName email")
        .populate("recruiter", "fullName email");

    res.status(201).json({
      message: "Interview Scheduled Successfully",
      interview,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Update Interview
// ==============================

export const updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    .populate("candidate", "fullName email")
    .populate("recruiter", "fullName email");

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    res.status(200).json(interview);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Delete Interview
// ==============================

export const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    res.status(200).json({
      message: "Interview Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Update Interview Status
// ==============================

export const updateInterviewStatus = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    interview.status = req.body.status;

    await interview.save();

    res.status(200).json(interview);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==============================
// Add Feedback
// ==============================

export const addFeedback = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    interview.feedback = req.body.feedback;
    interview.rating = req.body.rating;

    await interview.save();

    res.status(200).json({
      message: "Feedback Saved",
      interview,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};