const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    headline: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: String,
      },
    ],

    education: [
      {
        degree: String,
        college: String,
        year: String,
      },
    ],

    experience: [
      {
        company: String,
        role: String,
        duration: String,
      },
    ],

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserProfile", userProfileSchema);