const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["candidate", "recruiter", "admin"],
      default: "candidate",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    googleId: {
      type: String,
      default: "",
    },

    linkedinId: {
      type: String,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },
<<<<<<< HEAD

    title: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    experiences: [
      {
        company: {
          type: String,
          default: "",
        },
        role: {
          type: String,
          default: "",
        },
        period: {
          type: String,
          default: "",
        },
        location: {
          type: String,
          default: "",
        },
        description: {
          type: String,
          default: "",
        },
        current: {
          type: Boolean,
          default: false,
        },
      },
    ],

    education: [
      {
        school: {
          type: String,
          default: "",
        },
        degree: {
          type: String,
          default: "",
        },
        field: {
          type: String,
          default: "",
        },
        year: {
          type: String,
          default: "",
        },
        gpa: {
          type: String,
          default: "",
        },
      },
    ],

    preferences: {
      role: {
        type: String,
        default: "",
      },
      type: {
        type: String,
        default: "",
      },
      workMode: {
        type: String,
        default: "",
      },
      salary: {
        type: String,
        default: "",
      },
      availability: {
        type: String,
        default: "",
      },
    },
=======
    resetPasswordToken: {
  type: String,
  default: "",
},

resetPasswordExpire: {
  type: Date,
  default: null,
},
>>>>>>> main
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);