import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      default: null,
    },

    interviewType: {
      type: String,
      enum: ["HR", "Technical", "Final"],
      default: "HR",
    },

    mode: {
      type: String,
      enum: ["Online", "Offline"],
      default: "Online",
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      default: 60,
    },

    meetingLink: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    interviewer: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Scheduled",
        "Completed",
        "Cancelled",
        "Rescheduled",
      ],
      default: "Scheduled",
    },

    feedback: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Interview", interviewSchema);