const mongoose = require("mongoose");

mongoose.set("bufferCommands", false);

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.log("Server operating with backend data store.");
    return;
  }

  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI,
      {
        serverSelectionTimeoutMS: 10000,
      }
    );

    console.log(
      "MongoDB Connected Host:",
      conn.connection.host
    );
  } catch (error) {
    console.error("MongoDB Connection Error:");
    console.error(error.message);

    process.exit(1);
  }
};

module.exports = connectDB;