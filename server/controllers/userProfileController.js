const UserProfile = require("../models/UserProfile");

// Create Profile
const createProfile = async (req, res) => {
  try {
    const profile = await UserProfile.create({
      user: req.user,
      headline: req.body.headline,
      bio: req.body.bio,
      skills: req.body.skills,
      education: req.body.education,
      experience: req.body.experience,
      phone: req.body.phone,
      address: req.body.address,
      linkedin: req.body.linkedin,
      github: req.body.github,
    });

    res.status(201).json({
      message: "Profile created successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get My Profile
const getProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      user: req.user,
    }).populate("user", "name email");

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      user: req.user,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    Object.assign(profile, req.body);

    await profile.save();

    res.status(200).json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Profile
const deleteProfile = async (req, res) => {
  try {
    await UserProfile.findOneAndDelete({
      user: req.user,
    });

    res.status(200).json({
      message: "Profile deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
};