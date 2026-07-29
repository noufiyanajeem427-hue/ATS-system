const Job = require("../models/job");

// Create Job
const createJob = async (req, res) => {
  try {
    const { title, company, location, description } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      description,
    });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Jobs + Search + Filter + Sort + Pagination
const getAllJobs = async (req, res) => {
  try {
    const filter = {};

    // Search by title
    if (req.query.keyword) {
      filter.title = {
        $regex: req.query.keyword,
        $options: "i",
      };
    }

    // Filter by company
    if (req.query.company) {
      filter.company = {
        $regex: req.query.company,
        $options: "i",
      };
    }

    // Filter by location
    if (req.query.location) {
      filter.location = {
        $regex: req.query.location,
        $options: "i",
      };
    }

    // Sort
    let sortOption = { createdAt: -1 };

    if (req.query.sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const totalJobs = await Job.countDocuments(filter);

    const jobs = await Job.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      totalJobs,
      currentPage: page,
      totalPages: Math.ceil(totalJobs / limit),
      jobs,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Job By ID
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json(job);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Job
const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json({
      message: "Job updated successfully",
      job,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Job
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json({
      message: "Job deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
};