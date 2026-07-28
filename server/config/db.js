const mongoose = require("mongoose");

// Disable query buffering globally on Mongoose
mongoose.set("bufferCommands", false);

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.log("Server operating with backend data store.");
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 1000,
    });
    console.log("MongoDB Connected Host:", conn.connection.host);
  } catch (error) {
    console.log("MongoDB Connection Note: Running server with backend data store.");
    // Reset connection state on failure so readyState is 0 (Disconnected)
    try {
      await mongoose.disconnect();
    } catch (e) {}
  }
};

module.exports = connectDB;