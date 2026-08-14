const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const Job = require("../models/job");
const Application = require("../models/Application");

// Apply for a job
const applyJob = async (req, res) => {
  try {
    const { job } = req.body;

    // Resume uploaded?
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume is required",
      });
    }

    // Find the selected job
    const selectedJob = await Job.findById(job);

    // Job exists?
    if (!selectedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if candidate already applied
    const existingApplication = await Application.findOne({
      user: req.user,
      job,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    // Prepare request for Python AI
    const formData = new FormData();

    formData.append(
      "resume",
      fs.createReadStream(req.file.path)
    );

    formData.append(
      "job_description",
      selectedJob.description
    );

    // Call Python AI
    const aiResponse = await axios.post(
      "http://localhost:5002/match-resume",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    const ai = aiResponse.data;

    // Save application with AI analysis
    const application = await Application.create({
      user: req.user,
      job,

      resume: req.file.path,

      matchScore: ai.match_score || 0,

      skills: ai.skills || [],

      summary: ai.summary || "",

      experience: ai.experience || "",

      projects: ai.projects || [],

      certifications: ai.certifications || [],

      strengths: ai.strengths || [],

      weaknesses: ai.weaknesses || [],

      suggestions: ai.suggestions || [],

      interviewQuestions:
        ai.interview_questions || [],

      aiStatus: "Analyzed",

      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
      aiScore: ai.match_score,
    });

  } catch (error) {

    console.error("Apply Job Error:", error);

    if (error.code === "ECONNREFUSED") {
      return res.status(500).json({
        success: false,
        message: "Python AI Service is not running.",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all applications
const getApplications = async (req, res) => {
  try {
    let applications = await Application.find()
      .populate("user", "name email")
      .populate("job", "title company")
      .sort({ matchScore: -1 });
      applications = applications.map((app,index)=>{
        let recommendation = "Reject";

        if (app.matchScore >= 80)
          recommendation = "Highly Recommended";

        else if (app.matchScore >= 60)
          recommendation = "Recommended";

        else if (app.matchScore >= 40)
          recommendation = "Consider";

        return {
          ...app.toObject(),

          // ⭐ Phase 3 starts here
          rank: index + 1,
          recommendation,
        };
      });
    res.status(200).json({
      success: true,
      totalApplications: applications.length,

      shortlisted: applications.filter(
        a => a.matchScore >= 80
      ).length,

      averageScore:
        applications.length > 0
          ? (
              applications.reduce(
                (sum, app) => sum + app.matchScore,
                0
              ) / applications.length
            ).toFixed(1)
          : 0,

      applications,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get application by ID
const getApplicationById = async (req, res) => {
  try {

    const application = await Application.findById(req.params.id)
      .populate("user")
      .populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    let recommendation = "Reject";

    if (application.matchScore >= 80)
      recommendation = "Highly Recommended";

    else if (application.matchScore >= 60)
      recommendation = "Recommended";

    else if (application.matchScore >= 40)
      recommendation = "Consider";

    res.status(200).json({
      success: true,

      application: {
        ...application.toObject(),

        recommendation,
      },
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// Update application status
const updateApplicationStatus = async (req, res) => {
  try {

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (req.body.status) {
      application.status = req.body.status;
    }

    const updatedApplication = await application.save();

    res.status(200).json({
      message: "Application status updated successfully",
      application: updatedApplication,
    });

  } catch (error) {

    console.error("Update Application Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  applyJob,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
};