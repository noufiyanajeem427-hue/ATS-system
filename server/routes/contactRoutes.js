const express = require("express");

const {
  createContact,
  getContacts,
  updateContactStatus,
} = require("../controllers/contactController");

const router = express.Router();

router.post("/", createContact);
router.get("/", getContacts);
router.put("/:id", updateContactStatus);

module.exports = router;