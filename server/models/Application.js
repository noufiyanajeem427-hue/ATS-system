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

    role: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "APPLIED",
        "IN REVIEW",
        "INTERVIEWING",
        "OFFER RECEIVED",
        "WITHDRAWN",
      ],
      default: "APPLIED",
    },

    match: {
      type: Number,
      default: 0,
    },

    resumeUrl: {
      type: String,
      default: "",
    },

    coverLetter: {
      type: String,
      default: "",
    },

    timeline: [
      {
        status: String,
        date: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Application || mongoose.model("Application", applicationSchema);