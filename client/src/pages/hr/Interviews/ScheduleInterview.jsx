import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaUserTie,
  FaVideo,
  FaMapMarkerAlt,
  FaSave,
} from "react-icons/fa";

import { createInterview } from "../../../services/interviewService";
import "./ScheduleInterview.css";

function ScheduleInterview() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    candidate: "",
    recruiter: "",
    interviewType: "Technical",
    mode: "Online",
    date: "",
    time: "",
    duration: 60,
    meetingLink: "",
    location: "",
    interviewer: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createInterview(form);

      alert("Interview Scheduled Successfully");

      navigate("/hr/interviews");
    } catch (err) {
      console.error(err);
      alert("Failed to schedule interview");
    }
  };

  return (
    <div className="schedule-page">

      <div className="schedule-header">

        <Link to="/hr/interviews" className="back-btn">
          <FaArrowLeft />
        </Link>

        <div>
          <h1>Schedule Interview</h1>
          <p>Create a new interview for a candidate</p>
        </div>

      </div>

      <form className="schedule-card" onSubmit={handleSubmit}>

        <div className="form-grid">

          <div className="form-group">
            <label>Candidate ID</label>
            <input
              type="text"
              name="candidate"
              value={form.candidate}
              onChange={handleChange}
              placeholder="MongoDB Candidate ID"
            />
          </div>

          <div className="form-group">
            <label>Recruiter ID</label>
            <input
              type="text"
              name="recruiter"
              value={form.recruiter}
              onChange={handleChange}
              placeholder="MongoDB Recruiter ID"
            />
          </div>

          <div className="form-group">
            <label>Interview Type</label>

            <select
              name="interviewType"
              value={form.interviewType}
              onChange={handleChange}
            >
              <option>Technical</option>
              <option>HR</option>
              <option>Managerial</option>
              <option>Final Round</option>
            </select>

          </div>

          <div className="form-group">
            <label>Mode</label>

            <select
              name="mode"
              value={form.mode}
              onChange={handleChange}
            >
              <option>Online</option>
              <option>Offline</option>
            </select>

          </div>

          <div className="form-group">
            <label><FaCalendarAlt /> Date</label>

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label><FaClock /> Time</label>

            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Duration (minutes)</label>

            <input
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label><FaUserTie /> Interviewer</label>

            <input
              type="text"
              name="interviewer"
              value={form.interviewer}
              onChange={handleChange}
              placeholder="John Smith"
            />
          </div>

          {form.mode === "Online" ? (

            <div className="form-group full-width">
              <label><FaVideo /> Meeting Link</label>

              <input
                type="text"
                name="meetingLink"
                value={form.meetingLink}
                onChange={handleChange}
                placeholder="https://meet.google.com/..."
              />
            </div>

          ) : (

            <div className="form-group full-width">
              <label><FaMapMarkerAlt /> Interview Location</label>

              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Conference Room A"
              />
            </div>

          )}

        </div>

        <button className="save-btn">
          <FaSave />
          Schedule Interview
        </button>

      </form>

    </div>
  );
}

export default ScheduleInterview;