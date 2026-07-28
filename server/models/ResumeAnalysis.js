const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema(
  {
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    score: {
      type: Number,
      default: 0,
    },

    strengths: [
      {
        type: String,
      },
    ],

    weaknesses: [
      {
        type: String,
      },
    ],

    suggestions: [
      {
        type: String,
      },
    ],

    keywordsMatched: [
      {
        type: String,
      },
    ],

    keywordsMissing: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);