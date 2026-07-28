const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
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

    salary: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: [
        "Full-time",
        "Part-time",
        "Contract",
        "Hybrid",
        "Remote",
      ],
      required: true,
    },

    matchScore: {
      type: Number,
      default: 98,
    },

    description: {
      type: String,
      required: true,
    },

    requirements: [
      {
        type: String,
      },
    ],

    responsibilities: [
      {
        type: String,
      },
    ],

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["active", "closed", "draft"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);