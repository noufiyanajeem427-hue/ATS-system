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
    description: {
      type: String,
      required: false,
    },
    salary: {
      type: String,
      default: "$150k - $220k",
    },
    type: {
      type: String,
      default: "Full-time",
    },
    match: {
      type: Number,
      default: 95,
    },
    about: {
      type: String,
    },
    responsibilities: [{ type: String }],
    requirements: [{ type: String }],
    skills: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);