const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    // Resume uploaded by candidate
    resume: {
      type: String,
    },

    // AI Match Score
    matchScore: {
      type: Number,
      default: 0,
    },

    // Extracted Skills
    skills: [
      {
        type: String,
      },
    ],

    // Candidate Summary
    summary: {
      type: String,
      default: "",
    },

    // Experience
    experience: {
      type: String,
      default: "",
    },

    // Projects
    projects: [
      {
        type: String,
      },
    ],

    // Certifications
    certifications: [
      {
        type: String,
      },
    ],

    // Strengths
    strengths: [
      {
        type: String,
      },
    ],

    // Weaknesses
    weaknesses: [
      {
        type: String,
      },
    ],

    // AI Suggestions
    suggestions: [
      {
        type: String,
      },
    ],

    // Interview Questions
    interviewQuestions: [
      {
        type: String,
      },
    ],

    // AI Analysis Status
    aiStatus: {
      type: String,
      enum: ["Pending", "Analyzed"],
      default: "Pending",
    },

    // HR Decision
    status: {
      type: String,
      enum: [
        "Pending",
        "Shortlisted",
        "Interview",
        "Rejected",
        "Hired",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);