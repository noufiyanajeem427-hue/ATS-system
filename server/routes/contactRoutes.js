import express from "express";
import { createContact } from "../controllers/contactController.js";

const router = express.Router();

// POST Contact Message
router.post("/", createContact);

export default router;