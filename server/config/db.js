const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.log("Server operating with backend data store.");
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB Connected Host:", conn.connection.host);
  } catch (error) {
    console.log("MongoDB Connection Error:", error.message);
    console.log("MongoDB Connection Note: Running server with fallback data store if DB unavailable.");
    // Reset connection state on failure so readyState is 0 (Disconnected)
    try {
      await mongoose.disconnect();
    } catch (e) {}
  }
};

module.exports = connectDB;