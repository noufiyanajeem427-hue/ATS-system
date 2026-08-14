const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const { Parser } = require("json2csv");

const Application = require("../models/application");
const Job = require("../models/job");
const User = require("../models/user");

// =====================================================
// COMMON REPORT DATA
// =====================================================

const getReportData = async () => {
  const applications = await Application.find()
    .populate("user", "name email")
    .populate("job", "title company")
    .sort({ createdAt: -1 })
    .lean();

  return applications.map((application) => ({
    candidate:
      application.user?.name || "Unknown Candidate",

    email:
      application.user?.email || "",

    job:
      application.job?.title || "Unknown Job",

    company:
      application.job?.company || "",

    status:
      application.status || "Pending",

    matchScore:
      application.matchScore || 0,

    appliedDate: application.createdAt
      ? new Date(application.createdAt).toLocaleDateString()
      : "",
  }));
};

// =====================================================
// PDF REPORT
// =====================================================

const downloadPDF = async (req, res) => {
  try {
    const data = await getReportData();

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
      'attachment; filename="nexhire-recruitment-report.pdf"'
    );

    doc.pipe(res);

    // -------------------------------
    // TITLE
    // -------------------------------

    doc
      .fontSize(22)
      .text("NexHire AI", {
        align: "center",
      });

    doc
      .moveDown(0.5)
      .fontSize(16)
      .text("Recruitment Report", {
        align: "center",
      });

    doc
      .moveDown(0.5)
      .fontSize(10)
      .text(
        `Generated: ${new Date().toLocaleString()}`,
        {
          align: "center",
        }
      );

    doc.moveDown(2);

    // -------------------------------
    // SUMMARY
    // -------------------------------

    const totalApplications = data.length;

    const hired = data.filter(
      (item) => item.status === "Hired"
    ).length;

    const shortlisted = data.filter(
      (item) => item.status === "Shortlisted"
    ).length;

    const interviews = data.filter(
      (item) => item.status === "Interview"
    ).length;

    const rejected = data.filter(
      (item) => item.status === "Rejected"
    ).length;

    doc
      .fontSize(13)
      .text("Recruitment Summary");

    doc.moveDown(0.5);

    doc
      .fontSize(10)
      .text(
        `Total Applications: ${totalApplications}`
      );

    doc.text(`Shortlisted: ${shortlisted}`);

    doc.text(`Interviews: ${interviews}`);

    doc.text(`Hired: ${hired}`);

    doc.text(`Rejected: ${rejected}`);

    doc.moveDown(2);

    // -------------------------------
    // APPLICATION DETAILS
    // -------------------------------

    doc
      .fontSize(13)
      .text("Application Details");

    doc.moveDown();

    data.forEach((item, index) => {
      doc
        .fontSize(10)
        .text(
          `${index + 1}. ${item.candidate}`
        );

      doc.text(`   Email: ${item.email}`);

      doc.text(`   Job: ${item.job}`);

      doc.text(`   Company: ${item.company}`);

      doc.text(`   Status: ${item.status}`);

      doc.text(
        `   Match Score: ${item.matchScore}%`
      );

      doc.text(
        `   Applied: ${item.appliedDate}`
      );

      doc.moveDown(0.7);

      // New page when necessary
      if (doc.y > 720) {
        doc.addPage();
      }
    });

    doc.end();

  } catch (error) {
    console.error(
      "PDF Report Error:",
      error
    );

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Failed to generate PDF report.",
      });
    }
  }
};

// =====================================================
// EXCEL REPORT
// =====================================================

const downloadExcel = async (req, res) => {
  try {
    const data = await getReportData();

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "NexHire AI";

    workbook.created = new Date();

    const worksheet =
      workbook.addWorksheet(
        "Recruitment Report"
      );

    // -------------------------------
    // TITLE
    // -------------------------------

    worksheet.mergeCells(
      "A1:G1"
    );

    const titleCell =
      worksheet.getCell("A1");

    titleCell.value =
      "NexHire AI - Recruitment Report";

    titleCell.font = {
      bold: true,
      size: 16,
    };

    titleCell.alignment = {
      horizontal: "center",
    };

    // -------------------------------
    // HEADERS
    // -------------------------------

    worksheet.addRow([]);

    worksheet.addRow([
      "Candidate",
      "Email",
      "Job",
      "Company",
      "Status",
      "Match Score",
      "Applied Date",
    ]);

    const headerRow =
      worksheet.getRow(3);

    headerRow.font = {
      bold: true,
    };

    headerRow.alignment = {
      horizontal: "center",
    };

    // -------------------------------
    // DATA
    // -------------------------------

    data.forEach((item) => {
      worksheet.addRow([
        item.candidate,
        item.email,
        item.job,
        item.company,
        item.status,
        `${item.matchScore}%`,
        item.appliedDate,
      ]);
    });

    // -------------------------------
    // COLUMN WIDTH
    // -------------------------------

    worksheet.columns = [
      { width: 25 },
      { width: 30 },
      { width: 25 },
      { width: 25 },
      { width: 18 },
      { width: 15 },
      { width: 18 },
    ];

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="nexhire-recruitment-report.xlsx"'
    );

    await workbook.xlsx.write(res);

    res.end();

  } catch (error) {
    console.error(
      "Excel Report Error:",
      error
    );

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message:
          "Failed to generate Excel report.",
      });
    }
  }
};

// =====================================================
// CSV REPORT
// =====================================================

const downloadCSV = async (req, res) => {
  try {
    const data = await getReportData();

    const fields = [
      {
        label: "Candidate",
        value: "candidate",
      },
      {
        label: "Email",
        value: "email",
      },
      {
        label: "Job",
        value: "job",
      },
      {
        label: "Company",
        value: "company",
      },
      {
        label: "Status",
        value: "status",
      },
      {
        label: "Match Score",
        value: "matchScore",
      },
      {
        label: "Applied Date",
        value: "appliedDate",
      },
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
      'attachment; filename="nexhire-recruitment-report.csv"'
    );

    res.send(csv);

  } catch (error) {
    console.error(
      "CSV Report Error:",
      error
    );

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message:
          "Failed to generate CSV report.",
      });
    }
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  downloadPDF,
  downloadExcel,
  downloadCSV,
};