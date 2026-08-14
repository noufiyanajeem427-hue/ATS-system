const Contact = require("../models/Contact");

// CREATE CONTACT
const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields.",
      });
    }

    const newContact = await Contact.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: newContact,
    });
  } catch (error) {
    console.error("Contact Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// GET CONTACT MESSAGES
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.error("Get Contacts Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch contact messages.",
    });
  }
};


// MARK CONTACT AS READ
const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Unread", "Read"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status.",
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message status updated successfully.",
      contact,
    });
  } catch (error) {
    console.error("Update Contact Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update message.",
    });
  }
};


module.exports = {
  createContact,
  getContacts,
  updateContactStatus,
};