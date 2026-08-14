const User = require("../models/user");
const Job = require("../models/job");
const Application = require("../models/application");
const Interview = require("../models/interview");

const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const { Parser } = require("json2csv");

const getReports = async (req, res) => {
  try {
    const totalApplications =
      await Application.countDocuments();

    const totalHired =
      await Application.countDocuments({
        status: "Hired",
      });

    const totalInterviews =
      await Application.countDocuments({
        status: "Interview",
      });

    const totalRejected =
      await Application.countDocuments({
        status: "Rejected",
      });

    const monthlyData = await Application.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },

          applications: { $sum: 1 },

          hired: {
            $sum: {
              $cond: [
                { $eq: ["$status", "Hired"] },
                1,
                0,
              ],
            },
          },

          rejected: {
            $sum: {
              $cond: [
                { $eq: ["$status", "Rejected"] },
                1,
                0,
              ],
            },
          },

          shortlisted: {
            $sum: {
              $cond: [
                { $eq: ["$status", "Shortlisted"] },
                1,
                0,
              ],
            },
          },

          interviews: {
            $sum: {
              $cond: [
                { $eq: ["$status", "Interview"] },
                1,
                0,
              ],
            },
          },
        },
      },

      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlySummary = monthlyData.map((item) => ({
      month: monthNames[item._id.month - 1],
      year: item._id.year,
      applications: item.applications,
      shortlisted: item.shortlisted,
      interviews: item.interviews,
      hired: item.hired,
      rejected: item.rejected,
    }));

    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .lean();

    const jobReports = await Promise.all(
      jobs.map(async (job) => {
        const applications =
          await Application.countDocuments({
            job: job._id,
          });

        const shortlisted =
          await Application.countDocuments({
            job: job._id,
            status: "Shortlisted",
          });

        const interviews =
          await Application.countDocuments({
            job: job._id,
            status: "Interview",
          });

        const hired =
          await Application.countDocuments({
            job: job._id,
            status: "Hired",
          });

        const rejected =
          await Application.countDocuments({
            job: job._id,
            status: "Rejected",
          });

        return {
          _id: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          type: job.type,
          status: job.status,
          applications,
          shortlisted,
          interviews,
          hired,
          rejected,
        };
      })
    );

    res.status(200).json({
      success: true,

      cards: [
        {
          title: "Total Applications",
          value: totalApplications,
          color: "blue",
        },
        {
          title: "Interviews",
          value: totalInterviews,
          color: "purple",
        },
        {
          title: "Hired",
          value: totalHired,
          color: "green",
        },
        {
          title: "Rejected",
          value: totalRejected,
          color: "red",
        },
      ],

      monthlySummary,
      jobReports,
    });
  } catch (error) {
    console.error("Reports Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load reports.",
      error: error.message,
    });
  }
};

const getDownloadData = async () => {
  const applications =
    await Application.find()
      .sort({ createdAt: -1 })
      .lean();

  const users =
    await User.find()
      .select("name email")
      .lean();

  const jobs =
    await Job.find()
      .select("title company")
      .lean();

  return applications.map((application) => {
    // ======================================
    // FIND USER
    // ======================================

    const user = users.find(
      (item) =>
        String(item._id) ===
        String(application.user)
    );

    // ======================================
    // FIND JOB
    // ======================================

    const job = jobs.find(
      (item) =>
        String(item._id) ===
        String(application.job)
    );

    return {
      candidate:
        user?.name ||
        String(application.user || "Unknown"),

      email:
        user?.email ||
        "N/A",

      job:
        job?.title ||
        String(application.job || "Unknown"),

      company:
        job?.company ||
        "N/A",

      status:
        application.status ||
        "Pending",

      matchScore:
        application.matchScore || 0,

      aiStatus:
        application.aiStatus ||
        "Pending",

      appliedDate:
        application.createdAt
          ? new Date(
              application.createdAt
            ).toLocaleDateString()
          : "N/A",
    };
  });
};

