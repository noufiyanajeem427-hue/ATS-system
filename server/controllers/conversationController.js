const Conversation = require("../models/Conversation");

// Create Conversation
const createConversation = async (req, res) => {
  try {
    const conversation = await Conversation.create(req.body);

    res.status(201).json({
      message: "Conversation created successfully",
      conversation,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Conversations
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find().populate(
      "participants",
      "name email"
    );

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createConversation,
  getConversations,
};