const mongoose = require("mongoose");

const adminSettingsSchema = new mongoose.Schema(
  {
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
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.AdminSettings ||
  mongoose.model("AdminSettings", adminSettingsSchema);