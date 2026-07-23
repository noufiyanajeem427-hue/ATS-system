const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
console.log("Auth routes loaded successfully");

app.get("/", (req, res) => {
    res.send("THISIS MY SERVER");
});

const PORT = 5001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});