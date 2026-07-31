const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    logo: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    industry: {
      type: String,
      default: "",
    },
    company_size: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    pincode: {
      type: String,
      default: "",
    },
    linkedin_url: {
      type: String,
      default: "",
    },
    instagram_url: {
      type: String,
      default: "",
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Company", companySchema);