const downloadPDF = async (req, res) => {
  try {
    const data = await getDownloadData();

    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="NexHire-Recruitment-Report.pdf"'
    );

    doc.pipe(res);

    // Header
    doc
      .fontSize(22)
      .text("NexHire AI", {
        align: "center",
      });

    doc
      .fontSize(16)
      .text("Recruitment Report", {
        align: "center",
      });

    doc.moveDown();

    doc
      .fontSize(10)
      .text(
        `Generated: ${new Date().toLocaleString()}`,
        {
          align: "center",
        }
      );

    doc.moveDown(2);

    // Summary
    const total = data.length;

    const hired = data.filter(
      (item) => item.status === "Hired"
    ).length;

    const interviews = data.filter(
      (item) => item.status === "Interview"
    ).length;

    const rejected = data.filter(
      (item) => item.status === "Rejected"
    ).length;

    doc
      .fontSize(15)
      .text("Summary");

    doc.moveDown(0.5);

    doc.fontSize(11);

    doc.text(`Total Applications: ${total}`);
    doc.text(`Interviews: ${interviews}`);
    doc.text(`Hired: ${hired}`);
    doc.text(`Rejected: ${rejected}`);

    doc.moveDown(2);

    // Applications
    doc
      .fontSize(15)
      .text("Applications");

    doc.moveDown();

    if (data.length === 0) {
      doc
        .fontSize(11)
        .text("No applications available.");
    }

    data.forEach((item, index) => {
      doc
        .fontSize(10)
        .text(
          `${index + 1}. ${item.candidate}`
        );

      doc.text(
        `   Email: ${item.email}`
      );

      doc.text(
        `   Job: ${item.job}`
      );

      doc.text(
        `   Company: ${item.company}`
      );

      doc.text(
        `   Status: ${item.status}`
      );

      doc.text(
        `   Match Score: ${item.matchScore}`
      );

      doc.text(
        `   Applied: ${item.appliedDate}`
      );

      doc.moveDown(0.8);

      if (doc.y > 730) {
        doc.addPage();
      }
    });

    doc.end();
  } catch (error) {
    console.error(
      "PDF Download Error:",
      error
    );

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Failed to generate PDF.",
        error: error.message,
      });
    }
  }
};


const downloadExcel = async (req, res) => {
  try {
    const data = await getDownloadData();

    const workbook = new ExcelJS.Workbook();

    const worksheet =
      workbook.addWorksheet(
        "Recruitment Report"
      );

    worksheet.columns = [
      {
        header: "Candidate",
        key: "candidate",
        width: 25,
      },
      {
        header: "Email",
        key: "email",
        width: 30,
      },
      {
        header: "Job",
        key: "job",
        width: 25,
      },
      {
        header: "Company",
        key: "company",
        width: 25,
      },
      {
        header: "Status",
        key: "status",
        width: 18,
      },
      {
        header: "Match Score",
        key: "matchScore",
        width: 15,
      },
      {
        header: "AI Status",
        key: "aiStatus",
        width: 15,
      },
      {
        header: "Applied Date",
        key: "appliedDate",
        width: 20,
      },
    ];

    data.forEach((item) => {
      worksheet.addRow(item);
    });

    // Header formatting
    worksheet.getRow(1).font = {
      bold: true,
    };

    worksheet.getRow(1).alignment = {
      horizontal: "center",
    };

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="NexHire-Recruitment-Report.xlsx"'
    );

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    console.error(
      "Excel Download Error:",
      error
    );

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Failed to generate Excel report.",
        error: error.message,
      });
    }
  }
};

const downloadCSV = async (req, res) => {
  try {
    const data = await getDownloadData();

    const fields = [
      "candidate",
      "email",
      "job",
      "company",
      "status",
      "matchScore",
      "aiStatus",
      "appliedDate",
    ];

    const parser = new Parser({
      fields,
    });

    const csv = parser.parse(data);

    res.setHeader(
      "Content-Type",
      "text/csv"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="NexHire-Recruitment-Report.csv"'
    );

    res.send(csv);
  } catch (error) {
    console.error(
      "CSV Download Error:",
      error
    );

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Failed to generate CSV report.",
        error: error.message,
      });
    }
  }
};

module.exports = {
  getReports,
  downloadPDF,
  downloadExcel,
  downloadCSV,
};