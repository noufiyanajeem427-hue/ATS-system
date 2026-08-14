const User = require("../models/user");
const AdminSettings = require("../models/AdminSettings");
const bcrypt = require("bcryptjs");

const getProfileSettings = async (req, res) => {
  try {
  
    if (req.userRole === "admin") {
      return res.status(200).json({
        success: true,

        profile: {
          name: "NexHire Admin",
          email: process.env.ADMIN_EMAIL || "",
          phone: "",
          company: "NexHire",
          jobTitle: "Administrator",
        },
      });
    }

    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found.",
      });
    }

    return res.status(200).json({
      success: true,

      profile: {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        company: user.company || "",
        jobTitle: user.jobTitle || "",
      },
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load profile.",
    });
  }
};

const updateProfileSettings = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      jobTitle,
    } = req.body;

    if (req.userRole === "admin") {
      return res.status(200).json({
        success: true,

        message: "Admin profile updated successfully.",

        profile: {
          name: name || "NexHire Admin",

          // Admin email comes from .env
          email: process.env.ADMIN_EMAIL || "",

          phone: phone || "",

          company: company || "NexHire",

          jobTitle: jobTitle || "Administrator",
        },
      });
    }

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found.",
      });
    }

    if (name) {
      user.name = name;
    }

    if (email) {
      user.email = email;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (company !== undefined) {
      user.company = company;
    }

    if (jobTitle !== undefined) {
      user.jobTitle = jobTitle;
    }

    await user.save();

    return res.status(200).json({
      success: true,

      message: "Profile updated successfully.",

      profile: {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        company: user.company || "",
        jobTitle: user.jobTitle || "",
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};

const updatePassword = async (req, res) => {
  try {

    if (req.userRole === "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Admin password is managed through server configuration.",
      });
    }

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters.",
      });
    }

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Update Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update password.",
    });
  }
};

const getNotificationSettings = async (req, res) => {
  try {

    if (req.userRole === "admin") {
      let settings = await AdminSettings.findOne();

      if (!settings) {
        settings = await AdminSettings.create({
          email: true,
          jobs: true,
          candidates: false,
          reports: true,
        });
      }

      return res.status(200).json({
        success: true,
        notifications: {
          email: settings.email,
          jobs: settings.jobs,
          candidates: settings.candidates,
          reports: settings.reports,
        },
      });
    }

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      notifications: {
        email: user.notificationSettings?.email ?? true,
        jobs: user.notificationSettings?.jobs ?? true,
        candidates:
          user.notificationSettings?.candidates ?? false,
        reports: user.notificationSettings?.reports ?? true,
      },
    });
  } catch (error) {
    console.error(
      "Get Notification Settings Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to load notification settings.",
    });
  }
};

const updateNotificationSettings = async (req, res) => {
  try {
    const {
      email,
      jobs,
      candidates,
      reports,
    } = req.body;

    if (req.userRole === "admin") {
      let settings = await AdminSettings.findOne();

      if (!settings) {
        settings = new AdminSettings();
      }

      settings.email = Boolean(email);
      settings.jobs = Boolean(jobs);
      settings.candidates = Boolean(candidates);
      settings.reports = Boolean(reports);

      await settings.save();

      return res.status(200).json({
        success: true,
        message:
          "Notification preferences saved successfully.",
        notifications: {
          email: settings.email,
          jobs: settings.jobs,
          candidates: settings.candidates,
          reports: settings.reports,
        },
      });
    }

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.notificationSettings = {
      email: Boolean(email),
      jobs: Boolean(jobs),
      candidates: Boolean(candidates),
      reports: Boolean(reports),
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Notification preferences saved successfully.",
      notifications: user.notificationSettings,
    });
  } catch (error) {
    console.error(
      "Update Notification Settings Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update notification settings.",
    });
  }
};

module.exports = {
  getProfileSettings,
  updateProfileSettings,
  updatePassword,
  getNotificationSettings,
  updateNotificationSettings,

};