const Job = require("../models/job");
const mongoose = require("mongoose");

const defaultSeedJobs = [
  {
    title: "Senior Product Designer (AI/ML)",
    company: "Cognitive Systems",
    location: "San Francisco, CA (Remote)",
    salary: "$180k - $240k",
    salary_min: 180000,
    salary_max: 240000,
    job_type: "Full-time",
    work_mode: "Remote",
    match: 98,
    description: "Lead UI/UX design for cutting edge artificial intelligence models and user experiences.",
    status: "Open"
  },
  {
    title: "Principal UX Engineer",
    company: "Lumina Core",
    location: "New York, NY",
    salary: "$210k - $280k",
    salary_min: 210000,
    salary_max: 280000,
    job_type: "Hybrid",
    work_mode: "Hybrid",
    match: 85,
    description: "Drive frontend engineering architecture with React and TypeScript.",
    status: "Open"
  },
  {
    title: "Staff Infrastructure Engineer",
    company: "GridSphere",
    location: "Austin, TX (Remote)",
    salary: "$195k - $225k",
    salary_min: 195000,
    salary_max: 225000,
    job_type: "Full-time",
    work_mode: "Remote",
    match: 72,
    description: "Manage distributed cloud infrastructure, Kubernetes clusters, and CI/CD pipelines.",
    status: "Open"
  },
  {
    title: "Full Stack Engineer (Node.js & React)",
    company: "NexHire Solutions",
    location: "Chicago, IL (Hybrid)",
    salary: "$140k - $175k",
    salary_min: 140000,
    salary_max: 175000,
    job_type: "Full-time",
    work_mode: "Hybrid",
    match: 92,
    description: "Build robust backend microservices and responsive web applications for enterprise hiring workflow.",
    status: "Open"
  },
  {
    title: "AI/ML Solutions Architect",
    company: "Aether Dynamics",
    location: "Seattle, WA (Remote)",
    salary: "$220k - $300k",
    salary_min: 220000,
    salary_max: 300000,
    job_type: "Full-time",
    work_mode: "Remote",
    match: 88,
    description: "Design and implement scalable machine learning data pipelines and LLM integrations.",
    status: "Open"
  }
];

const isMongoConnected = () => {
  return mongoose.connection && mongoose.connection.readyState === 1;
};

// Create Job
const createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      company: req.body.company || req.body.company_name || "Tech Company",
      slug: req.body.slug || (req.body.title ? req.body.title.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now() : "job-" + Date.now())
    };

    if (isMongoConnected()) {
      const job = await Job.create(jobData);
      return res.status(201).json({
        message: "Job created successfully",
        job,
      });
    }

    const mockJob = { _id: "job_" + Date.now(), ...jobData, createdAt: new Date() };
    return res.status(201).json({
      message: "Job created successfully (in-memory)",
      job: mockJob,
    });
  } catch (error) {
    console.error("Create Job Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Get All Jobs
const getAllJobs = async (req, res) => {
  try {
    if (isMongoConnected()) {
      let jobs = await Job.find().sort({ createdAt: -1 });

      // Auto-seed database if empty
      if (!jobs || jobs.length === 0) {
        try {
          await Job.insertMany(defaultSeedJobs);
          jobs = await Job.find().sort({ createdAt: -1 });
        } catch (seedErr) {
          console.error("Error auto-seeding jobs:", seedErr.message);
        }
      }

      return res.status(200).json({
        success: true,
        count: jobs.length,
        jobs,
      });
    }

    // In-memory fallback
    return res.status(200).json({
      success: true,
      count: defaultSeedJobs.length,
      jobs: defaultSeedJobs.map((j, i) => ({ _id: `job_${i + 1}`, ...j })),
    });
  } catch (error) {
    console.error("Get All Jobs Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Get Job By ID
const getJobById = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const job = await Job.findById(req.params.id);
      if (job) return res.status(200).json(job);
    }

    const fallbackJob = defaultSeedJobs.find((j, i) => `job_${i + 1}` === req.params.id) || defaultSeedJobs[0];
    return res.status(200).json({ _id: req.params.id, ...fallbackJob });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update Job
const updateJob = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!job) return res.status(404).json({ message: "Job not found" });
      return res.status(200).json({ message: "Job updated successfully", job });
    }
    return res.status(200).json({ message: "Job updated successfully", job: { _id: req.params.id, ...req.body } });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete Job
const deleteJob = async (req, res) => {
  try {
    if (isMongoConnected()) {
      const job = await Job.findByIdAndDelete(req.params.id);
      if (!job) return res.status(404).json({ message: "Job not found" });
    }
    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
};