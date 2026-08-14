const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    // "candidate" -> Candidate Portal
    // "hr" -> HR Portal
    role: {
      type: String,
      enum: ["candidate", "hr"],
      default: "candidate",
    },

    // Only used for HR accounts
    company: {
      type: String,
      default: "",
    },

    jobTitle: {
      type: String,
      default: "",
    },

    // Mobile number
    phone: {
      type: String,
      default: "",
    },

    // Resume path
    resume: {
      type: String,
      default: "",
    },

    // ==========================================
    // NOTIFICATION SETTINGS
    // ==========================================

    notificationSettings: {
      email: {
        type: Boolean,
        default: true,
      },

      jobs: {
        type: Boolean,
        default: true,
      },

      candidates: {
        type: Boolean,
        default: false,
      },

      reports: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
    bufferCommands: false,
  }
);

module.exports =
  mongoose.models.User ||
  mongoose.model("User", userSchema);