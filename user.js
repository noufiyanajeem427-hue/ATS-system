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

    // "candidate" -> lands on the Candidate Portal, "hr" -> lands on the HR Portal
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

    resume: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    bufferCommands: false,
  }
);

module.exports = mongoose.model("User", userSchema);