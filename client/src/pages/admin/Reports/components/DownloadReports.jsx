import { useState } from "react";
import "./DownloadReports.css";

import {
  FaFilePdf,
  FaFileExcel,
  FaFileCsv,
} from "react-icons/fa";

function DownloadReports() {
  const [loading, setLoading] = useState("");

  const downloadReport = async (format) => {
    try {
      setLoading(format);

      const response = await fetch(
        `http://localhost:5001/api/reports/download/${format}`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to download report."
        );
      }

      const blob = await response.blob();

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      const extension =
        format === "pdf"
          ? "pdf"
          : format === "excel"
          ? "xlsx"
          : "csv";

      link.download =
        `NexHire-Recruitment-Report.${extension}`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Download Error:",
        error
      );

      alert(
        "Failed to download report. Please try again."
      );
    } finally {
      setLoading("");
    }
  };

  return (
    <div className="download-card">

      <h2>Download Reports</h2>

      <p>
        Export recruitment reports in your
        preferred format.
      </p>

      <div className="download-buttons">

        <button
          className="pdf-btn"
          onClick={() =>
            downloadReport("pdf")
          }
          disabled={loading === "pdf"}
        >
          <FaFilePdf />

          {loading === "pdf"
            ? "Generating..."
            : "PDF Report"}
        </button>

        <button
          className="excel-btn"
          onClick={() =>
            downloadReport("excel")
          }
          disabled={loading === "excel"}
        >
          <FaFileExcel />

          {loading === "excel"
            ? "Generating..."
            : "Excel Report"}
        </button>

        <button
          className="csv-btn"
          onClick={() =>
            downloadReport("csv")
          }
          disabled={loading === "csv"}
        >
          <FaFileCsv />

          {loading === "csv"
            ? "Generating..."
            : "CSV Report"}
        </button>

      </div>

    </div>
  );
}

export default DownloadReports;