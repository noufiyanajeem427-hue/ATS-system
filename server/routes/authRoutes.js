const express = require("express");
const { registerUser } = require("../controllers/authController");

const router = express.Router();
router.get("/hello", (req, res) => {
  res.send("Hello from auth routes");
});

router.post("/register", registerUser);

module.exports = router;