const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    isGroupChat: { type: Boolean, default: false },
    chatName: { type: String, trim: true },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    newestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
