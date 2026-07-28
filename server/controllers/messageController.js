const Message = require("../models/Message");

// Send Message
const sendMessage = async (req, res) => {
  try {
    const message = await Message.create(req.body);

    res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Messages of a Conversation
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    })
      .populate("sender", "name email")
      .populate("receiver", "name email");

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Mark Message as Read
const markMessageAsRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    res.status(200).json({
      message: "Message marked as read",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  markMessageAsRead,
};