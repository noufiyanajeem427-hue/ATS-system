const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ats-system";
  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB Connected Host:", conn.connection.host);
  } catch (error) {
    console.log("MongoDB Connection Error:", error.message);
    console.log("MongoDB Connection Note: Running server with fallback store until MongoDB database connection is active.");
  }
};

module.exports = connectDB;