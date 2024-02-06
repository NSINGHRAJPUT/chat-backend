const Chat = require("../model/feeds");
const jwt = require("jsonwebtoken");
const { getIo } = require("../socket");

// Create a new chat
exports.createChat = async (req, res) => {
  try {
    const { sender, receiver } = req.body;
    const existingChat = await Chat.findOne({ sender, receiver });
    if (existingChat) {
      return res.status(400).json({ error: "Chat already exists." });
    }
    const newChat = new Chat({ sender, receiver, messages: [] });
    await newChat.save();
    res.status(201).json(newChat);
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all chats for a user
exports.getChatsForUser = async (req, res) => {
  try {
    const { receiver, token } = req.body;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const senderId = decodedToken.userId;
    const chats = await Chat.find({
      $or: [
        { sender: senderId, receiver },
        { sender: receiver, receiver: senderId }, // Check for reverse order too
      ],
    })
      .populate("sender", "name")
      .populate("receiver", "name")
      .exec();

    res.json(chats);
  } catch (error) {
    console.error("Error getting user chats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add a message to a chat
exports.addMessageToChat = async (req, res) => {
  try {
    const { chatId, senderName, content } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found." });
    }
    chat.messages.push({ senderName, content });
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    console.error("Error adding message to chat:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOrCreateChatAndAddMessage = async (req, res) => {
  try {
    const { receiver, senderName, content, token } = req.body;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const sender = decodedToken.userId;
    let chat = await Chat.findOne({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    });
    if (!chat) {
      chat = new Chat({ sender, receiver, messages: [] });
    }
    chat.messages.push({ senderName, content });
    await chat.save();
    const io = getIo();
    io.emit("newMessage", {
      chatId: chat._id,
      message: { senderName, content },
    });
    res.status(201).json(chat);
  } catch (error) {
    console.error("Error getting or creating chat and adding message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
