const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model for the sender
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model for the receiver
    required: true,
  },
  messages: [
    {
      senderName: { type: String, required: true },
      content: { type: String, required: true },
    },
  ],
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
