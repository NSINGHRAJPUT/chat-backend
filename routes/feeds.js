const express = require("express");
const router = express.Router();
const chatController = require("../controller/feeds");

// Route to get all chats for a user
router.get("/:userId", chatController.getChatsForUser);
// Route to create a new chat
router.post("/", chatController.getOrCreateChatAndAddMessage);
// Route to add a message to a chat
router.post("/getChats", chatController.getChatsForUser);
router.post("/message", chatController.addMessageToChat);

module.exports = router;
