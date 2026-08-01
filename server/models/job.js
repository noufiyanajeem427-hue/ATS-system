const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: false,
    },

    company: {
      type: String,
      default: "Tech Company",
    },

    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: false,
    },

    description: {
      type: String,
      default: "",
    },

    job_type: {
      type: String,
      default: "Full-time",
    },

    work_mode: {
      type: String,
      default: "Remote",
    },

    location: {
      type: String,
      default: "Remote",
    },

    match: {
      type: Number,
      default: 90,
    },

    salary: {
      type: String,
      default: "$120k - $180k",
    },

    experience_min: {
      type: Number,
      default: 0,
    },

    experience_max: {
      type: Number,
      default: 0,
    },

    salary_min: {
      type: Number,
      default: 0,
    },

    salary_max: {
      type: Number,
      default: 0,
    },

    salary_period: {
      type: String,
      default: "Monthly",
    },

    vacancies: {
      type: Number,
      default: 1,
    },

    qualification: {
      type: String,
      default: "",
    },

    responsibilities: [
      {
        type: String,
      },
    ],

    benefits: [
      {
        type: String,
      },
    ],

    application_email: {
      type: String,
      default: "",
    },

    contact_number: {
      type: String,
      default: "",
    },

    application_deadline: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Job || mongoose.model("Job", jobSchema);