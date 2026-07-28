const dns = require("node:dns");
const mongoose = require("mongoose");

// Force Node.js to use Google's Public DNS servers
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("Host:", conn.connection.host);
    console.log("Database:", conn.connection.name);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;