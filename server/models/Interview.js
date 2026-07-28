const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    interviewer: {
      type: String,
      required: true,
    },

    interviewerTitle: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: ["Technical", "HR", "Managerial"],
      default: "Technical",
    },

    round: {
      type: String,
      default: "Round 1",
    },

    mode: {
      type: String,
      enum: ["Online", "Offline"],
      default: "Online",
    },

    interviewDate: {
      type: Date,
      required: true,
    },

    interviewTime: {
      type: String,
      required: true,
    },

    meetingLink: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },

    result: {
      type: String,
      enum: ["Pending", "Selected", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Interview", interviewSchema);