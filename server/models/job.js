const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    job_type: {
      type: String,
      required: true,
    },

    work_mode: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
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

module.exports = mongoose.model("Job", jobSchema);